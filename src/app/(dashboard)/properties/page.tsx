"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Slider,
//   SliderTrack,
//   SliderRange,
//   SliderThumb,
} from "@/components/ui/slider"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Search, BedDouble, Bath, Home, Euro } from "lucide-react"
import { fetchPropertiesApi } from "@/api/properties/fetchProperties"
import { useRouter } from "next/navigation"
import { useAtom } from "jotai"
import { filtersAtom, propertiesAtom } from "@/state/properties"
import { Spinner } from "@/components/ui/spinner"
import { userAtom } from "@/state/auth"

export default function PropertiesPage() {
  const handlePageRedirect = (router: any, propertyId: number) => {
    // Replace '/property-details/[id]' with the actual URL of the property detail page
    router.push(`/properties/${propertyId}`)
  }
  const [properties, setProperties] = useAtom(propertiesAtom)
  const [filters, setFilters] = useAtom(filtersAtom)
  const [loading, setLoading] = useState(true) // Loading state
  const [user] = useAtom(userAtom);
  console.log("user is ",user);
  
  

  const router = useRouter();
  const fetchProperties = async (filters: { location: string; propertyType: string; priceMin: number; priceMax: number; numBedrooms: string; status: string }) => {
    setLoading(true) 
    const queryParams = new URLSearchParams()
    if (filters.location) queryParams.append("location", filters.location)
    if (filters.propertyType) queryParams.append("propertyType", filters.propertyType)
    if (filters.priceMin) queryParams.append("priceMin", filters.priceMin.toString())
    if (filters.priceMax) queryParams.append("priceMax", filters.priceMax.toString())
    if (filters.numBedrooms) queryParams.append("numBedrooms", filters.numBedrooms)
    if (filters.status) queryParams.append("status", filters.status)

    try {
      const propertiesData = await fetchPropertiesApi(filters)
      console.log("propertiesData is",propertiesData)
      setProperties(propertiesData.properties)
    } catch (error) {
      console.error("Error fetching properties:", error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties(filters)
  }, [filters, setProperties])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location Search */}
          <div className="relative">
            <Input
              placeholder="Search location..."
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="pl-10"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>

          {/* Property Type Filter */}
          <Select
            value={filters.propertyType}
            onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HOUSE">House</SelectItem>
              <SelectItem value="APARTMENT">Apartment</SelectItem>
              <SelectItem value="COMMERCIAL">Commercial</SelectItem>
              <SelectItem value="LAND">Land</SelectItem>
            </SelectContent>
          </Select>

          {/* Bedrooms Filter */}
          <Select
            value={filters.numBedrooms}
            onValueChange={(value) => setFilters({ ...filters, numBedrooms: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}+ Beds
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AVAILABLE">Available</SelectItem>
              <SelectItem value="SOLD">Sold</SelectItem>
              <SelectItem value="RENTED">Rented</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Slider */}
        <div className="mt-6">
          <label className="text-sm font-medium mb-2 block">
            Price Range: €{filters.priceMin.toLocaleString()} - €{filters.priceMax.toLocaleString()}
          </label>
          <Slider
            defaultValue={[filters.priceMin, filters.priceMax]}
            max={1000000}
            step={10000}
            onValueChange={([min, max]) =>
              setFilters({ ...filters, priceMin: min, priceMax: max })
            }
            className="mt-2"
          />
        </div>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Spinner size="large" className="text-emerald-600" />
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                //   src={property.images[0]?.url || "https://img.freepik.com/free-photo/comfortable-elegance-modern-bedroom-with-luxury-bedding-generated-by-ai_188544-17037.jpg?t=st=1736792239~exp=1736795839~hmac=aad904334a0acc7a8b31e72f53390b3fba30ee3d12b671868599248f53d9b5f3&w=2000"}
                src={"https://img.freepik.com/free-photo/comfortable-elegance-modern-bedroom-with-luxury-bedding-generated-by-ai_188544-17037.jpg?t=st=1736792239~exp=1736795839~hmac=aad904334a0acc7a8b31e72f53390b3fba30ee3d12b671868599248f53d9b5f3&w=2000"}
                  alt={property.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded">
                  {property.status}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{property.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <BedDouble className="h-4 w-4" />
                  <span>{property.numBedrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  <span>{property.numBathrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  <span>{property.squareMeters}m²</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <div className="text-xl font-bold text-emerald-600">
                €{property.price.toLocaleString()}
              </div>
              <Button variant="outline" type="button" onClick={()=>handlePageRedirect(router, property.id)}>View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      )}

      {/* No Results Message */}
      {properties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No properties found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}