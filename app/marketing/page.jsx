"use client";

import { useState } from "react";
import Link from "next/link";

const initialForm = { name: "", phone: "", email: "", city: "", details: "" };

function RequestForm({ type }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  async function submit(event) {
    event.preventDefault();
    setStatus("جاري إرسال الطلب...");
    const response = await fetch("/api/marketing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, type }) });
    const result = await response.json().catch(() => ({}));
    setStatus(response.ok ? "تم استلام طلبك، وسنتواصل معك قريبًا." : result.error || "تعذر إرسال الطلب حاليًا.");
    if (response.ok) setForm(initialForm);
  }
  return <form className="marketing-form" onSubmit={submit}>
    <div className="marketing-fields">
      <input name="name" value={form.name} onChange={update} placeholder="الاسم" required aria-label="الاسم" />
      <input name="phone" value={form.phone} onChange={update} placeholder="رقم الهاتف" required aria-label="رقم الهاتف" inputMode="tel" />
      <input name="email" value={form.email} onChange={update} placeholder="البريد الإلكتروني (اختياري)" aria-label="البريد الإلكتروني" type="email" />
      <input name="city" value={form.city} onChange={update} placeholder="المدينة / المنطقة" required aria-label="المدينة والمنطقة" />
      <textarea name="details" value={form.details} onChange={update} placeholder={type === "seller" ? "اكتب تفاصيل العقار" : "ما الذي تبحث عنه؟"} required aria-label="التفاصيل" rows="4" />
    </div>
    <button className="btn primary" type="submit">إرسال الطلب</button>
    {status && <p className="form-status" role="status">{status}</p>}
  </form>;
}

export default function MarketingPage() {
  return <main className="marketing-page" dir="rtl" style={{ backgroundImage: "linear-gradient(120deg, rgba(16,24,29,.94), rgba(16,24,29,.98)), url('/skyscrapers.jpeg')" }}>
    <header className="marketing-nav"><div className="marketing-container"><Link href="/" className="marketing-brand"><img src="/al-hadaba-logo.png" alt="عقارات الهضبة" width="42" height="42" /> <span>شركة عقارات الهضبة</span></Link><nav><Link href="/">الرئيسية</Link><Link href="/buildings">المشروعات</Link><Link href="/marketing">التسويق</Link></nav></div></header>
    <section className="marketing-hero"><div className="marketing-container"><p className="eyebrow">حلول عقارية موثوقة</p><h1>نصل بعقارك إلى الشخص المناسب</h1><p>نساعد المالك على تسويق عقاره، ونساعد الباحث على الوصول إلى فرص تناسب احتياجه بوضوح واحترافية.</p></div></section>
    <section className="marketing-container marketing-grid" aria-label="طلبات التسويق العقاري">
      <article className="marketing-card"><span className="marketing-kicker">لديك عقار؟</span><h2>اعرض عقارك للبيع</h2><p>شاركنا تفاصيل عقارك وسيتولى فريقنا الوصول إلى المشترين الجادين.</p><RequestForm type="seller" /></article>
      <article className="marketing-card"><span className="marketing-kicker">تبحث عن عقار؟</span><h2>أخبرنا بما تبحث عنه</h2><p>أرسل مواصفات طلبك لنقترح عليك مشروعات وفرصًا مناسبة.</p><RequestForm type="buyer" /></article>
    </section>
    <footer className="marketing-footer"><Link href="/">العودة إلى الرئيسية</Link><span>© شركة عقارات الهضبة</span></footer>
  </main>;
}
