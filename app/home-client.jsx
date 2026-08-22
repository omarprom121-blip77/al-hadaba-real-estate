"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const wa = process.env.NEXT_PUBLIC_WHATSAPP || "201154833016";

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      width="30"
      height="30"
      fill="none"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M19.11 17.31c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.9 1.1-.17.19-.33.21-.61.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.4-1.65-1.57-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.64-1.54-.88-2.11-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.49.07-.75.35-.26.28-.98.96-.98 2.35 0 1.39 1 2.72 1.14 2.91.14.19 1.96 2.99 4.75 4.2.66.29 1.18.46 1.58.59.66.21 1.26.18 1.73.11.53-.08 1.66-.68 1.9-1.34.24-.66.24-1.22.17-1.34-.07-.12-.26-.19-.54-.33Z"
      />
      <path
        fill="currentColor"
        d="M16.02 3.2c-7.08 0-12.84 5.76-12.84 12.84 0 2.26.59 4.46 1.72 6.4L3.08 28.8l6.51-1.71a12.8 12.8 0 0 0 6.43 1.73h.01c7.08 0 12.84-5.76 12.84-12.84S23.1 3.2 16.02 3.2Zm0 23.43h-.01c-2.01 0-3.98-.54-5.7-1.56l-.41-.24-3.86 1.01 1.03-3.76-.27-.42a10.61 10.61 0 1 1 9.22 4.97Z"
      />
    </svg>
  );
}

export default function HomeClient() {
  const [data, setData] = useState({
    projects: [],
    investments: [],
    finishing: [],
    comments: [],
  });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [comment, setComment] = useState({
    name: "",
    comment: "",
  });

  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch("/api/public")
      .then((r) => r.json().then((payload) => ({ ok: r.ok, payload })))
      .then(({ ok, payload }) => {
        if (ok && payload.success !== false) {
          setData({ projects: [], investments: [], finishing: [], comments: [], ...payload });
        }
      })
      .catch((error) => console.error("[v0] Public content request failed:", error));
  }, []);

  async function submitContact(e) {
    e.preventDefault();
    setNotice("جاري الإرسال...");

    const r = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setNotice(
      r.ok
        ? "تم إرسال رسالتك بنجاح."
        : "حدث خطأ، حاول مرة أخرى."
    );

    if (r.ok) {
      setForm({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
    }
  }

  async function submitComment(e) {
    e.preventDefault();
    setNotice("جاري إرسال التعليق للمراجعة...");

    const r = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    });

    setNotice(
      r.ok
        ? "تم استلام تعليقك وسيظهر بعد موافقة الإدارة."
        : "حدث خطأ، حاول مرة أخرى."
    );

    if (r.ok) {
      setComment({
        name: "",
        comment: "",
      });
    }
  }

  return (
    <main>
      <img src="/alhadba-branding.jpeg" alt="هوية شركة عقارات الهضبة" className="top-branding" />
      {/* ================= HEADER ================= */}
      <header className="nav">
        <div className="container nav-inner">
          <Link
            href="/"
            className="brand"
            aria-label="عقارات الهضبة"
          >
            <img
              src="/al-hadaba-logo.png"
              alt="شعار عقارات الهضبة"
              className="brand-logo"
            />

            <span>عقارات الهضبة</span>
          </Link>

          <nav>
            <Link href="/finishing">التشطيبات</Link>
            <Link href="/buildings">المباني</Link>
            <Link href="/investment">استثمار</Link>

            <Link
              href="/login"
              className="nav-admin"
            >
              دخول الإدارة
            </Link>
          </nav>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-overlay" />

        <div className="container hero-content">
          <div className="eyebrow">
            حلول عقارية بثقة
          </div>

          <h1>عقارات الهضبة</h1>

          <p>
            نساعدك في العثور على أفضل الفرص العقارية
            والاستثمارية بطريقة سهلة واحترافية.
          </p>

          <div className="actions">
            <a
              href="#projects"
              className="btn primary"
            >
              استكشف المشروعات
            </a>

            <a
              href={`https://wa.me/${wa}?text=${encodeURIComponent(
                "مرحبًا، أريد الاستفسار عن أحد المشروعات العقارية."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="btn whatsapp-btn"
            >
              <WhatsAppIcon />
              <span>تواصل عبر واتساب</span>
            </a>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="section about">
        <div className="container split">
          <div>
            <div className="eyebrow dark">
              من نحن
            </div>

            <h2>
              نبذة عن عقارات الهضبة
            </h2>

            <p>
              شركة عقارات الهضبة تساعدك في العثور
              على أفضل الفرص العقارية والاستثمارية،
              من خلال تقديم مشروعات وخيارات عقارية
              متنوعة بطريقة سهلة واحترافية.
            </p>
          </div>

          <div className="info-card">
            <strong>
              خبرة • ثقة • فرص
            </strong>

            <span>
              منصة مرنة لعرض المشروعات والاستثمارات
              والتواصل المباشر.
            </span>
          </div>
        </div>
      </section>

      {/* ================= PROJECTS ================= */}
      <section
        id="projects"
        className="section soft"
      >
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow dark">
                مشروعاتنا
              </div>

              <h2>
                أحدث المشروعات
              </h2>
            </div>

            <Link
              href="/buildings"
              className="text-link"
            >
              عرض الكل ←
            </Link>
          </div>

          <div className="cards">
            {data.projects.map((p) => (
              <article
                className="card"
                key={p._id}
              >
                {p.video ? <video className="card-media" src={p.video} controls preload="metadata" playsInline aria-label={`فيديو ${p.title}`} /> : p.image ? <img className="card-media" src={p.image} alt={p.title} /> : <div className="card-img" />}

                <div className="card-body">
                  <h3>{p.title}</h3>

                  <p>
                    {p.description}
                  </p>
                </div>
              </article>
            ))}

            {!data.projects.length && (
              <div className="empty">
                لا توجد مشروعات منشورة حاليًا.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= INVESTMENT ================= */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow dark">
                فرص واعدة
              </div>

              <h2>
                الاستثمار
              </h2>
            </div>

            <Link
              href="/investment"
              className="text-link"
            >
              عرض الفرص ←
            </Link>
          </div>

          <div className="cards">
            {data.investments.map((p) => (
              <article
                className="card"
                key={p._id}
              >
                {p.video ? <video className="card-media" src={p.video} controls preload="metadata" playsInline aria-label={`فيديو ${p.title}`} /> : p.image ? <img className="card-media" src={p.image} alt={p.title} /> : <div className="card-img" />}

                <div className="card-body">
                  <h3>{p.title}</h3>

                  <p>
                    {p.description}
                  </p>
                </div>
              </article>
            ))}

            {!data.investments.length && (
              <div className="empty">
                أضف فرص الاستثمار من لوحة التحكم.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= REVIEWS ================= */}
      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow dark">
                آراء العملاء
              </div>

              <h2>
                تعليقات العملاء
              </h2>
            </div>
          </div>

          <div className="reviews">
            {data.comments.map((c) => (
              <div
                className="review"
                key={c._id}
              >
                <strong>
                  {c.name}
                </strong>

                <p>
                  {c.comment}
                </p>
              </div>
            ))}

            {!data.comments.length && (
              <div className="empty">
                كن أول من يشارك رأيه.
              </div>
            )}
          </div>

          <form
            className="form review-form"
            onSubmit={submitComment}
          >
            <h3>
              شاركنا رأيك
            </h3>

            <div className="grid2">
              <input
                required
                placeholder="الاسم"
                value={comment.name}
                onChange={(e) =>
                  setComment({
                    ...comment,
                    name: e.target.value,
                  })
                }
              />

              <input
                required
                placeholder="التعليق"
                value={comment.comment}
                onChange={(e) =>
                  setComment({
                    ...comment,
                    comment: e.target.value,
                  })
                }
              />
            </div>

            <button className="btn primary">
              إرسال التعليق
            </button>
          </form>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section className="section contact">
        <div className="container split">
          <div>
            <div className="eyebrow dark">
              تواصل معنا
            </div>

            <h2>
              ابدأ خطوتك العقارية
            </h2>

            <p>
              اترك بياناتك وسيتواصل معك فريق
              عقارات الهضبة.
            </p>
          </div>

          <form
            className="form"
            onSubmit={submitContact}
          >
            <input
              required
              placeholder="الاسم"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <input
              required
              placeholder="رقم الهاتف"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="البريد الإلكتروني (اختياري)"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <textarea
              required
              rows="5"
              placeholder="اكتب رسالتك"
              value={form.message}
              onChange={(e) =>
                setForm({
                  ...form,
                  message: e.target.value,
                })
              }
            />

            <button className="btn primary">
              إرسال الرسالة
            </button>

            {notice && (
              <small className="notice">
                {notice}
              </small>
            )}
          </form>
        </div>
      </section>

      {/* ================= WHATSAPP ================= */}
      <a
        className="whatsapp"
        href={`https://wa.me/${wa}?text=${encodeURIComponent(
          "مرحبًا، أريد الاستفسار عن أحد المشروعات العقارية."
        )}`}
        target="_blank"
        rel="noreferrer"
        aria-label="تواصل معنا عبر واتساب"
      >
        <WhatsAppIcon />
      </a>

      {/* ================= FOOTER ================= */}
      <footer>
        <div className="container footer-inner">
          <img
            src="/al-hadaba-logo.png"
            alt="شعار عقارات الهضبة"
            className="footer-logo"
          />

          <strong>
            عقارات الهضبة
          </strong>

          <span>
            أفضل الفرص العقارية والاستثمارية.
          </span>

          <span>
            © {new Date().getFullYear()} جميع الحقوق محفوظة.
          </span>
        </div>
      </footer>
    </main>
  );
}
