import dotenv from 'dotenv';
import { ArchitectureRAGStore } from './rag-store.js';

dotenv.config();

async function main() {
  const args = process.argv.slice(2);
  const findingId = parseInt(args.find(arg => arg.startsWith('--id='))?.split('=')[1]);
  const type = args.find(arg => arg.startsWith('--type='))?.split('=')[1];
  const comment = args.find(arg => arg.startsWith('--comment='))?.split('=')[1];

  if (!findingId || !type) {
    console.error('Usage: npm run feedback -- --id <finding-id> --type <false-positive|true-positive> [--comment "comment"]');
    process.exit(1);
  }

  const ragStore = new ArchitectureRAGStore();
  try {
    await ragStore.connect();
    if (type === 'false-positive') {
      await ragStore.markFalsePositive(findingId, comment);
      console.log(`Marked finding ${findingId} as false positive`);
    } else {
      console.error('Only false-positive type is currently supported');
      process.exit(1);
    }
  } catch (error) {
    console.error('Failed to record feedback:', error.message);
    process.exit(1);
  } finally {
    await ragStore.disconnect();
  }
}

main().catch(console.error);
