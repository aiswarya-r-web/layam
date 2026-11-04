const DAY_MS = 86400000

const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0

// Feb-29 birthdays are celebrated on Feb-28 in non-leap years
const birthdayInYear = (dob, year) => {
  const month = dob.getUTCMonth()
  let day = dob.getUTCDate()
  if (month === 1 && day === 29 && !isLeap(year)) day = 28
  return Date.UTC(year, month, day)
}

export const daysUntilBirthday = (dob, ref = new Date()) => {
  const birth = new Date(dob)
  const today = Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate())
  let next = birthdayInYear(birth, ref.getUTCFullYear())
  if (next < today) next = birthdayInYear(birth, ref.getUTCFullYear() + 1)
  return Math.round((next - today) / DAY_MS)
}

export const nextBirthdayYear = (dob, ref = new Date()) => {
  const birth = new Date(dob)
  const today = Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate())
  return birthdayInYear(birth, ref.getUTCFullYear()) < today
    ? ref.getUTCFullYear() + 1
    : ref.getUTCFullYear()
}

export const nextBirthdayDate = (dob, ref = new Date()) =>
  new Date(birthdayInYear(new Date(dob), nextBirthdayYear(dob, ref)))
