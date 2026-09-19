import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import MissionStatement from "@/components/about/MissionStatement";
import StoryBlock from "@/components/about/StoryBlock";
import StatsRow from "@/components/about/StatsRow";
import ValuesGrid from "@/components/about/ValuesGrid";
import Team from "@/components/about/Team";
import Gallery from "@/components/about/Gallery";
import AboutCta from "@/components/about/AboutCta";

export const metadata: Metadata = {
  title: "Giới thiệu — VERITY GEAR",
  description:
    "Câu chuyện thương hiệu VERITY GEAR — sứ mệnh, giá trị cốt lõi và hành trình chế tác phụ kiện gaming cao cấp cho game thủ.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionStatement />

      <section className="mx-auto flex max-w-[1600px] flex-col gap-24 px-6 py-4 sm:px-10 sm:py-8 sm:gap-32">
        <StoryBlock
          eyebrow="2020 — Khởi nguồn"
          title="Bắt đầu từ một chiếc bàn phím không hoàn hảo"
          desc="VERITY GEAR ra đời trong một căn phòng nhỏ, khi những người sáng lập — đều là game thủ thi đấu — nhận ra không một sản phẩm nào trên thị trường thỏa mãn cả hai tiêu chí: hiệu năng đỉnh cao và thiết kế tối giản. Chúng tôi quyết định tự chế tác."
          image="/images/about/hands-typing.jpg"
          imageAlt="Bàn tay thử nghiệm bàn phím cơ đầu tiên"
        />
        <StoryBlock
          eyebrow="Ám ảnh với chi tiết"
          title="Từng linh kiện đều trải qua kiểm định khắt khe"
          desc="Đội ngũ kỹ thuật của chúng tôi kiểm tra từng bảng mạch, từng switch trước khi lắp ráp. Không có sản phẩm nào rời xưởng nếu chưa vượt qua 72 giờ kiểm thử liên tục dưới điều kiện thi đấu thực tế."
          image="/images/about/engineer-circuit.jpg"
          imageAlt="Kỹ thuật viên kiểm tra bảng mạch"
          reverse
        />
        <StoryBlock
          eyebrow="Từ xưởng đến tay bạn"
          title="Sản xuất giới hạn, chất lượng không giới hạn"
          desc="Chúng tôi chọn sản xuất theo lô nhỏ để đảm bảo kiểm soát chất lượng tuyệt đối, thay vì chạy theo số lượng. Mỗi lô sản phẩm đều được đánh số và truy xuất nguồn gốc rõ ràng."
          image="/images/about/production-line.jpg"
          imageAlt="Dây chuyền lắp ráp linh kiện điện tử"
        />
      </section>

      <div className="pt-24 sm:pt-32">
        <StatsRow />
      </div>
      <ValuesGrid />
      <Team />
      <Gallery />
      <AboutCta />
    </>
  );
}
