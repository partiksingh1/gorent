"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, BedDouble, Bath, Home, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAtom } from "jotai";
import { userAtom } from "@/state/auth";
import { favoritesAtom } from "@/state/properties";
import { fetchFavoritesApi } from "@/api/properties/fetchFavorites";

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useAtom(favoritesAtom);
  const [loading, setLoading] = useState(false); // Start with loading as true
  const [user] = useAtom(userAtom);
  console.log("fav user is", user);

  // Ensure userId is available before calling API
  const userId = user?.user_id;
  console.log("userId",userId);
  

  useEffect(() => {
    if (!user) {
      router.replace("/login"); // If no user, redirect to login
      return;
    }

    // Fetch favorites only if userId is available
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        console.log("userid is",userId);
         // Set loading state to true before starting the API call
        const favoritesData = await fetchFavoritesApi(userId);
        console.log("favoritesData is", favoritesData);
        setFavorites(favoritesData.favorites); // Update the favorites state
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch favorites.",
        });
      } finally {
        setLoading(false); // Set loading to false after API call finishes
      }
    };

    if (userId) {
      fetchFavorites(); // Call the fetch function only if userId is valid
    }
  }, [user, userId, setFavorites, router]);

  // Remove a favorite from the list
  const removeFavorite = async (favoriteId: number) => {
    try {
      const response = await axios.delete(`/api/v1/favorites/${favoriteId}`);
      // Update the state after removing the favorite
      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== favoriteId));

      toast({
        title: "Success",
        description: "Property removed from favorites",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove favorite",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Saved Properties</h1>
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
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Saved</h1>
        <div className="flex items-center gap-2">
          <Heart className="text-red-500" />
          <span className="text-lg font-medium">{Array.isArray(favorites) ? favorites.length : 0} Properties</span>
        </div>
      </div>

      {Array.isArray(favorites) && favorites.length === 0 ?  (
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
          {Array.isArray(favorites) && favorites.map((favorite)=> (
            <Card key={favorite.id} className="overflow-hidden group">
              <div className="relative">
                {/* <img
                  src={favorite.property.images[0]?.url || "/property-placeholder.jpg"}
                  alt={favorite.property.title}
                  className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                /> */}
                <img
                //   src={property.images[0]?.url || "https://img.freepik.com/free-photo/comfortable-elegance-modern-bedroom-with-luxury-bedding-generated-by-ai_188544-17037.jpg?t=st=1736792239~exp=1736795839~hmac=aad904334a0acc7a8b31e72f53390b3fba30ee3d12b671868599248f53d9b5f3&w=2000"}
                src={"https://img.freepik.com/free-photo/comfortable-elegance-modern-bedroom-with-luxury-bedding-generated-by-ai_188544-17037.jpg?t=st=1736792239~exp=1736795839~hmac=aad904334a0acc7a8b31e72f53390b3fba30ee3d12b671868599248f53d9b5f3&w=2000"}
                  alt={favorite.property.title}
                  className="object-cover w-full h-full"
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
  );
}
