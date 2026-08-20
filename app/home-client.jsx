"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const wa = process.env.NEXT_PUBLIC_WHATSAPP || "201154833016";

export default function HomeClient() {
  const [data, setData] = useState({
    projects: [],
    investments: [],
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
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
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

      {/* =========================
          NAVBAR
      ========================= */}

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
            <Link href="/finishing">
              التشطيبات
            </Link>

            <Link href="/buildings">
              المباني
            </Link>

            <Link href="/investment">
              استثمار
            </Link>

            <Link
              href="/login"
              className="nav-admin"
            >
              دخول الإدارة
            </Link>
          </nav>

        </div>
      </header>


      {/* =========================
          HERO
      ========================= */}

      <section className="hero">

        <div className="hero-overlay" />

        <div className="container hero-content">

          <div className="eyebrow">
            حلول عقارية بثقة
          </div>

          <h1>
            عقارات الهضبة
          </h1>

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
              className="btn ghost"
            >
              تواصل عبر واتساب
            </a>

          </div>

        </div>
      </section>


      {/* =========================
          ABOUT
      ========================= */}

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


      {/* =========================
          PROJECTS
      ========================= */}

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

                <div
                  className="card-img"
                  style={{
                    backgroundImage: `url(${
                      p.image || "/hero-placeholder.svg"
                    })`,
                  }}
                />

                <div className="card-body">

                  <h3>
                    {p.title}
                  </h3>

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


      {/* =========================
          INVESTMENT
      ========================= */}

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

                <div
                  className="card-img"
                  style={{
                    backgroundImage: `url(${
                      p.image || "/hero-placeholder.svg"
                    })`,
                  }}
                />

                <div className="card-body">

                  <h3>
                    {p.title}
                  </h3>

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


      {/* =========================
          REVIEWS
      ========================= */}

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


      {/* =========================
          CONTACT
      ========================= */}

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


      {/* =========================
          WHATSAPP FLOATING BUTTON
      ========================= */}

      <a
        className="whatsapp"
        href={`https://wa.me/${wa}?text=${encodeURIComponent(
          "مرحبًا، أريد الاستفسار عن أحد المشروعات العقارية."
        )}`}
        target="_blank"
        rel="noreferrer"
        aria-label="تواصل معنا عبر واتساب"
      >

        <svg
          viewBox="0 0 32 32"
          aria-hidden="true"
        >

          <path
            fill="currentColor"
            d="M19.11 17.21c-.27-.14-1.59-.78-1.84-.87-.25-.09-.43-.14-.61.14-.18.27-.7.87-.86 1.05-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.15-1.34-.79-.7-1.33-1.56-1.49-1.83-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.67 1.12 2.85c.14.18 1.92 2.93 4.66 4.11.65.28 1.16.45 1.56.58.65.21 1.24.18 1.71.11.52-.08 1.59-.65 1.82-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z"
          />

          <path
            fill="currentColor"
            d="M16.03 3.2c-7.05 0-12.78 5.73-12.78 12.78 0 2.25.59 4.37 1.62 6.2L3.14 28.8l6.8-1.68a12.74 12.74 0 0 0 6.09 1.55h.01c7.05 0 12.78-5.73 12.78-12.78S23.08 3.2 16.03 3.2zm0 23.34h-.01a10.53 10.53 0 0 1-5.37-1.46l-.39-.23-4.03.99 1.08-3.93-.25-.4a10.55 10.55 0 1 1 8.97 5.03z"
          />

        </svg>

      </a>


      {/* =========================
          FOOTER
      ========================= */}

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