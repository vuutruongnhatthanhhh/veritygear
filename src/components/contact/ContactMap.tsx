import SocialLinks from "@/components/SocialLinks";

export default function ContactMap() {
  return (
    <div>
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink/40">
        Vị trí cửa hàng
      </p>
      <div className="overflow-hidden border border-ink/15">
        <div className="relative aspect-4/3 w-full">
          <iframe
            title="Bản đồ VERITY GEAR"
            src="https://www.google.com/maps?q=268+%C4%90i%E1%BB%87n+Bi%C3%AAn+Ph%E1%BB%A7,+Ph%C6%B0%E1%BB%9Dng+7,+Qu%E1%BA%ADn+3,+TP.+H%E1%BB%93+Ch%C3%AD+Minh&output=embed"
            className="absolute inset-0 h-full w-full grayscale contrast-125"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="border-t border-ink/15 px-4 py-3 text-[12px] font-medium text-ink/50">
          Nhấn để mở chỉ đường
        </div>
      </div>

      <div className="mt-8 border border-ink/15 bg-ink/[0.03] p-6">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/50">
          Theo dõi chúng tôi
        </p>
        <SocialLinks variant="light" />
      </div>
    </div>
  );
}
