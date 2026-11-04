import Pet from '../models/Pet.js'
import BirthdayNotification from '../models/BirthdayNotification.js'
import BirthdaySetting from '../models/BirthdaySetting.js'
import { daysUntilBirthday, nextBirthdayYear } from '../utils/birthday.js'

const DAY_MS = 86400000

export const runBirthdayCheck = async () => {
  const settings = await BirthdaySetting.get()
  if (!settings.remindersEnabled) return

  const pets = await Pet.find({
    dateOfBirth: { $exists: true, $ne: null },
  }).populate('userId', 'marketingOptOut')

  const now = new Date()
  let created = 0

  for (const pet of pets) {
    if (pet.userId?.marketingOptOut) continue

    const days = daysUntilBirthday(pet.dateOfBirth, now)
    let type = null
    if (days === settings.daysBeforeBirthday) type = 'reminder'
    else if (days === 0) type = 'birthday'
    if (!type) continue

    try {
      await BirthdayNotification.create({
        petId: pet._id,
        userId: pet.userId._id,
        notificationType: type,
        birthdayYear: nextBirthdayYear(pet.dateOfBirth, now),
        scheduledAt: now,
        sentAt: now,
        status: 'sent',
        deliveryChannel: 'in-app',
      })
      created++
    } catch (err) {
      if (err.code !== 11000) throw err // duplicate = already sent, skip silently
    }
  }

  if (created) console.log(`Birthday job: ${created} notification(s) created`)
}

// Runs at startup and every 24h — idempotent via unique index
export const scheduleBirthdayJob = () => {
  runBirthdayCheck().catch((e) => console.error('Birthday job failed:', e.message))
  setInterval(
    () => runBirthdayCheck().catch((e) => console.error('Birthday job failed:', e.message)),
    DAY_MS
  )
}
