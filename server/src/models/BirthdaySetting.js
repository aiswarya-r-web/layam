import mongoose from 'mongoose'

const birthdaySettingSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },
    remindersEnabled: { type: Boolean, default: true },
    daysBeforeBirthday: { type: Number, default: 10, min: 1 },
    minOrdersForGift: { type: Number, default: 1, min: 0 },
    monthlyGiftBudget: { type: Number, default: 5000, min: 0 },
    defaultGiftMessage: {
      type: String,
      default: 'Happy birthday! With love, Team VAALU',
    },
  },
  { timestamps: true }
)

birthdaySettingSchema.statics.get = async function () {
  return (
    (await this.findOne({ key: 'main' })) || (await this.create({ key: 'main' }))
  )
}

export default mongoose.model('BirthdaySetting', birthdaySettingSchema)
