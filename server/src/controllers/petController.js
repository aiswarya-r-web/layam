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

export const createPet = async (req, res) => {
  const { name, breed, age, weight, gender, image, foodPreferences, allergies } = req.body
  if (!name) return res.status(400).json({ message: 'Dog name is required' })

  const pet = await Pet.create({
    userId: req.user._id,
    name,
    breed,
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
