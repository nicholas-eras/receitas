'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import RecipeForm from '../../../../components/RecipeForm'
import { Recipe } from '../../page'

export default function EditarReceitaPage() {
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
    return <p className="text-center text-white">Carregando receita...</p>
  }

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Editar Receita</h1>

      <RecipeForm
        editingRecipe={recipe}
        onSave={() => router.push('/')}
        onCancelEdit={() => router.push('/')}
      />
    </main>
  )
}
