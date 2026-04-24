import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required for RAG features');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function generateEmbedding(text) {
  try {
    const openai = getOpenAIClient();
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

export function generateFindingContext(finding) {
  return `${finding.type}: ${finding.message} in ${finding.file}${finding.code_context ? `\nContext: ${finding.code_context}` : ''}`;
}
