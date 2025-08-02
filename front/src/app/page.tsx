/* page.tsx */
'use client'
import { useEffect, useState } from 'react'

export type Recipe = {
  id: string
  title: string
  timeMinutes: number
  servings: number
  ingredients: string[]
  steps: string[]
  imageUrls: string[]
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

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

  const startEditing = (r: Recipe) => {
    setEditingId(r.id)
    setTitle(r.title)
    setTimeMinutes(r.timeMinutes)
    setServings(r.servings)
    setIngredients(r.ingredients)
    setSteps(r.steps)
    setExistingImageUrls(r.imageUrls ?? [])
    setSelectedFiles([])
    setImagePreviews([])
  }

  const deleteRecipe = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`, {
      method: 'DELETE',
    })
    setRecipes(recipes.filter((r) => r.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !timeMinutes || !servings || ingredients.length === 0 || steps.length === 0) {
      alert('Preencha todos os campos.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('timeMinutes', String(timeMinutes));
    formData.append('servings', String(servings));
    ingredients.forEach((i) => formData.append('ingredients[]', i));
    steps.forEach((s) => formData.append('steps[]', s));
    selectedFiles.forEach((f) => formData.append('files', f));
    existingImageUrls.forEach((url) => formData.append('imageUrls[]', url));

    const url = editingId
      ? `${process.env.NEXT_PUBLIC_API_URL}/recipes/${editingId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/recipes`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) throw new Error('Erro ao salvar');

      const saved = await res.json();
      setRecipes(
        editingId ? recipes.map((r) => (r.id === editingId ? saved : r)) : [saved, ...recipes]
      );

      setEditingId(null)
      setTitle('')
      setTimeMinutes('')
      setServings('')
      setIngredients([])
      setSteps([])
      setSelectedFiles([])
      setImagePreviews([])
      setExistingImageUrls([])
    } catch (err) {
      console.error(err);
      alert('Falha ao salvar.');
    }
  }

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes`)
      .then((res) => res.json())
      .then(setRecipes)
  }, [])

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Minhas Receitas 🍲</h1>

      <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-2xl p-6 mb-6 space-y-4 border border-zinc-800">
        <h2 className="text-xl font-semibold text-white">
          {editingId ? 'Editar Receita' : 'Nova Receita'}
        </h2>

        <input type="text" placeholder="Título da receita" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 rounded bg-zinc-800 text-white" />

        <div className="flex gap-4">
          <input type="number" placeholder="Tempo (min)" value={timeMinutes} onChange={(e) => setTimeMinutes(Number(e.target.value))} className="w-1/2 p-2 rounded bg-zinc-800 text-white" />
          <input type="number" placeholder="Porções" value={servings} onChange={(e) => setServings(Number(e.target.value))} className="w-1/2 p-2 rounded bg-zinc-800 text-white" />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Ingredientes</label>
          <div className="flex gap-2">
            <input type="text" value={ingredientInput} onChange={(e) => setIngredientInput(e.target.value)} placeholder="Ex: 2 xícaras de leite" className="flex-1 p-2 rounded bg-zinc-800 text-white" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())} />
            <button type="button" onClick={addIngredient} className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700">Adicionar</button>
          </div>
          {ingredients.length > 0 && <ul className="list-disc ml-5 mt-2 text-gray-300 text-sm">{ingredients.map((i, idx) => <li key={idx}>{i}</li>)}</ul>}
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Modo de Preparo</label>
          <div className="flex gap-2">
            <input type="text" value={stepInput} onChange={(e) => setStepInput(e.target.value)} placeholder="Ex: Bata os ovos com o açúcar" className="flex-1 p-2 rounded bg-zinc-800 text-white" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStep())} />
            <button type="button" onClick={addStep} className="bg-purple-600 px-4 py-2 rounded text-white hover:bg-purple-700">Adicionar</button>
          </div>
          {steps.length > 0 && <ol className="list-decimal ml-5 mt-2 text-gray-300 text-sm">{steps.map((s, idx) => <li key={idx}>{s}</li>)}</ol>}
        </div>

        {/* Imagens já existentes (modo edição) */}
        {existingImageUrls.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {existingImageUrls.map((url, i) => (
              <div key={i} className="relative w-24 h-24">
                <img src={url} alt={`Imagem ${i + 1}`} className="w-full h-full object-cover rounded cursor-zoom-in" onClick={() => setSelectedImage(url)} />
                <button type="button" onClick={() => {
                  const updated = [...existingImageUrls];
                  updated.splice(i, 1);
                  setExistingImageUrls(updated);
                }} className="absolute top-0 right-0 bg-black bg-opacity-60 text-white text-xs rounded-bl px-1">❌</button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-2">
          <label className="block text-sm text-gray-300 mb-1">Imagens</label>

          <label className="inline-block bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 px-4 rounded cursor-pointer">
            📸 Selecionar ou Tirar Fotos
            <input
              type="file"
              multiple
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                const newFiles = Array.from(e.target.files || []);
                const updatedFiles = [...selectedFiles, ...newFiles];
                const updatedPreviews = [
                  ...imagePreviews,
                  ...newFiles.map((f) => URL.createObjectURL(f))
                ];
                setSelectedFiles(updatedFiles);
                setImagePreviews(updatedPreviews);
              }}
              className="hidden"
            />
          </label>
        </div>


        <div className="flex flex-wrap gap-2 mt-2">
          {imagePreviews.map((src, i) => (
            <div key={i} className="relative w-24 h-24">
              <img src={src} alt="preview" className="w-full h-full object-cover rounded" />
              <button type="button" onClick={() => {
                const newPreviews = [...imagePreviews];
                const newFiles = [...selectedFiles];
                newPreviews.splice(i, 1);
                newFiles.splice(i, 1);
                setImagePreviews(newPreviews);
                setSelectedFiles(newFiles);
              }} className="absolute top-0 right-0 bg-black bg-opacity-60 text-white text-xs rounded-bl px-1">❌</button>
            </div>
          ))}
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold">
          {editingId ? 'Salvar Alterações' : 'Salvar Receita'}
        </button>

        {editingId && (
          <button type="button" className="w-full mt-2 bg-gray-700 hover:bg-gray-800 text-white py-2 rounded" onClick={() => {
            setEditingId(null)
            setTitle('')
            setTimeMinutes('')
            setServings('')
            setIngredients([])
            setSteps([])
            setSelectedFiles([])
            setImagePreviews([])
            setExistingImageUrls([])
          }}>
            ❌ Cancelar Edição
          </button>
        )}
      </form>

      {selectedImage && (
        <div onClick={() => setSelectedImage(null)} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 cursor-zoom-out">
          <img src={selectedImage} alt="Visualização" className="max-w-full max-h-full rounded shadow-lg" />
        </div>
      )}

      <div className="space-y-4">
        {recipes.map((r) => (
          <div key={r.id} className="bg-zinc-900 rounded-2xl shadow p-6 border border-zinc-800">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-semibold text-white">{r.title}</h2>
              <div className="flex gap-2">
                <button onClick={() => startEditing(r)} className="text-sm px-2 py-1 rounded bg-yellow-600 hover:bg-yellow-700 text-white">✏️ Editar</button>
                <button onClick={() => deleteRecipe(r.id)} className="text-sm px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white">🗑️ Excluir</button>
              </div>
            </div>

            <p className="text-gray-400 text-sm mt-1">{r.timeMinutes} min • {r.servings} porções</p>

            {r.imageUrls?.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {r.imageUrls.map((url, i) => (
                  <img key={i} src={url} alt={`Imagem ${i + 1}`} className="w-32 h-32 object-cover rounded border border-zinc-700 cursor-zoom-in" onClick={() => setSelectedImage(url)} />
                ))}
              </div>
            )}

            <ul className="list-disc ml-6 mt-2 text-sm text-gray-300">
              {r.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}
            </ul>

            {r.steps.length > 0 && (
              <div className="mt-4">
                <p className="font-medium text-gray-400 mb-1">Modo de Preparo:</p>
                <ol className="list-decimal ml-5 text-sm text-gray-300">
                  {r.steps.map((s, idx) => <li key={idx}>{s}</li>)}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
