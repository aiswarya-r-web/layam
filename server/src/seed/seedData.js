export const categories = [
  { name: 'Dog Food', slug: 'dog-food', description: 'Nutritious daily meals for every age and breed' },
  { name: 'Treats & Snacks', slug: 'treats-snacks', description: 'Tasty rewards and training treats' },
  { name: 'Toys & Playtime', slug: 'toys-playtime', description: 'Fun toys to keep your dog active and happy' },
  { name: 'Grooming & Hygiene', slug: 'grooming-hygiene', description: 'Shampoos, brushes and everyday care' },
  { name: 'Collars & Leashes', slug: 'collars-leashes', description: 'Safe and stylish walking essentials' },
  { name: 'Beds & Furniture', slug: 'beds-furniture', description: 'Cosy beds and restful sleep solutions' },
  { name: 'Health & Wellness', slug: 'health-wellness', description: 'Supplements and wellness essentials' },
  { name: 'Clothing & Accessories', slug: 'clothing-accessories', description: 'Apparel and accessories for every season' },
  { name: 'Feeding Accessories', slug: 'feeding-accessories', description: 'Bowls, feeders and drinkers' },
  { name: 'Travel Accessories', slug: 'travel-accessories', description: 'Carriers and travel gear for trips together' },
]

export const products = [
  // ── Dog Food ──────────────────────────────────────────────
  {
    name: 'Puppy Chicken & Rice Dry Food', slug: 'puppy-chicken-rice-dry-food', category: 'dog-food',
    description: 'Complete and balanced dry food for puppies up to 12 months. Made with real chicken, rice and DHA for healthy growth.',
    price: 749, originalPrice: 899, brand: 'PawFeast',
    images: ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800'],
    stock: 40, rating: 4.6, reviewCount: 120, ageGroup: 'puppy', dogSize: 'all',
  },
  {
    name: 'Adult Chicken & Veg Kibble', slug: 'adult-chicken-veg-kibble', category: 'dog-food',
    description: 'Everyday adult maintenance kibble with chicken, carrots and peas. Supports digestion and a shiny coat.',
    price: 999, originalPrice: 1199, brand: 'PawFeast',
    images: ['https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800'],
    stock: 55, rating: 4.5, reviewCount: 210, ageGroup: 'adult', dogSize: 'all',
  },
  {
    name: 'Grain-Free Salmon Adult Food', slug: 'grain-free-salmon-adult-food', category: 'dog-food',
    description: 'Grain-free recipe with real salmon and sweet potato. Great for dogs with sensitive stomachs.',
    price: 1499, originalPrice: 1799, brand: 'WildBowls',
    images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800'],
    stock: 30, rating: 4.7, reviewCount: 95, ageGroup: 'adult', dogSize: 'all',
  },
  {
    name: 'Senior Light Chicken Formula', slug: 'senior-light-chicken-formula', category: 'dog-food',
    description: 'Lower-calorie senior formula with glucosamine for joint support and easy-to-digest chicken protein.',
    price: 1249, originalPrice: 1449, brand: 'PawFeast',
    images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800'],
    stock: 25, rating: 4.4, reviewCount: 60, ageGroup: 'senior', dogSize: 'all',
  },

  // ── Treats & Snacks ───────────────────────────────────────
  {
    name: 'Natural Chicken Jerky Strips', slug: 'natural-chicken-jerky-strips', category: 'treats-snacks',
    description: 'Slow-dried real chicken strips. High protein, no artificial colours or flavours.',
    price: 349, originalPrice: 449, brand: 'TreatCo',
    images: ['https://images.unsplash.com/photo-1582798358481-d199fb7347bb?w=800'],
    stock: 80, rating: 4.8, reviewCount: 340, ageGroup: 'all', dogSize: 'all',
  },
  {
    name: 'Peanut Butter Biscuits', slug: 'peanut-butter-biscuits', category: 'treats-snacks',
    description: 'Crunchy oven-baked biscuits made with dog-safe peanut butter and oats. Perfect everyday reward.',
    price: 249, originalPrice: 299, brand: 'TreatCo',
    images: ['https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800'],
    stock: 100, rating: 4.5, reviewCount: 180, ageGroup: 'all', dogSize: 'all',
  },
  {
    name: 'Dental Chew Sticks (28 Pack)', slug: 'dental-chew-sticks-28-pack', category: 'treats-snacks',
    description: 'Daily dental chews that help reduce plaque and tartar while freshening breath.',
    price: 499, originalPrice: 599, brand: 'DentaPup',
    images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800'],
    stock: 65, rating: 4.6, reviewCount: 230, ageGroup: 'adult', dogSize: 'all',
  },
  {
    name: 'Training Mini Bites', slug: 'training-mini-bites', category: 'treats-snacks',
    description: 'Tiny low-calorie treats ideal for training sessions. Soft texture puppies love.',
    price: 199, originalPrice: 249, brand: 'TreatCo',
    images: ['https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=800'],
    stock: 120, rating: 4.7, reviewCount: 150, ageGroup: 'puppy', dogSize: 'small',
  },

  // ── Toys & Playtime ───────────────────────────────────────
  {
    name: 'Tennis Ball Chew Toy (3 Pack)', slug: 'tennis-ball-chew-toy-3-pack', category: 'toys-playtime',
    description: 'Durable fetch balls with a pet-safe felt cover. Great for games of fetch in the park.',
    price: 499, originalPrice: 599, brand: 'PlayPup',
    images: ['https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=800'],
    stock: 90, rating: 4.6, reviewCount: 260, ageGroup: 'all', dogSize: 'all',
  },
  {
    name: 'Squeaky Plush Bone', slug: 'squeaky-plush-bone', category: 'toys-playtime',
    description: 'Soft plush bone with a hidden squeaker. Gentle on teeth, perfect for indoor play.',
    price: 299, originalPrice: 399, brand: 'PlayPup',
    images: ['https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800'],
    stock: 70, rating: 4.3, reviewCount: 95, ageGroup: 'all', dogSize: 'small',
  },
  {
    name: 'Cotton Rope Tug Toy', slug: 'cotton-rope-tug-toy', category: 'toys-playtime',
    description: 'Heavy-duty knotted cotton rope for tug-of-war. Also helps clean teeth during play.',
    price: 349, originalPrice: 449, brand: 'PlayPup',
    images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800'],
    stock: 60, rating: 4.5, reviewCount: 110, ageGroup: 'all', dogSize: 'large',
  },
  {
    name: 'Rubber Treat Dispenser', slug: 'rubber-treat-dispenser', category: 'toys-playtime',
    description: 'Natural rubber puzzle toy — fill with treats or kibble to keep your dog mentally engaged.',
    price: 599, originalPrice: 749, brand: 'SmartBark',
    images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800'],
    stock: 45, rating: 4.8, reviewCount: 310, ageGroup: 'all', dogSize: 'medium',
  },

  // ── Grooming & Hygiene ────────────────────────────────────
  {
    name: 'Oatmeal & Aloe Dog Shampoo', slug: 'oatmeal-aloe-dog-shampoo', category: 'grooming-hygiene',
    description: 'Gentle soap-free shampoo with oatmeal and aloe vera. Soothes dry, itchy skin.',
    price: 449, originalPrice: 549, brand: 'CleanPaws',
    images: ['https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800'],
    stock: 50, rating: 4.6, reviewCount: 140, ageGroup: 'all', dogSize: 'all',
  },
  {
    name: 'Deshedding Slicker Brush', slug: 'deshedding-slicker-brush', category: 'grooming-hygiene',
    description: 'Self-cleaning slicker brush that removes loose undercoat and reduces shedding by up to 90%.',
    price: 549, originalPrice: 699, brand: 'CleanPaws',
    images: ['https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800'],
    stock: 35, rating: 4.7, reviewCount: 200, ageGroup: 'all', dogSize: 'all',
  },
  {
    name: 'Soothing Paw Balm', slug: 'soothing-paw-balm', category: 'grooming-hygiene',
    description: 'Natural balm for cracked or dry paw pads. Made with shea butter and beeswax.',
    price: 349, originalPrice: 429, brand: 'CleanPaws',
    images: ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800'],
    stock: 60, rating: 4.5, reviewCount: 85, ageGroup: 'all', dogSize: 'all',
  },
  {
    name: 'Dog Nail Clippers with Guard', slug: 'dog-nail-clippers-with-guard', category: 'grooming-hygiene',
    description: 'Stainless steel clippers with safety guard and non-slip grip for stress-free trims.',
    price: 399, originalPrice: 499, brand: 'CleanPaws',
    images: ['https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800'],
    stock: 40, rating: 4.4, reviewCount: 70, ageGroup: 'all', dogSize: 'all',
  },

  // ── Collars & Leashes ─────────────────────────────────────
  {
    name: 'Adjustable Nylon Collar', slug: 'adjustable-nylon-collar', category: 'collars-leashes',
    description: 'Durable everyday collar with quick-release buckle and D-ring for tags. Adjustable fit.',
    price: 349, originalPrice: 449, brand: 'WalkWell',
    images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800'],
    stock: 75, rating: 4.5, reviewCount: 160, ageGroup: 'all', dogSize: 'medium',
  },
  {
    name: 'No-Pull Padded Harness', slug: 'no-pull-padded-harness', category: 'collars-leashes',
    description: 'Front-clip harness that discourages pulling. Padded chest plate for comfort.',
    price: 899, originalPrice: 1099, brand: 'WalkWell',
    images: ['https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=800'],
    stock: 45, rating: 4.7, reviewCount: 280, ageGroup: 'adult', dogSize: 'large',
  },
  {
    name: 'Braided Leather Leash (5ft)', slug: 'braided-leather-leash-5ft', category: 'collars-leashes',
    description: 'Hand-braided genuine leather leash with solid brass clip. Softens beautifully with use.',
    price: 1099, originalPrice: 1399, brand: 'WalkWell',
    images: ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800'],
    stock: 30, rating: 4.8, reviewCount: 120, ageGroup: 'all', dogSize: 'all',
  },
  {
    name: 'Reflective Night Collar', slug: 'reflective-night-collar', category: 'collars-leashes',
    description: 'High-visibility reflective collar for safer evening walks. Lightweight and adjustable.',
    price: 449, originalPrice: 549, brand: 'WalkWell',
    images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800'],
    stock: 55, rating: 4.6, reviewCount: 90, ageGroup: 'all', dogSize: 'all',
  },

  // ── Beds & Furniture ──────────────────────────────────────
  {
    name: 'Orthopedic Memory Foam Bed', slug: 'orthopedic-memory-foam-bed', category: 'beds-furniture',
    description: 'Supportive memory foam bed for older dogs and large breeds. Removable washable cover.',
    price: 2499, originalPrice: 2999, brand: 'CozyDen',
    images: ['https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800'],
    stock: 20, rating: 4.9, reviewCount: 175, ageGroup: 'senior', dogSize: 'large',
  },
  {
    name: 'Plush Donut Cuddler Bed', slug: 'plush-donut-cuddler-bed', category: 'beds-furniture',
    description: 'Ultra-soft donut bed with raised rim for head and neck support. Machine washable.',
    price: 1299, originalPrice: 1599, brand: 'CozyDen',
    images: ['https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800'],
    stock: 35, rating: 4.7, reviewCount: 220, ageGroup: 'all', dogSize: 'small',
  },
  {
    name: 'Elevated Cooling Cot', slug: 'elevated-cooling-cot', category: 'beds-furniture',
    description: 'Breathable mesh cot that keeps your dog cool and off the floor. Indoor and outdoor use.',
    price: 1799, originalPrice: 2199, brand: 'CozyDen',
    images: ['https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800'],
    stock: 25, rating: 4.5, reviewCount: 80, ageGroup: 'all', dogSize: 'medium',
  },
  {
    name: 'Washable Crate Mat', slug: 'washable-crate-mat', category: 'beds-furniture',
    description: 'Non-slip quilted crate mat that fits standard crates. Fully machine washable.',
    price: 799, originalPrice: 999, brand: 'CozyDen',
    images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800'],
    stock: 50, rating: 4.4, reviewCount: 65, ageGroup: 'all', dogSize: 'all',
  },

  // ── Health & Wellness ─────────────────────────────────────
  {
    name: 'Daily Multivitamin Chews', slug: 'daily-multivitamin-chews', category: 'health-wellness',
    description: 'Tasty soft chews with essential vitamins and minerals for daily wellbeing.',
    price: 649, originalPrice: 799, brand: 'VitalPup',
    images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800'],
    stock: 60, rating: 4.6, reviewCount: 190, ageGroup: 'all', dogSize: 'all',
  },
  {
    name: 'Joint Support Supplement', slug: 'joint-support-supplement', category: 'health-wellness',
    description: 'Glucosamine and chondroitin supplement to support joint health in adult and senior dogs.',
    price: 899, originalPrice: 1099, brand: 'VitalPup',
    images: ['https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800'],
    stock: 40, rating: 4.7, reviewCount: 150, ageGroup: 'senior', dogSize: 'all',
  },
  {
    name: 'Omega-3 Fish Oil', slug: 'omega-3-fish-oil', category: 'health-wellness',
    description: 'Wild-caught fish oil rich in EPA and DHA. Supports skin, coat and heart health.',
    price: 749, originalPrice: 899, brand: 'VitalPup',
    images: ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800'],
    stock: 45, rating: 4.5, reviewCount: 110, ageGroup: 'all', dogSize: 'all',
  },
  {
    name: 'Probiotic Digestive Chews', slug: 'probiotic-digestive-chews', category: 'health-wellness',
    description: 'Daily probiotic chews that support gut health and firm stools.',
    price: 699, originalPrice: 849, brand: 'VitalPup',
    images: ['https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=800'],
    stock: 38, rating: 4.4, reviewCount: 75, ageGroup: 'all', dogSize: 'all',
  },

  // ── Clothing & Accessories ────────────────────────────────
  {
    name: 'Cosy Winter Dog Hoodie', slug: 'cosy-winter-dog-hoodie', category: 'clothing-accessories',
    description: 'Warm fleece-lined hoodie for chilly walks. Available in multiple sizes.',
    price: 799, originalPrice: 999, brand: 'PupStyle',
    images: ['https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800'],
    stock: 42, rating: 4.6, reviewCount: 130, ageGroup: 'all', dogSize: 'small',
  },
  {
    name: 'Waterproof Dog Raincoat', slug: 'waterproof-dog-raincoat', category: 'clothing-accessories',
    description: 'Lightweight raincoat with hood and reflective trim. Keeps your dog dry on wet days.',
    price: 999, originalPrice: 1249, brand: 'PupStyle',
    images: ['https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800'],
    stock: 33, rating: 4.5, reviewCount: 95, ageGroup: 'all', dogSize: 'medium',
  },
  {
    name: 'Cotton Bandana (3 Pack)', slug: 'cotton-bandana-3-pack', category: 'clothing-accessories',
    description: 'Set of 3 reversible cotton bandanas with snap closure. Easy on, easy off.',
    price: 349, originalPrice: 449, brand: 'PupStyle',
    images: ['https://images.unsplash.com/photo-1582798358481-d199fb7347bb?w=800'],
    stock: 80, rating: 4.4, reviewCount: 70, ageGroup: 'all', dogSize: 'all',
  },
  {
    name: 'Reflective Safety Vest', slug: 'reflective-safety-vest', category: 'clothing-accessories',
    description: 'High-visibility vest for nighttime walks and hikes. Adjustable straps for a snug fit.',
    price: 549, originalPrice: 699, brand: 'PupStyle',
    images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800'],
    stock: 48, rating: 4.6, reviewCount: 85, ageGroup: 'all', dogSize: 'all',
  },

  // ── Feeding Accessories ───────────────────────────────────
  {
    name: 'Stainless Steel Bowl Set', slug: 'stainless-steel-bowl-set', category: 'feeding-accessories',
    description: 'Set of 2 rust-proof stainless steel bowls with non-skid rubber base.',
    price: 499, originalPrice: 649, brand: 'FeedRight',
    images: ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800'],
    stock: 70, rating: 4.7, reviewCount: 240, ageGroup: 'all', dogSize: 'all',
  },
  {
    name: 'Slow Feeder Bowl', slug: 'slow-feeder-bowl', category: 'feeding-accessories',
    description: 'Maze-pattern bowl that slows down fast eaters and aids digestion.',
    price: 449, originalPrice: 549, brand: 'FeedRight',
    images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800'],
    stock: 55, rating: 4.6, reviewCount: 175, ageGroup: 'all', dogSize: 'all',
  },
  {
    name: 'Gravity Water Dispenser (3.5L)', slug: 'gravity-water-dispenser-3-5l', category: 'feeding-accessories',
    description: 'Automatic gravity-fed waterer that keeps fresh water available all day.',
    price: 899, originalPrice: 1099, brand: 'FeedRight',
    images: ['https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800'],
    stock: 28, rating: 4.5, reviewCount: 90, ageGroup: 'all', dogSize: 'all',
  },
  {
    name: 'Raised Feeding Stand', slug: 'raised-feeding-stand', category: 'feeding-accessories',
    description: 'Elevated bamboo stand with two stainless bowls. Easier posture for larger dogs.',
    price: 1299, originalPrice: 1599, brand: 'FeedRight',
    images: ['https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800'],
    stock: 22, rating: 4.6, reviewCount: 60, ageGroup: 'adult', dogSize: 'large',
  },

  // ── Travel Accessories ────────────────────────────────────
  {
    name: 'Car Seat Cover Hammock', slug: 'car-seat-cover-hammock', category: 'travel-accessories',
    description: 'Waterproof hammock-style seat cover that protects your car from fur and muddy paws.',
    price: 1499, originalPrice: 1899, brand: 'GoPup',
    images: ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800'],
    stock: 30, rating: 4.7, reviewCount: 145, ageGroup: 'all', dogSize: 'all',
  },
  {
    name: 'Portable Travel Water Bottle', slug: 'portable-travel-water-bottle', category: 'travel-accessories',
    description: 'Leak-proof bottle with built-in drinking bowl. One-hand operation for walks and hikes.',
    price: 449, originalPrice: 549, brand: 'GoPup',
    images: ['https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=800'],
    stock: 65, rating: 4.6, reviewCount: 200, ageGroup: 'all', dogSize: 'all',
  },
  {
    name: 'Airline-Approved Pet Carrier', slug: 'airline-approved-pet-carrier', category: 'travel-accessories',
    description: 'Ventilated soft-sided carrier that fits under most airline seats. Padded shoulder strap.',
    price: 2299, originalPrice: 2799, brand: 'GoPup',
    images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800'],
    stock: 18, rating: 4.8, reviewCount: 130, ageGroup: 'all', dogSize: 'small',
  },
  {
    name: 'Dog Seatbelt Safety Clip', slug: 'dog-seatbelt-safety-clip', category: 'travel-accessories',
    description: 'Adjustable seatbelt tether that clips to any harness for safe car travel.',
    price: 299, originalPrice: 399, brand: 'GoPup',
    images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800'],
    stock: 85, rating: 4.5, reviewCount: 110, ageGroup: 'all', dogSize: 'all',
  },
]
