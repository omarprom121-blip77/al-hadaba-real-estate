"use client";

import { useState } from "react";
import Link from "next/link";

const sellInitial = { name: "", phone: "", propertyType: "", area: "", location: "", price: "", propertyNumber: "", finishing: "", metersComplete: "" };
const buyInitial = { name: "", phone: "", propertyType: "", location: "", area: "", budget: "", finishing: "", metersComplete: "", requirements: "" };
const types = ["شقة", "فيلا", "دوبلكس", "استوديو", "أخرى"];
const finishings = ["تشطيب كامل", "نصف تشطيب", "على الطوب", "أخرى"];

function MarketingForm({ mode }) {
  const isSell = mode === "sell";
  const [form, setForm] = useState(isSell ? sellInitial : buyInitial);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setStatus("جاري حفظ الطلب...");
    try {
      const response = await fetch("/api/marketing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, type: mode }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "تعذر حفظ الطلب حاليًا.");
      setStatus("تم حفظ طلبك بنجاح، وسيتواصل معك فريقنا قريبًا.");
      setForm(isSell ? sellInitial : buyInitial);
    } catch (error) { setStatus(error.message || "تعذر حفظ الطلب حاليًا."); }
    finally { setBusy(false); }
  }
  return <form className="marketing-form" onSubmit={submit}>
    <div className="marketing-fields">
      {!isSell && <div className="choice-field"><label>اختر نوع الوحدة التي تبحث عنها</label><div className="choice-grid">{types.map((type) => <button type="button" key={type} className={form.propertyType === type ? "choice active" : "choice"} onClick={() => setForm((current) => ({ ...current, propertyType: type }))}>{type}</button>)}</div></div>}
      {isSell && <select name="propertyType" value={form.propertyType} onChange={update} required aria-label="نوع الوحدة"><option value="">نوع الوحدة</option>{types.map((type) => <option key={type}>{type}</option>)}</select>}
      <input name="name" value={form.name} onChange={update} placeholder="اسم العميل" required aria-label="اسم العميل" />
      <input name="phone" value={form.phone} onChange={update} placeholder="رقم الهاتف" required aria-label="رقم الهاتف" inputMode="tel" />
      <input name="location" value={form.location} onChange={update} placeholder="المنطقة" required aria-label="المنطقة" />
      <input name="area" value={form.area} onChange={update} placeholder="المساحة بالمتر" required aria-label="المساحة بالمتر" inputMode="decimal" />
      <input name={isSell ? "price" : "budget"} value={isSell ? form.price : form.budget} onChange={update} placeholder={isSell ? "السعر المطلوب" : "الميزانية"} required aria-label={isSell ? "السعر المطلوب" : "الميزانية"} inputMode="decimal" />
      {isSell && <input name="propertyNumber" value={form.propertyNumber} onChange={update} placeholder="رقم العقار" required aria-label="رقم العقار" />}
      <select name="finishing" value={form.finishing} onChange={update} required aria-label="حالة التشطيب"><option value="">حالة التشطيب المطلوبة</option>{finishings.map((item) => <option key={item}>{item}</option>)}</select>
      <select name="metersComplete" value={form.metersComplete} onChange={update} required aria-label="هل العدادات كاملة؟"><option value="">هل العدادات كاملة؟</option><option value="نعم">نعم</option><option value="لا">لا</option></select>
      {!isSell && <textarea name="requirements" value={form.requirements} onChange={update} placeholder="تفاصيل أو متطلبات إضافية" rows="4" aria-label="تفاصيل أو متطلبات إضافية" />}
    </div>
    <button className="btn primary" type="submit" disabled={busy}>{busy ? "جاري الحفظ..." : "إرسال الطلب"}</button>
    {status && <p className="form-status" role="status">{status}</p>}
  </form>;
}

export default function MarketingPage() {
  return <main className="marketing-page" dir="rtl">
    <header className="marketing-nav"><div className="marketing-container"><Link href="/" className="marketing-brand"><img src="/al-hadaba-logo.png" alt="عقارات الهضبة" width="42" height="42" /><span>شركة عقارات الهضبة</span></Link><nav><Link href="/">الرئيسية</Link><Link href="/buildings">المشروعات</Link><Link href="/finishing">التشطيبات</Link><Link href="/marketing">التسويق</Link><Link href="/#armored-doors">أبواب مصفحة</Link></nav></div></header>
    <section className="marketing-hero"><div className="marketing-container"><p className="eyebrow">التسويق العقاري</p><h1>خدمات تسويق تصل بعقارك إلى الشخص المناسب</h1><p>اختر الخدمة المناسبة وسجّل بياناتك، وسيتواصل معك فريق عقارات الهضبة باحترافية.</p></div></section>
    <section className="marketing-container marketing-grid" aria-label="خدمات التسويق">
      <article className="marketing-card"><span className="marketing-kicker">لديك عقار للبيع؟</span><h2>بيع وحدتك</h2><p>أرسل تفاصيل وحدتك لنساعدك في الوصول إلى المشتري الجاد.</p><MarketingForm mode="sell" /></article>
      <article className="marketing-card"><span className="marketing-kicker">تبحث عن عقار؟</span><h2>شراء وحدة</h2><p>اختر مواصفات الوحدة التي تبحث عنها وسنقترح عليك المناسب.</p><MarketingForm mode="buy" /></article>
    </section>
    <footer className="marketing-footer"><Link href="/">العودة إلى الرئيسية</Link><span>© شركة عقارات الهضبة</span></footer>
  </main>;
}
