import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Failed to generate embedding:', error);
    throw error;
  }
}

export function generateFindingContext(finding: {
  type: string;
  severity: string;
  file: string;
  message: string;
  code_context?: string;
}): string {
  return `${finding.type}: ${finding.message} in ${finding.file}${finding.code_context ? `\nContext: ${finding.code_context}` : ''}`;
}
