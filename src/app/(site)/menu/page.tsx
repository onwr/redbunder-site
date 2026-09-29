import type { Metadata } from "next";
import { connection } from "next/server";
import { getMenu } from "@/lib/services/menu";
import PageHero from "@/components/site/PageHero";
import MenuBrowser from "@/components/menu/MenuBrowser";

export const metadata: Metadata = {
  title: "Menü",
  description: "Red Bunder menüsü: burgerler, yan ürünler ve içecekler. Tüm şubelerimizde aynı lezzet, aynı fiyat.",
};

/** Menü sayfası – tüm şubelerde aynı. Masadaki QR kod sade QR menüyü açar: /qr */
export default async function MenuPage() {
  await connection();
  const menu = await getMenu();

  return (
    <>
      <PageHero eyebrow="Red Bunder Menü" title="Lezzet" highlight="Menüsü">
        Ateşte pişen burgerler, çıtır yan ürünler ve serinleten içecekler. Tüm şubelerimizde aynı lezzet.
      </PageHero>

      <section className="bg-[#f5f4f1] px-5 pb-24 pt-10 lg:px-8 lg:pt-14 xl:px-10">
        <div className="mx-auto max-w-[1500px]">
          {menu.length > 0 ? (
            <MenuBrowser categories={menu} />
          ) : (
            <p className="py-20 text-center font-display text-2xl font-black uppercase text-black/40">Menü yakında burada.</p>
          )}
        </div>
      </section>
    </>
  );
}
