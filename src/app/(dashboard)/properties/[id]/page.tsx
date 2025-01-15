"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Carousel } from "@/components/ui/carousel"
import {
  BedDouble,
  Bath,
  Home,
  MapPin,
  Calendar,
  Heart,
  Share2,
  MessageSquare,
} from "lucide-react"
import axios from "axios"
import React from "react"

// Define property type based on your schema
interface Property {
  id: number
  title: string
  description: string
  price: number
  address: string
  propertyType: "HOUSE" | "APARTMENT" | "COMMERCIAL" | "LAND"
  status: "AVAILABLE" | "SOLD" | "RENTED"
  numBedrooms: number
  numBathrooms: number
  squareMeters: number
  yearBuilt: number
  latitude: number
  longitude: number
  features: { [key: string]: boolean };
  images: { url: string; imageType: "MAIN" | "GALLERY" | "FLOORPLAN" }[]
  userId: number
}

export default function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { id } = React.use(params);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true)
        setError("")
        const response = await axios.get(`http://localhost:3000/api/v1/findPropertyById/${id}`)
        console.log("find property by id",response)
        setProperty(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8" />
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </Card>
      </div>
    )
  }

  if (!property) return null
  const featuresArray = Object.entries(property.features)
  .filter(([_, value]) => value) // Keep only features that are true
  .map(([key]) => key); // Get the feature names

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Property Images Carousel */}
      <div className="mb-8">
      <Carousel className="h-[500px] rounded-lg overflow-hidden">
  {/* {property.images.map((img) => (
    <div key={img.url}> */}
      <img src={"https://img.freepik.com/free-photo/comfortable-elegance-modern-bedroom-with-luxury-bedding-generated-by-ai_188544-17037.jpg?t=st=1736792239~exp=1736795839~hmac=aad904334a0acc7a8b31e72f53390b3fba30ee3d12b671868599248f53d9b5f3&w=2000"} alt="Property image" className="w-full h-full object-cover" />
    {/* </div>
  ))} */}
</Carousel>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <p className="text-gray-600 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {property.address}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600 mb-2">
                  €{property.price.toLocaleString()}
                </div>
                <span className="inline-block bg-emerald-100 text-emerald-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {property.status}
                </span>
              </div>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-4 gap-4 py-4 border-y">
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-gray-400" />
                <span>{property.numBedrooms} Beds</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-gray-400" />
                <span>{property.numBathrooms} Baths</span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-gray-400" />
                <span>{property.squareMeters}m²</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span>Built {property.yearBuilt}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Features List */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {featuresArray.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-gray-600">{feature}</span>
            </div>
          ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="space-y-4">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Agent
              </Button>
              <Button variant="outline" className="w-full">
                <Heart className="mr-2 h-4 w-4" />
                Save Property
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Map Preview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="aspect-square rounded-lg overflow-hidden">
              {/* Add your map component here */}
              <div className="w-full h-full bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
