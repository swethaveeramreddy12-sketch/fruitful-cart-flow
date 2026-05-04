import banginapalli from "@/assets/mango-banginapalli.jpg";
import himamPasand from "@/assets/mango-himam-pasand.jpg";
import groundnuts from "@/assets/groundnuts.jpg";
import groundnutOil from "@/assets/groundnut-oil.jpg";
import kaju from "@/assets/kaju.png";
import medjoolDates from "@/assets/medjool-dates.png";

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
    price: 1000,
    weight: "5 kg box",
    image: himamPasand,
    badge: "Premium",
  },
  {
    id: "banginapalli",
    name: "Banginapalli",
    origin: "Andhra Pradesh",
    description:
      "Large, golden and fibre-free. Buttery texture with classic mango sweetness — picked at peak ripeness.",
    price: 500,
    weight: "5 kg box",
    image: banginapalli,
    badge: "Bestseller",
  },
  {
    id: "medjool-dates-jumbo",
    name: "Medjool Dates — Jumbo",
    origin: "Premium Grade",
    description:
      "Jumbo-sized Medjool dates — soft, caramel-rich and naturally sweet. Perfect for daily energy and gifting.",
    price: 950,
    weight: "1 kg pack",
    image: medjoolDates,
    badge: "Jumbo",
  },
  {
    id: "medjool-dates-large",
    name: "Medjool Dates — Large",
    origin: "Premium Grade",
    description:
      "Large Medjool dates with a luscious chewy texture and honey-like sweetness. A wholesome everyday treat.",
    price: 1000,
    weight: "1 kg pack",
    image: medjoolDates,
  },
  {
    id: "kaju",
    name: "Kaju (Cashews)",
    origin: "Premium Grade",
    description:
      "Whole, creamy cashews — crisp, buttery and perfect for snacking, sweets and rich Indian gravies.",
    price: 1300,
    weight: "1 kg pack",
    image: kaju,
  },
  {
    id: "groundnuts",
    name: "Groundnuts",
    origin: "Andhra Pradesh",
    description:
      "Farm-fresh, sun-dried groundnuts in shell. Crunchy, nutty and perfect for daily snacking or home roasting.",
    price: 190,
    weight: "1 kg pack",
    image: groundnuts,
  },
  {
    id: "groundnut-oil",
    name: "Cold-pressed Groundnut Oil",
    origin: "Andhra Pradesh",
    description:
      "Wood-pressed (kachi ghani) groundnut oil. Unrefined, aromatic and rich in natural goodness — ideal for everyday cooking.",
    price: 350,
    weight: "1 litre bottle",
    image: groundnutOil,
    badge: "Cold-pressed",
  },
];

export const findProduct = (id: string) => products.find((p) => p.id === id);
