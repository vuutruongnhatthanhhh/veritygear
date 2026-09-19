import Image from "next/image";

const TEAM = [
  {
    name: "Đăng Khoa",
    role: "Nhà sáng lập & CEO",
    image: "/images/about/team-1.jpg",
  },
  {
    name: "Linh Chi",
    role: "Trưởng phòng thiết kế",
    image: "/images/about/team-2.jpg",
  },
  {
    name: "Quang Huy",
    role: "Trưởng phòng sản phẩm",
    image: "/images/about/team-3.jpg",
  },
  {
    name: "Bảo Trân",
    role: "Quản lý cộng đồng",
    image: "/images/about/team-4.jpg",
  },
];

export default function Team() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10 sm:py-32">
      <div className="mb-14 text-center">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink/40">
          Đội ngũ
        </p>
        <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl">
          Những người đứng sau VERITY GEAR
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {TEAM.map((member) => (
          <div key={member.name} className="group relative overflow-hidden bg-ink">
            <div className="relative aspect-3/4 w-full">
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover grayscale transition-all duration-500 ease-out group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
              <span className="absolute left-0 top-0 h-[2px] w-0 bg-paper transition-all duration-500 ease-out group-hover:w-full" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <h3 className="font-display text-base font-bold text-paper">
                  {member.name}
                </h3>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/60">
                  {member.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
