import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getProject(id) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || '';
  const response = await fetch(`${base}/api/public/projects/${encodeURIComponent(id)}`, { cache: 'no-store' });
  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { throw new Error('تعذر قراءة استجابة الخادم.'); }
  if (response.status === 404) return null;
  if (!response.ok || !data.success) throw new Error(data.error || 'تعذر تحميل بيانات المشروع حاليًا.');
  return data.project;
}

export default async function ProjectDetailsPage({ params }) {
  const { id } = await params;
  let project = null;
  let error = '';
  try { project = await getProject(id); } catch (reason) { console.error('[v0] Project details load failed:', reason); error = reason.message; }
  return <main><header className="nav"><div className="container nav-inner"><Link href="/" className="brand"><span className="logoMark">هـ</span><span>عقارات الهضبة</span></Link><nav><Link href="/buildings">المباني</Link><Link href="/investment">استثمار</Link></nav></div></header><section className="page-hero"><div className="container"><div className="eyebrow">تفاصيل المشروع</div><h1>{project?.title || 'تفاصيل المشروع'}</h1></div></section><section className="section"><div className="container">{error ? <div className="empty">{error}</div> : !project ? <div className="empty">المشروع غير موجود أو لم يعد منشورًا.</div> : <article className="card project-details">{project.video && <video className="card-media" src={project.video} controls playsInline preload="metadata" aria-label={`فيديو ${project.title}`} />}{!project.video && project.image && <img className="card-media" src={project.image} alt={project.title} />}<div className="card-body"><h2>{project.title}</h2><p>{project.description}</p><Link href="/buildings" className="text-link">العودة إلى المشروعات ←</Link></div></article>}</div></section><a className="whatsapp" href="https://wa.me/201154833016" target="_blank" rel="noreferrer" aria-label="تواصل معنا عبر واتساب">◔</a></main>;
}
