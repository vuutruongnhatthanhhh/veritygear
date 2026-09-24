"use client";

import { useActionState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "./actions";

const inputClass =
  "w-full border border-ink/15 bg-ink/[0.03] px-4 py-3.5 text-[14px] text-ink placeholder:text-ink/35 outline-none transition-colors focus:border-ink";

type Profile = { full_name: string; phone: string; address: string } | null;

export function AccountForm({ email, profile }: { email: string; profile: Profile }) {
  const [state, action, pending] = useActionState(updateProfile, null);
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {state?.success && (
        <div className="border border-emerald-300 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
          {state.success}
        </div>
      )}
      {state?.error && (
        <div className="border border-red-300 bg-red-50 px-4 py-3 text-[13px] text-red-700">{state.error}</div>
      )}

      <form action={action} className="space-y-5">
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/60">
            Email
          </label>
          <input disabled value={email} className={`${inputClass} cursor-not-allowed opacity-60`} />
        </div>
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/60">
            Họ và tên
          </label>
          <input name="fullName" type="text" defaultValue={profile?.full_name ?? ""} className={inputClass} />
        </div>
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/60">
            Điện thoại
          </label>
          <input name="phone" type="tel" defaultValue={profile?.phone ?? ""} className={inputClass} />
        </div>
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/60">
            Địa chỉ
          </label>
          <input name="address" type="text" defaultValue={profile?.address ?? ""} className={inputClass} />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-13 w-full items-center justify-center bg-ink text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {pending ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleLogout}
        className="w-full border border-ink/15 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/70 transition-colors hover:border-ink hover:text-ink"
      >
        Đăng xuất
      </button>
    </div>
  );
}
