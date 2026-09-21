export type Product = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  badge?: string;
  description: string;
  specs: { label: string; value: string }[];
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
    description:
      "VERTEX X1 là bàn phím cơ full-size với khung nhôm CNC nguyên khối, hệ thống hotswap 5-pin và bộ switch tuyến tính được bôi trơn thủ công từ nhà máy. Được tinh chỉnh cùng các tuyển thủ chuyên nghiệp để đạt độ phản hồi tối ưu trong từng pha combat tốc độ cao.",
    specs: [
      { label: "Layout", value: "Full-size 104 phím" },
      { label: "Switch", value: "Linear, hotswap 5-pin" },
      { label: "Khung", value: "Nhôm CNC nguyên khối" },
      { label: "Kết nối", value: "USB-C có dây, polling 8000Hz" },
      { label: "Đèn nền", value: "RGB per-key, 16.8 triệu màu" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
  },
  {
    slug: "vertex-mini",
    name: "VERTEX MINI",
    category: "Bàn phím cơ",
    tagline: "Layout 75%, nhôm nguyên khối, RGB per-key",
    price: 3690000,
    image: "/images/products/keyboard-2.jpg",
    badge: "Mới",
    description:
      "VERTEX MINI thu gọn layout 75% nhưng không đánh đổi cảm giác gõ. Thân nhôm nguyên khối, gasket-mount giảm rung, phù hợp cho những ai cần không gian bàn tối giản mà vẫn muốn hiệu năng thi đấu đỉnh cao.",
    specs: [
      { label: "Layout", value: "75%, 82 phím" },
      { label: "Switch", value: "Linear, hotswap 5-pin" },
      { label: "Khung", value: "Gasket-mount, nhôm nguyên khối" },
      { label: "Kết nối", value: "USB-C có dây, polling 8000Hz" },
      { label: "Đèn nền", value: "RGB per-key, 16.8 triệu màu" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
  },
  {
    slug: "phantom-pro",
    name: "PHANTOM PRO",
    category: "Chuột gaming",
    tagline: "Cảm biến 32.000 DPI, không dây, 58g",
    price: 1890000,
    image: "/images/products/mouse-1.jpg",
    badge: "Bán chạy",
    description:
      "PHANTOM PRO sở hữu cảm biến quang học 32.000 DPI độ chính xác tuyệt đối, vỏ symmetrical siêu nhẹ chỉ 58g và kết nối không dây độ trễ dưới 1ms — được thiết kế cho những pha flick-shot đòi hỏi độ chuẩn xác cao nhất.",
    specs: [
      { label: "Cảm biến", value: "Quang học 32.000 DPI" },
      { label: "Trọng lượng", value: "58g" },
      { label: "Kết nối", value: "Không dây 2.4GHz + Bluetooth" },
      { label: "Pin", value: "Lên đến 70 giờ sử dụng" },
      { label: "Switch", value: "Optical, 80 triệu lần nhấn" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
  },
  {
    slug: "phantom-air",
    name: "PHANTOM AIR",
    category: "Chuột gaming",
    tagline: "Siêu nhẹ 42g, vỏ tổ ong, symmetrical",
    price: 1490000,
    image: "/images/products/mouse-2.jpg",
    description:
      "PHANTOM AIR đẩy giới hạn trọng lượng xuống chỉ còn 42g nhờ vỏ tổ ong đục lỗ toàn thân, vẫn giữ độ cứng cáp và cảm giác bám tay symmetrical quen thuộc của dòng PHANTOM.",
    specs: [
      { label: "Cảm biến", value: "Quang học 26.000 DPI" },
      { label: "Trọng lượng", value: "42g" },
      { label: "Kết nối", value: "Không dây 2.4GHz" },
      { label: "Pin", value: "Lên đến 60 giờ sử dụng" },
      { label: "Switch", value: "Optical, 80 triệu lần nhấn" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
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
    description:
      "AERO ONE tái tạo âm trường vòm ảo 7.1 với driver 50mm neodymium, giúp định vị bước chân đối thủ chính xác đến từng góc độ. Đệm memory foam bọc vải thoáng khí cho phép đeo liên tục nhiều giờ không mỏi.",
    specs: [
      { label: "Driver", value: "50mm Neodymium" },
      { label: "Âm thanh", value: "Vòm ảo 7.1" },
      { label: "Microphone", value: "Gắp, khử ồn ENC" },
      { label: "Kết nối", value: "USB-C / 3.5mm" },
      { label: "Đệm tai", value: "Memory foam, bọc vải thoáng khí" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
  },
  {
    slug: "aero-silent",
    name: "AERO SILENT",
    category: "Tai nghe",
    tagline: "Closed-back, chống ồn chủ động, đệm memory foam",
    price: 2190000,
    image: "/images/products/headset-2.jpg",
    description:
      "AERO SILENT trang bị công nghệ chống ồn chủ động (ANC), lý tưởng cho không gian thi đấu ồn ào hoặc phòng net. Thiết kế closed-back giữ âm bass sâu và cách âm tối đa với môi trường xung quanh.",
    specs: [
      { label: "Driver", value: "45mm Neodymium" },
      { label: "Chống ồn", value: "ANC chủ động" },
      { label: "Microphone", value: "Tích hợp, khử ồn ENC" },
      { label: "Kết nối", value: "USB-C / Bluetooth 5.3" },
      { label: "Pin", value: "Lên đến 30 giờ (bật ANC)" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
  },
  {
    slug: "glide-xl",
    name: "GLIDE XL",
    category: "Lót chuột",
    tagline: "Kích thước 900x400, bề mặt tốc độ, may viền khóa cạnh",
    price: 590000,
    image: "/images/categories/mousepad.jpg",
    description:
      "GLIDE XL phủ kín toàn bộ mặt bàn với kích thước 900x400mm, bề mặt dệt tốc độ cao giúp thao tác mượt mà, đế cao su chống trượt và đường may viền khóa cạnh chống sờn theo thời gian.",
    specs: [
      { label: "Kích thước", value: "900 x 400 x 4mm" },
      { label: "Bề mặt", value: "Vải dệt tốc độ cao" },
      { label: "Đế", value: "Cao su tự nhiên chống trượt" },
      { label: "Viền", value: "May khóa cạnh chống sờn" },
      { label: "Vệ sinh", value: "Giặt được, chống thấm nước" },
      { label: "Bảo hành", value: "12 tháng chính hãng" },
    ],
  },
  {
    slug: "pulse",
    name: "PULSE",
    category: "Tay cầm",
    tagline: "Không dây tần số thấp, hall-effect trigger",
    price: 1990000,
    image: "/images/products/controller-1.jpg",
    badge: "Mới",
    description:
      "PULSE trang bị cần analog và trigger cảm biến hall-effect chống trôi vĩnh viễn, kết nối không dây tần số thấp độ trễ tối thiểu, phù hợp cho cả chơi game trên PC lẫn console.",
    specs: [
      { label: "Analog & Trigger", value: "Cảm biến Hall-effect" },
      { label: "Kết nối", value: "Không dây 2.4GHz tần số thấp" },
      { label: "Pin", value: "Lên đến 25 giờ sử dụng" },
      { label: "Tương thích", value: "PC / Console" },
      { label: "Rung phản hồi", value: "Motor kép, tùy chỉnh cường độ" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
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
