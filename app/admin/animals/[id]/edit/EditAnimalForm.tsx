'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Animal = {
  id: string
  name: string
  species: string
  breed: string | null
  sex: string | null
  age_years: number | null
  description: string | null
  status: string
  photo_urls: string[] | null
}

export default function EditAnimalForm({ animal }: { animal: Animal }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newPhotoFiles, setNewPhotoFiles] = useState<File[]>([])
  const [newPhotoPreviews, setNewPhotoPreviews] = useState<string[]>([])
  const [existingPhotos, setExistingPhotos] = useState<string[]>(animal.photo_urls ?? [])

  function handlePhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    setNewPhotoFiles(files)
    setNewPhotoPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  function removeExistingPhoto(url: string) {
    setExistingPhotos((prev) => prev.filter((p) => p !== url))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)

    // Upload new photos
    const uploadedUrls: string[] = []
    for (const file of newPhotoFiles) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('animal-photos')
        .upload(path, file, { upsert: false })
      if (uploadError) {
        setError('Photo upload failed: ' + uploadError.message)
        setLoading(false)
        return
      }
      const { data: urlData } = supabase.storage.from('animal-photos').getPublicUrl(path)
      uploadedUrls.push(urlData.publicUrl)
    }

    const allPhotos = [...existingPhotos, ...uploadedUrls]

    const { error: updateError } = await supabase.from('animals').update({
      name: form.get('name') as string,
      species: form.get('species') as string,
      breed: (form.get('breed') as string) || null,
      sex: (form.get('sex') as string) || null,
      age_years: form.get('age_years') ? Number(form.get('age_years')) : null,
      description: (form.get('description') as string) || null,
      status: form.get('status') as string,
      photo_urls: allPhotos.length > 0 ? allPhotos : null,
    }).eq('id', animal.id)

    if (updateError) {
      setError(updateError.message)
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
        <input name="name" required defaultValue={animal.name} className={fieldClass} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Species *</label>
          <select name="species" required defaultValue={animal.species} className={fieldClass}>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="rabbit">Rabbit</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Sex</label>
          <select name="sex" defaultValue={animal.sex ?? ''} className={fieldClass}>
            <option value="">Unknown</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Breed</label>
          <input name="breed" defaultValue={animal.breed ?? ''} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Age (years)</label>
          <input name="age_years" type="number" min="0" step="0.5" defaultValue={animal.age_years ?? ''} className={fieldClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Status *</label>
        <select name="status" required defaultValue={animal.status} className={fieldClass}>
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
          defaultValue={animal.description ?? ''}
          className={fieldClass + ' resize-none'}
        />
      </div>

      {/* Existing photos */}
      {existingPhotos.length > 0 && (
        <div>
          <label className={labelClass}>Current Photos</label>
          <div className="flex gap-2 flex-wrap">
            {existingPhotos.map((url) => (
              <div key={url} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-20 h-20 object-cover rounded-xl border border-amber-100" />
                <button
                  type="button"
                  onClick={() => removeExistingPhoto(url)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New photos */}
      <div>
        <label className={labelClass}>Add More Photos</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotos}
          className="w-full text-sm text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-[#D4A017]/10 file:text-[#2D1606] hover:file:bg-[#D4A017]/20 transition-colors cursor-pointer"
        />
        {newPhotoPreviews.length > 0 && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {newPhotoPreviews.map((src, i) => (
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
          {loading ? 'Saving...' : 'Save Changes'}
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
