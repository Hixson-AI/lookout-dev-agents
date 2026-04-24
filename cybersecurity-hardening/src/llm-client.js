import dotenv from 'dotenv';

dotenv.config();

function getOpenRouterClient() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is required for LLM features');
  }
  return {
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
  };
}

export async function analyzeFindingWithLLM(finding) {
  try {
    const client = getOpenRouterClient();
    const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';
    const maxTokens = parseInt(process.env.OPENROUTER_MAX_TOKENS || '1000');

    const prompt = `Analyze this security finding and provide:
1. Severity assessment (is the current severity correct?)
2. Context-aware explanation
3. Specific remediation steps
4. False positive likelihood (low/medium/high)

Finding:
- Type: ${finding.type}
- Severity: ${finding.severity}
- File: ${finding.file}
- Message: ${finding.message}
- Code context: ${finding.code_context || 'N/A'}

Respond in JSON format:
{
  "severity": "low|medium|high",
  "explanation": "context-aware explanation",
  "remediation": "specific steps to fix",
  "falsePositiveLikelihood": "low|medium|high",
  "confidence": 0.0-1.0
}`;

    const response = await fetch(`${client.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${client.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/Hixson-AI/lookout-dev-agents',
        'X-Title': 'Cybersecurity Hardening Agent',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a security expert specializing in code security analysis. Provide concise, actionable security assessments in JSON format.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: maxTokens,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse LLM response as JSON');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Failed to analyze finding with LLM:', error.message);
    // Return null on failure so pattern matching can still work
    return null;
  }
}

export async function analyzeFindingsBatch(findings) {
  const results = [];
  
  for (const finding of findings) {
    const analysis = await analyzeFindingWithLLM(finding);
    if (analysis) {
      results.push({
        ...finding,
        llmAnalysis: analysis,
        confidence: analysis.confidence || 0.5,
      });
    } else {
      results.push({
        ...finding,
        llmAnalysis: null,
        confidence: 0.5,
      });
    }
  }

  return results;
}
