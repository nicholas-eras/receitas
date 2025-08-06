'use client'
import { useRouter } from 'next/navigation'
import RecipeForm from '../../../components/RecipeForm'

export default function NovaReceitaPage() {
  const router = useRouter()

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Nova Receita</h1>

      <RecipeForm
        editingRecipe={null}
        onSave={() => router.push('/')}
        onCancelEdit={() => router.push('/')}
      />
    </main>
  )
}
