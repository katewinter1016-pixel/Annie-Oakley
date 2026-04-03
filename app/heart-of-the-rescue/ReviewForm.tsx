'use client'

// This component runs in the browser.
// It handles two things:
//   1. Uploading the photo directly to Supabase Storage (like a cloud file cabinet)
//   2. Saving the review text + photo URL to the reviews database table

import { useState, useRef } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Upload } from 'lucide-react'

export default function ReviewForm() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // When a user picks a photo, show them a preview before submitting
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    // FileReader reads the file locally in the browser to create a preview URL
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    let photoUrl: string | null = null

    // Step 1: Upload photo to Supabase Storage if one was selected
    if (selectedFile) {
      // Create a unique filename so two people with the same file name don't overwrite each other
      const filename = `${Date.now()}-${selectedFile.name.replace(/\s+/g, '-')}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('review-photos')
        .upload(filename, selectedFile)

      if (uploadError) {
        setError('Photo upload failed. Please try again or submit without a photo.')
        setSubmitting(false)
        return
      }

      // Step 2: Get the public URL so we can display the photo later
      const { data: urlData } = supabase.storage
        .from('review-photos')
        .getPublicUrl(uploadData.path)

      photoUrl = urlData.publicUrl
    }

    // Step 3: Save the review to the database
    const { error: dbError } = await supabase.from('reviews').insert({
      reviewer_name: fd.get('reviewer_name') as string,
      animal_name: fd.get('animal_name') as string,
      review_text: fd.get('review_text') as string,
      photo_url: photoUrl,
    })

    if (dbError) {
      setError('Something went wrong saving your review. Please try again.')
      setSubmitting(false)
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-[#2D1606] rounded-2xl p-10 text-center flex flex-col items-center gap-4">
        <div className="text-4xl">💛</div>
        <h3 className="font-display text-2xl font-bold text-[#D4A017]">Thank You!</h3>
        <p className="text-amber-50/80 leading-relaxed">
          Your story has been shared! Stories like yours inspire other families to take
          the leap and open their hearts to a rescue animal. We're so grateful.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-amber-100 rounded-2xl p-8 flex flex-col gap-6 shadow-sm">

      {/* Photo upload */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-stone-700">
          Photo of Your Animal
        </label>

        {/* Clicking the styled box triggers the hidden file input */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-amber-200 rounded-xl overflow-hidden hover:border-[#D4A017] transition-colors"
        >
          {preview ? (
            <div className="relative h-56 w-full">
              <Image src={preview} alt="Preview" fill className="object-cover" />
              <div className="absolute inset-0 bg-[#2D1606]/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <p className="text-white font-semibold text-sm">Click to change photo</p>
              </div>
            </div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center gap-2 text-stone-400">
              <Upload className="w-8 h-8 text-amber-300" />
              <p className="text-sm">Click to upload a photo</p>
              <p className="text-xs text-stone-300">JPG, PNG — max 10MB</p>
            </div>
          )}
        </div>

        {/* Hidden actual file input — styled box above triggers this */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Animal name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-stone-700">
          Your Animal's Name <span className="text-[#D4A017]">*</span>
        </label>
        <input
          name="animal_name"
          required
          placeholder="e.g. Buddy"
          className="w-full border border-amber-200 rounded-xl px-4 py-3 text-stone-800 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-transparent placeholder:text-stone-300 text-sm"
        />
      </div>

      {/* Reviewer name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-stone-700">
          Your Name <span className="text-[#D4A017]">*</span>
        </label>
        <input
          name="reviewer_name"
          required
          placeholder="e.g. Sarah M."
          className="w-full border border-amber-200 rounded-xl px-4 py-3 text-stone-800 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-transparent placeholder:text-stone-300 text-sm"
        />
      </div>

      {/* Review text */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-stone-700">
          Your Story <span className="text-[#D4A017]">*</span>
        </label>
        <textarea
          name="review_text"
          required
          placeholder="Tell us about your experience with Annie Oakley Animal Rescue and your furry family member..."
          rows={5}
          className="w-full border border-amber-200 rounded-xl px-4 py-3 text-stone-800 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-transparent placeholder:text-stone-300 text-sm resize-y"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-[#D4A017] text-[#2D1606] py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 shadow-lg shadow-[#D4A017]/20"
      >
        {submitting ? 'Sharing your story…' : 'Share My Story'}
      </button>
    </form>
  )
}
