/**
 * DeepSeek AI Job Analyzer Utility
 */
export async function analyzeWithDeepSeek(prompt: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not defined in environment variables.');
  }

  // Append user's requested consistency instruction
  const finalPrompt = prompt.endsWith('.') 
    ? prompt + ' Cevabın her seferinde kesin ve matematiksel olarak tutarlı olmalıdır.'
    : prompt + '. Cevabın her seferinde kesin ve matematiksel olarak tutarlı olmalıdır.';

  // DeepSeek API Request Object matching the openai SDK structure
  // Explicitly configured with temperature: 0
  const payload = {
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content: 'Sen LinkedIn ilanlarındaki hayalet iş ilanı (ghost job) risklerini inceleyen profesyonel bir analiz asistanısın.'
      },
      {
        role: 'user',
        content: finalPrompt
      }
    ],
    temperature: 0 // Keep output deterministic and logically consistent
  };

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.choices || data.choices.length === 0) {
    throw new Error('Invalid response format from DeepSeek API.');
  }

  return data.choices[0].message.content;
}
