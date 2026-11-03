const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

const SYSTEM_PROMPT = `You are Paw-sistant, the friendly AI assistant for Layam — an online shop for dog food, treats, toys, grooming, beds and accessories in India (prices in ₹).

Personality: warm, playful, helpful. Occasional dog puns and a 🐾 are welcome, but keep answers short and useful.

You can help with:
- Choosing products (food, treats, toys, beds, grooming) for dogs of different ages, breeds and sizes
- General dog care, feeding and training tips
- How the store works: Cash on Delivery only, free delivery on orders ₹999+ (₹49 below), coupons applied at checkout, orders tracked under "My orders", users can register dog profiles for birthday gifts
- If asked about a specific order or refund you can't access, suggest checking "My orders" or the Contact page

Rules:
- Never invent product names, prices or policies — if unsure, say so and suggest browsing the shop
- For medical or emergency questions, gently recommend a vet
- Keep replies under ~120 words unless asked for more detail
`

export const chat = async (req, res) => {
  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(503).json({ message: 'Paw-sistant is not configured yet' })
  }

  const { messages } = req.body
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ message: 'Messages are required' })
  }

  const history = messages
    .filter((m) => ['user', 'assistant'].includes(m?.role) && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
    .slice(-12)

  if (!history.length || history[history.length - 1].role !== 'user') {
    return res.status(400).json({ message: 'A user message is required' })
  }

  try {
    const r = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
        'X-Title': 'Layam Paw-sistant',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-8b-instruct:free',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
        max_tokens: 400,
        temperature: 0.7,
      }),
    })

    const data = await r.json()
    if (!r.ok) {
      return res
        .status(r.status === 401 ? 502 : r.status)
        .json({ message: data.error?.message || 'Paw-sistant is having trouble right now' })
    }

    const reply = data.choices?.[0]?.message?.content?.trim()
    res.json({ reply: reply || 'Woof... I drew a blank. Try asking again!' })
  } catch {
    res.status(502).json({ message: 'Could not reach Paw-sistant. Try again later.' })
  }
}
