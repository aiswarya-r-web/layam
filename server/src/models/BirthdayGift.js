import mongoose from 'mongoose'

const giftItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
)

const shipmentSchema = new mongoose.Schema(
  {
    courierName: { type: String, trim: true },
    trackingNumber: { type: String, trim: true },
    shippingAddress: { type: String },
    dispatchedAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { _id: false }
)

const birthdayGiftSchema = new mongoose.Schema(
  {
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    birthdayYear: { type: Number, required: true },
    items: {
      type: [giftItemSchema],
      validate: [(v) => v.length > 0, 'Gift must contain at least one item'],
    },
    totalAmount: { type: Number, required: true, min: 0 },
    giftMessage: { type: String, trim: true },
    shipment: { type: shipmentSchema, default: {} },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'PACKED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
)

// Prevent duplicate active gifts for the same pet and birthday year
birthdayGiftSchema.index(
  { petId: 1, birthdayYear: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: 'CANCELLED' } } }
)

export default mongoose.model('BirthdayGift', birthdayGiftSchema)
