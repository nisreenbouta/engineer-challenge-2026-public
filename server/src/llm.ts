function fakeSummarize(message: string): string {
  const lower = message.toLowerCase()

  const positiveWords = ['thanks', 'happy', 'great', 'love', 'appreciate', 'fantastic', 'improvement', 'smooth', 'reliable', 'good']
  const negativeWords = ['bug', 'broken', 'issue', 'problem', 'error', "doesn't", "can't", 'frustrat', 'annoying', 'wrong', 'fail', 'missing', 'slow', 'duplicate']

  const isPositive = positiveWords.some((w) => lower.includes(w))
  const isNegative = negativeWords.some((w) => lower.includes(w))

  const categories = [
    { keywords: ['bug', 'broken', "doesn't work", 'error', 'not working', 'issue'], label: 'Bug report' },
    { keywords: ['billing', 'charge', 'payment', 'invoice', 'refund', 'subscription', 'price', 'pricing', 'plan'], label: 'Billing' },
    { keywords: ['feature', 'option', 'would like', 'wish', 'suggestion', 'add'], label: 'Feature request' },
    { keywords: ['login', 'password', 'reset', 'authenticate', 'sign in'], label: 'Account access' },
    { keywords: ['performance', 'slow', 'load', 'timeout', 'lag'], label: 'Performance' },
    { keywords: ['mobile', 'app', 'ios', 'android'], label: 'Mobile app' },
    { keywords: ['api', 'integration', 'sync', 'import', 'export', 'csv'], label: 'Integration' },
    { keywords: ['search', 'filter', 'notification', 'dashboard', 'report'], label: 'UX feedback' },
  ]

  const category = categories.find((c) => c.keywords.some((k) => lower.includes(k)))
  const sentences = message.split(/[.!?]+/).filter((s) => s.trim().length > 10)
  const firstSentence = sentences.length > 0 ? sentences[0].trim() : message.trim()
  const snippet = firstSentence.length > 80 ? firstSentence.slice(0, 77) + '...' : firstSentence
  const sentiment = isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'
  const tag = category ? category.label + ' — ' : ''

  return `${tag}"${snippet}" — ${sentiment} feedback.`
}

function extractMessage(prompt: string): string {
  const lines = prompt.split('\n')
  return lines[lines.length - 1] || ''
}

export async function summarizeText(prompt: string): Promise<string> {
  if (process.env.FAKE_LLM === 'true') {
    return fakeSummarize(extractMessage(prompt))
  }

  const apiKey = process.env.OPENAI_API_KEY
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  })

  const data: any = await response.json()
  return data.choices[0].message.content
}
