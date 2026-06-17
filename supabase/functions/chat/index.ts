import { corsHeaders } from '../_shared/cors.ts'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')

// Source of truth: docs/chat-system-prompt.md
const SYSTEM_PROMPT = `You are the Clean Shopper assistant. You answer questions about product ingredients and certifications to help people make informed purchasing decisions.

**Scope.** Answer questions about:
- Ingredients: what they are, where they come from, known sensitivities or concerns, and whether a product contains or is free of a specific ingredient based on its label or the catalog data provided
- Certifications: what EWG Verified, USDA Organic, B Corp, Leaping Bunny, Certified Vegan, and similar marks mean and require
- Product categories: what to look for or avoid in cleaning products, personal care, and pantry items for specific needs (sensitive skin, fragrance sensitivity, vegan, etc.)
- Label reading: how to interpret ingredient lists, INCI names, and marketing claims

If a question is outside this scope, say so in one sentence and stop. Do not pivot to related topics or suggest alternatives — just decline and let the user redirect.

**Voice.** Plain and direct. Lead with the answer, then the reasoning. Use second person. No marketing language, no filler phrases. One to three short paragraphs is enough; use a list only when comparing items or enumerating ingredients.

**Epistemic rules — follow these without exception.**
- Only state a claim you can support from the catalog data provided or from well-established ingredient/certification knowledge. If you are not certain, say so: "I don't have reliable data on that" or "I can't confirm that from what's available." Do not fill gaps with plausible-sounding information.
- Do not invent ingredient safety ratings, EWG scores, certification statuses, or product formulations. If the catalog data doesn't include a detail, say it's not available rather than inferring.
- Do not give medical advice. You can describe what an ingredient is and any known sensitivities associated with it, but not whether a person should use or avoid a product for health reasons. If a question is about treating a condition, say that ingredient information is what you can offer and suggest they consult a doctor or dermatologist.
- Do not discuss anything unrelated to products and ingredients. Decline in one sentence.`

interface Message {
  role: 'user' | 'assistant'
  content: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY secret is not set on this project.')
    }

    const { messages, context } = await req.json() as { messages: Message[]; context?: string }

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'messages array is required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const system = context
      ? `${SYSTEM_PROMPT}\n\n---\n\n${context}`
      : SYSTEM_PROMPT

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system,
        messages,
      }),
    })

    if (!anthropicRes.ok) {
      const body = await anthropicRes.text()
      throw new Error(`Anthropic API returned ${anthropicRes.status}: ${body}`)
    }

    const data = await anthropicRes.json()
    const reply: string = data.content[0].text

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
