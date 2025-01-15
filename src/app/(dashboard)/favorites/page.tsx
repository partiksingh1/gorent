"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, BedDouble, Bath, Home, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export interface User {
  id: string
  email: string
  name: string
  role: string
}

interface FavoriteProperty {
  id: number
  property: {
    id: number
    title: string
    description: string
    price: number
    address: string
    propertyType: string
    numBedrooms: number
    numBathrooms: number
    squareMeters: number
    images: { url: string }[]
  }
}

export default function FavoritesPage() {
  const router = useRouter()

  const [favorites, setFavorites] = useState<FavoriteProperty[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch the user and their favorites from the API
  const fetchFavorites = async () => {
    try {
      // Get the user from localStorage
      const userData = localStorage.getItem("user")
      console.log("user is",(userData))
      if (!userData) {
        router.push("/login") // Redirect to login if no user is found
        return
      }

      const user: User = JSON.parse(userData) // Parse the user object from localStorage
      const userId = user.id
      console.log("user id is ",userId)

      setLoading(true)

      const response = await axios.get(`http://localhost:3000/api/v1/favorites/${userId}`)
      console.log("favorites is ", response.data);
      
      setFavorites(response.data)
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load favorites",
      })
    } finally {
      setLoading(false)
    }
  }

  // Remove a favorite from the list
  const removeFavorite = async (favoriteId: number) => {
    try {
      const response = await axios.delete(`/api/v1/favorites/${favoriteId}`)

      // Update the state after removing the favorite
      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== favoriteId))

      toast({
        title: "Success",
        description: "Property removed from favorites",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove favorite",
      })
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-t-lg" />
              <div className="p-4 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Favorites</h1>
        <div className="flex items-center gap-2">
          <Heart className="text-red-500" />
          <span className="text-lg font-medium">{favorites.length} Properties</span>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Favorites Yet</h2>
          <p className="text-gray-500 mb-4">Start adding properties to your favorites list</p>
          <Button asChild>
            <a href="/properties">Browse Properties</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <Card key={favorite.id} className="overflow-hidden group">
              <div className="relative">
                <img
                  src={favorite.property.images[0]?.url || "/property-placeholder.jpg"}
                  alt={favorite.property.title}
                  className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFavorite(favorite.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{favorite.property.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{favorite.property.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <BedDouble className="h-4 w-4" />
                    <span>{favorite.property.numBedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>{favorite.property.numBathrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    <span>{favorite.property.squareMeters}m²</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-emerald-600">
                    €{favorite.property.price.toLocaleString()}
                  </span>
                  <Button variant="outline" asChild>
                    <a href={`/properties/${favorite.property.id}`}>View Details</a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
