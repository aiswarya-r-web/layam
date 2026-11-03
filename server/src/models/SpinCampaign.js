import mongoose from 'mongoose'

const spinCampaignSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'VAALU Paw Spin' },
    minimumOrderAmount: { type: Number, default: 1000, min: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
    maxSpinsPerCustomer: { type: Number, default: 10, min: 1 },
    couponExpiryDays: { type: Number, default: 30, min: 1 },
  },
  { timestamps: true }
)

export default mongoose.model('SpinCampaign', spinCampaignSchema)
