'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import RecipeList from '../../components/RecipeList'

export type Recipe = {
  id: string
  title: string
  timeMinutes: number
  servings: number
  ingredients: string[]
  steps: string[]
  images: { url: string; publicId: string }[]
  imageUrls?: string[]
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes`)
      .then((res) => res.json())
      .then((data) => {
        const adapted = data.map((r: any) => ({
          ...r,
          imageUrls: r.images?.map((img: any) => img.url) ?? []
        }))
        setRecipes(adapted)
      })
  }, [])

  const handleDelete = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`, {
      method: 'DELETE'
    })
    setRecipes((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Minhas Receitas 🍲</h1>

      <Link
        href="/criar"
        className="block text-center mb-6 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold"
      >
        ➕ Nova Receita
      </Link>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por título, ingrediente ou passo..."
        className="w-full mb-6 p-2 rounded bg-zinc-800 text-white"
      />

      <RecipeList
        recipes={recipes}
        onEdit={(r) => window.location.href = `/editar/${r.id}`}
        onDelete={handleDelete}
        onViewImage={setSelectedImage}
        searchTerm={search}
      />

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 cursor-zoom-out"
        >
          <img
            src={selectedImage}
            alt="Visualização"
            className="max-w-full max-h-full rounded shadow-lg"
          />
        </div>
      )}
    </main>
  )
}
