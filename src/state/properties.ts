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

// Atom for storing the fetched properties
export const propertiesAtom = atom([]);
