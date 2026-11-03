import Category from '../models/Category.js'

export const getCategories = async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 })
  res.json({ categories })
}

export const createCategory = async (req, res) => {
  const { name, slug, description, image } = req.body
  if (!name || !slug) {
    return res.status(400).json({ message: 'Name and slug are required' })
  }
  const category = await Category.create({ name, slug, description, image })
  res.status(201).json({ category })
}

export const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  })
  if (!category) return res.status(404).json({ message: 'Category not found' })
  res.json({ category })
}

export const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { returnDocument: 'after' }
  )
  if (!category) return res.status(404).json({ message: 'Category not found' })
  res.json({ message: 'Category deactivated', category })
}
