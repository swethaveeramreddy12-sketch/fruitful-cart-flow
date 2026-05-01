import banginapalli from "@/assets/mango-banginapalli.jpg";
import himamPasand from "@/assets/mango-himam-pasand.jpg";
import groundnuts from "@/assets/groundnuts.jpg";
import groundnutOil from "@/assets/groundnut-oil.jpg";

export type Product = {
  id: string;
  name: string;
  origin: string;
  description: string;
  /** Price in INR per box */
  price: number;
  weight: string;
  image: string;
  badge?: string;
};

export const products: Product[] = [
  {
    id: "himam-pasand",
    name: "Himam Pasand",
    origin: "Andhra Pradesh",
    description:
      "The royal mango. Fibre-less, melt-in-mouth flesh with a perfume that fills the room. Naturally ripened, no carbide.",
    price: 1799,
    weight: "3 kg box (5–7 mangoes)",
    image: himamPasand,
    badge: "Premium",
  },
  {
    id: "banginapalli",
    name: "Banginapalli",
    origin: "Andhra Pradesh",
    description:
      "Large, golden and fibre-free. Buttery texture with classic mango sweetness — picked at peak ripeness.",
    price: 999,
    weight: "5 kg box (10–12 mangoes)",
    image: banginapalli,
    badge: "Bestseller",
  },
  {
    id: "groundnuts",
    name: "Groundnuts",
    origin: "Andhra Pradesh",
    description:
      "Farm-fresh, sun-dried groundnuts in shell. Crunchy, nutty and perfect for daily snacking or home roasting.",
    price: 349,
    weight: "2 kg pack",
    image: groundnuts,
  },
  {
    id: "groundnut-oil",
    name: "Cold-pressed Groundnut Oil",
    origin: "Andhra Pradesh",
    description:
      "Wood-pressed (kachi ghani) groundnut oil. Unrefined, aromatic and rich in natural goodness — ideal for everyday cooking.",
    price: 599,
    weight: "1 litre bottle",
    image: groundnutOil,
    badge: "Cold-pressed",
  },
];

export const findProduct = (id: string) => products.find((p) => p.id === id);
