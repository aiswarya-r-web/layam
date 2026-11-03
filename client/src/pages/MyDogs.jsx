import { useEffect, useState } from 'react'
import { Dog, Pencil, Plus, Trash2 } from 'lucide-react'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'

const EMPTY = { name: '', breed: '', age: '', weight: '', gender: 'male', image: '', foodPreferences: '', allergies: '' }

export default function MyDogs() {
  const [pets, setPets] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg] = useState('')

  const load = () =>
    api.get('/pets').then((r) => setPets(r.data.pets)).catch(() => setPets([]))

  useEffect(() => { load() }, [])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const pickImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result }))
    reader.readAsDataURL(file)
  }

  const openEdit = (pet) => {
    setEditing(pet._id)
    setForm({
      name: pet.name, breed: pet.breed || '', age: pet.age ?? '', weight: pet.weight ?? '',
      gender: pet.gender || 'male', image: pet.image || '',
      foodPreferences: pet.foodPreferences || '', allergies: pet.allergies || '',
    })
    setShowForm(true)
  }

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    const payload = { ...form, age: Number(form.age) || undefined, weight: Number(form.weight) || undefined }
    try {
      if (editing) await api.put(`/pets/${editing}`, payload)
      else await api.post('/pets', payload)
      setShowForm(false)
      setEditing(null)
      setForm(EMPTY)
      load()
    } catch (err) {
      setMsg(err.response?.data?.message || 'Could not save pet')
    }
  }

  const remove = async (id) => {
    try {
      await api.delete(`/pets/${id}`)
      load()
    } catch {}
  }

  if (!pets) return <LoadingSpinner text="Fetching your dogs..." />

  return (
    <main className="mx-auto max-w-[1000px] px-6 py-10 md:px-14">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-[#5d3a1a]">My Dogs</h1>
        <button
          onClick={() => { setEditing(null); setForm(EMPTY); setShowForm(true) }}
          className="inline-flex items-center gap-2 rounded-full bg-[#7a4a21] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#5f3a19]"
        >
          <Plus size={16} /> Add a dog
        </button>
      </div>

      {pets.length === 0 && !showForm && (
        <div className="mt-10 rounded-[25px] border border-[#e8dcc8] bg-white p-14 text-center">
          <Dog size={44} className="mx-auto text-[#c9a87c]" />
          <p className="mt-3 font-bold text-[#5d3a1a]">No dog profiles yet</p>
          <p className="mt-1 text-sm text-[#8a6a4a]">Add your dog to get personalised picks.</p>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pets.map((p) => (
          <div key={p._id} className="rounded-[20px] border border-[#e8dcc8] bg-white p-5">
            <div className="flex items-center justify-between">
              {p.image ? (
                <img src={p.image} alt={p.name} className="h-12 w-12 rounded-full border border-[#e5d3b3] object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1e3cb] text-[#7a4a21]">
                  <Dog size={24} />
                </div>
              )}
              <div className="flex gap-1">
                <button onClick={() => openEdit(p)} className="rounded-full p-2 text-[#a08b74] transition hover:bg-[#f1e6d2] hover:text-[#7a4a21]" aria-label="Edit">
                  <Pencil size={16} />
                </button>
                <button onClick={() => remove(p._id)} className="rounded-full p-2 text-[#a08b74] transition hover:bg-red-50 hover:text-red-600" aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="mt-3 font-extrabold text-[#5d3a1a]">{p.name}</h3>
            <div className="mt-1 space-y-0.5 text-sm text-[#8a6a4a]">
              {p.breed && <p>{p.breed}</p>}
              <p>
                {p.age != null && `${p.age} yrs`}
                {p.age != null && p.weight != null && ' · '}
                {p.weight != null && `${p.weight} kg`}
                {p.gender && ` · ${p.gender}`}
              </p>
              {p.foodPreferences && <p>Likes: {p.foodPreferences}</p>}
              {p.allergies && <p className="text-red-500">Allergies: {p.allergies}</p>}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <form onSubmit={submit} className="mt-8 rounded-[25px] border border-[#e8dcc8] bg-white p-6">
          <h2 className="font-extrabold text-[#5d3a1a]">{editing ? 'Edit dog' : 'Add a dog'}</h2>
          <div className="mt-4 flex items-center gap-4">
            {form.image ? (
              <img src={form.image} alt="Dog" className="h-16 w-16 rounded-full border border-[#e5d3b3] object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f1e3cb] text-[#7a4a21]">
                <Dog size={28} />
              </div>
            )}
            <label className="cursor-pointer rounded-full border border-[#e5d3b3] px-4 py-2 text-sm font-bold text-[#7a4a21] transition hover:bg-[#f1e6d2]">
              {form.image ? 'Change photo' : 'Add photo'}
              <input type="file" accept="image/*" onChange={pickImage} className="hidden" />
            </label>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-[#6b4423]">Name *</label>
              <input required value={form.name} onChange={set('name')} className="mt-1 w-full rounded-xl border border-[#e5d3b3] bg-[#faf9f5] px-4 py-2.5 outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#6b4423]">Breed</label>
              <input value={form.breed} onChange={set('breed')} className="mt-1 w-full rounded-xl border border-[#e5d3b3] bg-[#faf9f5] px-4 py-2.5 outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#6b4423]">Age (years)</label>
              <input type="number" min="0" step="0.5" value={form.age} onChange={set('age')} className="mt-1 w-full rounded-xl border border-[#e5d3b3] bg-[#faf9f5] px-4 py-2.5 outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#6b4423]">Weight (kg)</label>
              <input type="number" min="0" step="0.5" value={form.weight} onChange={set('weight')} className="mt-1 w-full rounded-xl border border-[#e5d3b3] bg-[#faf9f5] px-4 py-2.5 outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#6b4423]">Gender</label>
              <select value={form.gender} onChange={set('gender')} className="mt-1 w-full rounded-xl border border-[#e5d3b3] bg-white px-4 py-2.5 outline-none">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-[#6b4423]">Food preferences</label>
              <input value={form.foodPreferences} onChange={set('foodPreferences')} className="mt-1 w-full rounded-xl border border-[#e5d3b3] bg-[#faf9f5] px-4 py-2.5 outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-[#6b4423]">Allergies (optional)</label>
              <input value={form.allergies} onChange={set('allergies')} className="mt-1 w-full rounded-xl border border-[#e5d3b3] bg-[#faf9f5] px-4 py-2.5 outline-none" />
            </div>
          </div>
          {msg && <p className="mt-3 text-sm font-semibold text-red-600">{msg}</p>}
          <div className="mt-5 flex gap-3">
            <button className="rounded-full bg-[#7a4a21] px-6 py-2.5 font-bold text-white transition hover:bg-[#5f3a19]">
              {editing ? 'Save changes' : 'Add dog'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-[#e5d3b3] px-6 py-2.5 font-bold text-[#8a6a4a]">
              Cancel
            </button>
          </div>
        </form>
      )}
    </main>
  )
}
