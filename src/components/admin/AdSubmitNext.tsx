"use client";

/** "Kaydet ve yeni ekle": işaretliyse kayıttan sonra aynı dönemle boş form açılır */
export default function AdSubmitNext() {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-black/60">
      <input type="checkbox" name="_next" value="new" className="size-[18px] accent-[#ef101b]" />
      Kaydettikten sonra aynı dönem için yeni kayıt aç (birden fazla platform girerken)
    </label>
  );
}
