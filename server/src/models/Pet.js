import mongoose from 'mongoose'

const petSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    breed: { type: String, trim: true },
    dateOfBirth: { type: Date },
    age: { type: Number, min: 0 },
    weight: { type: Number, min: 0 },
    gender: { type: String, enum: ['male', 'female'] },
    image: { type: String },
    foodPreferences: { type: String, trim: true },
    allergies: { type: String, trim: true },
  },
  { timestamps: true }
)

export default mongoose.model('Pet', petSchema)
