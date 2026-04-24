import dotenv from 'dotenv';
import { RAGStore } from './rag-store.js';

dotenv.config();

async function main() {
  const ragStore = new RAGStore();
  
  try {
    await ragStore.connect();
    
    const stats = await ragStore.getLearningStats();
    const fpByType = await ragStore.getFalsePositiveRateByType();
    
    console.log('\n📊 Learning Statistics\n');
    console.log(`Total findings in knowledge base: ${stats.total_findings}`);
    console.log(`False positives: ${stats.false_positives} (${((stats.false_positives / stats.total_findings) * 100 || 0).toFixed(1)}%)`);
    console.log(`True positives: ${stats.true_positives}`);
    console.log(`Average confidence: ${(stats.avg_confidence * 100 || 0).toFixed(0)}%`);
    console.log(`Repositories scanned: ${stats.repositories_scanned}\n`);
    
    if (fpByType.length > 0) {
      console.log('False Positive Rate by Type:');
      fpByType.forEach(row => {
        console.log(`  ${row.type}: ${row.fp_rate}% (${row.false_positives}/${row.total})`);
      });
    }
  } catch (error) {
    console.error('Failed to retrieve stats:', error.message);
    console.error('Make sure docker-compose is running and RAG is initialized');
    process.exit(1);
  } finally {
    await ragStore.disconnect();
  }
}

main().catch(console.error);
