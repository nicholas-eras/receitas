'use client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Recipe } from '@/app/page'

export default function CozinharPage() {
  const { id } = useParams()
  const router = useRouter()
  const [recipe, setRecipe] = useState<Recipe | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRecipe({
          ...data,
          imageUrls: data.images?.map((img: any) => img.url) ?? []
        })
      })
  }, [id])

  if (!recipe) {
    return <p className="text-white text-center">Carregando receita...</p>
  }

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <button
        onClick={() => router.push('/')}
        className="mb-4 px-4 py-2 rounded bg-gray-700 hover:bg-gray-800 text-white text-sm"
      >
        ← Voltar
      </button>

      <div className="bg-zinc-900 rounded-2xl shadow p-6 border border-zinc-800">
        <h1 className="text-3xl font-bold text-white">{recipe.title}</h1>
        <p className="text-gray-400 text-sm mt-1">{recipe.timeMinutes} min • {recipe.servings} porções</p>

        {recipe.imageUrls?.length! > 0 && (
          <div className="flex gap-2 flex-wrap mt-4">
            {recipe.imageUrls!.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Imagem ${i + 1}`}
                className="w-32 h-32 object-cover rounded border border-zinc-700"
              />
            ))}
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-xl text-white font-semibold mb-2">Ingredientes</h2>
          <ul className="list-disc ml-6 text-gray-300 text-sm">
            {recipe.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}
          </ul>
        </div>

        <div className="mt-6">
          <h2 className="text-xl text-white font-semibold mb-2">Modo de Preparo</h2>
          <ol className="list-decimal ml-6 text-gray-300 text-sm space-y-1">
            {recipe.steps.map((s, idx) => <li key={idx}>{s}</li>)}
          </ol>
        </div>
      </div>
    </main>
  )
}
