import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

/* ── Configuration (kept) ─────────────────────────────────────────────── */
const LANGS = [
  { code:"en", flag:"🇬🇧", label:"English"     },
  { code:"fr", flag:"🇫🇷", label:"Français"    },
  { code:"rw", flag:"🇷🇼", label:"Kinyarwanda" },
];
const T = {
  en:{ portal:"Buyer Portal", welcome:"Welcome back", products:"Products", purchases:"My Purchases", weather:"Weather", advisory:"Advisory", totalSpent:"Total Spent", profile:"Profile", logout:"Sign out", confirmLogout:"Your session will end. Continue?", cancel:"Stay", yes:"Sign out", product:"Product", category:"Category", price:"Price", seller:"Seller", stock:"Stock", buy:"Order", date:"Date", qty:"Qty", total:"Total", status:"Status" },
  fr:{ portal:"Portail Acheteur", welcome:"Bon retour", products:"Produits", purchases:"Mes achats", weather:"Météo", advisory:"Conseils", totalSpent:"Total dépensé", profile:"Profil", logout:"Déconnexion", confirmLogout:"Votre session se terminera.", cancel:"Rester", yes:"Déconnecter", product:"Produit", category:"Catégorie", price:"Prix", seller:"Vendeur", stock:"Stock", buy:"Commander", date:"Date", qty:"Qté", total:"Total", status:"Statut" },
  rw:{ portal:"Urubuga", welcome:"Murakaza neza", products:"Ibicuruzwa", purchases:"Ibyo naguze", weather:"Ikirere", advisory:"Inama", totalSpent:"Amafaranga", profile:"Umwirondoro", logout:"Sohoka", confirmLogout:"Urubuga rwawe ruzarangira.", cancel:"Oya", yes:"Sohoka", product:"Igicuruzwa", category:"Ubwoko", price:"Igiciro", seller:"Umucuruzi", stock:"Imbago", buy:"Gura", date:"Itariki", qty:"Ingano", total:"Ikirenga", status:"Imimerere" },
};

/* ── Blue & White Theme (replaced all non-blue colors) ─────────────────── */
const STATUS_CFG = {
  "Delivered":  { color:"#1E4ED8", bg:"#DBEAFE", text:"#1E3A8A" },  // darker blue
  "In Transit": { color:"#2563EB", bg:"#BFDBFE", text:"#1E40AF" },  // medium blue
  "Pending":    { color:"#3B82F6", bg:"#EFF6FF", text:"#1D4ED8" },  // light blue
};
const CAT_CFG = {
  "Beverages":"#2563EB",   // blue-600
  "Vegetables":"#3B82F6",  // blue-500
  "Grains":"#60A5FA",      // blue-400
  "Fruits":"#93C5FD",      // blue-300
};
const NAV = [
  { id:"products",  emoji:"🌾", label:"Products"  },
  { id:"purchases", emoji:"🛒", label:"Purchases" },
  { id:"weather",   emoji:"🌤️", label:"Weather"   },
  { id:"advisory",  emoji:"📰", label:"Advisory"  },
];
const rain = p => p>60?"🌧️":p>30?"🌦️":"☀️";

/* ── Empty placeholders (removed sample data) ─────────────────────────── */
const USER = { name: "", email: "", role: "" };               // replace with real user
const PRODUCTS = [];                                           // replace with real products
const TRANSACTIONS = [];                                       // replace with real transactions
const WEATHER = [];                                            // replace with real weather
const ARTICLES = [];                                           // replace with real articles

/* ── Sparkline (now uses blue shades) ─────────────────────────────────── */
function Spark({ vals, color = "#3B82F6" }) {
  if (!vals || vals.length === 0) return null;
  const W=72,H=26,PAD=2;
  const mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1;
  const pts=vals.map((v,i)=>`${PAD+i*(W-PAD*2)/(vals.length-1)},${H-PAD-(v-mn)/rng*(H-PAD*2)}`).join(" ");
  const fill=pts+` ${W-PAD},${H-PAD} ${PAD},${H-PAD}`;
  return (
    <svg width={W} height={H} style={{display:"block",flexShrink:0}}>
      <defs>
        <linearGradient id={`sg${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={fill} fill={`url(#sg${color.replace("#","")})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Component ───────────────────────────────────────────────────────── */
export default function BuyerDashboard() {
  const { logout } = useAuth();

  const [lang,setLang]             = useState("en");
  const [showLang,setShowLang]     = useState(false);
  const [showLogout,setShowLogout] = useState(false);
  const [tab,setTab]               = useState("products");
  const [loaded,setLoaded]         = useState(false);

  const t = T[lang];
  const totalSpent = TRANSACTIONS.reduce((s,tx)=>s+tx.total,0);
  const curLang = LANGS.find(l=>l.code===lang);

  useEffect(()=>{const id=setTimeout(()=>setLoaded(true),60);return()=>clearTimeout(id);},[]);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');`}</style>

      <div className="min-h-screen flex bg-blue-50 font-['Nunito',sans-serif]">

        {/* ── Sidebar (blue-900) ── */}
        <aside className="fixed top-0 left-0 w-60 h-screen bg-blue-900 flex flex-col z-50 shadow-xl">
          <div className="p-6 border-b border-blue-800">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 grid place-items-center text-lg shadow-lg flex-shrink-0">
                🌾
              </div>
              <div>
                <div className="text-base font-extrabold text-white">AgriMarket</div>
                <div className="text-xs text-blue-200 font-medium">Rwanda Platform</div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-300 px-2 pt-2.5 pb-1.5">Main Menu</div>
            {NAV.map(n => (
              <div
                key={n.id}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 text-blue-200 text-sm font-semibold hover:bg-blue-800 hover:text-white ${
                  tab === n.id ? 'bg-blue-700 text-white' : ''
                }`}
                onClick={() => setTab(n.id)}
              >
                <span className="text-base w-6 text-center flex-shrink-0">{n.emoji}</span>
                {n.label}
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 ml-auto flex-shrink-0" />
              </div>
            ))}
            <div className="text-xs font-bold uppercase tracking-wider text-blue-300 px-2 pt-2.5 pb-1.5 mt-3">Account</div>
            <a href="/profile" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 text-blue-200 text-sm font-semibold hover:bg-blue-800 hover:text-white no-underline">
              <span className="text-base w-6 text-center flex-shrink-0">👤</span> Profile
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 ml-auto flex-shrink-0" />
            </a>
            <div
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 text-blue-200 text-sm font-semibold hover:bg-blue-800 hover:text-white"
              onClick={() => setShowLogout(true)}
            >
              <span className="text-base w-6 text-center flex-shrink-0">🚪</span> Sign out
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 ml-auto flex-shrink-0" />
            </div>
          </div>

          <div className="p-4 border-t border-blue-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-extrabold text-sm grid place-items-center flex-shrink-0 border-2 border-blue-300">
              {USER.name ? USER.name.charAt(0) : '?'}
            </div>
            <div>
              <div className="text-sm font-bold text-white">{USER.name.split(" ")[0] || "Guest"}</div>
              <div className="text-xs text-blue-300 font-medium">{USER.role || "Buyer"}</div>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="ml-60 flex-1 flex flex-col min-h-screen">

          {/* Topbar (white with blue border) */}
          <div className="sticky top-0 z-40 h-15 flex items-center justify-between px-8 bg-white backdrop-blur-md border-b border-blue-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider">
              <span>Dashboard</span>
              <span className="text-blue-300">/</span>
              <span className="text-blue-600">{NAV.find(n=>n.id===tab)?.label || "Overview"}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Language */}
              <div className="relative">
                <button
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer font-sans transition-all duration-150 whitespace-nowrap border-2 border-blue-200 bg-white text-blue-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => setShowLang(v=>!v)}
                >
                  {curLang?.flag} {lang.toUpperCase()} <span className="text-[0.6rem]">▾</span>
                </button>
                {showLang && (
                  <div className="absolute top-full right-0 mt-2 bg-white border-2 border-blue-200 rounded-xl p-1 shadow-xl min-w-[152px] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {LANGS.map(l=>(
                      <div
                        key={l.code}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm font-semibold text-blue-800 hover:bg-blue-50 hover:text-blue-600 ${
                          l.code === lang ? 'bg-blue-100 text-blue-700' : ''
                        }`}
                        onClick={()=>{setLang(l.code);setShowLang(false)}}
                      >
                        {l.flag} {l.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <a href="/profile" className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer font-sans transition-all duration-150 whitespace-nowrap border-2 border-blue-200 bg-white text-blue-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {t.profile}
              </a>
              <button
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer font-sans transition-all duration-150 whitespace-nowrap border-2 border-blue-200 bg-white text-blue-700 hover:border-blue-500 hover:text-blue-800 hover:bg-blue-100"
                onClick={() => setShowLogout(true)}
              >
                {t.logout}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              </button>
            </div>
          </div>

          {/* Hero (blue-800) */}
          <div className={`mx-8 mt-6 bg-blue-800 rounded-2xl p-8 grid grid-cols-[1fr_auto] items-center gap-8 relative overflow-hidden shadow-2xl transition-all duration-500 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-blue-400 before:to-blue-600 after:content-[''] after:absolute after:-top-20 after:-right-16 after:w-72 after:h-72 after:rounded-full after:bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,transparent_65%)] ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-300 mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                {t.welcome}
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                {USER.name.split(" ")[0] || "Guest"} <span className="text-blue-300">{USER.name.split(" ")[1] || ""}</span>
              </h1>
              <div className="text-xs text-blue-200 mt-2">{USER.email || "No email"}</div>
              <div className="flex gap-2 mt-3 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-blue-700 text-blue-200 text-xs font-bold border border-blue-600">✦ {USER.role || "Buyer"}</span>
                <span className="px-3 py-1 rounded-full bg-blue-700/50 text-blue-100 text-xs font-bold border border-blue-600">📍 Kigali, Rwanda</span>
                <span className="px-3 py-1 rounded-full bg-blue-700/50 text-blue-100 text-xs font-bold border border-blue-600">
                  🗓 {new Date().toLocaleDateString("en-GB",{month:"short",day:"numeric",year:"numeric"})}
                </span>
              </div>
            </div>
            <div className="flex items-center relative z-10">
              <div className="text-right px-6 first:pl-0">
                <div className="text-3xl font-black text-white leading-tight tracking-tight">{PRODUCTS.length}</div>
                <div className="text-xs text-blue-300 mt-1 font-bold uppercase tracking-widest">Products</div>
              </div>
              <div className="w-px h-11 bg-blue-700 self-center" />
              <div className="text-right px-6">
                <div className="text-3xl font-black text-white leading-tight tracking-tight">{TRANSACTIONS.length}</div>
                <div className="text-xs text-blue-300 mt-1 font-bold uppercase tracking-widest">Orders</div>
              </div>
              <div className="w-px h-11 bg-blue-700 self-center" />
              <div className="text-right px-6">
                <div className="text-3xl font-black text-white leading-tight tracking-tight">{(totalSpent/1000).toFixed(0)}K</div>
                <div className="text-xs text-blue-300 mt-1 font-bold uppercase tracking-widest">RWF</div>
              </div>
            </div>
          </div>

          {/* Stat cards (white with blue border/hover) */}
          <div className={`grid grid-cols-3 gap-3.5 mx-8 mt-4 transition-all duration-500 delay-100 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          }`}>
            {[
              { ico:"🌾", lbl:t.products,    val:PRODUCTS.length,                     sub:"Available now",   spark:[],  col:"#3B82F6" },
              { ico:"🛒", lbl:t.purchases,   val:TRANSACTIONS.length,                 sub:"This month",      spark:[],  col:"#3B82F6" },
              { ico:"💰", lbl:t.totalSpent,  val:`RWF ${totalSpent.toLocaleString()}`, sub:"Lifetime total",  spark:[], col:"#3B82F6" },
            ].map((s,i)=>(
              <div key={i} className="bg-white border-2 border-blue-200 rounded-xl p-5 flex items-start justify-between gap-3 transition-all hover:shadow-lg hover:border-blue-400 hover:-translate-y-1">
                <div className="flex-1">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 grid place-items-center text-lg mb-3">{s.ico}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">{s.lbl}</div>
                  <div className="text-2xl font-black text-blue-900 leading-tight tracking-tight">{s.val}</div>
                  <div className="text-xs font-bold text-blue-500 mt-1.5">{s.sub}</div>
                </div>
                <Spark vals={s.spark} color={s.col}/>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className={`mx-8 mb-8 flex-1 transition-all duration-500 delay-200 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          }`}>
            <div className="flex gap-0.5 mb-5 bg-white border-2 border-blue-200 rounded-xl p-1 w-fit">
              {NAV.map(n=>(
                <button
                  key={n.id}
                  className={`px-4 py-2 text-xs font-bold cursor-pointer border-none bg-transparent text-blue-600 font-sans tracking-wide rounded-lg transition-all hover:text-blue-800 hover:bg-blue-100 ${
                    tab === n.id ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' : ''
                  }`}
                  onClick={() => setTab(n.id)}
                >
                  {n.emoji} {n.label}
                </button>
              ))}
            </div>

            {/* ── Products ── */}
            {tab==="products" && (
              <>
                <div className="bg-white border-2 border-blue-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-3.5 border-b-2 border-blue-100 flex items-center justify-between bg-blue-50">
                    <div className="text-sm font-extrabold text-blue-800 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-200 grid place-items-center text-sm">🌾</div>
                      {t.products}
                    </div>
                    <span className="bg-blue-200 text-blue-800 border border-blue-300 text-xs font-extrabold px-2 py-1 rounded-full tracking-wider">{PRODUCTS.length} LISTED</span>
                  </div>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-blue-100 bg-blue-50">
                        <th className="text-left px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-blue-700">{t.product}</th>
                        <th className="text-left px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-blue-700">{t.category}</th>
                        <th className="text-left px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-blue-700">{t.price}</th>
                        <th className="text-left px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-blue-700">{t.seller}</th>
                        <th className="text-left px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-blue-700">Trend</th>
                        <th className="text-left px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-blue-700"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {PRODUCTS.length === 0 ? (
                        <tr><td colSpan="6" className="text-center py-10 text-blue-400">No products available</td></tr>
                      ) : (
                        PRODUCTS.map(p=>(
                          <tr key={p.id} className="border-b border-blue-100 hover:bg-blue-50">
                            <td className="px-4 py-3 text-sm text-blue-900 font-extrabold">{p.name}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-extrabold" style={{background: `${CAT_CFG[p.cat]}20`, color: CAT_CFG[p.cat]}}>
                                <span className="w-1.5 h-1.5 rounded-full" style={{background: CAT_CFG[p.cat]}} />
                                {p.cat}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className="font-extrabold text-blue-700">RWF {p.price.toLocaleString()}</span>
                              <span className="text-blue-400 text-xs">/{p.unit}</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-blue-600 font-medium">{p.seller}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={p.trend.startsWith("+") ? "text-blue-600 text-xs font-extrabold" : "text-blue-800 text-xs font-extrabold"}>
                                {p.trend.startsWith("+")?"↑":"↓"} {p.trend}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <button className="bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all px-3.5 py-1.5 text-xs rounded-lg font-bold">
                                {t.buy}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-2 gap-3.5 mt-3.5">
                  <div className="bg-white border-2 border-blue-200 rounded-xl overflow-hidden">
                    <div className="px-5 py-3.5 border-b-2 border-blue-100 flex items-center justify-between bg-blue-50">
                      <div className="text-sm font-extrabold text-blue-800 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-200 grid place-items-center text-sm">🌤️</div>
                        {t.weather}
                      </div>
                      <span className="bg-blue-200 text-blue-800 border border-blue-300 text-xs font-extrabold px-2 py-1 rounded-full tracking-wider">LIVE</span>
                    </div>
                    {WEATHER.length === 0 ? (
                      <div className="text-center py-10 text-blue-400">No weather data</div>
                    ) : (
                      WEATHER.slice(0,4).map((w,i)=>(
                        <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-blue-100 hover:bg-blue-50 gap-3.5">
                          <div>
                            <div className="font-extrabold text-sm text-blue-900">{w.district}</div>
                            <div className="text-xs text-blue-500 mt-0.5 font-medium">Rwanda</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-extrabold text-blue-700">{w.temp}°C {rain(w.rain)}</div>
                            <div className="text-xs text-blue-500">{w.rain}% rain</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="bg-white border-2 border-blue-200 rounded-xl overflow-hidden">
                    <div className="px-5 py-3.5 border-b-2 border-blue-100 flex items-center justify-between bg-blue-50">
                      <div className="text-sm font-extrabold text-blue-800 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-200 grid place-items-center text-sm">📰</div>
                        {t.advisory}
                      </div>
                      <span className="bg-blue-200 text-blue-800 border border-blue-300 text-xs font-extrabold px-2 py-1 rounded-full tracking-wider">NEW</span>
                    </div>
                    {ARTICLES.length === 0 ? (
                      <div className="text-center py-10 text-blue-400">No articles</div>
                    ) : (
                      ARTICLES.map((a,i)=>{
                        const tagCls = a.tag==="Environment" ? "bg-blue-100 text-blue-800" : a.tag==="Market" ? "bg-blue-200 text-blue-900" : a.tag==="Agronomy" ? "bg-blue-300 text-blue-900" : "bg-blue-100 text-blue-700";
                        return(
                          <div key={a.id} className="flex items-center justify-between px-5 py-3.5 border-b border-blue-100 hover:bg-blue-50 gap-3.5">
                            <span className="text-2xl font-black text-blue-200 flex-shrink-0 w-7 leading-tight tracking-tight">0{i+1}</span>
                            <a href={`/advisory/${a.id}`} className="text-blue-800 font-bold text-sm no-underline flex-1 leading-relaxed hover:text-blue-600">{a.title}</a>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold flex-shrink-0 ${tagCls}`}>{a.tag}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ── Purchases ── */}
            {tab==="purchases" && (
              <div className="bg-white border-2 border-blue-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b-2 border-blue-100 flex items-center justify-between bg-blue-50">
                  <div className="text-sm font-extrabold text-blue-800 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-200 grid place-items-center text-sm">🛒</div>
                    {t.purchases}
                  </div>
                  <span className="bg-blue-200 text-blue-800 border border-blue-300 text-xs font-extrabold px-2 py-1 rounded-full tracking-wider">{TRANSACTIONS.length} ORDERS</span>
                </div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-blue-100 bg-blue-50">
                      <th className="text-left px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-blue-700">{t.product}</th>
                      <th className="text-left px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-blue-700">{t.date}</th>
                      <th className="text-left px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-blue-700">{t.qty}</th>
                      <th className="text-left px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-blue-700">{t.total}</th>
                      <th className="text-left px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-blue-700">{t.status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TRANSACTIONS.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-10 text-blue-400">No transactions</td></tr>
                    ) : (
                      TRANSACTIONS.map(tx=>{
                        const s=STATUS_CFG[tx.status]||STATUS_CFG["Pending"];
                        return(
                          <tr key={tx.id} className="border-b border-blue-100 hover:bg-blue-50">
                            <td className="px-4 py-3 text-sm text-blue-900 font-extrabold">{tx.product}</td>
                            <td className="px-4 py-3 text-sm text-blue-600 font-medium">{tx.date}</td>
                            <td className="px-4 py-3 text-sm text-blue-600 font-medium">{tx.qty}</td>
                            <td className="px-4 py-3 text-sm font-extrabold text-blue-700">RWF {tx.total.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-extrabold" style={{background:s.bg, color:s.text}}>
                                <span className="w-1.5 h-1.5 rounded-full" style={{background:s.color}}/>{tx.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Weather ── */}
            {tab==="weather" && (
              <div className="bg-white border-2 border-blue-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b-2 border-blue-100 flex items-center justify-between bg-blue-50">
                  <div className="text-sm font-extrabold text-blue-800 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-200 grid place-items-center text-sm">🌤️</div>
                    {t.weather}
                  </div>
                  <span className="bg-blue-200 text-blue-800 border border-blue-300 text-xs font-extrabold px-2 py-1 rounded-full tracking-wider">5 DISTRICTS</span>
                </div>
                {WEATHER.length === 0 ? (
                  <div className="text-center py-10 text-blue-400">No weather data</div>
                ) : (
                  WEATHER.map((w,i)=>(
                    <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-blue-100 hover:bg-blue-50 gap-3.5">
                      <div>
                        <div className="font-extrabold text-sm text-blue-900">{w.district}</div>
                        <div className="text-xs text-blue-500 mt-0.5 font-medium">Rwanda</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-extrabold text-blue-700">{w.temp}°C</div>
                          <div className="text-xs text-blue-500">{w.rain}% chance of rain</div>
                        </div>
                        <span className="text-2xl">{rain(w.rain)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── Advisory ── */}
            {tab==="advisory" && (
              <div className="bg-white border-2 border-blue-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b-2 border-blue-100 flex items-center justify-between bg-blue-50">
                  <div className="text-sm font-extrabold text-blue-800 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-200 grid place-items-center text-sm">📰</div>
                    {t.advisory}
                  </div>
                  <span className="bg-blue-200 text-blue-800 border border-blue-300 text-xs font-extrabold px-2 py-1 rounded-full tracking-wider">{ARTICLES.length} ARTICLES</span>
                </div>
                {ARTICLES.length === 0 ? (
                  <div className="text-center py-10 text-blue-400">No articles</div>
                ) : (
                  ARTICLES.map((a,i)=>{
                    const tagCls = a.tag==="Environment" ? "bg-blue-100 text-blue-800" : a.tag==="Market" ? "bg-blue-200 text-blue-900" : a.tag==="Agronomy" ? "bg-blue-300 text-blue-900" : "bg-blue-100 text-blue-700";
                    return(
                      <div key={a.id} className="flex items-center justify-between px-5 py-3.5 border-b border-blue-100 hover:bg-blue-50 gap-3.5">
                        <span className="text-2xl font-black text-blue-200 flex-shrink-0 w-7 leading-tight tracking-tight">0{i+1}</span>
                        <a href={`/advisory/${a.id}`} className="text-blue-800 font-bold text-sm no-underline flex-1 leading-relaxed hover:text-blue-600">{a.title}</a>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold flex-shrink-0 ${tagCls}`}>{a.tag}</span>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Footer (blue-500 links) */}
          <footer className="mx-8 mb-8 pt-4 border-t-2 border-blue-200 flex flex-wrap gap-2 items-center justify-center text-xs text-blue-600">
            <a href="mailto:mordekai893@gmail.com" className="no-underline font-semibold inline-flex items-center gap-1 hover:text-blue-800">📧 mordekai893@gmail.com</a>
            <span className="w-1 h-1 rounded-full bg-blue-300" />
            <span className="font-semibold">👤 Mordekai</span>
            <span className="w-1 h-1 rounded-full bg-blue-300" />
            <a href="https://mordekai.vercel.app" target="_blank" rel="noreferrer" className="no-underline font-semibold inline-flex items-center gap-1 hover:text-blue-800">🌐 Portfolio</a>
            <span className="w-1 h-1 rounded-full bg-blue-300" />
            <a href="https://instagram.com/Mordekai_320" target="_blank" rel="noreferrer" className="no-underline font-semibold inline-flex items-center gap-1 hover:text-blue-800">📸 Instagram</a>
            <span className="w-1 h-1 rounded-full bg-blue-300" />
            <a href="https://twitter.com/Mordekai668896" target="_blank" rel="noreferrer" className="no-underline font-semibold inline-flex items-center gap-1 hover:text-blue-800">🐦 Twitter</a>
            <span className="w-1 h-1 rounded-full bg-blue-300" />
            <a href="https://facebook.com/UM.Mordekai" target="_blank" rel="noreferrer" className="no-underline font-semibold inline-flex items-center gap-1 hover:text-blue-800">👍 Facebook</a>
            <span className="w-1 h-1 rounded-full bg-blue-300" />
            <a href="https://tiktok.com/@Mordekai320" target="_blank" rel="noreferrer" className="no-underline font-semibold inline-flex items-center gap-1 hover:text-blue-800">🎵 TikTok</a>
            <span className="w-1 h-1 rounded-full bg-blue-300" />
            <a href="https://wa.me/250796381024" target="_blank" rel="noreferrer" className="no-underline font-semibold inline-flex items-center gap-1 hover:text-blue-800">📱 0796381024</a>
          </footer>
        </main>
      </div>

      {/* Logout Modal (white with blue accent) */}
      {showLogout && (
        <div className="fixed inset-0 z-50 bg-blue-900/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-150" onClick={() => setShowLogout(false)}>
          <div className="bg-white border-2 border-blue-200 rounded-2xl p-10 max-w-sm w-11/12 shadow-2xl text-center animate-in slide-in-from-bottom-4 duration-200" onClick={e => e.stopPropagation()}>
            <div className="text-5xl mb-3 leading-none">🚪</div>
            <h3 className="text-2xl font-black text-blue-900 mb-2 tracking-tight">Sign out?</h3>
            <p className="text-blue-600 text-sm mb-7 leading-relaxed font-medium">{t.confirmLogout}</p>
            <div className="flex gap-2.5 justify-center">
              <button
                className="px-6 py-2.5 rounded-lg text-sm font-extrabold cursor-pointer bg-blue-600 text-white border-none shadow-md hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all"
                onClick={() => { logout(); setShowLogout(false); }}
              >
                {t.yes}
              </button>
              <button
                className="px-6 py-2.5 rounded-lg text-sm font-bold cursor-pointer bg-blue-50 text-blue-700 border-2 border-blue-200 hover:bg-blue-100 hover:text-blue-800 hover:border-blue-300 transition-all"
                onClick={() => setShowLogout(false)}
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}