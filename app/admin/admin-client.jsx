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
    imagePublicId: '',
    imageResourceType: '',
    video: '',
    videoPublicId: '',
    videoResourceType: ''
  });

  const [uploads, setUploads] = useState({ image: null, video: null });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function readApiResponse(response) {
    const text = await response.text();
    const contentType = response.headers.get('content-type') || '';
    if (!text) return {};
    if (contentType.includes('application/json')) {
      try { return JSON.parse(text); } catch { throw new Error('استجابة غير صالحة من الخادم'); }
    }
    const message = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (response.status === 413) throw new Error('حجم الملف كبير جدًا. تم إيقاف الرفع قبل النشر.');
    throw new Error(message.slice(0, 240) || `تعذر إتمام الطلب (${response.status})`);
  }

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

      const contentData = await readApiResponse(contentRes);
      const commentsData = await readApiResponse(commentsRes);

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
      const imageMedia = form.image ? { url: form.image, publicId: form.imagePublicId, resourceType: form.imageResourceType, format: form.imageFormat, width: form.imageWidth, height: form.imageHeight, duration: null } : (uploads.image ? await uploadFile(uploads.image, 'image') : null);
      const videoMedia = form.video ? { url: form.video, publicId: form.videoPublicId, resourceType: form.videoResourceType, format: form.videoFormat, width: form.videoWidth, height: form.videoHeight, duration: form.videoDuration } : (uploads.video ? await uploadFile(uploads.video, 'video') : null);
      if ((uploads.image && !imageMedia) || (uploads.video && !videoMedia)) return;
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          image: imageMedia?.url || '',
          imagePublicId: imageMedia?.publicId || '',
          imageResourceType: imageMedia?.resourceType || '',
          video: videoMedia?.url || '',
          videoPublicId: videoMedia?.publicId || '',
          videoResourceType: videoMedia?.resourceType || '',
          mediaType: videoMedia?.url ? 'video' : imageMedia?.url ? 'image' : 'none',
          imageFormat: imageMedia?.format || '',
          imageWidth: imageMedia?.width || null,
          imageHeight: imageMedia?.height || null,
          videoFormat: videoMedia?.format || '',
          videoWidth: videoMedia?.width || null,
          videoHeight: videoMedia?.height || null,
          videoDuration: videoMedia?.duration || null,
          type: tab,
          published: true
        })
      });

      const data = await readApiResponse(res);

      if (!res.ok) {
        setMsg(data.error || 'حدث خطأ أثناء النشر');
        return;
      }

      setMsg('✅ تم نشر المحتوى بنجاح');

      setForm({
        title: '',
        description: '',
        image: '',
        imagePublicId: '',
        imageResourceType: '',
        video: '',
        videoPublicId: '',
        videoResourceType: ''
      });
      setUploads({ image: null, video: null });

      await load();
    } catch (error) {
      console.error(error);
      setMsg('حدث خطأ في الاتصال بالسيرفر');
    } finally {
      setLoading(false);
    }
  }

  async function uploadFile(file, field) {
    if (!file) return null;
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const maxBytes = field === 'video' ? 200 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > maxBytes) {
      setMsg(field === 'video' ? 'حجم الفيديو أكبر من 200 ميجابايت' : 'حجم الصورة أكبر من 15 ميجابايت');
      return null;
    }
    if ((field === 'image' && !isImage) || (field === 'video' && !isVideo)) {
      setMsg(field === 'image' ? 'اختر ملف صورة صحيحًا' : 'اختر ملف فيديو صحيحًا');
      return null;
    }
    setLoading(true);
    setMsg(`جاري رفع ${field === 'image' ? 'الصورة' : 'الفيديو'}...`);
    try {
      const signatureResponse = await fetch('/api/upload/signature', { method: 'POST' });
      const signature = await readApiResponse(signatureResponse);
      if (!signatureResponse.ok || !signature.success) throw new Error(signature.error || 'تعذر تجهيز الرفع');
      const body = new FormData();
      body.append('file', file);
      body.append('api_key', signature.apiKey);
      body.append('timestamp', String(signature.timestamp));
      body.append('signature', signature.signature);
      body.append('folder', signature.folder);
      const resourceType = field === 'video' ? 'video' : 'image';
      const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/${resourceType}/upload`, { method: 'POST', body });
      const cloudinaryData = await readApiResponse(cloudinaryResponse);
      if (!cloudinaryResponse.ok || !cloudinaryData.secure_url) throw new Error(cloudinaryData.error?.message || 'فشل رفع الملف');
      const media = { url: cloudinaryData.secure_url, publicId: cloudinaryData.public_id, resourceType: cloudinaryData.resource_type, format: cloudinaryData.format || '', width: cloudinaryData.width || null, height: cloudinaryData.height || null, duration: cloudinaryData.duration || null };
      setForm(prev => ({ ...prev, [field]: media.url, [`${field}PublicId`]: media.publicId, [`${field}ResourceType`]: media.resourceType, [`${field}Format`]: media.format, [`${field}Width`]: media.width, [`${field}Height`]: media.height, [`${field}Duration`]: media.duration }));
      setMsg(`تم رفع ${field === 'image' ? 'الصورة' : 'الفيديو'} بنجاح`);
      return media;
    } catch (error) {
      console.error('[v0] Direct Cloudinary upload failed:', error);
      setMsg(error.message || 'حدث خطأ أثناء رفع الملف');
      return null;
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

      const data = await readApiResponse(res);

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

      const data = await readApiResponse(res);

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

      const data = await readApiResponse(res);

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

                <label className="upload-field">
                  صورة المحتوى (اختياري)
                  <input type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; setUploads(prev => ({ ...prev, image: file || null })); uploadFile(file, 'image'); }} />
                </label>
                {form.image && <small>تم تجهيز الصورة للنشر</small>}

                <label className="upload-field">
                  فيديو المحتوى (اختياري)
                  <input type="file" accept="video/*" onChange={e => { const file = e.target.files?.[0]; setUploads(prev => ({ ...prev, video: file || null })); uploadFile(file, 'video'); }} />
                </label>
                {form.video && <small>تم تجهيز الفيديو للنشر</small>}

                <button
                  type="submit"
                  className="btn primary"
                  disabled={loading}
                >
                  {loading ? 'جاري النشر...' : 'نشر المحتوى'}
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
