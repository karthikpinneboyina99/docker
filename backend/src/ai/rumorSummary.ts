import { config } from '../config';

/**
 * Cost Implication:
 * We are using `meta-llama/llama-3-8b-instruct`.
 * The prompt and constraints consist of roughly 100-150 input tokens.
 * The output is constrained to 3-4 sentences, roughly 60-100 tokens.
 * Total token usage per call: ~250 tokens.
 * Llama-3-8B is heavily optimized, usually costing ~$0.05 per 1M tokens.
 * This translates to roughly $0.0000125 per API call, making it 
 * incredibly cheap and suitable for high-volume use.
 */

export async function generateRumorSummary(
  rumorData: any,
  reliabilityScore: number,
  transferProbability: number
): Promise<{ summary: string; generatedBy: 'ai' | 'fallback' }> {
  
  const sourcesText = rumorData.reports
    .map((r: any) => r.source.name)
    .join(', ');

  const fallbackSummary = `Rumor: ${rumorData.player.name} to ${rumorData.toClub.name}. Status: ${rumorData.status}. Reliability: ${reliabilityScore}/100. Probability: ${transferProbability}%. Sources: ${sourcesText || 'Unknown'}.`;

  if (!config.OPENROUTER_API_KEY) {
    return { summary: fallbackSummary, generatedBy: 'fallback' };
  }

  const prompt = `
You are a football transfer expert journalist (in the style of Fabrizio Romano).
Write a confident, concise summary of this transfer rumor in 3-4 sentences.
Cite the source consensus.
You MUST include the exact calculated Reliability Score (${reliabilityScore}/100) and Transfer Probability (${transferProbability}%) in your narrative.
Do NOT invent new facts, do NOT invent new sources, do NOT make up numbers or transfer fees not provided here.

Data:
Player: ${rumorData.player.name}
From: ${rumorData.fromClub.name}
To: ${rumorData.toClub.name}
Status: ${rumorData.status}
Sources reporting: ${sourcesText}
Reliability Score: ${reliabilityScore}/100
Transfer Probability: ${transferProbability}%
  `.trim();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3-8b-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 150
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`OpenRouter API failed: ${response.statusText}`);
      return { summary: fallbackSummary, generatedBy: 'fallback' };
    }

    const data: any = await response.json();
    if (data.choices && data.choices.length > 0) {
      return {
        summary: data.choices[0].message.content.trim(),
        generatedBy: 'ai'
      };
    }

    return { summary: fallbackSummary, generatedBy: 'fallback' };
  } catch (error) {
    console.error('Failed to generate AI summary, using fallback:', error);
    return { summary: fallbackSummary, generatedBy: 'fallback' };
  }
}
