import NewAnimalForm from './NewAnimalForm'

export default function NewAnimalPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Add New Animal</h1>
        <p className="text-stone-400 mt-1">Fill in the details to list a new rescue animal.</p>
      </div>
      <NewAnimalForm />
    </div>
  )
}
