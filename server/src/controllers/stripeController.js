import Order from '../models/Order.js'
import { getStripe } from '../config/stripe.js'

export const fulfillPaidOrder = async (session) => {
  const order = await Order.findOneAndUpdate(
    { stripeSessionId: session.id, paymentStatus: 'pending' },
    { paymentStatus: 'paid', orderStatus: 'confirmed' },
    { returnDocument: 'after' }
  )
  if (order) return order
  return Order.findOne({ stripeSessionId: session.id })
}

export const stripeWebhook = async (req, res) => {
  const stripe = getStripe()
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).json({ message: 'Stripe not configured' })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    if (session.metadata?.type === 'order') {
      await fulfillPaidOrder(session)
    }
  }

  res.json({ received: true })
}

export const verifySession = async (req, res) => {
  const stripe = getStripe()
  if (!stripe) return res.status(503).json({ message: 'Online payment not configured' })

  const { sessionId } = req.body
  if (!sessionId) return res.status(400).json({ message: 'sessionId is required' })

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.client_reference_id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'This payment does not belong to your account' })
    }
    if (session.payment_status !== 'paid') {
      return res.json({ verified: false })
    }
    const order = await fulfillPaidOrder(session)
    res.json({ verified: true, orderId: order?._id || session.metadata?.orderId })
  } catch {
    res.status(400).json({ message: 'Invalid session' })
  }
}
