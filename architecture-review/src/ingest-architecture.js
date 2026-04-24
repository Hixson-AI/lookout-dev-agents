import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { ArchitectureRAGStore } from './rag-store.js';
import { generateEmbedding } from './embeddings.js';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARCHITECTURE_REPO = path.resolve(__dirname, '../../architecture');

async function ingestMarkdownFiles() {
  const ragStore = new ArchitectureRAGStore();
  await ragStore.connect();
  const docsPath = path.join(ARCHITECTURE_REPO, 'docs');
  const slicesPath = path.join(ARCHITECTURE_REPO, 'slices');
  console.log('Ingesting architecture docs...');
  await ingestDirectory(docsPath, 'architecture', ragStore, 'architecture');
  console.log('\nIngesting slice docs...');
  await ingestDirectory(slicesPath, 'architecture', ragStore, 'slice');
  const stats = await ragStore.getKnowledgeStats();
  console.log('\nKnowledge stats:', stats);
  await ragStore.disconnect();
}

async function ingestDirectory(dirPath, source, ragStore, documentType) {
  if (!fs.existsSync(dirPath)) { console.log(`Directory not found: ${dirPath}`); return; }
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) { await ingestDirectory(filePath, source, ragStore, documentType); }
    else if (file.endsWith('.md')) { await ingestMarkdownFile(filePath, source, ragStore, documentType); }
  }
}

async function ingestMarkdownFile(filePath, source, ragStore, documentType) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(ARCHITECTURE_REPO, filePath);
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : path.basename(filePath, '.md');
    const topicsMatch = content.match(/^topics:\s*\[(.+)\]/m);
    const topics = topicsMatch ? topicsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, '')) : [];
    const embedding = await generateEmbedding(content);
    await ragStore.storeDocument({ title, content, source, sourcePath: relativePath, documentType, topics, embedding });
    console.log(`  ✓ Ingested: ${relativePath}`);
  } catch (error) { console.error(`  ✗ Failed to ingest ${filePath}:`, error.message); }
}

ingestMarkdownFiles().catch(console.error);
