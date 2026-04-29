import alphonso from "@/assets/mango-alphonso.jpg";
import banganapalli from "@/assets/mango-banganapalli.jpg";
import kesar from "@/assets/mango-kesar.jpg";
import dasheri from "@/assets/mango-dasheri.jpg";
import langra from "@/assets/mango-langra.jpg";
import himayat from "@/assets/mango-himayat.jpg";

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
    id: "alphonso",
    name: "Alphonso",
    origin: "Ratnagiri, Maharashtra",
    description:
      "The king of mangoes. Saffron flesh, intense aroma, honey-sweet finish. Hand-picked at peak ripeness.",
    price: 1499,
    weight: "3 kg box (8–10 mangoes)",
    image: alphonso,
    badge: "Bestseller",
  },
  {
    id: "banganapalli",
    name: "Banganapalli",
    origin: "Andhra Pradesh",
    description:
      "Large, golden and fibre-free. A buttery texture with classic mango sweetness — perfect for the whole family.",
    price: 999,
    weight: "5 kg box (10–12 mangoes)",
    image: banganapalli,
  },
  {
    id: "kesar",
    name: "Kesar",
    origin: "Junagadh, Gujarat",
    description:
      "Saffron-hued and richly aromatic. Naturally ripened, no calcium carbide — ever.",
    price: 1199,
    weight: "3 kg box (10–12 mangoes)",
    image: kesar,
    badge: "Limited",
  },
  {
    id: "dasheri",
    name: "Dasheri",
    origin: "Malihabad, Uttar Pradesh",
    description:
      "Slender, pale-gold and dripping with juice. The classic North Indian summer indulgence.",
    price: 849,
    weight: "5 kg box (14–16 mangoes)",
    image: dasheri,
  },
  {
    id: "langra",
    name: "Langra",
    origin: "Varanasi, Uttar Pradesh",
    description:
      "Greenish-yellow with a tangy-sweet flavour. Loved for its distinctive taste and smooth pulp.",
    price: 899,
    weight: "5 kg box (12–14 mangoes)",
    image: langra,
  },
  {
    id: "himayat",
    name: "Himayat (Imam Pasand)",
    origin: "Telangana",
    description:
      "The royal mango. Fibre-less, melt-in-mouth flesh with a perfume that fills the room.",
    price: 1799,
    weight: "3 kg box (5–7 mangoes)",
    image: himayat,
    badge: "Premium",
  },
];

export const findProduct = (id: string) => products.find((p) => p.id === id);
