// atoms.js
import { atom } from "jotai";

// Atom for managing filters
export const filtersAtom = atom({
  location: "",
  propertyType: "",
  priceMin: 0,
  priceMax: 1000000,
  numBedrooms: "",
  status: "",
});
export interface Property {
  id: number
  title: string
  description: string
  price: number
  address: string
  propertyType: string
  status: string
  numBedrooms: number
  numBathrooms: number
  squareMeters: number
  images: { url: string }[]
}

export interface FavoriteProperty {
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
// Atom for storing the fetched properties
export const propertiesAtom = atom<Property[]>([])

export const favoritesAtom = atom<FavoriteProperty[]>([])
