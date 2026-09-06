import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Đăng nhập · Vow",
  robots: { index: false, follow: false },
};

export default async function DangNhapPage({
  searchParams,
}: {
  searchParams: Promise<{ tiep?: string }>;
}) {
  const { tiep } = await searchParams;
  // Only same-site paths, so ?tiep= cannot bounce anyone to another domain.
  const next = typeof tiep === "string" && /^\/(?!\/)/.test(tiep) ? tiep : "/";
  return <LoginForm next={next} />;
}
