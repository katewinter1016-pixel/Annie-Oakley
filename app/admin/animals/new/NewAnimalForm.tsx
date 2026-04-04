'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewAnimalForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])

  function handlePhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    setPhotoFiles(files)
    setPhotoPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)

    // Upload photos via server API
    const photoUrls: string[] = []
    for (const file of photoFiles) {
      const uploadForm = new FormData()
      uploadForm.append('file', file)
      uploadForm.append('bucket', 'Animal Photos')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: uploadForm })
      if (!res.ok) {
        const err = await res.json()
        setError('Photo upload failed: ' + err.error)
        setLoading(false)
        return
      }
      const { url } = await res.json()
      photoUrls.push(url)
    }

    const res = await fetch('/api/admin/animals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.get('name'),
        species: form.get('species'),
        breed: form.get('breed'),
        sex: form.get('sex'),
        age_years: form.get('age_years'),
        description: form.get('description'),
        status: form.get('status'),
        photo_urls: photoUrls,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      setError(err.error ?? 'Failed to save animal')
      setLoading(false)
      return
    }

    router.push('/admin/animals')
    router.refresh()
  }

  const fieldClass = 'w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]/30 bg-white'
  const labelClass = 'block text-sm font-semibold text-stone-600 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      <div>
        <label className={labelClass}>Name *</label>
        <input name="name" required className={fieldClass} placeholder="e.g. Biscuit" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Species *</label>
          <select name="species" required className={fieldClass}>
            <option value="">Select...</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="rabbit">Rabbit</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Sex</label>
          <select name="sex" className={fieldClass}>
            <option value="">Unknown</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Breed</label>
          <input name="breed" className={fieldClass} placeholder="e.g. Lab Mix" />
        </div>
        <div>
          <label className={labelClass}>Age (years)</label>
          <input name="age_years" type="number" min="0" step="0.5" className={fieldClass} placeholder="e.g. 2" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Status *</label>
        <select name="status" required className={fieldClass} defaultValue="available">
          <option value="available">Available</option>
          <option value="pending">Pending</option>
          <option value="fostered">Fostered</option>
          <option value="adopted">Adopted</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          rows={4}
          className={fieldClass + ' resize-none'}
          placeholder="Tell us about this animal's personality, history, and needs..."
        />
      </div>

      <div>
        <label className={labelClass}>Photos</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotos}
          className="w-full text-sm text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-[#D4A017]/10 file:text-[#2D1606] hover:file:bg-[#D4A017]/20 transition-colors cursor-pointer"
        />
        {photoPreviews.length > 0 && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {photoPreviews.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" className="w-20 h-20 object-cover rounded-xl border border-amber-100" />
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#D4A017] text-[#2D1606] px-6 py-2.5 rounded-full font-bold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Animal'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-stone-500 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-stone-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
