import Link from 'next/link';

async function getItems(kind) {
  try { const r = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/public`, {cache:'no-store'}); const d=await r.json(); return kind==='finishing' ? (d.finishing||[]) : kind==='projects' ? d.projects||[] : d.investments||[]; } catch { return []; }
}
export default async function ContentPage({title,description,kind}) {
  const items=await getItems(kind);
  return <main><header className="nav"><div className="container nav-inner"><Link href="/" className="brand"><span className="logoMark">هـ</span><span>عقارات الهضبة</span></Link><nav><Link href="/finishing">التشطيبات</Link><Link href="/buildings">المباني</Link><Link href="/investment">استثمار</Link><Link href="/login" className="nav-admin">دخول الإدارة</Link></nav></div></header>
  <section className="page-hero"><div className="container"><div className="eyebrow">عقارات الهضبة</div><h1>{title}</h1><p>{description}</p></div></section>
  <section className="section"><div className="container"><div className="cards">{items.map(x=><article className="card" key={x._id}>{x.image && <img className="card-media" src={x.image} alt={x.title}/>} {x.video && <video className="card-media" src={x.video} controls preload="metadata" playsInline aria-label={`فيديو ${x.title}`}/>} {!x.image&&!x.video&&<div className="card-img"/>}<div className="card-body"><h3>{x.title}</h3><p>{x.description}</p></div></article>)}{!items.length && <div className="empty">لا يوجد محتوى منشور حاليًا. يمكنك إضافته من لوحة التحكم.</div>}</div></div></section>
  <a className="whatsapp" href="https://wa.me/201154833016" target="_blank" rel="noreferrer">◔</a>
  <footer><div className="container footer-inner"><strong>عقارات الهضبة</strong><Link href="/">الرئيسية</Link></div></footer></main>
}
