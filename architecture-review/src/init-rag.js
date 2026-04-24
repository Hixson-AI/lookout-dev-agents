import dotenv from 'dotenv';
import { ArchitectureRAGStore } from './rag-store.js';

dotenv.config();

async function main() {
  const ragStore = new ArchitectureRAGStore();

  try {
    console.log('Connecting to RAG store...');
    await ragStore.connect();
    console.log('Architecture Review RAG store initialized successfully');
    console.log('Database schema created via init-rag.sql on first run');
  } catch (error) {
    console.error('Failed to initialize RAG store:', error.message);
    console.error('Make sure docker-compose is running: docker-compose up -d');
    process.exit(1);
  } finally {
    await ragStore.disconnect();
  }
}

main().catch(console.error);
