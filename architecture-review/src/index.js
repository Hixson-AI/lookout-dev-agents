import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { ArchitectureRAGStore } from './rag-store.js';
import { generateEmbedding, generateFindingContext } from './embeddings.js';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, '../config.json');

function loadConfig() { return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')); }

function checkSimplicity(repoPath, exclude) {
  const issues = [];
  for (const fp of glob.sync('**/*.{js,ts,json}', { cwd: repoPath, ignore: exclude, absolute: true })) {
    try {
      const c = fs.readFileSync(fp, 'utf8');
      const factories = [...c.matchAll(/class\s+\w*Factory\w*\s+/g)];
      if (factories.length) { 
        const ln = c.substring(0, factories[0].index).split('\n').length;
        issues.push({type:'simplicity-first', severity:'low', file:fp, line_number:ln, principle_reference:'Principle 1: Simplicity First', message:'Factory pattern detected - verify it is necessary or can be simplified', code_context:`Line ${ln}: ${factories[0][0].trim()}`}); 
      }
      if (fp.endsWith('package.json')) {
        const pkg = JSON.parse(c);
        for (const dep of Object.keys(pkg.dependencies||{}).filter(d=>['lodash','underscore','moment','uuid'].includes(d))) {
          issues.push({type:'simplicity-first', severity:'low', file:fp, line_number:1, principle_reference:'Principle 1: Simplicity First', message:`Dependency ${dep} may be unnecessary - verify active usage`, code_context:`"${dep}": "${pkg.dependencies[dep]}"`});
        }
      }
    } catch {}
  }
  return issues;
}

function checkControlPlane(repoPath, exclude) {
  const issues = [];
  if (!['lookout-control'].includes(path.basename(repoPath))) return issues;
  for (const fp of glob.sync('**/src/**/*.{js,ts}', { cwd: repoPath, ignore: exclude, absolute: true })) {
    try {
      const c = fs.readFileSync(fp, 'utf8');
      for (const m of [...c.matchAll(/req\.body\.(ssn|phi|patient|medical|diagnosis|health)/gi)]) {
        const ln = c.substring(0, m.index).split('\n').length;
        issues.push({type:'control-plane-boundary', severity:'high', file:fp, line_number:ln, principle_reference:'Principle 3: Shared Control Plane Boundary', message:'Control plane code appears to process client PHI data', code_context:`Line ${ln}: ${c.split('\n')[ln-1].trim().substring(0,120)}`});
      }
    } catch {}
  }
  return issues;
}

function checkPHI(repoPath, exclude) {
  const issues = [];
  for (const fp of glob.sync('**/*.{js,ts,py,go,json,yaml,yml}', { cwd: repoPath, ignore: exclude, absolute: true })) {
    try {
      const c = fs.readFileSync(fp, 'utf8');
      const rp = path.relative(repoPath, fp);
      const isTest = /test|spec|fixture/i.test(rp);
      for (const m of [...c.matchAll(/console\.(log|debug|info)\s*\(.*?(ssn|patient|phi|medical|diagnosis|mrn|dob)/gi)]) {
        const ln = c.substring(0, m.index).split('\n').length;
        issues.push({type:'phi-caution', severity:'high', file:fp, line_number:ln, principle_reference:'Principle 5: PHI Caution', message:'Potential PHI logging detected - use structured logger with PHI scrubbing', code_context:`Line ${ln}: ${c.split('\n')[ln-1].trim().substring(0,120)}`});
      }
      for (const m of [...c.matchAll(/const\s+\w*(patient|ssn|mrn|dob)\w*\s*=\s*['"]\d{3}-?\d{2}-?\d{4}/gi)]) {
        if (isTest) continue;
        const ln = c.substring(0, m.index).split('\n').length;
        issues.push({type:'phi-caution', severity:'high', file:fp, line_number:ln, principle_reference:'Principle 5: PHI Caution', message:'Hardcoded PHI-like data pattern in non-test file', code_context:`Line ${ln}: ${c.split('\n')[ln-1].trim().substring(0,120)}`});
      }
      if ((rp.endsWith('docker-compose.yml')||rp.endsWith('fly.toml')) && /LOKI|GRAFANA|log|observability/i.test(c) && !/scrub|phi|sanitize|mask/i.test(c)) {
        issues.push({type:'phi-caution', severity:'medium', file:fp, line_number:1, principle_reference:'Principle 5: PHI Caution', message:'Observability config without PHI scrubbing mention', code_context:'Observability configuration block'});
      }
    } catch {}
  }
  return issues;
}

function checkDedicatedByNeed(repoPath, exclude) {
  const issues = [];
  for (const fp of glob.sync('**/*.{js,ts,json,yaml,yml}', { cwd: repoPath, ignore: exclude, absolute: true })) {
    try {
      const c = fs.readFileSync(fp, 'utf8');
      if (/profile.*=.*dedicated|dedicated.*profile/i.test(c) && !/justification|trigger|approval/i.test(c)) {
        const m = c.match(/profile.*=.*dedicated|dedicated.*profile/i);
        const ln = c.substring(0, m.index).split('\n').length;
        issues.push({type:'dedicated-by-need', severity:'medium', file:fp, line_number:ln, principle_reference:'Principle 4: Dedicated by Need', message:'Dedicated profile without documented justification or trigger', code_context:`Line ${ln}: ${c.split('\n')[ln-1].trim().substring(0,120)}`});
      }
      if (/if.*dedicated|dedicated.*then/i.test(c) && !/Shared.*default|shared.*default/i.test(c)) {
        const m = c.match(/if.*dedicated|dedicated.*then/i);
        const ln = c.substring(0, m.index).split('\n').length;
        issues.push({type:'dedicated-by-need', severity:'low', file:fp, line_number:ln, principle_reference:'Principle 4: Dedicated by Need', message:'Isolation by default - should default to Shared unless explicitly justified', code_context:`Line ${ln}: ${c.split('\n')[ln-1].trim().substring(0,120)}`});
      }
    } catch {}
  }
  return issues;
}

function checkInternalOnlyToolchain(repoPath, exclude) {
  const issues = [];
  const name = path.basename(repoPath);
  if (name === 'lookout-portal' || name === 'elmo') return issues;
  for (const fp of glob.sync('**/*.{js,ts,json,yaml,yml}', { cwd: repoPath, ignore: exclude, absolute: true })) {
    try {
      const c = fs.readFileSync(fp, 'utf8');
      const rp = path.relative(repoPath, fp);
      if (/vite|webpack|rollup|parcel|esbuild/i.test(c) && /client|tenant|production/i.test(c) && !/portal|internal|admin/i.test(rp)) {
        const m = c.match(/vite|webpack|rollup|parcel|esbuild/i);
        const ln = c.substring(0, m.index).split('\n').length;
        issues.push({type:'internal-only-toolchain', severity:'low', file:fp, line_number:ln, principle_reference:'Principle 6: Internal-Only Toolchain', message:'Build tooling reference in client-facing code - verify this is not internal tooling deployed to client runtime', code_context:`Line ${ln}: ${c.split('\n')[ln-1].trim().substring(0,120)}`});
      }
    } catch {}
  }
  return issues;
}

function checkDogfooding(repoPath, exclude) {
  const issues = [];
  for (const fp of glob.sync('**/*.{js,ts,json,yaml,yml,md}', { cwd: repoPath, ignore: exclude, absolute: true })) {
    try {
      const c = fs.readFileSync(fp, 'utf8');
      if (/platform.*automation|admin.*ops|catalog.*sync|rag.*reindex|dns.*provision/i.test(c) && !/platform.*tenant|reserved.*tenant|App.*record/i.test(c)) {
        const m = c.match(/platform.*automation|admin.*ops|catalog.*sync|rag.*reindex|dns.*provision/i);
        const ln = c.substring(0, m.index).split('\n').length;
        issues.push({type:'dogfooding', severity:'medium', file:fp, line_number:ln, principle_reference:'Principle 11: Dogfooding', message:'Platform automation detected - should be modeled as App record owned by platform tenant', code_context:`Line ${ln}: ${c.split('\n')[ln-1].trim().substring(0,120)}`});
      }
      if (/internal.*workflow|hixson.*automation/i.test(c) && /dedicated/i.test(c)) {
        const m = c.match(/internal.*workflow|hixson.*automation/i);
        const ln = c.substring(0, m.index).split('\n').length;
        issues.push({type:'dogfooding', severity:'high', file:fp, line_number:ln, principle_reference:'Principle 11: Dogfooding', message:'Internal automation using Dedicated profile - signals data model misalignment (should use Shared tier)', code_context:`Line ${ln}: ${c.split('\n')[ln-1].trim().substring(0,120)}`});
      }
    } catch {}
  }
  return issues;
}

function checkOrchestration(repoPath, exclude) {
  const issues = [];
  const name = path.basename(repoPath);
  if (!name.includes('n8n') && !name.includes('orchestrator')) return issues;
  for (const fp of glob.sync('**/*.{js,ts,json}', { cwd: repoPath, ignore: exclude, absolute: true })) {
    try {
      const c = fs.readFileSync(fp, 'utf8');
      if (/sqlite|memoryStore|workflowState\s*=/.test(c)) {
        const m = c.match(/sqlite|memoryStore|workflowState\s*=/);
        const ln = c.substring(0, m.index).split('\n').length;
        issues.push({type:'orchestration-not-sor', severity:'medium', file:fp, line_number:ln, principle_reference:'Principle 7: Orchestration Is Not the System of Record', message:'Orchestration code appears to store persistent state locally', code_context:`Line ${ln}: ${c.split('\n')[ln-1].trim().substring(0,120)}`});
      }
    } catch {}
  }
  return issues;
}

function checkTemplates(repoPath, exclude) {
  const issues = [];
  for (const fp of glob.sync('**/*.{js,ts,tsx}', { cwd: repoPath, ignore: exclude, absolute: true })) {
    try {
      const c = fs.readFileSync(fp, 'utf8');
      const matches = [...c.matchAll(/if\s*\(\s*tenant\s*===?\s*['"](\w+)/g)];
      if (matches.length > 2) {
        const ln = c.substring(0, matches[0].index).split('\n').length;
        issues.push({type:'scale-through-templates', severity:'medium', file:fp, line_number:ln, principle_reference:'Principle 10: Scale Through Templates', message:`${matches.length} hardcoded tenant branches detected - prefer parameterized templates`, code_context:`Examples: ${matches.slice(0,3).map(m=>m[0]).join('; ')}`});
      }
    } catch {}
  }
  return issues;
}

function checkDocs(repoPath, exclude) {
  const issues = [];
  if (!fs.existsSync(path.join(repoPath, 'slices')) && !fs.existsSync(path.join(repoPath, 'docs'))) {
    issues.push({type:'documentation-compliance', severity:'low', file:path.basename(repoPath), principle_reference:'Principle 8: Document Before Building', message:'Repository lacks slices/ or docs/ directory - major decisions should be recorded', code_context:'No slices/ or docs/ directory found'});
  }
  return issues;
}

function checkRepoDeps(repoPath, exclude) {
  const issues = [];
  const name = path.basename(repoPath);
  const forbidden = { 'lookout-api': ['lookout-control'], 'lookout-control': ['lookout-api'] }[name];
  if (!forbidden) return issues;
  for (const fp of glob.sync('**/*.{js,ts,json}', { cwd: repoPath, ignore: exclude, absolute: true })) {
    try {
      const c = fs.readFileSync(fp, 'utf8');
      for (const f of forbidden) {
        if (c.includes(f) || c.includes(`../${f}`)) {
          const lineMatch = c.match(new RegExp(`(from|require|import).*?(\.\/\.\.\/)?${f}`));
          const ln = lineMatch ? c.substring(0, lineMatch.index).split('\n').length : 0;
          issues.push({type:'repo-structure', severity:'high', file:fp, line_number:ln, principle_reference:'Principle 9: Explicit Over Implicit / Repository Strategy', message:`Unauthorized cross-repo dependency to ${f} - repos should communicate via APIs`, code_context: ln ? `Line ${ln}: ${c.split('\n')[ln-1].trim().substring(0,120)}` : c.match(new RegExp(`(from|require|import).*?${f}`))?.[0] || ''});
        }
      }
    } catch {}
  }
  return issues;
}

async function applyLearning(issues, repository, ragStore, config) {
  if (!config.rag.enabled || !config.rag.useLearnedPatterns) return issues;
  const enhanced = [];
  let ragDisabled = false;
  for (const issue of issues) {
    try {
      if (ragDisabled) { enhanced.push({ ...issue, confidence_score: 0.5 }); continue; }
      const context = generateFindingContext(issue);
      const embedding = await generateEmbedding(context);
      const similar = await ragStore.findSimilarFindings(embedding, 5, config.rag.similarityThreshold);
      let confidence = 0.5;
      if (similar.length > 0) {
        const avgSim = similar.reduce((s, x) => s + x.similarity, 0) / similar.length;
        const fpRate = similar.filter(x => x.is_false_positive).length / similar.length;
        confidence = 0.5 + (avgSim * 0.3) - (fpRate * 0.2);
        confidence = Math.max(0.1, Math.min(0.95, confidence));
      }
      if (confidence >= config.rag.confidenceThreshold) {
        enhanced.push({ ...issue, confidence_score: confidence, similar_findings: similar.length });
      }
    } catch (err) {
      if (err.message?.includes('401') || err.message?.includes('auth previously failed')) {
        console.warn('OpenRouter auth failed - disabling RAG');
        config.rag.enabled = false; ragDisabled = true;
      }
      enhanced.push({ ...issue, confidence_score: 0.5 });
    }
  }
  return enhanced;
}

async function storeFindings(issues, repository, ragStore, config) {
  if (!config.rag.enabled || !config.rag.storeFindings) return;
  for (const issue of issues) {
    try {
      const context = generateFindingContext(issue);
      const embedding = await generateEmbedding(context);
      await ragStore.storeFinding({ ...issue, repository, embedding, confidence_score: issue.confidence_score || 0.5 });
    } catch (err) {
      if (err.message?.includes('401')) { config.rag.enabled = false; return; }
      console.error('Failed to store finding:', err.message);
    }
  }
}

function filterBySeverity(issues, threshold) {
  const order = { low: 1, medium: 2, high: 3 };
  const min = order[threshold] || 2;
  return issues.filter(i => order[i.severity] >= min);
}

async function generateReport(allIssues, config, ragStore) {
  const reportDir = path.join(__dirname, '../reports');
  fs.mkdirSync(reportDir, { recursive: true });
  const ts = new Date().toISOString().split('T')[0];
  const reportPath = path.join(reportDir, `architecture-review-${ts}.md`);
  let r = '# Architecture Review Report\n\n';
  r += `Generated: ${new Date().toISOString()}\n`;
  r += `Severity Threshold: ${config.severityThreshold}\n`;
  r += `Learning Enabled: ${config.rag.enabled}\n\n`;
  let total = 0;
  for (const { repo, issues } of allIssues) {
    if (issues.length > 0) {
      r += `## ${repo}\n\n`;
      for (const i of issues) {
        const conf = i.confidence_score ? ` (confidence: ${(i.confidence_score*100).toFixed(0)}%)` : '';
        const sim = i.similar_findings ? ` [${i.similar_findings} similar]` : '';
        r += `- **[${i.severity.toUpperCase()}]** ${i.file}: ${i.message}${conf}${sim}\n`;
        r += `  - Principle: \`${i.principle_reference || 'N/A'}\`\n`;
        if (i.code_context) r += `  \`${i.code_context}\`\n`;
        total++;
      }
      r += '\n';
    }
  }
  if (total === 0) r += 'No architecture issues found above threshold.\n';
  else r += `\nTotal Issues: ${total}\n`;
  if (config.rag.enabled) {
    const stats = await ragStore.getLearningStats();
    const fpByType = await ragStore.getFalsePositiveRateByType();
    r += '\n## Learning Insights\n\n';
    r += `- Total findings in knowledge base: ${stats.total_findings}\n`;
    r += `- False positives: ${stats.false_positives} (${((stats.false_positives / stats.total_findings)*100 || 0).toFixed(1)}%)\n`;
    r += `- Average confidence: ${(stats.avg_confidence*100 || 0).toFixed(0)}%\n`;
    r += `- Repositories scanned: ${stats.repositories_scanned}\n\n`;
    if (fpByType.length > 0) {
      r += '### False Positive Rate by Type\n\n';
      for (const row of fpByType) r += `- ${row.type}: ${row.fp_rate}% (${row.false_positives}/${row.total})\n`;
    }
  }
  fs.writeFileSync(reportPath, r);
  console.log(`\nReport saved to ${reportPath}`);
  console.log(`Total issues: ${total}`);
}

async function main() {
  const config = loadConfig();
  const ragStore = new ArchitectureRAGStore();
  if (config.rag.enabled) {
    try { await ragStore.connect(); } catch (err) {
      console.warn('Failed to connect to RAG, continuing without learning:', err.message);
      config.rag.enabled = false;
    }
  }
  const allIssues = [];
  const start = Date.now();
  for (const repo of config.repositories) {
    const repoPath = path.resolve(__dirname, '../../', repo);
    if (!fs.existsSync(repoPath)) { console.log(`Skipping ${repo} - not found`); continue; }
    console.log(`\nScanning ${repo}...`);
    const issues = [];
    if (config.checks.simplicityFirst) issues.push(...checkSimplicity(repoPath, config.excludePatterns));
    if (config.checks.controlPlaneBoundary) issues.push(...checkControlPlane(repoPath, config.excludePatterns));
    if (config.checks.dedicatedByNeed) issues.push(...checkDedicatedByNeed(repoPath, config.excludePatterns));
    if (config.checks.phiCaution) issues.push(...checkPHI(repoPath, config.excludePatterns));
    if (config.checks.internalOnlyToolchain) issues.push(...checkInternalOnlyToolchain(repoPath, config.excludePatterns));
    if (config.checks.orchestrationNotSoR) issues.push(...checkOrchestration(repoPath, config.excludePatterns));
    if (config.checks.scaleThroughTemplates) issues.push(...checkTemplates(repoPath, config.excludePatterns));
    if (config.checks.documentationCompliance) issues.push(...checkDocs(repoPath, config.excludePatterns));
    if (config.checks.repoStructure) issues.push(...checkRepoDeps(repoPath, config.excludePatterns));
    if (config.checks.dogfooding) issues.push(...checkDogfooding(repoPath, config.excludePatterns));
    const enhanced = await applyLearning(issues, repo, ragStore, config);
    allIssues.push({ repo, issues: enhanced });
    if (config.rag.enabled) await storeFindings(enhanced, repo, ragStore, config);
  }
  const duration = Date.now() - start;
  if (config.rag.enabled) {
    for (const { repo, issues } of allIssues) {
      const h = issues.filter(i => i.severity === 'high').length;
      const m = issues.filter(i => i.severity === 'medium').length;
      const l = issues.filter(i => i.severity === 'low').length;
      await ragStore.recordScanHistory({ repository: repo, total_findings: issues.length, high_severity: h, medium_severity: m, low_severity: l, scan_duration_ms: duration, learning_enabled: config.rag.enabled });
    }
  }
  const filtered = allIssues.map(({ repo, issues }) => ({ repo, issues: filterBySeverity(issues, config.severityThreshold) }));
  await generateReport(filtered, config, ragStore);
  if (config.rag.enabled) await ragStore.disconnect();
}

main().catch(console.error);
