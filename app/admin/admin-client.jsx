'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminClient() {
  const router = useRouter();

  const [tab, setTab] = useState('projects');
  const [items, setItems] = useState([]);
  const [comments, setComments] = useState([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    video: ''
  });

  const [upload, setUpload] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // تحميل المحتوى والتعليقات
  async function load() {
    try {
      const [contentRes, commentsRes] = await Promise.all([
        fetch('/api/admin/content', {
          cache: 'no-store'
        }),
        fetch('/api/admin/comments', {
          cache: 'no-store'
        })
      ]);

      const contentData = await contentRes.json();
      const commentsData = await commentsRes.json();

      if (contentRes.ok) {
        setItems(contentData.items || []);
      }

      if (commentsRes.ok) {
        setComments(commentsData.comments || commentsData.items || []);
      }
    } catch (error) {
      console.error(error);
      setMsg('حدث خطأ أثناء تحميل البيانات');
    }
  }

  useEffect(() => {
    load();
  }, []);

  // تسجيل الخروج
  async function logout() {
    await fetch('/api/logout', {
      method: 'POST'
    });

    router.push('/');
  }

  // نشر المحتوى
  async function save(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      setMsg('اكتب العنوان');
      return;
    }

    if (!form.description.trim()) {
      setMsg('اكتب الوصف');
      return;
    }

    setLoading(true);
    setMsg('جاري نشر المحتوى...');

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          image: form.image,
          video: form.video,
          type: tab,
          published: true
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || 'حدث خطأ أثناء النشر');
        return;
      }

      setMsg('✅ تم نشر المحتوى بنجاح');

      setForm({
        title: '',
        description: '',
        image: '',
        video: ''
      });

      await load();
    } catch (error) {
      console.error(error);
      setMsg('حدث خطأ في الاتصال بالسيرفر');
    } finally {
      setLoading(false);
    }
  }

  // رفع صورة أو فيديو إلى Cloudinary
  async function uploadFile(e) {
    e.preventDefault();

    if (!upload) {
      setMsg('اختر صورة أو فيديو أولاً');
      return;
    }

    setLoading(true);
    setMsg('جاري رفع الملف...');

    try {
      const formData = new FormData();
      formData.append('file', upload);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || 'فشل رفع الملف');
        return;
      }

      // لو الفيديو
      if (data.type === 'video') {
        setForm(prev => ({
          ...prev,
          video: data.url
        }));

        setMsg('✅ تم رفع الفيديو ووضع رابطه تلقائيًا');
      }

      // لو الصورة
      else {
        setForm(prev => ({
          ...prev,
          image: data.url
        }));

        setMsg('✅ تم رفع الصورة ووضع رابطها تلقائيًا');
      }

      setUpload(null);
    } catch (error) {
      console.error(error);
      setMsg('حدث خطأ أثناء رفع الملف');
    } finally {
      setLoading(false);
    }
  }

  // حذف محتوى
  async function del(id) {
    const ok = confirm('هل أنت متأكد أنك تريد حذف هذا المحتوى؟');

    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/content?id=${id}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || 'فشل الحذف');
        return;
      }

      setMsg('تم حذف المحتوى');

      await load();
    } catch (error) {
      console.error(error);
      setMsg('حدث خطأ أثناء الحذف');
    }
  }

  // الموافقة / إخفاء التعليق
  async function moderate(id, status) {
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          status
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || 'حدث خطأ');
        return;
      }

      setMsg(
        status === 'approved'
          ? 'تمت الموافقة على التعليق'
          : 'تم إخفاء التعليق'
      );

      await load();
    } catch (error) {
      console.error(error);
      setMsg('حدث خطأ أثناء تعديل التعليق');
    }
  }

  // حذف تعليق
  async function delComment(id) {
    const ok = confirm('هل تريد حذف هذا التعليق؟');

    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/comments?id=${id}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || 'فشل حذف التعليق');
        return;
      }

      setMsg('تم حذف التعليق');

      await load();
    } catch (error) {
      console.error(error);
      setMsg('حدث خطأ أثناء حذف التعليق');
    }
  }

  const title =
    tab === 'projects'
      ? 'المباني'
      : tab === 'finishing'
        ? 'التشطيبات'
        : tab === 'investments'
          ? 'الاستثمارات'
          : 'التعليقات';

  return (
    <main className="admin-page">

      {/* الشريط العلوي */}
      <header className="adminbar">
        <strong>عقارات الهضبة — لوحة التحكم</strong>

        <button
          onClick={logout}
          className="btn ghost darkbtn"
        >
          تسجيل الخروج
        </button>
      </header>

      <div className="admin-layout">

        {/* القائمة الجانبية */}
        <aside>

          <button
            onClick={() => setTab('projects')}
            className={tab === 'projects' ? 'active' : ''}
          >
            المباني
          </button>

          <button
            onClick={() => setTab('finishing')}
            className={tab === 'finishing' ? 'active' : ''}
          >
            التشطيبات
          </button>

          <button
            onClick={() => setTab('investments')}
            className={tab === 'investments' ? 'active' : ''}
          >
            استثمار
          </button>

          <button
            onClick={() => setTab('comments')}
            className={tab === 'comments' ? 'active' : ''}
          >
            التعليقات
          </button>

        </aside>

        {/* المحتوى */}
        <section className="admin-main">

          <div className="section-head">
            <div>
              <div className="eyebrow dark">
                إدارة المحتوى
              </div>

              <h1>{title}</h1>
            </div>
          </div>

          {/* ========================= */}
          {/* المحتوى */}
          {/* ========================= */}

          {tab !== 'comments' ? (

            <>

              {/* فورم النشر */}
              <form
                className="form admin-form"
                onSubmit={save}
              >

                <input
                  required
                  placeholder="العنوان"
                  value={form.title}
                  onChange={e =>
                    setForm({
                      ...form,
                      title: e.target.value
                    })
                  }
                />

                <textarea
                  required
                  rows="4"
                  placeholder="الوصف"
                  value={form.description}
                  onChange={e =>
                    setForm({
                      ...form,
                      description: e.target.value
                    })
                  }
                />

                <input
                  placeholder="رابط الصورة"
                  value={form.image}
                  onChange={e =>
                    setForm({
                      ...form,
                      image: e.target.value
                    })
                  }
                />

                <input
                  placeholder="رابط الفيديو (اختياري)"
                  value={form.video}
                  onChange={e =>
                    setForm({
                      ...form,
                      video: e.target.value
                    })
                  }
                />

                <button
                  type="submit"
                  className="btn primary"
                  disabled={loading}
                >
                  {loading ? 'جاري النشر...' : 'نشر المحتوى'}
                </button>

              </form>

              {/* رفع ملف */}
              <form
                className="form admin-form"
                onSubmit={uploadFile}
              >

                <h3>رفع صورة أو فيديو</h3>

                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={e =>
                    setUpload(
                      e.target.files?.[0] || null
                    )
                  }
                />

                <button
                  type="submit"
                  className="btn ghost darkbtn"
                  disabled={loading}
                >
                  {loading ? 'جاري الرفع...' : 'رفع الملف'}
                </button>

              </form>

              {/* قائمة المحتوى */}
              <div className="admin-list">

                {items
                  .filter(x => x.type === tab)
                  .map(x => (

                    <div
                      className="admin-item"
                      key={x._id}
                    >

                      <div>

                        <strong>
                          {x.title}
                        </strong>

                        <p>
                          {x.description}
                        </p>

                        {x.video && (
                          <small>
                            🎥 يوجد فيديو
                          </small>
                        )}

                        {x.image && (
                          <small>
                            🖼️ توجد صورة
                          </small>
                        )}

                      </div>

                      <button
                        className="btn danger"
                        onClick={() => del(x._id)}
                      >
                        حذف
                      </button>

                    </div>

                  ))}

                {!items.filter(x => x.type === tab).length && (
                  <div className="empty">
                    لا يوجد محتوى حتى الآن.
                  </div>
                )}

              </div>

            </>

          ) : (

            /* ========================= */
            /* التعليقات */
            /* ========================= */

            <div className="admin-list">

              {comments.map(c => (

                <div
                  className="admin-item"
                  key={c._id}
                >

                  <div>

                    <strong>
                      {c.name}
                    </strong>

                    <p>
                      {c.comment}
                    </p>

                    <small>
                      الحالة: {c.status}
                    </small>

                  </div>

                  <div className="actions">

                    <button
                      className="btn primary"
                      onClick={() =>
                        moderate(
                          c._id,
                          'approved'
                        )
                      }
                    >
                      موافقة
                    </button>

                    <button
                      className="btn ghost darkbtn"
                      onClick={() =>
                        moderate(
                          c._id,
                          'hidden'
                        )
                      }
                    >
                      إخفاء
                    </button>

                    <button
                      className="btn danger"
                      onClick={() =>
                        delComment(c._id)
                      }
                    >
                      حذف
                    </button>

                  </div>

                </div>

              ))}

              {!comments.length && (
                <div className="empty">
                  لا توجد تعليقات.
                </div>
              )}

            </div>

          )}

          {/* الرسائل */}
          {msg && (
            <small className="notice">
              {msg}
            </small>
          )}

        </section>

      </div>

    </main>
  );
}
