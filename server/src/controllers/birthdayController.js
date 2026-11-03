import Pet from '../models/Pet.js'
import BirthdayNotification from '../models/BirthdayNotification.js'
import { daysUntilBirthday, nextBirthdayDate } from '../utils/birthday.js'

export const getUpcoming = async (req, res) => {
  const pets = await Pet.find({
    userId: req.user._id,
    dateOfBirth: { $exists: true, $ne: null },
  })

  const now = new Date()
  const upcoming = pets
    .map((p) => ({
      _id: p._id,
      name: p.name,
      breed: p.breed,
      dateOfBirth: p.dateOfBirth,
      nextBirthday: nextBirthdayDate(p.dateOfBirth, now),
      daysUntil: daysUntilBirthday(p.dateOfBirth, now),
    }))
    .filter((p) => p.daysUntil <= 10)
    .sort((a, b) => a.daysUntil - b.daysUntil)

  res.json({ upcoming })
}

export const getMyNotifications = async (req, res) => {
  const notifications = await BirthdayNotification.find({ userId: req.user._id })
    .populate('petId', 'name breed')
    .sort({ createdAt: -1 })
    .limit(30)
  res.json({ notifications })
}
