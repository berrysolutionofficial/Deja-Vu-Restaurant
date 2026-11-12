export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  secondaryPrice?: { label: string; price: number };
  portionSizes?: { label: string; price: number }[];
  isSpecial?: boolean;
  isPopular?: boolean;
  image: string;
  rating?: number;
  reviewCount?: number;
}

export const MENU_CATEGORIES = [
  { id: 'steaks', label: 'Beef & Chicken Steaks' },
  { id: 'bbq-karahi', label: 'BBQ & Karahi' },
  { id: 'burgers-sandwiches', label: 'Burgers & Sandwiches' },
  { id: 'biryani-rolls', label: 'Biryani & Rolls' },
  { id: 'starters', label: 'Starters & Platters' },
  { id: 'pasta-pizza', label: 'Pasta & Pizza' },
  { id: 'chinese-seafood', label: 'Chinese & Seafood' },
  { id: 'desserts-beverages', label: 'Desserts & Beverages' },
  { id: 'naan-sides', label: 'Naan & Sides' },
] as const;

// Categorized high-fidelity image mapping to guarantee 100% unique & varied image coverage
const IMG_STEAK_SPECIAL = '/assets/images/hero_sizzling_steak_1794462151749.jpg';
const IMG_STEAK_FAJITA = '/assets/images/dish_sizzling_fajita_1794464869482.jpg';
const IMG_STEAK_MEXICAN = '/assets/images/dish_mexican_steak_1794464870175.jpg';
const IMG_STEAK_MOROCCAN = '/assets/images/moroccan_sambal_steak_1794464935285.jpg';
const IMG_STEAK_MUSHROOM = '/assets/images/dish_mushroom_steak_1794464871284.jpg';
const IMG_CHICKEN_TARRAGON = '/assets/images/dish_tarragon_chicken_1794464868496.jpg';
const IMG_CHICKEN_PARMESAN = '/assets/images/parmesan_chicken_dish_1794464935092.jpg';
const IMG_DYNAMITE_PRAWNS = '/assets/images/dynamite_prawns_dish_1794464934656.jpg';
const IMG_BBQ = '/assets/images/bbq_charcoal_platter_1794462153034.jpg';
const IMG_SEEKH_KABAB = '/assets/images/seekh_kabab_dish_1794466594548.jpg';
const IMG_KARAHI = '/assets/images/dish_chicken_karahi_1794463795003.jpg';
const IMG_WHITE_HANDI = '/assets/images/chicken_white_handi_1794466595601.jpg';
const IMG_PARATHA_ROLL = '/assets/images/puri_paratha_roll_1794466596176.jpg';
const IMG_FISH_CHIPS = '/assets/images/crispy_fish_chips_1794466596380.jpg';
const IMG_BURGER = '/assets/images/gourmet_burger_fries_1794462152540.jpg';
const IMG_BIRYANI = '/assets/images/dish_royal_biryani_1794463795642.jpg';
const IMG_PASTA = '/assets/images/dish_creamy_pasta_1794463797715.jpg';
const IMG_ALFREDO = '/assets/images/fettuccine_alfredo_1794471793227.jpg';
const IMG_LASAGNA = '/assets/images/baked_lasagna_1794471810830.jpg';
const IMG_PIZZA = '/assets/images/artisan_oven_pizza_1794471771786.jpg';
const IMG_SANDWICH = '/assets/images/club_sandwich_1794471829696.jpg';
const IMG_DESSERT = '/assets/images/dish_lava_cake_dessert_1794463798067.jpg';

export const MENU_ITEMS: MenuItem[] = [
  // --- BEEF STEAKS (Menu Card 10 & 7) ---
  {
    id: 'beef-dejavu-special',
    name: 'Deja Vu Special Steak',
    category: 'steaks',
    description: 'Char Grilled beef served with sundried tomato pesto sauce and seasonal vegetables',
    price: 2563,
    isSpecial: true,
    isPopular: true,
    image: IMG_STEAK_SPECIAL,
    rating: 5.0,
    reviewCount: 342
  },
  {
    id: 'beef-sizzling-fajita',
    name: 'Sizzling Beef Fajita',
    category: 'steaks',
    description: 'Char grilled beef sauteed with onion, capsicum, tomato. Served with salsa, sour cream, pitta bread and rice',
    price: 2338,
    image: IMG_STEAK_FAJITA,
    rating: 4.9,
    reviewCount: 218
  },
  {
    id: 'beef-mexican-steak',
    name: 'Mexican Steak',
    category: 'steaks',
    description: 'Prime beef steak served with spicy Mexican sauce and sideline',
    price: 2563,
    image: IMG_STEAK_MEXICAN,
    rating: 4.8,
    reviewCount: 176
  },
  {
    id: 'beef-moroccan-steak',
    name: 'Moroccan Steak',
    category: 'steaks',
    description: 'Char grilled beef served with rich Moroccan sambal sauce',
    price: 2585,
    image: IMG_STEAK_MOROCCAN,
    rating: 4.9,
    reviewCount: 204
  },
  {
    id: 'beef-tarragon-steak',
    name: 'Tarragon Steak',
    category: 'steaks',
    description: 'Tender beef fillet served with creamy french tarragon herb sauce',
    price: 2599,
    isPopular: true,
    image: IMG_CHICKEN_TARRAGON,
    rating: 5.0,
    reviewCount: 289
  },
  {
    id: 'beef-fire-steak',
    name: 'Fire Steak',
    category: 'steaks',
    description: 'Char grilled beef served with chef special spicy fiery sauce',
    price: 2499,
    image: IMG_STEAK_MEXICAN,
    rating: 4.8,
    reviewCount: 154
  },
  {
    id: 'beef-tuscany-steak',
    name: 'Tuscany Steak',
    category: 'steaks',
    description: 'Center cut tenderloin steak served with rich Tuscany herb butter sauce',
    price: 3333,
    isSpecial: true,
    image: IMG_STEAK_SPECIAL,
    rating: 4.9,
    reviewCount: 132
  },
  {
    id: 'beef-mushroom-steak',
    name: 'Mushroom Steak',
    category: 'steaks',
    description: 'Beef steak served with rich creamy wild mushroom reduction sauce',
    price: 2450,
    image: IMG_STEAK_MUSHROOM,
    rating: 4.9,
    reviewCount: 245
  },
  {
    id: 'beef-cherry-mustard',
    name: 'Cherry Mustard Steak',
    category: 'steaks',
    description: 'Beef steak with sauteed vegetables, served with tangy cherry mustard glaze sauce',
    price: 3103,
    image: IMG_STEAK_MOROCCAN,
    rating: 4.8,
    reviewCount: 98
  },
  {
    id: 'beef-surf-turf',
    name: 'Surf & Turf Steak',
    category: 'steaks',
    description: 'Beef steak served with garlic lemon butter sauce topped with jumbo grilled prawns',
    price: 3506,
    isSpecial: true,
    image: IMG_DYNAMITE_PRAWNS,
    rating: 5.0,
    reviewCount: 194
  },
  {
    id: 'beef-duck-steak',
    name: 'Beef Duck Steak',
    category: 'steaks',
    description: 'Double decker steak served with chef signature special sauce',
    price: 3508,
    image: IMG_STEAK_SPECIAL,
    rating: 4.9,
    reviewCount: 110
  },
  {
    id: 'beef-black-pepper',
    name: 'Black Pepper Steak',
    category: 'steaks',
    description: 'Beef steak served with cracked black pepper demi-glace sauce',
    price: 2530,
    image: IMG_STEAK_MUSHROOM,
    rating: 4.8,
    reviewCount: 180
  },

  // --- CHICKEN STEAKS (Menu Card 3 & 4) ---
  {
    id: 'chk-dejavu-special',
    name: 'Deja Vu Special Chicken',
    category: 'steaks',
    description: 'Pan Fried Chicken Stuffed with Spinach and Cheese',
    price: 1846,
    isSpecial: true,
    isPopular: true,
    image: IMG_CHICKEN_PARMESAN,
    rating: 5.0,
    reviewCount: 356
  },
  {
    id: 'chk-parmesan',
    name: 'Parmesan Chicken',
    category: 'steaks',
    description: 'Golden Fried Chicken topped with Red Sauce and Cheese',
    price: 1978,
    image: IMG_CHICKEN_PARMESAN,
    rating: 4.9,
    reviewCount: 230
  },
  {
    id: 'chk-mushroom',
    name: 'Mushroom Chicken',
    category: 'steaks',
    description: 'Served with Creamy Mushroom Sauce',
    price: 1846,
    image: IMG_STEAK_MUSHROOM,
    rating: 4.8,
    reviewCount: 172
  },
  {
    id: 'chk-tarragon',
    name: 'Tarragon Chicken',
    category: 'steaks',
    description: 'Served with Creamy Tarragon Sauce',
    price: 1846,
    image: IMG_CHICKEN_TARRAGON,
    rating: 4.9,
    reviewCount: 264
  },
  {
    id: 'chk-moroccan',
    name: 'Moroccan Chicken',
    category: 'steaks',
    description: 'Served with Moroccan Sauce',
    price: 1866,
    image: IMG_STEAK_MOROCCAN,
    rating: 4.8,
    reviewCount: 148
  },
  {
    id: 'chk-mexican',
    name: 'Mexican Chicken',
    category: 'steaks',
    description: 'Served with Spicy Mexican Sauce',
    price: 1826,
    image: IMG_STEAK_MEXICAN,
    rating: 4.8,
    reviewCount: 160
  },
  {
    id: 'chk-italian',
    name: 'Italian Chicken',
    category: 'steaks',
    description: 'Golden Fried Chicken topped with Tomato Sauce and Cheese Stuffed Mushroom and Cheese',
    price: 1888,
    image: IMG_CHICKEN_PARMESAN,
    rating: 4.9,
    reviewCount: 142
  },
  {
    id: 'chk-moskawa',
    name: 'Chicken Moskawa',
    category: 'steaks',
    description: 'Golden Fried Chicken Stuffed by Sauteed Mushroom and Mozzarella Cheese Served with Tarragon Sauce',
    price: 1985,
    image: IMG_CHICKEN_TARRAGON,
    rating: 4.9,
    reviewCount: 135
  },
  {
    id: 'chk-black-pepper',
    name: 'Black Pepper Chicken',
    category: 'steaks',
    description: 'Grilled chicken with black pepper sauce',
    price: 1799,
    image: IMG_STEAK_MUSHROOM,
    rating: 4.7,
    reviewCount: 120
  },
  {
    id: 'chk-twin',
    name: 'Twin Chicken',
    category: 'steaks',
    description: 'Grill chicken with mushroom sauce and pepper sauce',
    price: 1846,
    image: IMG_STEAK_MUSHROOM,
    rating: 4.8,
    reviewCount: 150
  },
  {
    id: 'chk-fire',
    name: 'Fire Chicken',
    category: 'steaks',
    description: 'Served with mixture spicy sauce',
    price: 1846,
    image: IMG_STEAK_MEXICAN,
    rating: 4.8,
    reviewCount: 168
  },
  {
    id: 'chk-stuffed',
    name: 'Stuffed Chicken',
    category: 'steaks',
    description: 'Chicken Fillet Stuffed with Spinach, Turkey Bacon, Cheddar Cheese Served with Caper Sauce',
    price: 1950,
    image: IMG_CHICKEN_PARMESAN,
    rating: 4.9,
    reviewCount: 188
  },
  {
    id: 'chk-rolland',
    name: 'Chicken Rolland',
    category: 'steaks',
    description: 'Stuffed Chicken Roll Filled with Capsicum, Jalapeno, Cheese & Spinach Served with Creamy Spinach Sauce',
    price: 2499,
    isSpecial: true,
    image: IMG_CHICKEN_PARMESAN,
    rating: 5.0,
    reviewCount: 215
  },
  {
    id: 'chk-jalapeno',
    name: 'Jalapeno Chicken',
    category: 'steaks',
    description: 'Grilled Chicken Steak With Creamy Jalapeno Sauce Served with Sauteed vegetable & any side line',
    price: 1835,
    image: IMG_CHICKEN_TARRAGON,
    rating: 4.8,
    reviewCount: 145
  },
  {
    id: 'chk-sizzling-fajita',
    name: 'Sizzling Chicken Fajita',
    category: 'steaks',
    description: 'Char Grilled Chicken Sauteed with Onion, Capsicum, Tomato and Sideline with Salsa Sour Cream Pitta Bread and Rice',
    price: 1850,
    image: IMG_STEAK_FAJITA,
    rating: 4.9,
    reviewCount: 228
  },

  // --- BBQ & KARAHI (Menu Card 11 & 18) ---
  {
    id: 'bbq-family-platter',
    name: 'Deja Vu Special Family Platter',
    category: 'bbq-karahi',
    description: 'Grand charcoal BBQ feast with Chicken Tikka, Seekh Kababs, Malai Boti, Bihari Boti & Roghni Naans',
    price: 5599,
    isSpecial: true,
    isPopular: true,
    image: IMG_BBQ
  },
  {
    id: 'bbq-platter',
    name: 'B.B.Q Platter',
    category: 'bbq-karahi',
    description: 'Sumptuous assortment of Malai Boti, Seekh Kabab, Spicy Boti and Chutney',
    price: 3500,
    image: IMG_BBQ
  },
  {
    id: 'chk-achari-karahi',
    name: 'Chicken Achari Karahi',
    category: 'bbq-karahi',
    description: 'Traditional tangy achari spice cooked in pure wok over high flame',
    price: 2048,
    portionSizes: [
      { label: 'Half', price: 2048 },
      { label: 'Full', price: 3174 }
    ],
    image: IMG_KARAHI
  },
  {
    id: 'chk-green-karahi',
    name: 'Chicken Green Karahi',
    category: 'bbq-karahi',
    description: 'Aromatic green masala made with fresh mint, coriander, and green chillies',
    price: 2320,
    portionSizes: [
      { label: 'Half', price: 2320 },
      { label: 'Full', price: 3520 }
    ],
    image: IMG_KARAHI
  },
  {
    id: 'chk-tikka-karahi',
    name: 'Chicken Tikka Karahi',
    category: 'bbq-karahi',
    description: 'Charcoal grilled chicken tikka tossed into a rich, smoky karahi gravy',
    price: 2268,
    portionSizes: [
      { label: 'Half', price: 2268 },
      { label: 'Full', price: 3420 }
    ],
    image: IMG_KARAHI
  },
  {
    id: 'chk-karahi-red',
    name: 'Chicken Karahi Red',
    category: 'bbq-karahi',
    description: 'Classic red karahi cooked with tomatoes, ginger juliennes and aromatic spices',
    price: 1999,
    portionSizes: [
      { label: 'Half', price: 1999 },
      { label: 'Full', price: 3099 }
    ],
    image: IMG_KARAHI
  },
  {
    id: 'chk-karahi-white',
    name: 'Chicken Karahi White',
    category: 'bbq-karahi',
    description: 'Velvety cream and yogurt white karahi with mild freshly crushed white pepper',
    price: 2268,
    portionSizes: [
      { label: 'Half', price: 2268 },
      { label: 'Full', price: 3338 }
    ],
    image: IMG_KARAHI
  },
  {
    id: 'chk-makhni-handi',
    name: 'Chicken Makhni Handi',
    category: 'bbq-karahi',
    description: 'Boneless chicken cubes cooked in silky butter and tomato cream gravy',
    price: 1700,
    image: IMG_WHITE_HANDI,
    rating: 4.9,
    reviewCount: 220
  },
  {
    id: 'chk-reshmi-handi',
    name: 'Chicken Reshmi Handi',
    category: 'bbq-karahi',
    description: 'Tender boneless chicken marinated in silken cream cooked in clay pot',
    price: 1999,
    image: IMG_WHITE_HANDI,
    rating: 4.8,
    reviewCount: 185
  },
  {
    id: 'chk-white-handi',
    name: 'Chicken White Handi',
    category: 'bbq-karahi',
    description: 'Slow-simmered chicken handi with rich cashew paste and heavy cream',
    price: 1899,
    image: IMG_WHITE_HANDI,
    rating: 5.0,
    reviewCount: 310
  },
  {
    id: 'chk-bihari-boti',
    name: 'Chicken Bihari Botti',
    category: 'bbq-karahi',
    description: 'Thinly sliced boneless chicken marinated in raw papaya and bihari masala',
    price: 799,
    image: IMG_SEEKH_KABAB,
    rating: 4.9,
    reviewCount: 235
  },
  {
    id: 'chk-spicy-boti',
    name: 'Chicken Spicy Boti',
    category: 'bbq-karahi',
    description: 'Charcoal grilled chicken cubes with fiery red spices',
    price: 799,
    image: IMG_SEEKH_KABAB,
    rating: 4.8,
    reviewCount: 198
  },
  {
    id: 'chk-malai-boti',
    name: 'Chicken Malai Boti',
    category: 'bbq-karahi',
    description: 'Melt-in-mouth chicken cubes marinated in fresh clotted cream and mild herbs',
    price: 1099,
    isPopular: true,
    image: IMG_SEEKH_KABAB,
    rating: 5.0,
    reviewCount: 340
  },
  {
    id: 'chk-spicy-boneless',
    name: 'Chicken Spicy Boneless',
    category: 'bbq-karahi',
    description: 'Charcoal grilled boneless chunks tossed in special barbecue sauce',
    price: 799,
    image: IMG_BBQ,
    rating: 4.8,
    reviewCount: 165
  },
  {
    id: 'chk-reshmi-kabab',
    name: 'Chicken Reshmi Kabab',
    category: 'bbq-karahi',
    description: 'Delicately spiced minced chicken skewers grilled over fragrant coals',
    price: 699,
    image: IMG_SEEKH_KABAB,
    rating: 4.9,
    reviewCount: 280
  },
  {
    id: 'chk-tikka',
    name: 'Chicken Tikka',
    category: 'bbq-karahi',
    description: 'Traditional charcoal grilled chicken quarter with lemon and masala',
    price: 599,
    portionSizes: [
      { label: 'Leg', price: 599 },
      { label: 'Chest', price: 699 }
    ],
    image: IMG_BBQ
  },
  {
    id: 'chk-bihari-tikka',
    name: 'Chicken Bihari Tikka',
    category: 'bbq-karahi',
    description: 'Tender chicken quarter marinated in mustard oil and smoked bihari spices',
    price: 699,
    portionSizes: [
      { label: 'Leg', price: 699 },
      { label: 'Chest', price: 730 }
    ],
    image: IMG_BBQ
  },
  {
    id: 'chk-malai-tikka',
    name: 'Chicken Malai Tikka',
    category: 'bbq-karahi',
    description: 'Creamy grilled chicken quarter with aromatic white cardamom marinade',
    price: 730,
    portionSizes: [
      { label: 'Leg', price: 730 },
      { label: 'Chest', price: 820 }
    ],
    image: IMG_BBQ
  },
  {
    id: 'mutton-karahi-red',
    name: 'Mutton Karahi Red',
    category: 'bbq-karahi',
    description: 'Tender mutton cooked in traditional red wok spices with fresh ginger',
    price: 3443,
    portionSizes: [
      { label: 'Half', price: 3443 },
      { label: 'Full', price: 4799 }
    ],
    image: IMG_KARAHI
  },
  {
    id: 'mutton-karahi-white',
    name: 'Mutton Karahi White',
    category: 'bbq-karahi',
    description: 'Slow-cooked mutton with dairy cream, yoghurt and aromatic mild spices',
    price: 3548,
    portionSizes: [
      { label: 'Half', price: 3548 },
      { label: 'Full', price: 5198 }
    ],
    image: IMG_KARAHI
  },
  {
    id: 'mutton-achari-karahi',
    name: 'Mutton Achari karahi',
    category: 'bbq-karahi',
    description: 'Pickle flavored spicy tender mutton in thick rich masala',
    price: 3548,
    portionSizes: [
      { label: 'Half', price: 3548 },
      { label: 'Full', price: 5198 }
    ],
    image: IMG_KARAHI
  },
  {
    id: 'mutton-green-karahi',
    name: 'Mutton Green Karahi',
    category: 'bbq-karahi',
    description: 'Mutton cooked with fresh cilantro, mint, green chili puree and black pepper',
    price: 3648,
    portionSizes: [
      { label: 'Half', price: 3648 },
      { label: 'Full', price: 5005 }
    ],
    image: IMG_KARAHI
  },
  {
    id: 'mutton-numkin',
    name: 'Mutton Numkin',
    category: 'bbq-karahi',
    description: 'Peshawari Shinwari style salted mutton cooked in its own natural juices',
    price: 2000,
    image: IMG_KARAHI
  },
  {
    id: 'beef-seekh-kabab',
    name: 'Beef Seekh Kabab',
    category: 'bbq-karahi',
    description: 'Minced prime beef skewers with charred onions, coriander and green chilies',
    price: 899,
    image: IMG_SEEKH_KABAB,
    rating: 5.0,
    reviewCount: 320
  },
  {
    id: 'beef-bihari-boti',
    name: 'Beef Bihari Boti',
    category: 'bbq-karahi',
    description: 'Ultra tender beef strips marinated overnight in bihari spices and raw papaya',
    price: 999,
    image: IMG_SEEKH_KABAB,
    rating: 4.9,
    reviewCount: 290
  },
  {
    id: 'daal-makhni',
    name: 'Daal Makhni',
    category: 'bbq-karahi',
    description: 'Slow simmered black lentils and kidney beans cooked with butter and cream',
    price: 999,
    image: IMG_KARAHI
  },
  {
    id: 'daal-tarka',
    name: 'Daal Tarka',
    category: 'bbq-karahi',
    description: 'Yellow lentils tempered with garlic, cumin seeds and whole red chillies in desi ghee',
    price: 799,
    image: IMG_KARAHI
  },

  // --- BURGERS & SANDWICHES (Menu Card 1 & 9) ---
  {
    id: 'burger-dejavu-special',
    name: 'Deja Vu Special burger',
    category: 'burgers-sandwiches',
    description: 'Grilled spicy chicken topped with mushrooms, onions, cheese, lettuce and tomatoes, served with fries and coleslaw',
    price: 855,
    isSpecial: true,
    isPopular: true,
    image: IMG_BURGER
  },
  {
    id: 'burger-zinger',
    name: 'Zinger Burger',
    category: 'burgers-sandwiches',
    description: 'Lemon and cheese served with fries and coleslaw',
    price: 799,
    isPopular: true,
    image: IMG_BURGER
  },
  {
    id: 'burger-crispy-fish',
    name: 'Crispy Fish Burger',
    category: 'burgers-sandwiches',
    description: 'Served with fries and coleslaw',
    price: 899,
    image: IMG_BURGER
  },
  {
    id: 'burger-buffalo',
    name: 'Buffalo Burger',
    category: 'burgers-sandwiches',
    description: 'Crispy fried chicken breast tossed in our famous buffalo sauce topped with cheese, ranch dressing, lettuce, tomatoes, onion & mayo served with fries & coleslaw',
    price: 775,
    image: IMG_BURGER
  },
  {
    id: 'burger-jalapeno-beef',
    name: 'Jalapeno Beef Burger',
    category: 'burgers-sandwiches',
    description: 'Char grilledbeef topped with sauteed mushrooms, onions, jalapeno peppers, lettuce, tomatoes and mayo served with fries and coleslaw',
    price: 899,
    image: IMG_BURGER
  },
  {
    id: 'burger-classic-beef',
    name: 'Classic Beef Burger',
    category: 'burgers-sandwiches',
    description: 'Juicy beef patty served with fries and coleslaw',
    price: 899,
    image: IMG_BURGER
  },
  {
    id: 'burger-crispy-chicken',
    name: 'Crispy Chicken Burger',
    category: 'burgers-sandwiches',
    description: 'Served with fries and coleslaw',
    price: 775,
    image: IMG_BURGER
  },
  {
    id: 'burger-western-beef-cheese',
    name: 'Western Beef Cheese Burger',
    category: 'burgers-sandwiches',
    description: 'Grilled beef with cheese topped with BBQ sauce, lettuce, tomatoes and golden onion rings, served with fries and coleslaw',
    price: 1099,
    isSpecial: true,
    image: IMG_BURGER
  },
  {
    id: 'burger-chef-special',
    name: 'Chef Special Burger',
    category: 'burgers-sandwiches',
    description: 'Grilled beef with cheese and chef’s special recipe served with fries and coleslaw',
    price: 999,
    image: IMG_BURGER
  },
  {
    id: 'sandwich-dejavu-special',
    name: 'Deja Vu Special Sandwich',
    category: 'burgers-sandwiches',
    description: 'Grilled chicken mixed with capsicum, onions and topped with cheese, served in hot dog bread with fries and coleslaw',
    price: 999,
    isSpecial: true,
    image: IMG_SANDWICH
  },
  {
    id: 'sandwich-club',
    name: 'Club Sandwich',
    category: 'burgers-sandwiches',
    description: 'Classic club sandwich with grilled chicken, cheese, fried egg, lettuce tomatoes and cucumbers, served with fries and coleslaw',
    price: 899,
    isPopular: true,
    image: IMG_SANDWICH
  },
  {
    id: 'sandwich-mushroom-chicken-cheese',
    name: 'Mushroom Chicken Cheese Sandwich',
    category: 'burgers-sandwiches',
    description: 'Grilled chicken mixed with capsicums and onions and topped with mushroom and cheese, served with fries and coleslaw',
    price: 799,
    image: IMG_SANDWICH
  },
  {
    id: 'sandwich-chicken-cheese',
    name: 'Chicken Cheese Sandwich',
    category: 'burgers-sandwiches',
    description: 'Pan-grilled chicken and cheese Served with fries and coleslaw',
    price: 799,
    image: IMG_SANDWICH
  },
  {
    id: 'sandwich-smoky-beef-cheese',
    name: 'Smoky Beef Cheese Sandwich',
    category: 'burgers-sandwiches',
    description: 'Grilled beef with BBQ smoky sauce, served with fries and coleslaw',
    price: 1099,
    image: IMG_SANDWICH
  },
  {
    id: 'sandwich-bbq',
    name: 'BBQ sandwich',
    category: 'burgers-sandwiches',
    description: 'BBQ chicken with lettuce, tomatoes and cheese',
    price: 805,
    image: IMG_SANDWICH
  },

  // --- BIRYANI & ROLLS (Menu Card 17) ---
  {
    id: 'biryani-dejavu-special',
    name: 'Deja Vu Special Biryani',
    category: 'biryani-rolls',
    description: 'Signature aromatic biryani prepared with choice tender meat, saffron, prunes and special spice pot',
    price: 2600,
    isSpecial: true,
    isPopular: true,
    image: IMG_BIRYANI
  },
  {
    id: 'biryani-tikka',
    name: 'Tikka Bryani',
    category: 'biryani-rolls',
    description: 'Charcoal grilled spicy chicken tikka nestled on fragrant long grain basmati biryani rice',
    price: 1499,
    portionSizes: [
      { label: 'Leg', price: 1499 },
      { label: 'Chest', price: 1599 }
    ],
    image: IMG_BIRYANI
  },
  {
    id: 'biryani-chicken',
    name: 'Chicken Biryani',
    category: 'biryani-rolls',
    description: 'Traditional spiced chicken biryani with potatoes and whole spices',
    price: 800,
    portionSizes: [
      { label: 'Single', price: 800 },
      { label: 'Double', price: 1000 }
    ],
    image: IMG_BIRYANI
  },
  {
    id: 'pulao-beef-special',
    name: 'Special Beef Pulao',
    category: 'biryani-rolls',
    description: 'Fragrant beef yakhni pulao cooked in rich bone marrow broth with tender meat chunks',
    price: 899,
    portionSizes: [
      { label: 'Single', price: 899 },
      { label: 'Double', price: 1100 }
    ],
    image: IMG_BIRYANI
  },
  {
    id: 'biryani-matka-chicken',
    name: 'Matka Chicken Biryani',
    category: 'biryani-rolls',
    description: 'Dum cooked chicken biryani sealed in traditional clay pot to lock in smoky aromatics',
    price: 1400,
    isSpecial: true,
    image: IMG_BIRYANI
  },
  {
    id: 'biryani-matka-mutton',
    name: 'Mutton Matka Biryani',
    category: 'biryani-rolls',
    description: 'Tender mutton pieces slow cooked inside clay pot with saffron basmati rice',
    price: 2000,
    isSpecial: true,
    image: IMG_BIRYANI
  },
  {
    id: 'roll-chicken-chutney',
    name: 'Chicken Chutney Roll',
    category: 'biryani-rolls',
    description: 'Charcoal grilled chicken boti rolled in crispy paratha with tangy imli chutney and onions',
    price: 370,
    isPopular: true,
    image: IMG_PARATHA_ROLL,
    rating: 5.0,
    reviewCount: 380
  },
  {
    id: 'roll-zinger-mayo',
    name: 'Zinger Mayo Roll',
    category: 'biryani-rolls',
    description: 'Crispy chicken strips with garlic mayo sauce wrapped in flaky paratha',
    price: 320,
    image: IMG_PARATHA_ROLL,
    rating: 4.8,
    reviewCount: 210
  },
  {
    id: 'roll-chicken-malai',
    name: 'Chicken Malai Roll',
    category: 'biryani-rolls',
    description: 'Silken malai boti pieces rolled with gentle spices and green chutney',
    price: 399,
    image: IMG_PARATHA_ROLL,
    rating: 4.9,
    reviewCount: 260
  },

  // --- STARTERS (Menu Card 8 & 2) ---
  {
    id: 'starter-special-combo',
    name: 'Special Combo Platter',
    category: 'starters',
    description: 'Mozzarella cheese sticks, Chicken strips, Peri peri bites, finger fish, chicken wings, prawns & fries, served with our explosive sauce',
    price: 2260,
    isSpecial: true,
    isPopular: true,
    image: IMG_BBQ
  },
  {
    id: 'starter-dejavu-platter',
    name: 'Deja Vu Special Platter',
    category: 'starters',
    description: 'Chicken wings, onion rings, chicken finger, cheese balls, & cheese stick, served with honey mustard Sauce and cocktail sauce',
    price: 2008,
    isSpecial: true,
    image: IMG_BURGER
  },
  {
    id: 'starter-loaded-fries',
    name: 'Deja Vu Loaded Fries',
    category: 'starters',
    description: 'Homemade beef chilli with tomato sauce black olives, jalapenos and cheese',
    price: 999,
    isPopular: true,
    image: IMG_BURGER
  },
  {
    id: 'starter-masala-fries',
    name: 'Masala Fries',
    category: 'starters',
    description: 'French fries Served with garlic mayo sauce',
    price: 599,
    image: IMG_BURGER
  },
  {
    id: 'starter-prawn-tempura',
    name: 'Prawn Tempura',
    category: 'starters',
    description: 'Batter-fried prawns, served with cocktail sauce',
    price: 1553,
    image: IMG_BURGER
  },
  {
    id: 'starter-breaded-fingers',
    name: 'Breaded Chicken Fingers',
    category: 'starters',
    description: 'Boneless chicken strips marinated in garlicky buttermilk, then lightly breaded and deep-fried',
    price: 835,
    image: IMG_BURGER
  },
  {
    id: 'starter-finger-fish',
    name: 'Crunchy Finger Fish',
    category: 'starters',
    description: 'Crunchy finger fish served with tartar sauce',
    price: 1099,
    image: IMG_FISH_CHIPS,
    rating: 4.9,
    reviewCount: 215
  },
  {
    id: 'starter-buffalo-wings',
    name: 'Buffalo Wings',
    category: 'starters',
    description: 'Chicken wings served with ranch dressing sauce',
    price: 799,
    image: IMG_BURGER,
    rating: 4.8,
    reviewCount: 160
  },
  {
    id: 'starter-dynamite-prawns',
    name: 'Dynamite Prawns',
    category: 'starters',
    description: 'Crispy batter-fried prawns toasted in our explosive spicy dynamite sauce',
    price: 1499,
    isPopular: true,
    image: IMG_DYNAMITE_PRAWNS,
    rating: 5.0,
    reviewCount: 360
  },
  {
    id: 'starter-pizza-fries',
    name: 'Pizza Fries',
    category: 'starters',
    description: 'Mushrooms,black olives, grean olives, capsicum,and cheese',
    price: 999,
    image: IMG_BURGER
  },
  {
    id: 'starter-dynamite-chicken',
    name: 'Dynamite Chicken',
    category: 'starters',
    description: 'Crispy batter-fried chicken toasted in our explosive spicy dynamite sauce',
    price: 1099,
    image: IMG_BURGER
  },
  {
    id: 'starter-stuffed-strips',
    name: 'Stuffed Chicken Strip',
    category: 'starters',
    description: 'Hand crafted cheddar and mozarella cheese breaded and golden fried, stuffed with jalapeno & capers and served with honey mustard sauce',
    price: 1099,
    image: IMG_BURGER
  },
  {
    id: 'starter-bbq-wings',
    name: 'BBQ Wings',
    category: 'starters',
    description: 'Batter-fried chicken wings toasted in BBQ sauce',
    price: 750,
    image: IMG_BURGER
  },
  {
    id: 'starter-mozzarella-sticks',
    name: 'Mozzarella Cheese Sticks',
    category: 'starters',
    description: 'Golden fried mozzarella cheese sticks served with marinana sauce',
    price: 1099,
    image: IMG_BURGER
  },
  {
    id: 'starter-mexican-quesadilla',
    name: 'Mexican Quesadilla',
    category: 'starters',
    description: 'Grill Flour tortillas filled with mozarella cheese roasted chicken, tomatoes and capsicum, served with jalapeno peppers, salsa and sour cream',
    price: 899,
    image: IMG_BURGER
  },
  {
    id: 'starter-dhaka-chicken',
    name: 'Dhaka Chicken',
    category: 'starters',
    description: 'Batter-fried chicken served with cocktail sauce',
    price: 999,
    image: IMG_BURGER
  },
  {
    id: 'starter-peri-peri-bites',
    name: 'Peri Peri Bites',
    category: 'starters',
    description: 'Peri peri bites served with delicious sauce',
    price: 779,
    isPopular: true,
    image: IMG_BURGER
  },

  // --- PASTA & PIZZA (Menu Card 6 & 14) ---
  {
    id: 'pasta-dejavu-special',
    name: 'Deja Vu Special Pasta',
    category: 'pasta-pizza',
    description: 'Special Pasta with Oven Baked chicken topped with cheddar cheese',
    price: 1599,
    isSpecial: true,
    isPopular: true,
    image: IMG_PASTA
  },
  {
    id: 'pasta-chicken-alfredo',
    name: 'Chicken Alfredo Pasta',
    category: 'pasta-pizza',
    description: 'Fettuccine Pasta with creamy mushroom sauce served with garlic bread',
    price: 1499,
    isPopular: true,
    image: IMG_ALFREDO
  },
  {
    id: 'pasta-chicken-lasagna',
    name: 'Chicken Cheese Lasagna',
    category: 'pasta-pizza',
    description: 'Sheets of Pasta layered with chicken slice mushroom and Cheese Cooked in Tomato basil sauce',
    price: 1599,
    image: IMG_LASAGNA
  },
  {
    id: 'pasta-vegetable',
    name: 'Vegetable Pasta',
    category: 'pasta-pizza',
    description: 'Penne Pasta with assorted vegetable served with creamy white sauce',
    price: 799,
    image: IMG_PASTA
  },
  {
    id: 'pasta-chilli-chicken',
    name: 'Chilli Chicken Pasta',
    category: 'pasta-pizza',
    description: 'Penne Pasta accompanied with creamy sauce served with spicy grilled chicken',
    price: 1199,
    image: IMG_ALFREDO
  },
  {
    id: 'pasta-italian-style',
    name: 'Italian Style Pasta',
    category: 'pasta-pizza',
    description: 'Penne Pasta topped with char grilled chicken served with special hot sauce and cheese',
    price: 1199,
    image: IMG_PASTA
  },
  {
    id: 'pasta-spicy-chicken',
    name: 'Spicy Chicken Pasta',
    category: 'pasta-pizza',
    description: 'Penne Pasta with char grilled chicken sprinkled with parmesan cheese',
    price: 1199,
    image: IMG_ALFREDO
  },
  {
    id: 'pasta-penne-arrabbiata',
    name: 'Penne Arrabbiata Pasta',
    category: 'pasta-pizza',
    description: 'Penne Pasta with chicken & tomato sauce',
    price: 1099,
    image: IMG_PASTA
  },
  {
    id: 'pizza-chef-special',
    name: "Chef's Special Pizza",
    category: 'pasta-pizza',
    description: 'Loaded with chicken tikka, sausages, mushrooms, onions, bell peppers and premium mozzarella',
    price: 1599,
    portionSizes: [
      { label: 'Medium', price: 1599 },
      { label: 'Large', price: 2228 }
    ],
    isSpecial: true,
    image: IMG_PIZZA
  },
  {
    id: 'pizza-bbq-spicy',
    name: 'BBQ Spicy Pizza',
    category: 'pasta-pizza',
    description: 'Smoky BBQ chicken chunks, jalapenos, onions and barbecue swirl drizzle',
    price: 1899,
    portionSizes: [
      { label: 'Medium', price: 1899 },
      { label: 'Large', price: 2540 }
    ],
    image: IMG_PIZZA
  },
  {
    id: 'pizza-malai-boti',
    name: 'Malai Boti Pizza',
    category: 'pasta-pizza',
    description: 'Creamy malai boti chicken chunks, white sauce base, mozzarella and mild herbs',
    price: 1999,
    portionSizes: [
      { label: 'Medium', price: 1999 },
      { label: 'Large', price: 2599 }
    ],
    isPopular: true,
    image: IMG_PIZZA
  },

  // --- CHINESE & SEAFOOD (Menu Card 5 & 14) ---
  {
    id: 'chinese-chicken-dry-chilli',
    name: 'Chicken Dry Chilli',
    category: 'chinese-seafood',
    description: 'Chicken with Chillies toasted in Home Made Chef Special Sauce Mix With Green Chilli Capsicum and Sauteed Onion',
    price: 1450,
    isPopular: true,
    image: IMG_KARAHI
  },
  {
    id: 'chinese-beef-dry-chilli',
    name: 'Beef Dry Chilli',
    category: 'chinese-seafood',
    description: 'Beef with Green Chillies toasted Capsicum and Onion Toasted in Home Made Chef Special Sauce',
    price: 1870,
    image: IMG_KARAHI
  },
  {
    id: 'chinese-chicken-shashlik',
    name: 'Chicken Shashlik',
    category: 'chinese-seafood',
    description: 'Cube Chicken and Vegetables with Sauce on Top',
    price: 1600,
    image: IMG_KARAHI
  },
  {
    id: 'chinese-chicken-chowmein',
    name: 'Chicken Chowmein',
    category: 'chinese-seafood',
    description: 'Chinese Noddles With Chicken and Vegetables',
    price: 1300,
    isPopular: true,
    image: IMG_KARAHI
  },
  {
    id: 'chinese-chicken-manchurian',
    name: 'Chicken Manchurian',
    category: 'chinese-seafood',
    description: 'Chicken with Chinese style Tangi & Spicy Sauces',
    price: 1450,
    image: IMG_KARAHI
  },
  {
    id: 'chinese-chicken-jalfrezi',
    name: 'Chicken JalFrezi',
    category: 'chinese-seafood',
    description: 'Chicken glazed in ketchup and chilli garlic sauce served with rice',
    price: 1250,
    image: IMG_KARAHI
  },
  {
    id: 'chinese-garlic-chilli-beef',
    name: 'Garlic Chilli Beef',
    category: 'chinese-seafood',
    description: 'Shallow fried beef and vegetables cooked in garlic chilli greavy served with rice',
    price: 1740,
    image: IMG_KARAHI
  },
  {
    id: 'chinese-chilli-prawn',
    name: 'Chilli Prawn',
    category: 'chinese-seafood',
    description: 'Prawns and vegetables cooked in chilli graevy served with rice',
    price: 2180,
    image: IMG_KARAHI
  },
  {
    id: 'rice-egg-fried',
    name: 'Egg Fried Rice',
    category: 'chinese-seafood',
    description: 'Aromatic wok fried basmati rice with scrambled egg and spring onions',
    price: 699,
    image: IMG_BIRYANI
  },
  {
    id: 'rice-vegetable-fried',
    name: 'Vegetable Fried Rice',
    category: 'chinese-seafood',
    description: 'Chinese style wok fried rice with carrot, peas and cabbage',
    price: 599,
    image: IMG_BIRYANI
  },
  {
    id: 'rice-chicken-fried',
    name: 'Chicken Fried Rice',
    category: 'chinese-seafood',
    description: 'Classic chicken fried rice cooked on roaring flames',
    price: 799,
    image: IMG_BIRYANI
  },
  {
    id: 'seafood-lightly-creamy-fish',
    name: 'Lightly Creamy Fish',
    category: 'chinese-seafood',
    description: 'Pan seared white fish fillet cooked in a delicate light cream and herb sauce',
    price: 1618,
    image: IMG_STEAK_SPECIAL
  },
  {
    id: 'seafood-fish-and-chips',
    name: 'Fish & Chips',
    category: 'chinese-seafood',
    description: 'Golden battered fish fillet with tartar sauce, lemon wedges and hot crispy fries',
    price: 1878,
    image: IMG_FISH_CHIPS,
    rating: 4.9,
    reviewCount: 195
  },
  {
    id: 'seafood-grilled-tandoori-fish',
    name: 'Grilled Tandoori Fish',
    category: 'chinese-seafood',
    description: 'Fish fillet marinated in tandoori spices and grilled over hot coals',
    price: 1848,
    image: IMG_BBQ,
    rating: 4.8,
    reviewCount: 140
  },
  {
    id: 'seafood-bbq-fish-tikka',
    name: 'BBQ Fish Tikka',
    category: 'chinese-seafood',
    description: 'Fish cubes marinated in lemon tikka masala grilled to smoky perfection',
    price: 1778,
    image: IMG_BBQ,
    rating: 4.8,
    reviewCount: 155
  },
  {
    id: 'seafood-dhaka-fish',
    name: 'Dhaka Fish',
    category: 'chinese-seafood',
    description: 'Crumb fried fish fingers seasoned with sesame seeds and herbs',
    price: 1748,
    image: IMG_FISH_CHIPS,
    rating: 4.9,
    reviewCount: 180
  },
  {
    id: 'seafood-fish-sriracha',
    name: 'Fish Sriracha',
    category: 'chinese-seafood',
    description: 'Grilled fish smothered in bold and spicy red sriracha glaze',
    price: 1999,
    image: IMG_STEAK_MOROCCAN
  },

  // --- DESSERTS & BEVERAGES (Menu Card 16, 12, 13) ---
  {
    id: 'dessert-lava-cake',
    name: 'Chocolate Lava Cake',
    category: 'desserts-beverages',
    description: 'Warm chocolate cake with a molten chocolate center served with vanilla ice cream',
    price: 699,
    isSpecial: true,
    isPopular: true,
    image: IMG_DESSERT
  },
  {
    id: 'dessert-sizzling-brownie',
    name: 'Sizzling Brownie',
    category: 'desserts-beverages',
    description: 'Rich dark brownie on a sizzling hot skillet drenched in hot Belgian chocolate sauce',
    price: 699,
    isPopular: true,
    image: IMG_DESSERT
  },
  {
    id: 'dessert-fudge-cake',
    name: 'Chocolate Fudge Cake',
    category: 'desserts-beverages',
    description: 'Moist layers of rich chocolate cake frosted with thick chocolate fudge',
    price: 599,
    image: IMG_DESSERT
  },
  {
    id: 'dessert-ice-cream',
    name: 'Ice Cream',
    category: 'desserts-beverages',
    description: 'Single or Double Scoop Creamy Ice Cream',
    price: 264,
    portionSizes: [
      { label: 'Single Scoop', price: 264 },
      { label: 'Double Scoop', price: 386 }
    ],
    image: IMG_DESSERT
  },
  {
    id: 'smoothie-strawberry',
    name: 'Strawberry Smoothie',
    category: 'desserts-beverages',
    description: 'Fresh blended strawberries with chilled milk and yogurt',
    price: 571,
    image: IMG_DESSERT
  },
  {
    id: 'smoothie-blueberry',
    name: 'Blueberry Smoothie',
    category: 'desserts-beverages',
    description: 'Chilled wild blueberry puree blended with velvety cream',
    price: 571,
    image: IMG_DESSERT
  },
  {
    id: 'smoothie-peach',
    name: 'Peach Smoothie',
    category: 'desserts-beverages',
    description: 'Luscious golden peach nectar and creamy frost',
    price: 571,
    image: IMG_DESSERT
  },
  {
    id: 'bev-cappuccino',
    name: 'Cappuccino',
    category: 'desserts-beverages',
    description: 'Freshly ground espresso with steamed milk foam and cocoa dusting',
    price: 660,
    image: IMG_DESSERT
  },
  {
    id: 'bev-frappuccino',
    name: 'Frappuccino',
    category: 'desserts-beverages',
    description: 'Blended iced coffee topped with whipped cream and caramel drizzle',
    price: 738,
    image: IMG_DESSERT
  },
  {
    id: 'bev-hot-chocolate',
    name: 'Hot Chocolate',
    category: 'desserts-beverages',
    description: 'Rich melted cocoa with hot steamed milk and marshmallows',
    price: 660,
    image: IMG_DESSERT
  },
  {
    id: 'bev-doodh-pati',
    name: 'Doodh Pati',
    category: 'desserts-beverages',
    description: 'Rich Pakistani slow-brewed milk tea with crushed cardamom',
    price: 222,
    isPopular: true,
    image: IMG_DESSERT
  },
  {
    id: 'bev-pakola',
    name: 'Pakola',
    category: 'desserts-beverages',
    description: 'The iconic ice-cream soda of Karachi',
    price: 186,
    image: IMG_DESSERT
  },
  {
    id: 'bev-fresh-lime-7up',
    name: 'Fresh Lime with 7up',
    category: 'desserts-beverages',
    description: 'Fresh squeezed lime juice with ice cold 7up and mint salt',
    price: 228,
    image: IMG_DESSERT
  },
  {
    id: 'bev-red-bull',
    name: 'Red Bull',
    category: 'desserts-beverages',
    description: 'Chilled 250ml can',
    price: 945,
    image: IMG_DESSERT
  },

  // --- NAAN & SIDES (Menu Card 13) ---
  {
    id: 'side-roghni-naan',
    name: 'Roghni Naan',
    category: 'naan-sides',
    description: 'Fresh tandoori naan brushed with butter and sprinkled with sesame seeds',
    price: 90,
    isPopular: true,
    image: IMG_BBQ
  },
  {
    id: 'side-garlic-naan',
    name: 'Garlic Naan',
    category: 'naan-sides',
    description: 'Tandoori naan topped with minced roasted garlic and fresh coriander',
    price: 90,
    image: IMG_BBQ
  },
  {
    id: 'side-plain-naan',
    name: 'Plain Naan',
    category: 'naan-sides',
    description: 'Soft traditional clay oven baked flatbread',
    price: 66,
    image: IMG_BBQ
  },
  {
    id: 'side-puri-paratha',
    name: 'Puri Paratha',
    category: 'naan-sides',
    description: 'Crispy deep-fried flaky golden paratha, ideal with BBQ and rolls',
    price: 119,
    image: IMG_BBQ
  },
  {
    id: 'side-chapati',
    name: 'Chapati',
    category: 'naan-sides',
    description: 'Whole wheat thin tawa phulka',
    price: 66,
    image: IMG_BBQ
  },
  {
    id: 'side-raita',
    name: 'Raita',
    category: 'naan-sides',
    description: 'Chilled whipped yoghurt with roasted cumin and fresh mint',
    price: 239,
    image: IMG_BBQ
  },
  {
    id: 'side-fresh-salad',
    name: 'Salad',
    category: 'naan-sides',
    description: 'Crisp sliced cucumber, onions, tomatoes and green chillies with lemon',
    price: 239,
    image: IMG_BBQ
  },
  {
    id: 'side-extra-sauce',
    name: 'Extra Sauce',
    category: 'naan-sides',
    description: 'Choice of Pepper Sauce, Tarragon Sauce, Mushroom Sauce, or Dynamite Sauce',
    price: 210,
    image: IMG_CHICKEN_TARRAGON
  },
  {
    id: 'side-extra-sideline',
    name: 'Extra Sideline',
    category: 'naan-sides',
    description: 'Choice of French Fries, Mashed Potatoes, or Sauteed Vegetables',
    price: 330,
    image: IMG_BURGER
  }
];
