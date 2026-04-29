import dotenv from 'dotenv';

dotenv.config();

export async function generateEmbedding(text) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}\n${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

export async function generateFindingContext(finding) {
  return `${finding.type}: ${finding.message} in ${finding.file}. Context: ${finding.code_context || 'N/A'}`;
}
