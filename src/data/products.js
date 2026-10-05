const img = {
  buddha: "/Manjushree.webp",
  temple: "/kubera.webp",
  metal: "/zhabdung.webp",
  wood: "/ThangtongGyalpo.webp",
  ritual: "/Avalokiteshvara.webp",
  statue: "/21TaraStatue.webp",
};

const rawProducts = [
  {
    id: "manjushree-gold",
    image: img.buddha,
    category: "Buddha",
    collection: "best-sellers",
    title: "Handcrafted Manjushree Statue",
    price: 24000,
    material: "Copper, gold finish",
  },
  {
    id: "kubera-plated",
    image: img.temple,
    category: "Kubera",
    collection: "best-sellers",
    title: "12-inch Gold Plated Kubera",
    price: 42000,
    material: "Copper, gold finish",
  },
  {
    id: "zhabdung-copper",
    image: img.statue,
    category: "Zhabdung",
    collection: "best-sellers",
    title: "18-inch Copper Zhabdung",
    price: 36000,
    material: "Hammered copper",
  },
  {
    id: "gautam-classic",
    image: img.ritual,
    category: "Buddha",
    collection: "best-sellers",
    title: "Traditional Gautam Buddha",
    price: 28000,
    material: "Lost-wax bronze",
  },
  {
    id: "kubera-detail",
    image: img.metal,
    category: "Kubera",
    collection: "best-sellers",
    title: "Ornate Kubera Statue",
    price: 45000,
    material: "Copper, gold finish",
  },
  {
    id: "himalayan-copper",
    image: img.wood,
    category: "Zhabdung",
    collection: "best-sellers",
    title: "Handcrafted Himalayan Copper",
    price: 39000,
    material: "Hammered copper",
  },
  {
    id: "new-buddha",
    image: img.buddha,
    category: "Buddha",
    collection: "new",
    title: "New Buddha Collection",
    price: 30000,
    material: "Copper, gold finish",
  },
  {
    id: "new-copper",
    image: img.statue,
    category: "Zhabdung",
    collection: "new",
    title: "New Copper Crafted Statue",
    price: 38000,
    material: "Hammered copper",
  },
  {
    id: "new-kubera",
    image: img.temple,
    category: "Kubera",
    collection: "new",
    title: "New Kubera Collection",
    price: 48000,
    material: "Copper, gold finish",
  },
  {
    id: "meditating-buddha",
    image: img.ritual,
    category: "Buddha",
    collection: "new",
    title: "Meditating Buddha Statue",
    price: 32000,
    material: "Lost-wax bronze",
  },
  {
    id: "classic-gautam",
    image: img.buddha,
    category: "Buddha",
    collection: "classics",
    title: "Classic Gautam Buddha",
    price: 35000,
    material: "Lost-wax bronze",
  },
  {
    id: "meditation-classic",
    image: img.ritual,
    category: "Buddha",
    collection: "classics",
    title: "Meditation Buddha",
    price: 38000,
    material: "Copper, gold finish",
  },
  {
    id: "traditional-kubera",
    image: img.metal,
    category: "Kubera",
    collection: "classics",
    title: "Traditional Kubera Statue",
    price: 44000,
    material: "Copper, gold finish",
  },
  {
    id: "seated-gautam",
    image: img.statue,
    category: "Buddha",
    collection: "classics",
    title: "Seated Gautam Buddha",
    price: 46000,
    material: "Lost-wax bronze",
  },
];

export const featuredCollections = [
  {
    id: "best-sellers",
    title: "Best Sellers",
    description:
      "Pieces most loved for their finish, presence, and fidelity to traditional form.",
  },
  {
    id: "new",
    title: "New Additions",
    description: "Recent work from the atelier, ready for collectors and temples.",
  },
  {
    id: "classics",
    title: "Sacred Classics",
    description: "Timeless Himalayan iconography, cast and finished by hand.",
  },
];

export const byCollection = (id) =>
  products.filter((product) => product.collection === id);

export const getProduct = (id) => products.find((product) => product.id === id);

export const relatedProducts = (product, limit = 4) =>
  products
    .filter(
      (item) =>
        item.id !== product.id &&
        (item.category === product.category ||
          item.collection === product.collection)
    )
    .slice(0, limit);

const specs = {
  "manjushree-gold": {
    height: "10 in / 25 cm",
    weight: "3.2 kg",
    description:
      "Manjushree, bodhisattva of wisdom, modelled in copper and finished in gold. The sword and scripture are chased by hand in the Patan atelier.",
  },
  "kubera-plated": {
    height: "12 in / 30 cm",
    weight: "4.8 kg",
    description:
      "A seated Kubera, deity of wealth, with fire-gilded copper and carefully worked ornaments on the crown and jewelled torso.",
  },
  "zhabdung-copper": {
    height: "18 in / 46 cm",
    weight: "7.1 kg",
    description:
      "An 18-inch Zhabdung in hammered copper. The robe folds and throne are built up through chasing rather than casting alone.",
  },
  "gautam-classic": {
    height: "11 in / 28 cm",
    weight: "3.6 kg",
    description:
      "A classic Gautam Buddha in lost-wax bronze, seated in meditation with a calm, canonical face and a simple lotus base.",
  },
  "kubera-detail": {
    height: "14 in / 36 cm",
    weight: "5.4 kg",
    description:
      "An ornate Kubera with dense jewellery, mongoose, and gem motifs. Copper body with a high gold finish.",
  },
  "himalayan-copper": {
    height: "16 in / 41 cm",
    weight: "6.2 kg",
    description:
      "Himalayan copper work with a dark, burnished surface. Suitable for a shrine or a quiet interior.",
  },
  "new-buddha": {
    height: "12 in / 30 cm",
    weight: "3.9 kg",
    description:
      "A new Buddha from this season’s firing—gold-finished copper with a slightly broader lotus and a still, open gaze.",
  },
  "new-copper": {
    height: "15 in / 38 cm",
    weight: "5.8 kg",
    description:
      "Recently completed copper sculpture, left with a living hammered skin rather than a full gilt.",
  },
  "new-kubera": {
    height: "13 in / 33 cm",
    weight: "5.1 kg",
    description:
      "New Kubera collection piece with a brighter gold plate and a compact, temple-ready scale.",
  },
  "meditating-buddha": {
    height: "10 in / 25 cm",
    weight: "3.4 kg",
    description:
      "A meditating Buddha in lost-wax bronze. The mudra and ushnisha follow traditional Newar proportion.",
  },
  "classic-gautam": {
    height: "14 in / 36 cm",
    weight: "5.0 kg",
    description:
      "A larger classic Gautam in bronze, intended for a hall or chapel rather than a small altar.",
  },
  "meditation-classic": {
    height: "12 in / 30 cm",
    weight: "4.1 kg",
    description:
      "Meditation Buddha with a gold finish over copper. Quiet drapery and a low, stable base.",
  },
  "traditional-kubera": {
    height: "13 in / 33 cm",
    weight: "4.9 kg",
    description:
      "Traditional Kubera iconography: mongoose, jewels, and a protective, seated posture in gilt copper.",
  },
  "seated-gautam": {
    height: "16 in / 41 cm",
    weight: "6.4 kg",
    description:
      "Seated Gautam Buddha in lost-wax bronze, with a deep patina and a generous lotus throne.",
  },
};

export const products = rawProducts.map((product) => ({
  origin: "Patan, Nepal",
  finishTime: "4–8 weeks if commissioned",
  ...product,
  ...specs[product.id],
}));

// export const collections
