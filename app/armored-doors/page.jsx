"use client";

import Image from "next/image";

const wa = process.env.NEXT_PUBLIC_WHATSAPP || "201154833016";
const doors = [
  { id: "01", name: "باب الهضبة 01", image: "/doors/door-01.png" },
  { id: "02", name: "باب الهضبة 02", image: "/doors/door-02.png" },
  { id: "03", name: "باب الهضبة 03", image: "/doors/door-03.png" },
];

export default function ArmoredDoorsPage() {
  function orderDoor(door) {
    const message = `أريد طلب الباب رقم ${door.id} 🚪 - ${door.name}`;
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="content-page armored-doors-page" dir="rtl">
      <div className="content-shell">
        <header className="content-header">
          <a className="content-logo" href="/"><img src="/al-hadaba-logo.png" alt="شركة عقارات الهضبة" width="54" height="54" /></a>
          <div><div className="eyebrow dark">حماية وأناقة لمنزلك</div><h1>الأبواب المصفحة 🚪</h1><p>اختر الباب المناسب لك، واضغط «طلب» للتواصل معنا مباشرة عبر WhatsApp.</p></div>
        </header>
        <section className="door-grid" aria-label="الأبواب المصفحة المتاحة للبيع">
          {doors.map((door) => (
            <article className="door-card" key={door.id}>
              <button className="door-image-button" type="button" onClick={() => orderDoor(door)} aria-label={`عرض وطلب ${door.name}`}><Image src={door.image} alt={door.name} width={700} height={900} priority={door.id === "01"} /></button>
              <div className="door-card-body"><div><span className="door-number">باب رقم {door.id}</span><h2>{door.name}</h2></div><button className="btn primary" type="button" onClick={() => orderDoor(door)}>طلب</button></div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
