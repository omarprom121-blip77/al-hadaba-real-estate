import Link from 'next/link';
import { getPublishedContent } from '../lib/content';

export const dynamic = 'force-dynamic';
export default async function ContentPage({title,description,kind}) {
  let items = [];
  let loadError = '';
  try { items = await getPublishedContent(kind); } catch (error) { console.error('[v0] Content page load failed:', error); loadError = error.message || 'تعذر تحميل المحتوى'; }
  return <main><header className="nav"><div className="container nav-inner"><Link href="/" className="brand"><span className="logoMark">هـ</span><span>عقارات الهضبة</span></Link><nav><Link href="/finishing">التشطيبات</Link><Link href="/buildings">المباني</Link><Link href="/investment">استثمار</Link><Link href="/login" className="nav-admin">دخول الإدارة</Link></nav></div></header>
  <section className="page-hero"><div className="container"><div className="eyebrow">عقارات الهضبة</div><h1>{title}</h1><p>{description}</p></div></section>
  <section className="section"><div className="container"><div className="cards">{items.map(x=><article className="card" key={x._id}>{x.image && <img className="card-media" src={x.image} alt={x.title}/>} {x.video && <video className="card-media" src={x.video} controls preload="metadata" playsInline aria-label={`فيديو ${x.title}`}/>} {!x.image&&!x.video&&<div className="card-img"/>}<div className="card-body"><h3>{x.title}</h3><p>{x.description}</p>{kind === 'projects' && <Link href={`/projects/${encodeURIComponent(x._id)}`} className="text-link">عرض المزيد ←</Link>}</div></article>)}{loadError ? <div className="empty">{loadError}</div> : !items.length && <div className="empty">لا يوجد محتوى منشور حاليًا. يمكنك إضافته من لوحة التحكم.</div>}</div></div></section>
  <footer><div className="container footer-inner"><strong>عقارات الهضبة</strong><Link href="/">الرئيسية</Link></div></footer></main>
}
