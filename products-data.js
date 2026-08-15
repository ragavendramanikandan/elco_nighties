// products-data.js - Seed Data & Store Database for Suneeta Elco Nighties

const DEFAULT_PRODUCTS = [
  {
    id: "SEN-101",
    title: "Jaipuri Floral Hand Block Print Cotton Nighty",
    category: "nighties",
    categoryName: "Nighties & Gowns",
    fabric: "100% Jaipuri Cotton",
    price: 899,
    originalPrice: 1299,
    discount: 30,
    rating: 4.9,
    reviewsCount: 128,
    badge: "Bestseller",
    sizes: ["M", "L", "XL", "XXL", "3XL"],
    colors: ["#9E2A2B", "#1F3A52", "#E09F3E"],
    colorNames: ["Maroon Floral", "Indigo Blue", "Mustard Gold"],
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Handcrafted in pure 60s count breathable Jaipuri cotton with authentic Sanganeri hand-block botanical motifs. Designed with a soft round neck, delicate piping, and side pocket for daily comfort.",
    features: [
      "100% Pure Breathable 60s Jaipuri Cotton",
      "Hand block printed with azo-free dyes",
      "Relaxed comfort fit with deep side pocket",
      "Pre-shrunk fabric, zero color bleeding"
    ],
    inStock: true,
    stockCount: 45,
    isFeedingFriendly: false,
    neckType: "Round Neck with Lace Detailing",
    sleeves: "Half Sleeves"
  },
  {
    id: "SEN-102",
    title: "Handmade Wax Batik Pure Cotton Kaftan Gown",
    category: "kaftans",
    categoryName: "Kaftans & Loungewear",
    fabric: "Pure Batik Cotton",
    price: 1199,
    originalPrice: 1699,
    discount: 29,
    rating: 5.0,
    reviewsCount: 94,
    badge: "Elco Signature",
    sizes: ["Free Size", "Plus Size (XL-4XL)"],
    colors: ["#1B365D", "#582F0E", "#2D6A4F"],
    colorNames: ["Batik Indigo Blue", "Earth Brown", "Emerald Moss"],
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Our signature artisanal wax batik kaftan, crafted by traditional craftsmen. Features an adjustable inner drawstring waist for flattering silhouette, breezy kimona sleeves, and ultra-soft handfeel.",
    features: [
      "Authentic handmade resist-wax Batik art",
      "Adjustable drawstring waist fit for all body types",
      "Lightweight, breathable & cool for humid weather",
      "Ankle-length with side slits for easy movement"
    ],
    inStock: true,
    stockCount: 32,
    isFeedingFriendly: true,
    neckType: "V-Neck with Drawstring",
    sleeves: "Kimono / Batwing Sleeves"
  },
  {
    id: "SEN-103",
    title: "Sanganeri Booti Cotton Collar Night Suit Set",
    category: "nightsuits",
    categoryName: "Night Suits & Sets",
    fabric: "100% Jaipuri Cotton",
    price: 1299,
    originalPrice: 1799,
    discount: 28,
    rating: 4.8,
    reviewsCount: 76,
    badge: "Trending",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#E76F51", "#2A9D8F", "#264653"],
    colorNames: ["Coral Booti", "Sage Mint", "Deep Navy"],
    images: [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Classic notch collar shirt paired with matching relaxed-fit pyjamas. Made from feather-soft mulmul cotton adorned with delicate Jaipuri booti block prints, contrast piping, and elasticated waist with drawcord.",
    features: [
      "2-Piece Set: Button-down shirt + Elasticated Pyjama",
      "Dual deep side pockets on pyjama",
      "Notch collar with premium fabric buttons",
      "Relaxed lounge silhouette"
    ],
    inStock: true,
    stockCount: 28,
    isFeedingFriendly: true,
    neckType: "Notch Collar",
    sleeves: "Full Sleeves"
  },
  {
    id: "SEN-104",
    title: "Alpine Premium Soft Front-Open Feeding Nighty",
    category: "nighties",
    categoryName: "Nighties & Gowns",
    fabric: "Alpine Cotton",
    price: 999,
    originalPrice: 1499,
    discount: 33,
    rating: 4.9,
    reviewsCount: 162,
    badge: "Maternity Special",
    sizes: ["M", "L", "XL", "XXL", "3XL"],
    colors: ["#6D597A", "#B56576", "#355070"],
    colorNames: ["Plum Violet", "Dusty Rose", "Slate Navy"],
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Specialized Alpine knit cotton nighty with concealed front buttons / dual zips for easy nursing & all-day lounge comfort. Non-stretch, super-durable and keeps its shape after hundreds of washes.",
    features: [
      "Concealed front zip / buttons for maternity nursing",
      "Heavyweight breathable Alpine cotton weave",
      "Zero-shrinkage and wrinkle resistant",
      "Comfortable scoop neck with lace yolk"
    ],
    inStock: true,
    stockCount: 50,
    isFeedingFriendly: true,
    neckType: "Front Button / Zip Yolk",
    sleeves: "Half Sleeves"
  },
  {
    id: "SEN-105",
    title: "Bagru Indigo Block Print Flared Tiered Maxi Dress",
    category: "homedresses",
    categoryName: "Home Dresses & Skirts",
    fabric: "100% Jaipuri Cotton",
    price: 1399,
    originalPrice: 1999,
    discount: 30,
    rating: 4.9,
    reviewsCount: 88,
    badge: "New Arrival",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#1F3A52", "#9E2A2B", "#3A5A40"],
    colorNames: ["Indigo Dabu", "Madder Red", "Olive Leaf"],
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Effortlessly versatile 3-tier maxi dress ideal for homewear, relaxed brunches, or step-out errands. Made from natural indigo mud-resist (Dabu) hand block cotton with tier gather details and functional pockets.",
    features: [
      "Multi-tier flare with graceful drape",
      "Natural indigo hand-block dye",
      "Two hidden deep seam pockets",
      "Can be styled as homedress or daywear"
    ],
    inStock: true,
    stockCount: 22,
    isFeedingFriendly: false,
    neckType: "Square Neck",
    sleeves: "Elbow Sleeves"
  },
  {
    id: "SEN-106",
    title: "Warli Tribal Art Batik Cotton Lounge Nighty",
    category: "nighties",
    categoryName: "Nighties & Gowns",
    fabric: "Pure Batik Cotton",
    price: 849,
    originalPrice: 1199,
    discount: 29,
    rating: 4.7,
    reviewsCount: 65,
    badge: "Bandra Favorite",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["#4A4E69", "#9A8C98", "#22223B"],
    colorNames: ["Charcoal Warli", "Taupe Earth", "Midnight Black"],
    images: [
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Celebrates Maharashtra's indigenous Warli folk art combined with traditional batik dye techniques. Super lightweight, breathable cotton perfect for Mumbai's tropical climate.",
    features: [
      "Warli folk pattern border & yoke",
      "Double reinforced stitching for long life",
      "Ultra-soft combed pure cotton fabric",
      "Roomy cut with side slit ease"
    ],
    inStock: true,
    stockCount: 38,
    isFeedingFriendly: false,
    neckType: "Round Neck",
    sleeves: "Half Sleeves"
  },
  {
    id: "SEN-107",
    title: "Jaipuri Block Printed Cotton Flared Wrap Skirt",
    category: "homedresses",
    categoryName: "Home Dresses & Skirts",
    fabric: "100% Jaipuri Cotton",
    price: 799,
    originalPrice: 1099,
    discount: 27,
    rating: 4.8,
    reviewsCount: 53,
    badge: "Pure Cotton",
    sizes: ["Free Size (Waist 28-42 in)"],
    colors: ["#BC4749", "#6A994E", "#386641"],
    colorNames: ["Crimson Paisley", "Fern Green", "Forest Olive"],
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Flowing full-circle cotton wrap skirt with ethnic Rajasthani paisley motifs and tie-up waist belt. Lightweight, breezy, and effortlessly pairable with t-shirts, crop tops, or kurtas.",
    features: [
      "Full 3.5 meter wide flared hem",
      "Adjustable wrap waist belt fits sizes XS to XXL",
      "100% fine cambric cotton",
      "Easy wash and natural fall"
    ],
    inStock: true,
    stockCount: 30,
    isFeedingFriendly: false,
    neckType: "N/A (Skirt)",
    sleeves: "N/A"
  },
  {
    id: "SEN-108",
    title: "Summer Breeze Cotton Shorts & Top Night Suit Set",
    category: "nightsuits",
    categoryName: "Night Suits & Sets",
    fabric: "100% Pure Mulmul Cotton",
    price: 1099,
    originalPrice: 1599,
    discount: 31,
    rating: 4.9,
    reviewsCount: 110,
    badge: "Summer Hit",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#F4A261", "#E76F51", "#2A9D8F"],
    colorNames: ["Sunset Peach", "Terracotta Blossom", "Aqua Floral"],
    images: [
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Stay cool during hot summer nights with this lightweight shorts loungewear set. Crafted from cloud-like pure mulmul cotton with sweet scalloped hems, elasticated waistband, and boxy tee fit.",
    features: [
      "Featherlight mulmul cotton fabric",
      "Comfort elastic shorts with drawcord",
      "Relaxed drop-shoulder top",
      "Breathable and quick drying"
    ],
    inStock: true,
    stockCount: 42,
    isFeedingFriendly: false,
    neckType: "Crew Neck",
    sleeves: "Short Sleeves"
  },
  {
    id: "SEN-109",
    title: "Ajrakh Geometric Indigo Silk-Cotton Lounge Kaftan",
    category: "kaftans",
    categoryName: "Kaftans & Loungewear",
    fabric: "Ajrakh Modal Cotton",
    price: 1499,
    originalPrice: 2199,
    discount: 32,
    rating: 5.0,
    reviewsCount: 71,
    badge: "Luxury Edition",
    sizes: ["Free Size", "Plus Size"],
    colors: ["#0B2545", "#8C1D40", "#134074"],
    colorNames: ["Royal Indigo Ajrakh", "Kutch Madder", "Navy Star"],
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Intricately hand-printed Ajrakh geometric patterns using centuries-old 14-stage block printing techniques. Luxuriously soft silk-cotton modal fabric that drapes like a dream.",
    features: [
      "Authentic Ajrakh 14-stage block print",
      "Silky-soft modal cotton blend",
      "Tassel drawstring details at neckline",
      "Ideal for hosting, leisure & travel"
    ],
    inStock: true,
    stockCount: 19,
    isFeedingFriendly: true,
    neckType: "Keyhole Neck with Tassels",
    sleeves: "Full Flare Kaftan Sleeves"
  },
  {
    id: "SEN-110",
    title: "Classic Bandra Checkered Cotton Homewear Midi",
    category: "homedresses",
    categoryName: "Home Dresses & Skirts",
    fabric: "100% Handloom Cotton",
    price: 949,
    originalPrice: 1399,
    discount: 32,
    rating: 4.8,
    reviewsCount: 42,
    badge: "Everyday Essential",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["#E76F51", "#264653", "#E9C46A"],
    colorNames: ["Rust Gingham", "Forest Slate", "Ochre Check"],
    images: [
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80"
    ],
    description: "A breezy calf-length midi dress designed for effortless comfort at home. Features an A-line silhouette, breathable woven cotton checks, and deep utility pockets.",
    features: [
      "100% pure woven yarn-dyed cotton",
      "Spacious A-line cut with back tie",
      "Reinforced dual side pockets",
      "Easy machine washable"
    ],
    inStock: true,
    stockCount: 26,
    isFeedingFriendly: false,
    neckType: "Sweetheart Neck",
    sleeves: "Sleeveless with Wide Straps"
  },
  {
    id: "SEN-111",
    title: "Batik Floral Print Zip-Front Long Nighty",
    category: "nighties",
    categoryName: "Nighties & Gowns",
    fabric: "Pure Batik Cotton",
    price: 899,
    originalPrice: 1299,
    discount: 30,
    rating: 4.9,
    reviewsCount: 89,
    badge: "Easy Wear",
    sizes: ["L", "XL", "XXL", "3XL"],
    colors: ["#2B2D42", "#8D99AE", "#D90429"],
    colorNames: ["Indigo Vine", "Grey Blossom", "Ruby Batik"],
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Features a smooth 14-inch front metallic-finish nylon zipper for effortless wearing. Beautiful floral wax crackle batik design that gets softer with every wash.",
    features: [
      "Long front zipper for easy on & off",
      "Premium wax crackle batik texture",
      "Soft pleats across chest for unrestricted movement",
      "Side pocket for phone/essentials"
    ],
    inStock: true,
    stockCount: 34,
    isFeedingFriendly: true,
    neckType: "Front Zip Mandarin Neck",
    sleeves: "Half Sleeves"
  },
  {
    id: "SEN-112",
    title: "Jaipuri Mughal Jaal Pure Cotton Pyjama Set",
    category: "nightsuits",
    categoryName: "Night Suits & Sets",
    fabric: "100% Jaipuri Cotton",
    price: 1349,
    originalPrice: 1899,
    discount: 29,
    rating: 5.0,
    reviewsCount: 68,
    badge: "Heritage Craft",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#3D5A80", "#EE6C4D", "#293241"],
    colorNames: ["Mughal Royal Teal", "Terracotta Clay", "Charcoal Night"],
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Inspired by royal Mughal architecture and palace jaal lattices. Detailed with mother-of-pearl buttons, contrast piped cuffs, and a tailored yet comfy fit.",
    features: [
      "Fine count 100% cambric cotton",
      "Hand block printed Mughal lattice print",
      "Elastic waistband with matching drawstring",
      "Includes matching cotton storage pouch"
    ],
    inStock: true,
    stockCount: 20,
    isFeedingFriendly: true,
    neckType: "Notch Collar",
    sleeves: "3/4th Sleeves"
  }
];

const DEFAULT_COUPONS = [
  { code: "BANDRAELCO", discountPercent: 15, minOrder: 999, description: "15% Off Elco Market Welcome Offer" },
  { code: "WELCOME10", discountPercent: 10, minOrder: 500, description: "10% Off on your first order" },
  { code: "JAIPURICOTTON", discountPercent: 20, minOrder: 1999, description: "20% Off on Jaipuri & Batik collection over ₹1,999" },
  { code: "FREESHIP", discountPercent: 0, minOrder: 0, description: "Free Express Shipping Across India" }
];

const DEFAULT_ORDERS = [
  {
    id: "SEN-2026-8941",
    date: "2026-08-14T10:30:00.000Z",
    customer: {
      name: "Pooja Sharma",
      email: "pooja.sharma@example.com",
      phone: "+91 98201 45678",
      address: "Flat 402, Sea View Apts, Perry Cross Rd, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050"
    },
    items: [
      {
        id: "SEN-102",
        title: "Handmade Wax Batik Pure Cotton Kaftan Gown",
        size: "Free Size",
        color: "Batik Indigo Blue",
        price: 1199,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "SEN-101",
        title: "Jaipuri Floral Hand Block Print Cotton Nighty",
        size: "XL",
        color: "Maroon Floral",
        price: 899,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
      }
    ],
    pricing: {
      subtotal: 2997,
      discount: 449.55,
      couponCode: "BANDRAELCO",
      shippingFee: 0,
      tax: 127.37,
      total: 2674.82
    },
    paymentMethod: "UPI (Google Pay)",
    paymentStatus: "PAID",
    orderStatus: "Processing",
    trackingTimeline: [
      { status: "Order Placed", time: "Aug 14, 2026 10:30 AM", done: true },
      { status: "Confirmed at Bandra Elco Store", time: "Aug 14, 2026 11:15 AM", done: true },
      { status: "Packed & Quality Checked", time: "Aug 14, 2026 03:40 PM", done: true },
      { status: "Dispatched via Express Courier", time: "Aug 15, 2026 09:00 AM", done: true },
      { status: "Out for Delivery", time: "Expected Aug 16", done: false }
    ],
    transactionRef: "UPI-TXN-894120934"
  }
];

const PINCODE_DIRECTORY = {
  "400050": { city: "Mumbai (Bandra West)", state: "Maharashtra", zone: "Local Mumbai", estDays: "Same Day / Next Day (24 hrs)" },
  "400001": { city: "Mumbai (Fort)", state: "Maharashtra", zone: "Local Mumbai", estDays: "1-2 Days" },
  "400053": { city: "Mumbai (Andheri West)", state: "Maharashtra", zone: "Local Mumbai", estDays: "1-2 Days" },
  "411001": { city: "Pune", state: "Maharashtra", zone: "Western India", estDays: "2-3 Days" },
  "110001": { city: "New Delhi", state: "Delhi NCR", zone: "Northern India", estDays: "3-4 Days" },
  "560001": { city: "Bengaluru", state: "Karnataka", zone: "Southern India", estDays: "3-4 Days" },
  "600001": { city: "Chennai", state: "Tamil Nadu", zone: "Southern India", estDays: "3-4 Days" },
  "700001": { city: "Kolkata", state: "West Bengal", zone: "Eastern India", estDays: "4-5 Days" },
  "302001": { city: "Jaipur", state: "Rajasthan", zone: "Northern India", estDays: "3-4 Days" },
  "380001": { city: "Ahmedabad", state: "Gujarat", zone: "Western India", estDays: "2-3 Days" },
  "500001": { city: "Hyderabad", state: "Telangana", zone: "Southern India", estDays: "3-4 Days" }
};
