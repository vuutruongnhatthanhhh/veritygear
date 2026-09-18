export type Product = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  badge?: string;
};

export const products: Product[] = [
  {
    slug: "vertex-x1",
    name: "VERTEX X1",
    category: "Bàn phím cơ",
    tagline: "Full-size, hotswap, switch tuyến tính siêu mượt",
    price: 4290000,
    compareAtPrice: 4990000,
    image: "/images/products/keyboard-1.jpg",
    badge: "Bán chạy",
  },
  {
    slug: "vertex-mini",
    name: "VERTEX MINI",
    category: "Bàn phím cơ",
    tagline: "Layout 75%, nhôm nguyên khối, RGB per-key",
    price: 3690000,
    image: "/images/products/keyboard-2.jpg",
    badge: "Mới",
  },
  {
    slug: "phantom-pro",
    name: "PHANTOM PRO",
    category: "Chuột gaming",
    tagline: "Cảm biến 32.000 DPI, không dây, 58g",
    price: 1890000,
    image: "/images/products/mouse-1.jpg",
    badge: "Bán chạy",
  },
  {
    slug: "phantom-air",
    name: "PHANTOM AIR",
    category: "Chuột gaming",
    tagline: "Siêu nhẹ 42g, vỏ tổ ong, symmetrical",
    price: 1490000,
    image: "/images/products/mouse-2.jpg",
  },
  {
    slug: "aero-one",
    name: "AERO ONE",
    category: "Tai nghe",
    tagline: "Driver 50mm, mic gắp, âm trường vòm ảo 7.1",
    price: 2590000,
    compareAtPrice: 2990000,
    image: "/images/products/headset-1.jpg",
    badge: "Giảm giá",
  },
  {
    slug: "aero-silent",
    name: "AERO SILENT",
    category: "Tai nghe",
    tagline: "Closed-back, chống ồn chủ động, đệm memory foam",
    price: 2190000,
    image: "/images/products/headset-2.jpg",
  },
  {
    slug: "glide-xl",
    name: "GLIDE XL",
    category: "Lót chuột",
    tagline: "Kích thước 900x400, bề mặt tốc độ, may viền khóa cạnh",
    price: 590000,
    image: "/images/categories/mousepad.jpg",
  },
  {
    slug: "pulse",
    name: "PULSE",
    category: "Tay cầm",
    tagline: "Không dây tần số thấp, hall-effect trigger",
    price: 1990000,
    image: "/images/products/controller-1.jpg",
    badge: "Mới",
  },
];

export const categories = [
  {
    name: "Bàn phím cơ",
    slug: "ban-phim",
    image: "/images/categories/keyboard.jpg",
    count: 12,
  },
  {
    name: "Chuột gaming",
    slug: "chuot",
    image: "/images/categories/mouse.jpg",
    count: 9,
  },
  {
    name: "Tai nghe",
    slug: "tai-nghe",
    image: "/images/categories/headset.jpg",
    count: 7,
  },
  {
    name: "Lót chuột",
    slug: "lot-chuot",
    image: "/images/categories/mousepad.jpg",
    count: 5,
  },
  {
    name: "Tay cầm",
    slug: "tay-cam",
    image: "/images/categories/controller.jpg",
    count: 4,
  },
];

export function formatVnd(value: number): string {
  return value.toLocaleString("vi-VN") + "₫";
}
