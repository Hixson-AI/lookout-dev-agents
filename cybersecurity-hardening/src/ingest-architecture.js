import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GeneralRAGStore } from '../src/general-rag-store.js';
import { generateEmbedding } from '../src/embeddings.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Architecture repo path
const ARCHITECTURE_REPO = '/home/garrett/repos/work/hixson-ai/architecture';

async function ingestMarkdownFiles() {
  const ragStore = new GeneralRAGStore();
  await ragStore.connect();

  const docsPath = path.join(ARCHITECTURE_REPO, 'docs');
  const slicesPath = path.join(ARCHITECTURE_REPO, 'slices');

  console.log('Ingesting architecture docs...');
  let docsCount = await ingestDirectory(docsPath, 'architecture', ragStore, 'architecture');
  console.log(`  ✓ Ingested ${docsCount} architecture docs`);

  console.log('\nIngesting slice docs...');
  let slicesCount = await ingestDirectory(slicesPath, 'architecture', ragStore, 'slice');
  console.log(`  ✓ Ingested ${slicesCount} slice docs`);

  console.log('\nTotal documents ingested:', docsCount + slicesCount);

  const stats = await ragStore.getKnowledgeStats();
  console.log('\nKnowledge stats:', stats);

  await ragStore.disconnect();
}
 0
async function ingestDirectory(dirPath, source, ragStore, documentType) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory not found: $;
  let count = 0{dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
      countc+=onst filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
   constresult=
      if (result) count++;
    if (stat.isDirectory()) {
   

  return count;   await ingestDirectory(filePath, source, ragStore, documentType);
    } else if (file.endsWith('.md')) {
      await ingestMarkdownFile(filePath, source, ragStore, documentType);
    }
  }
}

async function ingestMarkdownFile(filePath, source, ragStore, documentType) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(source === 'architecture' ? ARCHITECTURE_REPO : source, filePath);

    // Extract title from first heading
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : path.basename(filePath, '.md');

    // Extract topics from YAML frontmatter if present
    const topicsMatch = content.match(/^topics:\s*\[(.+)\]/m);
    const topics = topicsMatch ? topicsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, '')) : [];

    // Generate embedding
    const embedding = await generateEmbedding(content);

    await ragStore.storeDocument({
      title,
      content,
      source,
      sourcePath: relativePath,
      documentType,
      topics,
      embedding,
    });

    return true;
  } catch (error) {
    console.error(`  ✗ Failed to ingest ${filePath}:`, error.message);
    return false;
  }
}

ingestMarkdownFiles().catch(console.error);
