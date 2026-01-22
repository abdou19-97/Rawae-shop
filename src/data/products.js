const products = [
  {
    id: "p1",
    name: "Rose Glow Serum",
    brand: "GlowLab",
    description: "Hydrating serum with rose extract for radiant skin.",
    features: [
      "Contains pure rose extract",
      "Deeply hydrates skin",
      "Improves skin texture",
      "Suitable for all skin types",
    ],
    category: "skincare",
    subcategory: "serum",
    basePrice: 1200,
    discount: 15, // 15% off
    soldCount: 120,
    isNew: false,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop",
    ],
    gift: {
      name: "Mini Rose Mist",
      image:
        "https://images.unsplash.com/photo-1536305030011-9b2f2efb0f02?q=80&w=400&auto=format&fit=crop",
    },
    inStock: true,
  },
  {
    id: "p2",
    name: "Velvet Lipstick",
    brand: "ColorPro",
    description: "Long-lasting matte lipstick in rich shades.",
    features: [
      "12-hour wear",
      "Matte finish",
      "Non-drying formula",
      "Available in 20 shades",
    ],
    category: "makeup",
    subcategory: "lipstick",
    basePrice: 800,
    discount: 20, // 20% off
    soldCount: 95,
    isNew: false,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop",
    ],
    gift: {
      name: "Lip Balm",
      image:
        "https://images.unsplash.com/photo-1512427691650-1f34c3d8d2b6?q=80&w=400&auto=format&fit=crop",
    },
    inStock: true,
  },
  {
    id: "p3",
    name: "Nourish Hair Oil",
    brand: "HairCare Plus",
    description: "Lightweight oil to nourish and add shine.",
    features: [
      "Argan oil enriched",
      "Repairs damaged hair",
      "Adds natural shine",
      "Non-greasy formula",
    ],
    category: "haircare",
    subcategory: "hair-oil",
    basePrice: 1500,
    discount: 0,
    soldCount: 45,
    isNew: true,
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=800&auto=format&fit=crop",
    ],
    gift: {
      name: "Mini Comb",
      image:
        "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=400&auto=format&fit=crop",
    },
    inStock: false,
  },
  {
    id: "p4",
    name: "Silk Night Cream",
    brand: "DreamSkin",
    description: "Nourishing night cream for smooth skin.",
    features: [
      "Overnight repair",
      "Anti-aging formula",
      "Deeply moisturizing",
      "Wake up to soft skin",
    ],
    category: "skincare",
    subcategory: "night-cream",
    basePrice: 2000,
    discount: 10,
    soldCount: 78,
    isNew: false,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1583980682066-f703b201b8e6?q=80&w=800&auto=format&fit=crop",
    ],
    gift: {
      name: "Sleep Mask",
      image:
        "https://images.unsplash.com/photo-1576671081602-91d7d0e9f6b4?q=80&w=400&auto=format&fit=crop",
    },
    inStock: true,
  },
  {
    id: "p5",
    name: "Glow Highlighter",
    brand: "ShimmerBeauty",
    description: "Crystal-fine highlighter for luminous skin.",
    features: [
      "Buildable glow",
      "Long-lasting shimmer",
      "Blends seamlessly",
      "Multi-use formula",
    ],
    category: "makeup",
    subcategory: "highlighter",
    basePrice: 950,
    discount: 25,
    soldCount: 150,
    isNew: false,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=800&auto=format&fit=crop",
    ],
    gift: {
      name: "Makeup Sponge",
      image:
        "https://images.unsplash.com/photo-1536242171178-ec2134a6e6d7?q=80&w=400&auto=format&fit=crop",
    },
    inStock: true,
  },
  {
    id: "p6",
    name: "Aloe Cleanser",
    brand: "PureClean",
    description: "Gentle cleanser with aloe vera for daily use.",
    features: [
      "Gentle on skin",
      "Removes impurities",
      "Aloe vera infused",
      "pH balanced",
    ],
    category: "cleansers",
    subcategory: "gel-cleanser",
    basePrice: 600,
    discount: 0,
    soldCount: 62,
    isNew: true,
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
    ],
    gift: {
      name: "Travel Pouch",
      image:
        "https://images.unsplash.com/photo-1545235617-9465a0d6b4d1?q=80&w=400&auto=format&fit=crop",
    },
    inStock: true,
  },
  {
    id: "p7",
    name: "Bronze Bronzer",
    brand: "SunKissed",
    description: "Buildable bronzer for a sun-kissed look.",
    features: [
      "Natural bronze finish",
      "Easy to blend",
      "Matte formula",
      "Long-lasting color",
    ],
    category: "makeup",
    subcategory: "blush",
    basePrice: 700,
    discount: 30,
    soldCount: 38,
    isNew: false,
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1596704017254-9b121068fc8b?q=80&w=800&auto=format&fit=crop",
    ],
    gift: {
      name: "Brush Mini",
      image:
        "https://images.unsplash.com/photo-1520975923601-6a6d8c7f5c0a?q=80&w=400&auto=format&fit=crop",
    },
    inStock: false,
  },
  {
    id: "p8",
    name: "Vitamin C Mask",
    brand: "BrightFace",
    description: "Brightening mask with vitamin C.",
    features: [
      "Brightens complexion",
      "Vitamin C enriched",
      "Evens skin tone",
      "Weekly treatment",
    ],
    category: "masks",
    subcategory: "sheet-mask",
    basePrice: 1100,
    discount: 15,
    soldCount: 88,
    isNew: true,
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop",
    ],
    gift: {
      name: "Sample Serum",
      image:
        "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop",
    },
    inStock: true,
  },
];

export default products;
