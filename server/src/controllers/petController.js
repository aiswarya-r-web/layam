import Pet from '../models/Pet.js'

export const getPets = async (req, res) => {
  const pets = await Pet.find({ userId: req.user._id }).sort({ createdAt: -1 })
  res.json({ pets })
}

export const getPet = async (req, res) => {
  const pet = await Pet.findOne({ _id: req.params.id, userId: req.user._id })
  if (!pet) return res.status(404).json({ message: 'Pet not found' })
  res.json({ pet })
}

const MAX_PETS_PER_USER = 5

export const createPet = async (req, res) => {
  const { name, breed, dateOfBirth, age, weight, gender, image, foodPreferences, allergies } = req.body
  if (!name) return res.status(400).json({ message: 'Dog name is required' })

  const count = await Pet.countDocuments({ userId: req.user._id })
  if (count >= MAX_PETS_PER_USER) {
    return res.status(400).json({ message: `You can add up to ${MAX_PETS_PER_USER} dog profiles` })
  }

  const pet = await Pet.create({
    userId: req.user._id,
    name,
    breed,
    dateOfBirth,
    age,
    weight,
    gender,
    image,
    foodPreferences,
    allergies,
  })
  res.status(201).json({ pet })
}

export const updatePet = async (req, res) => {
  delete req.body.userId
  const pet = await Pet.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { returnDocument: 'after', runValidators: true }
  )
  if (!pet) return res.status(404).json({ message: 'Pet not found' })
  res.json({ pet })
}

export const deletePet = async (req, res) => {
  const pet = await Pet.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
  if (!pet) return res.status(404).json({ message: 'Pet not found' })
  res.json({ message: 'Pet profile deleted' })
}
