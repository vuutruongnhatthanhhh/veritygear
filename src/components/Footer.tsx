import Image from "next/image";
import Link from "next/link";
import SocialLinks from "./SocialLinks";

const COLUMNS = [
  {
    title: "Sản phẩm",
    links: [
      { label: "Bàn phím cơ", href: "/san-pham?danh-muc=ban-phim" },
      { label: "Chuột gaming", href: "/san-pham?danh-muc=chuot" },
      { label: "Tai nghe", href: "/san-pham?danh-muc=tai-nghe" },
      { label: "Lót chuột", href: "/san-pham?danh-muc=lot-chuot" },
      { label: "Tay cầm", href: "/san-pham?danh-muc=tay-cam" },
    ],
  },
  {
    title: "Công ty",
    links: [
      { label: "Cột mốc", href: "/cot-moc" },
      { label: "Giới thiệu", href: "/gioi-thieu" },
      { label: "Tin tức", href: "/tin-tuc" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [{ label: "Liên hệ", href: "/lien-he" }],
  },
];

export default function Footer() {
  return (
    <footer id="lien-he" className="border-t border-ink/10 bg-ink text-paper">
      <div className="mx-auto max-w-[1600px] px-6 py-16 sm:px-10 sm:py-20">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 md:grid-cols-5">
          <div className="col-span-2">
            <Image
              src="/images/logo/logo-white.png"
              alt="VERITY GEAR"
              width={236}
              height={100}
              className="h-20 w-47 object-contain object-left"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
              Phụ kiện gaming cao cấp — chế tác cho những game thủ không khoan
              nhượng. Chính xác. Bền bỉ. Đẳng cấp.
            </p>
            <SocialLinks variant="dark" className="mt-6" />
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
          <p>
            Thiết kế web:{" "}
            <a
              href="https://tjzenn.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-paper/70 underline underline-offset-2 transition-colors hover:text-paper"
            >
              TJZenn
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
