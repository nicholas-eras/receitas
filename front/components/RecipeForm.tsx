'use client'
import { Recipe } from '@/app/page'
import { useEffect, useState } from 'react'

interface Props {
  editingRecipe: Recipe | null
  onSave: (recipe: Recipe) => void
  onCancelEdit: () => void
}

export default function RecipeForm({ editingRecipe, onSave, onCancelEdit }: Props) {
  const [title, setTitle] = useState('')
  const [timeMinutes, setTimeMinutes] = useState<number | ''>('')
  const [servings, setServings] = useState<number | ''>('')
  const [ingredientInput, setIngredientInput] = useState('')
  const [ingredients, setIngredients] = useState<string[]>([])
  const [stepInput, setStepInput] = useState('')
  const [steps, setSteps] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([])
  const [editingIngredientIndex, setEditingIngredientIndex] = useState<number | null>(null)
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingRecipe) {
      setTitle(editingRecipe.title)
      setTimeMinutes(editingRecipe.timeMinutes)
      setServings(editingRecipe.servings)
      setIngredients(editingRecipe.ingredients)
      setSteps(editingRecipe.steps)
      setExistingImageUrls(editingRecipe.imageUrls ?? [])
    } else {
      resetForm()
    }
  }, [editingRecipe])

  const resetForm = () => {
    setTitle('')
    setTimeMinutes('')
    setServings('')
    setIngredients([])
    setSteps([])
    setSelectedFiles([])
    setImagePreviews([])
    setExistingImageUrls([])
  }

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setIngredients([...ingredients, ingredientInput.trim()])
      setIngredientInput('')
    }
  }

  const addStep = () => {
    if (stepInput.trim()) {
      setSteps([...steps, stepInput.trim()])
      setStepInput('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !timeMinutes || !servings || ingredients.length === 0 || steps.length === 0) {
      alert('Preencha todos os campos.')
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('timeMinutes', String(timeMinutes))
    formData.append('servings', String(servings))
    ingredients.forEach((i) => formData.append('ingredients[]', i))
    steps.forEach((s) => formData.append('steps[]', s))
    selectedFiles.forEach((f) => formData.append('files', f))
    existingImageUrls.forEach((url) => formData.append('imageUrls[]', url))

    const url = editingRecipe
      ? `${process.env.NEXT_PUBLIC_API_URL}/recipes/${editingRecipe.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/recipes`

    const method = editingRecipe ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        body: formData
      })

      if (!res.ok) throw new Error('Erro ao salvar')

      const saved = await res.json()
      onSave(saved)
      resetForm()
    } catch (err) {
      console.error(err)
      alert('Falha ao salvar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-2xl p-6 mb-6 space-y-4 border border-zinc-800">
      <h2 className="text-xl font-semibold text-white">
        {editingRecipe ? 'Editar Receita' : 'Nova Receita'}
      </h2>

      <input type="text" placeholder="Título da receita" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 rounded bg-zinc-800 text-white" />

      <div className="flex gap-4">
        <input type="number" placeholder="Tempo (min)" value={timeMinutes} onChange={(e) => setTimeMinutes(Number(e.target.value))} className="w-1/2 p-2 rounded bg-zinc-800 text-white" />
        <input type="number" placeholder="Porções" value={servings} onChange={(e) => setServings(Number(e.target.value))} className="w-1/2 p-2 rounded bg-zinc-800 text-white" />
      </div>

      {/* Ingredientes */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Ingredientes</label>
        <div className="flex gap-2">
          <input type="text" value={ingredientInput} onChange={(e) => setIngredientInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())} placeholder="Ex: 2 xícaras de leite" className="flex-1 p-2 rounded bg-zinc-800 text-white" />
          <button type="button" onClick={addIngredient} className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700">Adicionar</button>
        </div>
        <ul className="list-disc ml-5 mt-2 text-gray-300 text-sm">
          {ingredients.map((i, idx) => (
            <li key={idx} className="flex items-center justify-between">
              {editingIngredientIndex === idx ? (
                <input
                  value={i}
                  autoFocus
                  onChange={(e) => {
                    const updated = [...ingredients]
                    updated[idx] = e.target.value
                    setIngredients(updated)
                  }}
                  onBlur={() => setEditingIngredientIndex(null)}
                  className="bg-zinc-700 text-white p-1 rounded w-full mr-2"
                />
              ) : (
                <span onClick={() => setEditingIngredientIndex(idx)} className="flex-1 cursor-pointer hover:underline">{i}</span>
              )}
              <button onClick={() => setIngredients(ingredients.filter((_, i) => i !== idx))} type="button" className="text-red-500 text-xs ml-2">❌</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Modo de preparo */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Modo de Preparo</label>
        <div className="flex gap-2">
          <input type="text" value={stepInput} onChange={(e) => setStepInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStep())} placeholder="Ex: Bata os ovos com o açúcar" className="flex-1 p-2 rounded bg-zinc-800 text-white" />
          <button type="button" onClick={addStep} className="bg-purple-600 px-4 py-2 rounded text-white hover:bg-purple-700">Adicionar</button>
        </div>
        <ol className="list-decimal ml-5 mt-2 text-gray-300 text-sm">
          {steps.map((s, idx) => (
            <li key={idx} className="flex items-center justify-between">
              {editingStepIndex === idx ? (
                <input
                  value={s}
                  autoFocus
                  onChange={(e) => {
                    const updated = [...steps]
                    updated[idx] = e.target.value
                    setSteps(updated)
                  }}
                  onBlur={() => setEditingStepIndex(null)}
                  className="bg-zinc-700 text-white p-1 rounded w-full mr-2"
                />
              ) : (
                <span onClick={() => setEditingStepIndex(idx)} className="flex-1 cursor-pointer hover:underline">{s}</span>
              )}
              <button onClick={() => setSteps(steps.filter((_, i) => i !== idx))} type="button" className="text-red-500 text-xs ml-2">❌</button>
            </li>
          ))}
        </ol>
      </div>

      {/* Upload Imagens */}
      <div className="mt-2 space-y-2">
        <label className="block text-sm text-gray-300 mb-1">Imagens</label>
        <label className="inline-block bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 px-4 rounded cursor-pointer">
          📷 Tirar Foto
          <input type="file" accept="image/*" capture="environment" onChange={(e) => {
            const files = Array.from(e.target.files || [])
            setSelectedFiles((prev) => [...prev, ...files])
            setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))])
          }} className="hidden" />
        </label>
        <label className="inline-block bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 px-4 rounded cursor-pointer ml-2">
          🖼️ Galeria
          <input type="file" accept="image/*" multiple onChange={(e) => {
            const files = Array.from(e.target.files || [])
            setSelectedFiles((prev) => [...prev, ...files])
            setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))])
          }} className="hidden" />
        </label>
      </div>

      {/* Previews novas */}
      <div className="flex flex-wrap gap-2 mt-2">
        {imagePreviews.map((src, i) => (
          <div key={i} className="relative w-24 h-24">
            <img src={src} className="w-full h-full object-cover rounded" />
            <button type="button" onClick={() => {
              const previews = [...imagePreviews]
              const files = [...selectedFiles]
              previews.splice(i, 1)
              files.splice(i, 1)
              setImagePreviews(previews)
              setSelectedFiles(files)
            }} className="absolute top-0 right-0 bg-black bg-opacity-60 text-white text-xs rounded-bl px-1">❌</button>
          </div>
        ))}
      </div>

      {/* Imagens existentes */}
      {existingImageUrls.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {existingImageUrls.map((url, i) => (
            <div key={i} className="relative w-24 h-24">
              <img src={url} className="w-full h-full object-cover rounded" />
              <button type="button" onClick={() => {
                const updated = [...existingImageUrls]
                updated.splice(i, 1)
                setExistingImageUrls(updated)
              }} className="absolute top-0 right-0 bg-black bg-opacity-60 text-white text-xs rounded-bl px-1">❌</button>
            </div>
          ))}
        </div>
      )}

      <button type="submit" disabled={loading} className={`w-full text-white py-2 rounded font-semibold ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
        {loading ? 'Salvando...' : editingRecipe ? 'Salvar Alterações' : 'Salvar Receita'}
      </button>

        <button type="button" onClick={onCancelEdit} className="w-full mt-2 bg-gray-700 hover:bg-gray-800 text-white py-2 rounded">
            Voltar
        </button>
    </form>
  )
}
