import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata = { title: "Đăng nhập — VERITY GEAR" };

export default function DangNhapPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
