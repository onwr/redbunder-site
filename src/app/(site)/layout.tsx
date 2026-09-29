import Footer from "@/components/site/Footer";

/** Header her sayfanın hero'suna gömülüdür (HeroShell / PageHero) */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
