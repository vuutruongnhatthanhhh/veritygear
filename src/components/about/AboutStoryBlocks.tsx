import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import StoryBlock from "./StoryBlock";

const FALLBACK_BLOCKS = [
  {
    reverse: false,
    eyebrow_vi: "2020 — Khởi nguồn",
    eyebrow_en: "2020 — The beginning",
    title_vi: "Bắt đầu từ một chiếc bàn phím không hoàn hảo",
    title_en: "It started with an imperfect keyboard",
    desc_vi:
      "VERITY GEAR ra đời trong một căn phòng nhỏ, khi những người sáng lập — đều là game thủ thi đấu — nhận ra không một sản phẩm nào trên thị trường thỏa mãn cả hai tiêu chí: hiệu năng đỉnh cao và thiết kế tối giản. Chúng tôi quyết định tự chế tác.",
    desc_en:
      "VERITY GEAR was born in a small room, when its founders — all competitive gamers — realized no product on the market satisfied both criteria: peak performance and minimalist design. So we decided to craft our own.",
    image_url: "/images/about/hands-typing.jpg",
  },
  {
    reverse: true,
    eyebrow_vi: "Ám ảnh với chi tiết",
    eyebrow_en: "Obsessed with detail",
    title_vi: "Từng linh kiện đều trải qua kiểm định khắt khe",
    title_en: "Every component goes through rigorous testing",
    desc_vi:
      "Đội ngũ kỹ thuật của chúng tôi kiểm tra từng bảng mạch, từng switch trước khi lắp ráp. Không có sản phẩm nào rời xưởng nếu chưa vượt qua 72 giờ kiểm thử liên tục dưới điều kiện thi đấu thực tế.",
    desc_en:
      "Our engineering team inspects every board, every switch before assembly. No product leaves the workshop without passing 72 hours of continuous testing under real competitive conditions.",
    image_url: "/images/about/engineer-circuit.jpg",
  },
  {
    reverse: false,
    eyebrow_vi: "Từ xưởng đến tay bạn",
    eyebrow_en: "From workshop to you",
    title_vi: "Sản xuất giới hạn, chất lượng không giới hạn",
    title_en: "Limited production, unlimited quality",
    desc_vi:
      "Chúng tôi chọn sản xuất theo lô nhỏ để đảm bảo kiểm soát chất lượng tuyệt đối, thay vì chạy theo số lượng. Mỗi lô sản phẩm đều được đánh số và truy xuất nguồn gốc rõ ràng.",
    desc_en:
      "We choose small-batch production to ensure absolute quality control, rather than chasing volume. Every batch is numbered and fully traceable.",
    image_url: "/images/about/production-line.jpg",
  },
];

export default async function AboutStoryBlocks() {
  const locale = await getLocale();
  const supabase = await createClient();
  const { data } = await supabase.from("about_story_blocks").select("*").order("sort_order");

  const blocks = data && data.length > 0 ? data : FALLBACK_BLOCKS;
  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  return (
    <section className="mx-auto flex max-w-[1600px] flex-col gap-24 px-6 py-4 sm:gap-32 sm:px-10 sm:py-8">
      {blocks.map((b, i) => (
        <StoryBlock
          key={i}
          eyebrow={pick(b.eyebrow_vi, b.eyebrow_en)}
          title={pick(b.title_vi, b.title_en)}
          desc={pick(b.desc_vi, b.desc_en)}
          image={b.image_url || "/images/about/hands-typing.jpg"}
          imageAlt={pick(b.title_vi, b.title_en)}
          reverse={b.reverse}
        />
      ))}
    </section>
  );
}
