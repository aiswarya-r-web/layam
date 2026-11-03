import mongoose from 'mongoose'

const birthdayNotificationSchema = new mongoose.Schema(
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
    notificationType: {
      type: String,
      enum: ['reminder', 'birthday'],
      required: true,
    },
    birthdayYear: { type: Number, required: true },
    scheduledAt: { type: Date },
    sentAt: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'sent',
    },
    deliveryChannel: { type: String, default: 'in-app' },
    errorMessage: { type: String },
  },
  { timestamps: true }
)

// One notification per pet per type per birthday year — prevents duplicates
birthdayNotificationSchema.index(
  { petId: 1, notificationType: 1, birthdayYear: 1 },
  { unique: true }
)

export default mongoose.model('BirthdayNotification', birthdayNotificationSchema)
