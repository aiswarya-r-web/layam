import mongoose from 'mongoose'

const spinRewardSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'SpinCampaign', required: true },
    name: { type: String, required: true },
    rewardType: {
      type: String,
      enum: ['percentage', 'fixed', 'free_shipping', 'free_product', 'no_win'],
      required: true,
    },
    value: { type: Number, default: 0, min: 0 },
    probability: { type: Number, default: 0, min: 0 },
    maxUsage: { type: Number, min: 1 },
    usedCount: { type: Number, default: 0, min: 0 },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('SpinReward', spinRewardSchema)
