import dotenv from 'dotenv';

dotenv.config();

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required for embeddings');
  }
  return {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.openai.com/v1',
  };
}

export async function generateEmbedding(text) {
  try {
    const client = getOpenAIClient();
    const model = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';

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
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
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
