import mongoose from 'mongoose'

const spinAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'SpinCampaign', required: true },
    rewardId: { type: mongoose.Schema.Types.ObjectId, ref: 'SpinReward', required: true },
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    giftCode: { type: String },
    status: { type: String, enum: ['spun'], default: 'spun' },
    spunAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export default mongoose.model('SpinAttempt', spinAttemptSchema)
