'use client'
import { Recipe } from '@/app/page'
import { useRouter } from 'next/navigation'

interface Props {
  recipes: Recipe[]
  onEdit: (recipe: Recipe) => void
  onDelete: (id: string) => void
  onViewImage: (url: string) => void
  searchTerm?: string
}

export default function RecipeList({ recipes, onEdit, onDelete, onViewImage, searchTerm }: Props) {
  const router = useRouter()
  const lowerSearch = searchTerm?.toLowerCase() ?? ''

  const filtered = recipes.filter((r) => {
    const matchTitle = r.title.toLowerCase().includes(lowerSearch)
    const matchIngredients = r.ingredients.some((i) => i.toLowerCase().includes(lowerSearch))
    const matchSteps = r.steps.some((s) => s.toLowerCase().includes(lowerSearch))
    return matchTitle || matchIngredients || matchSteps
  })

  return (
    <div className="space-y-4">
      {filtered.map((r) => (
        <div key={r.id} className="bg-zinc-900 rounded-2xl shadow p-6 border border-zinc-800">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-semibold text-white">{r.title}</h2>
            <div className="flex gap-2">
                <button onClick={() => router.push(`/cozinhar/${r.id}`)} className="text-sm px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white">👨‍🍳 Cozinhar</button>
              <button onClick={() => onEdit(r)} className="text-sm px-2 py-1 rounded bg-yellow-600 hover:bg-yellow-700 text-white">✏️ Editar</button>
              <button onClick={() => onDelete(r.id)} className="text-sm px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white">🗑️ Excluir</button>
            </div>
          </div>

          <p className="text-gray-400 text-sm mt-1">{r.timeMinutes} min • {r.servings} porções</p>

          {Array.isArray(r.imageUrls) && r.imageUrls.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {r.imageUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Imagem ${i + 1}`}
                  className="w-32 h-32 object-cover rounded border border-zinc-700 cursor-zoom-in"
                  onClick={() => onViewImage(url)}
                />
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
  )
}
