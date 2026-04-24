import dotenv from 'dotenv';

dotenv.config();

function getOpenRouterClient() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is required for RAG features');
  }
  return {
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
  };
}

export async function generateEmbedding(text) {
  try {
    const client = getOpenRouterClient();
    const model = process.env.OPENROUTER_EMBEDDING_MODEL || 'openai/text-embedding-3-small';

    const response = await fetch(`${client.baseURL}/embeddings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${client.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error('Failed to generate embedding:', error);
    throw error;
  }
}

export function generateFindingContext(finding) {
  return `${finding.type}: ${finding.message} in ${finding.file}${finding.code_context ? `\nContext: ${finding.code_context}` : ''}`;
}
