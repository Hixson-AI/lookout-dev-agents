import dotenv from 'dotenv';

dotenv.config();

let authFailed = false;

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
  if (authFailed) {
    throw new Error('OpenRouter auth previously failed; skipping embeddings');
  }

  try {
    const client = getOpenRouterClient();
    const model = process.env.OPENROUTER_EMBEDDING_MODEL || 'openai/text-embedding-3-small';

    const response = await fetch(`${client.baseURL}/embeddings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${client.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lookout.local',
        'X-Title': 'Lookout Architecture Review Agent',
      },
      body: JSON.stringify({
        model,
        input: text,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        authFailed = true;
      }
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    if (error.message?.includes('401')) {
      authFailed = true;
    }
    throw error;
  }
}

export function generateFindingContext(finding) {
  return `${finding.type} (${finding.principle_reference || 'unknown principle'}): ${finding.message} in ${finding.file}${finding.code_context ? `\nContext: ${finding.code_context}` : ''}`;
}
