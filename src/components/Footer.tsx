import Image from "next/image";
import Link from "next/link";

const COLUMNS = [
  {
    title: "Sản phẩm",
    links: [
      { label: "Bàn phím cơ", href: "/#san-pham" },
      { label: "Chuột gaming", href: "/#san-pham" },
      { label: "Tai nghe", href: "/#san-pham" },
      { label: "Lót chuột", href: "/#san-pham" },
    ],
  },
  {
    title: "Công ty",
    links: [
      { label: "Giới thiệu", href: "/about" },
      { label: "Tuyển dụng", href: "#" },
      { label: "Báo chí", href: "#" },
      { label: "Đại lý", href: "#" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { label: "Chính sách bảo hành", href: "#" },
      { label: "Đổi trả 30 ngày", href: "#" },
      { label: "Hướng dẫn mua hàng", href: "#" },
      { label: "Liên hệ", href: "/lien-he" },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="lien-he" className="border-t border-ink/10 bg-ink text-paper">
      <div className="mx-auto max-w-[1600px] px-6 py-16 sm:px-10 sm:py-20">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 md:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo/logo-white.png"
                alt=""
                width={236}
                height={100}
                className="h-11 w-26 object-contain object-left"
              />
              <span className="font-display text-2xl font-bold tracking-[0.2em]">
                VERITY<span className="text-paper/40">GEAR</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
              Phụ kiện gaming cao cấp — chế tác cho những game thủ không khoan
              nhượng. Chính xác. Bền bỉ. Đẳng cấp.
            </p>
            <div className="mt-6 flex gap-4">
              {["Facebook", "Instagram", "TikTok", "YouTube"].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/20 text-[10px] uppercase tracking-wide text-paper/70 transition-colors hover:border-paper hover:text-paper"
                >
                  {s.slice(0, 2)}
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-paper/40">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-paper/70 transition-colors hover:text-paper"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-paper/10 pt-8 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VERITY GEAR. All rights reserved.</p>
          <p>Thiết kế & phát triển tại Việt Nam.</p>
        </div>
      </div>
    </footer>
  );
}
