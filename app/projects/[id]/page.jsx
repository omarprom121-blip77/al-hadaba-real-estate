import Link from 'next/link';
import { getPublishedProject } from '../../../lib/content';

export const dynamic = 'force-dynamic';

export default async function ProjectDetailsPage({ params }) {
  const { id } = await params;
  let project = null;
  let error = '';
  try { project = await getPublishedProject(id); } catch (reason) { console.error('[v0] Project details load failed:', reason); error = 'تعذر تحميل بيانات المشروع حاليًا.'; }
  return <main><header className="nav"><div className="container nav-inner"><Link href="/" className="brand"><span className="logoMark">هـ</span><span>عقارات الهضبة</span></Link><nav><Link href="/buildings">المباني</Link><Link href="/investment">استثمار</Link></nav></div></header><section className="page-hero"><div className="container"><div className="eyebrow">تفاصيل المشروع</div><h1>{project?.title || 'تفاصيل المشروع'}</h1></div></section><section className="section"><div className="container">{error ? <div className="empty">{error}</div> : !project ? <div className="empty">المشروع غير موجود أو لم يعد منشورًا.</div> : <article className="card project-details">{project.video && <video className="card-media" src={project.video} controls playsInline preload="metadata" aria-label={`فيديو ${project.title}`} />}{!project.video && project.image && <img className="card-media" src={project.image} alt={project.title} />}<div className="card-body"><h2>{project.title}</h2><p>{project.description}</p><Link href="/buildings" className="text-link">العودة إلى المشروعات ←</Link></div></article>}</div></section></main>;
}
