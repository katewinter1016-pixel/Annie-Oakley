import Link from 'next/link'

export default function FacebookBanner() {
  return (
    <div className="bg-amber-50 border-y border-amber-200 py-3 px-4 text-center text-sm text-stone-600">
      This site is updated weekly. For the most current animal listings and updates, follow us on{' '}
      <a
        href="https://www.facebook.com/profile.php?id=61564323554302"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-[#D4A017] hover:underline"
      >
        Facebook
      </a>
      {' '}or{' '}
      <a
        href="https://www.instagram.com/annie_oakley_animal_rescue/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-[#D4A017] hover:underline"
      >
        Instagram
      </a>
      .
    </div>
  )
}
