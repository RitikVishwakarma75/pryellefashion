import { CustomerReview, InstagramPost } from '@/types';

export const REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Aanya Verma',
    location: 'Mumbai',
    hairType: 'Thick & Heavy Wavy Hair (Type 2B)',
    rating: 5,
    title: 'Finally a clip that actually stays in my hair all day.',
    comment: 'Every clip I bought from drugstore brands would shatter or slide down within 30 minutes. The Luna Claw has double teeth that hold my entire thick mane through 10-hour workdays with zero headache. Pure luxury.',
    productName: 'Luna Sculpted Claw — Amber Tortoise',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    verified: true,
    date: '2 days ago',
  },
  {
    id: 'rev-2',
    author: 'Meera Kapur',
    location: 'New Delhi',
    hairType: 'Fine Silk Strands (Type 1A)',
    rating: 5,
    title: 'Zero creases after a whole night of sleep.',
    comment: 'The Nuage Mulberry Silk Scrunchie is like sleeping on a cloud. I blow-dry my hair on Sunday, sleep with this scrunchie, and wake up on Tuesday with my salon blowout completely intact.',
    productName: 'Nuage Mulberry Silk Scrunchie — Blush Camellia',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    verified: true,
    date: '1 week ago',
  },
  {
    id: 'rev-3',
    author: 'Devika Singhania',
    location: 'Bengaluru',
    hairType: 'Dense Curls & Coils (Type 3C)',
    rating: 5,
    title: 'Worth every single rupee. The Solstice is a miracle.',
    comment: 'As someone with tight coils, hair clips are usually a joke. The Solstice Grand Claw has deep arched teeth that cradle my curly volume without catching or tearing my ends. It feels like fine jewelry.',
    productName: 'Solstice Grand Claw — Honey Amber',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
    verified: true,
    date: '2 weeks ago',
  },
  {
    id: 'rev-4',
    author: 'Zara Al-Mansoor',
    location: 'Dubai / Mumbai',
    hairType: 'Medium Textured Bob',
    rating: 5,
    title: 'The Riviera Headband is completely pinch-free.',
    comment: 'I suffer from migraine triggers when wearing standard headbands. The flexible memory core on this Prayele piece is magic. Wore it for 9 hours at a gallery opening and forgot I even had it on.',
    productName: 'Riviera Sculpted Velvet Crown — Emerald Velvet',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    verified: true,
    date: '3 weeks ago',
  },
];

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'ig-1',
    image: '/images/products/claw-clip.jpg',
    handle: '@tanya.chatterjee',
    likes: '4.2k',
    taggedProduct: {
      id: 'luna-claw',
      name: 'Luna Sculpted Claw',
      price: 499,
    },
  },
  {
    id: 'ig-2',
    image: '/images/products/hair-pins.jpg',
    handle: '@ria.atelier',
    likes: '2.8k',
    taggedProduct: {
      id: 'astra-pearl-pin',
      name: 'Astra Baroque Pearl Pin',
      price: 449,
    },
  },
  {
    id: 'ig-3',
    image: '/images/products/wooden-comb.jpg',
    handle: '@elena_haircare',
    likes: '3.6k',
    taggedProduct: {
      id: 'santal-wide-tooth-comb',
      name: 'Santal Styling Comb',
      price: 749,
    },
  },
  {
    id: 'ig-4',
    image: '/images/products/silk-scrunchie.jpg',
    handle: '@natashastyle',
    likes: '5.1k',
    taggedProduct: {
      id: 'nuage-silk-scrunchie',
      name: 'Nuage Silk Scrunchie',
      price: 499,
    },
  },
  {
    id: 'ig-5',
    image: '/images/products/headbands.jpg',
    handle: '@kavya_editorial',
    likes: '6.4k',
    taggedProduct: {
      id: 'riviera-padded-headband',
      name: 'Riviera Velvet Crown',
      price: 649,
    },
  },
  {
    id: 'ig-6',
    image: '/images/products/bridal-vine.jpg',
    handle: '@parisienne_hair',
    likes: '3.9k',
    taggedProduct: {
      id: 'bridal-pearl-vine',
      name: 'Heirloom Bridal Vine',
      price: 899,
    },
  },
];

export const PRESS_MENTIONS = [
  { name: 'VOGUE', quote: '“The hair accessory revival has found its definitive voice in Prayele.”' },
  { name: 'HARPER’S BAZAAR', quote: '“Apple-level engineering meets Parisian salon intimacy.”' },
  { name: 'ELLE', quote: '“Finally, claw clips that don’t snap, slip, or ruin hair cuticles.”' },
  { name: 'GRAZIA', quote: '“The must-have item in every celebrity vanity bag this season.”' },
];
