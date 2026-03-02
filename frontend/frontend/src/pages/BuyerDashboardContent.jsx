import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

/* ── Configuration ─────────────────────────────────────────────── */
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

const STATUS_CFG = {
  "Delivered":  { color:"#10b981", bg:"rgba(16, 185, 129, 0.1)", text:"#10b981" },
  "In Transit": { color:"#06b6d4", bg:"rgba(6, 182, 212, 0.1)", text:"#06b6d4" },
  "Pending":    { color:"#f59e0b", bg:"rgba(245, 158, 11, 0.1)", text:"#f59e0b" },
};
const CAT_CFG = {
  "Beverages":"#10b981",
  "Vegetables":"#06b6d4",
  "Grains":"#f59e0b",
  "Fruits":"#ec4899",
};
const NAV = [
  { id:"products",  emoji:"🌾", label:"Products"  },
  { id:"purchases", emoji:"🛒", label:"Purchases" },
  { id:"weather",   emoji:"🌤️", label:"Weather"   },
  { id:"advisory",  emoji:"📰", label:"Advisory"  },
];
const rain = p => p>60?"🌧️":p>30?"🌦️":"☀️";

/* ── Empty placeholders ─────────────────────────────────────────── */
const USER = { name: "", email: "", role: "" };
const PRODUCTS = [];
const TRANSACTIONS = [];
const WEATHER = [];
const ARTICLES = [];

/* ── Sparkline ──────────────────────────────────────────────────── */
function Spark({ vals, color = "#10b981" }) {
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

/* ── Component ───────────────────────────────────────────────────── */
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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');`}</style>

      <div className="min-h-screen flex bg-[#0f172a] font-['DM_Sans',sans-serif]">

        {/* ── Sidebar ── */}
        <aside className="fixed top-0 left-0 w-72 h-screen bg-gradient-to-b from-[#0a0f1a] to-[#162137] flex flex-col z-50 shadow-2xl border-r border-[#334155]">
          <div className="p-6 border-b border-[#334155]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#10b981] to-[#06b6d4] grid place-items-center text-xl shadow-lg flex-shrink-0 font-black">
                🌾
              </div>
              <div>
                <div className="text-base font-extrabold text-white">AgriMarket</div>
                <div className="text-xs text-[#cbd5e1] font-medium">Rwanda Platform</div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] px-3 pt-3 pb-2">Navigation</div>
            {NAV.map(n => (
              <button
                key={n.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 text-sm font-semibold w-full text-left ${
                  tab === n.id 
                    ? 'bg-gradient-to-r from-[#10b981]/20 to-[#06b6d4]/20 text-[#10b981] border border-[#10b981]/30' 
                    : 'text-[#cbd5e1] hover:bg-[#1a243a] hover:text-white'
                }`}
                onClick={() => setTab(n.id)}
              >
                <span className="text-lg w-6 text-center flex-shrink-0">{n.emoji}</span>
                <span className="flex-1">{n.label}</span>
                {tab === n.id && <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse flex-shrink-0" />}
              </button>
            ))}
            
            <div className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] px-3 pt-4 pb-2">Account</div>
            <a href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#cbd5e1] hover:bg-[#1a243a] hover:text-white transition-all text-sm font-semibold no-underline">
              <span className="text-lg w-6 text-center flex-shrink-0">👤</span>
              <span className="flex-1">{t.profile}</span>
            </a>
            <button
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#cbd5e1] hover:bg-[#ef4444]/10 hover:text-[#ef4444] transition-all text-sm font-semibold w-full text-left"
              onClick={() => setShowLogout(true)}
            >
              <span className="text-lg w-6 text-center flex-shrink-0">🚪</span>
              <span className="flex-1">{t.logout}</span>
            </button>
          </div>

          <div className="p-4 border-t border-[#334155] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10b981] to-[#06b6d4] text-white font-extrabold text-sm grid place-items-center flex-shrink-0 border-2 border-[#10b981]">
              {USER.name ? USER.name.charAt(0) : '?'}
            </div>
            <div>
              <div className="text-sm font-bold text-white">{USER.name.split(" ")[0] || "Guest"}</div>
              <div className="text-xs text-[#94a3b8] font-medium">{USER.role || "Buyer"}</div>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="ml-72 flex-1 flex flex-col min-h-screen">

          {/* Topbar */}
          <div className="sticky top-0 z-40 h-20 flex items-center justify-between px-8 bg-[#1a243a]/80 backdrop-blur-xl border-b border-[#334155]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#94a3b8] uppercase tracking-wider">
              <span>{t.portal}</span>
              <span className="text-[#475569]">/</span>
              <span className="text-[#10b981]">{NAV.find(n=>n.id===tab)?.label || "Overview"}</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Language */}
              <div className="relative">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border border-[#334155] bg-[#1a243a] text-[#cbd5e1] hover:border-[#10b981] hover:text-[#10b981] hover:bg-[#10b981]/10"
                  onClick={() => setShowLang(v=>!v)}
                >
                  {curLang?.flag} {lang.toUpperCase()} <span className="text-[0.6rem]">▾</span>
                </button>
                {showLang && (
                  <div className="absolute top-full right-0 mt-2 bg-[#1a243a] border border-[#334155] rounded-xl p-2 shadow-2xl min-w-[160px] z-50">
                    {LANGS.map(l=>(
                      <button
                        key={l.code}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm font-semibold w-full text-left transition-all ${
                          l.code === lang 
                            ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30' 
                            : 'text-[#cbd5e1] hover:bg-[#233049] hover:text-white'
                        }`}
                        onClick={()=>{setLang(l.code);setShowLang(false)}}
                      >
                        {l.flag} {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <a href="/profile" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border border-[#334155] bg-[#1a243a] text-[#cbd5e1] hover:border-[#10b981] hover:text-[#10b981] hover:bg-[#10b981]/10">
                👤 {t.profile}
              </a>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border border-[#334155] bg-[#ef4444]/10 text-[#ef4444] hover:border-[#ef4444] hover:bg-[#ef4444]/20"
                onClick={() => setShowLogout(true)}
              >
                🚪 {t.logout}
              </button>
            </div>
          </div>

          {/* Hero */}
          <div className={`mx-8 mt-6 bg-gradient-to-br from-[#1a243a] to-[#233049] rounded-2xl p-8 grid grid-cols-[1fr_auto] items-center gap-8 relative overflow-hidden shadow-2xl border border-[#334155] transition-all duration-500 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#10b981] to-[#06b6d4]" />
            <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.12)_0%,transparent_65%)] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-3">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                {t.welcome}
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                {USER.name.split(" ")[0] || "Guest"} <span className="text-[#10b981]">{USER.name.split(" ")[1] || ""}</span>
              </h1>
              <div className="text-sm text-[#94a3b8] mt-2">{USER.email || "No email"}</div>
              <div className="flex gap-2 mt-4 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-[#10b981]/20 text-[#10b981] text-xs font-bold border border-[#10b981]/30">✦ {USER.role || "Buyer"}</span>
                <span className="px-3 py-1 rounded-full bg-[#06b6d4]/20 text-[#06b6d4] text-xs font-bold border border-[#06b6d4]/30">📍 Kigali, Rwanda</span>
                <span className="px-3 py-1 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] text-xs font-bold border border-[#f59e0b]/30">
                  🗓 {new Date().toLocaleDateString("en-GB",{month:"short",day:"numeric",year:"numeric"})}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="text-right">
                <div className="text-3xl font-black text-white">{PRODUCTS.length}</div>
                <div className="text-xs text-[#94a3b8] mt-1 font-bold uppercase tracking-widest">Products</div>
              </div>
              <div className="w-px h-12 bg-[#334155]" />
              <div className="text-right">
                <div className="text-3xl font-black text-white">{TRANSACTIONS.length}</div>
                <div className="text-xs text-[#94a3b8] mt-1 font-bold uppercase tracking-widest">Orders</div>
              </div>
              <div className="w-px h-12 bg-[#334155]" />
              <div className="text-right">
                <div className="text-3xl font-black text-white">{(totalSpent/1000).toFixed(0)}K</div>
                <div className="text-xs text-[#94a3b8] mt-1 font-bold uppercase tracking-widest">RWF</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-3 gap-4 mx-8 mt-6 transition-all duration-500 delay-100 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          }`}>
            {[
              { ico:"🌾", lbl:t.products,    val:PRODUCTS.length,                     sub:"Available now",   spark:[],  col:"#10b981" },
              { ico:"🛒", lbl:t.purchases,   val:TRANSACTIONS.length,                 sub:"This month",      spark:[],  col:"#06b6d4" },
              { ico:"💰", lbl:t.totalSpent,  val:`RWF ${totalSpent.toLocaleString()}`, sub:"Lifetime total",  spark:[], col:"#f59e0b" },
            ].map((s,i)=>(
              <div key={i} className="bg-[#1a243a] border border-[#334155] rounded-xl p-5 flex items-start justify-between gap-3 transition-all hover:shadow-lg hover:border-[#10b981] hover:-translate-y-1 hover:bg-[#1a243a]/80">
                <div className="flex-1">
                  <div className="w-11 h-11 rounded-lg bg-[#10b981]/20 grid place-items-center text-lg mb-3">{s.ico}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1">{s.lbl}</div>
                  <div className="text-2xl font-black text-white leading-tight tracking-tight">{s.val}</div>
                  <div className="text-xs font-bold text-[#10b981] mt-2">{s.sub}</div>
                </div>
                <Spark vals={s.spark} color={s.col}/>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className={`mx-8 mb-8 flex-1 transition-all duration-500 delay-200 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          }`}>
            {/* ── Products ── */}
            {tab==="products" && (
              <>
                <div className="bg-[#1a243a] border border-[#334155] rounded-xl overflow-hidden mt-6">
                  <div className="px-6 py-4 border-b border-[#334155] flex items-center justify-between bg-[#0f172a]">
                    <div className="text-sm font-extrabold text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#10b981]/20 grid place-items-center text-sm">🌾</div>
                      {t.products}
                    </div>
                    <span className="bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 text-xs font-extrabold px-3 py-1 rounded-full">{PRODUCTS.length} LISTED</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-[#334155] bg-[#0f172a]">
                          <th className="text-left px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-[#94a3b8]">{t.product}</th>
                          <th className="text-left px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-[#94a3b8]">{t.category}</th>
                          <th className="text-left px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-[#94a3b8]">{t.price}</th>
                          <th className="text-left px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-[#94a3b8]">{t.seller}</th>
                          <th className="text-left px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-[#94a3b8]">Trend</th>
                          <th className="text-left px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-[#94a3b8]"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {PRODUCTS.length === 0 ? (
                          <tr><td colSpan="6" className="text-center py-12 text-[#475569]">No products available</td></tr>
                        ) : (
                          PRODUCTS.map(p=>(
                            <tr key={p.id} className="border-b border-[#334155] hover:bg-[#1a243a]/50 transition-colors">
                              <td className="px-6 py-3 text-sm text-white font-extrabold">{p.name}</td>
                              <td className="px-6 py-3 text-sm">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-extrabold" style={{background: `${CAT_CFG[p.cat]}20`, color: CAT_CFG[p.cat]}}>
                                  <span className="w-1.5 h-1.5 rounded-full" style={{background: CAT_CFG[p.cat]}} />
                                  {p.cat}
                                </span>
                              </td>
                              <td className="px-6 py-3 text-sm">
                                <span className="font-extrabold text-white">RWF {p.price.toLocaleString()}</span>
                                <span className="text-[#94a3b8] text-xs ml-1">/{p.unit}</span>
                              </td>
                              <td className="px-6 py-3 text-sm text-[#cbd5e1]">{p.seller}</td>
                              <td className="px-6 py-3 text-sm">
                                <span className={`text-xs font-extrabold ${p.trend.startsWith("+") ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                                  {p.trend.startsWith("+")?"↑":"↓"} {p.trend}
                                </span>
                              </td>
                              <td className="px-6 py-3 text-sm">
                                <button className="bg-[#10b981] text-white hover:bg-[#059669] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all px-4 py-1.5 text-xs rounded-lg font-bold">
                                  {t.buy}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-[#1a243a] border border-[#334155] rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#334155] flex items-center justify-between bg-[#0f172a]">
                      <div className="text-sm font-extrabold text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#06b6d4]/20 grid place-items-center text-sm">🌤️</div>
                        {t.weather}
                      </div>
                      <span className="bg-[#06b6d4]/20 text-[#06b6d4] border border-[#06b6d4]/30 text-xs font-extrabold px-3 py-1 rounded-full">LIVE</span>
                    </div>
                    {WEATHER.length === 0 ? (
                      <div className="text-center py-10 text-[#475569]">No weather data</div>
                    ) : (
                      WEATHER.slice(0,4).map((w,i)=>(
                        <div key={i} className="flex items-center justify-between px-6 py-3 border-b border-[#334155] hover:bg-[#1a243a]/50 gap-3">
                          <div>
                            <div className="font-extrabold text-sm text-white">{w.district}</div>
                            <div className="text-xs text-[#94a3b8] mt-1">Rwanda</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-extrabold text-[#10b981]">{w.temp}°C {rain(w.rain)}</div>
                            <div className="text-xs text-[#94a3b8]">{w.rain}% rain</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="bg-[#1a243a] border border-[#334155] rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#334155] flex items-center justify-between bg-[#0f172a]">
                      <div className="text-sm font-extrabold text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/20 grid place-items-center text-sm">📰</div>
                        {t.advisory}
                      </div>
                      <span className="bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30 text-xs font-extrabold px-3 py-1 rounded-full">NEW</span>
                    </div>
                    {ARTICLES.length === 0 ? (
                      <div className="text-center py-10 text-[#475569]">No articles</div>
                    ) : (
                      ARTICLES.map((a,i)=>{
                        const tagCols = {
                          "Environment": { bg:"#10b981", text:"white" },
                          "Market": { bg:"#06b6d4", text:"white" },
                          "Agronomy": { bg:"#f59e0b", text:"white" }
                        };
                        const tc = tagCols[a.tag] || { bg:"#10b981", text:"white" };
                        return(
                          <div key={a.id} className="flex items-center justify-between px-6 py-3 border-b border-[#334155] hover:bg-[#1a243a]/50 gap-3">
                            <span className="text-2xl font-black text-[#334155] flex-shrink-0 w-7">0{i+1}</span>
                            <a href={`/advisory/${a.id}`} className="text-[#cbd5e1] font-bold text-sm no-underline flex-1 hover:text-[#10b981] transition-colors">{a.title}</a>
                            <span className="px-2 py-0.5 rounded-full text-xs font-extrabold flex-shrink-0 text-white" style={{background:tc.bg}}>{a.tag}</span>
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
              <div className="bg-[#1a243a] border border-[#334155] rounded-xl overflow-hidden mt-6">
                <div className="px-6 py-4 border-b border-[#334155] flex items-center justify-between bg-[#0f172a]">
                  <div className="text-sm font-extrabold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#06b6d4]/20 grid place-items-center text-sm">🛒</div>
                    {t.purchases}
                  </div>
                  <span className="bg-[#06b6d4]/20 text-[#06b6d4] border border-[#06b6d4]/30 text-xs font-extrabold px-3 py-1 rounded-full">{TRANSACTIONS.length} ORDERS</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-[#334155] bg-[#0f172a]">
                        <th className="text-left px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-[#94a3b8]">{t.product}</th>
                        <th className="text-left px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-[#94a3b8]">{t.date}</th>
                        <th className="text-left px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-[#94a3b8]">{t.qty}</th>
                        <th className="text-left px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-[#94a3b8]">{t.total}</th>
                        <th className="text-left px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-[#94a3b8]">{t.status}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TRANSACTIONS.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-12 text-[#475569]">No transactions</td></tr>
                      ) : (
                        TRANSACTIONS.map(tx=>{
                          const s=STATUS_CFG[tx.status]||STATUS_CFG["Pending"];
                          return(
                            <tr key={tx.id} className="border-b border-[#334155] hover:bg-[#1a243a]/50 transition-colors">
                              <td className="px-6 py-3 text-sm text-white font-extrabold">{tx.product}</td>
                              <td className="px-6 py-3 text-sm text-[#cbd5e1]">{tx.date}</td>
                              <td className="px-6 py-3 text-sm text-[#cbd5e1]">{tx.qty}</td>
                              <td className="px-6 py-3 text-sm font-extrabold text-white">RWF {tx.total.toLocaleString()}</td>
                              <td className="px-6 py-3 text-sm">
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
              </div>
            )}

            {/* ── Weather ── */}
            {tab==="weather" && (
              <div className="bg-[#1a243a] border border-[#334155] rounded-xl overflow-hidden mt-6">
                <div className="px-6 py-4 border-b border-[#334155] flex items-center justify-between bg-[#0f172a]">
                  <div className="text-sm font-extrabold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#06b6d4]/20 grid place-items-center text-sm">🌤️</div>
                    {t.weather}
                  </div>
                  <span className="bg-[#06b6d4]/20 text-[#06b6d4] border border-[#06b6d4]/30 text-xs font-extrabold px-3 py-1 rounded-full">5 DISTRICTS</span>
                </div>
                {WEATHER.length === 0 ? (
                  <div className="text-center py-12 text-[#475569]">No weather data</div>
                ) : (
                  WEATHER.map((w,i)=>(
                    <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-[#334155] hover:bg-[#1a243a]/50 gap-4 transition-colors">
                      <div>
                        <div className="font-extrabold text-sm text-white">{w.district}</div>
                        <div className="text-xs text-[#94a3b8] mt-1">Rwanda</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-extrabold text-[#10b981]">{w.temp}°C</div>
                          <div className="text-xs text-[#94a3b8]">{w.rain}% chance of rain</div>
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
              <div className="bg-[#1a243a] border border-[#334155] rounded-xl overflow-hidden mt-6">
                <div className="px-6 py-4 border-b border-[#334155] flex items-center justify-between bg-[#0f172a]">
                  <div className="text-sm font-extrabold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/20 grid place-items-center text-sm">📰</div>
                    {t.advisory}
                  </div>
                  <span className="bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30 text-xs font-extrabold px-3 py-1 rounded-full">{ARTICLES.length} ARTICLES</span>
                </div>
                {ARTICLES.length === 0 ? (
                  <div className="text-center py-12 text-[#475569]">No articles</div>
                ) : (
                  ARTICLES.map((a,i)=>{
                    const tagCols = {
                      "Environment": { bg:"#10b981", text:"white" },
                      "Market": { bg:"#06b6d4", text:"white" },
                      "Agronomy": { bg:"#f59e0b", text:"white" }
                    };
                    const tc = tagCols[a.tag] || { bg:"#10b981", text:"white" };
                    return(
                      <div key={a.id} className="flex items-center justify-between px-6 py-4 border-b border-[#334155] hover:bg-[#1a243a]/50 gap-4 transition-colors">
                        <span className="text-2xl font-black text-[#334155] flex-shrink-0 w-8">0{i+1}</span>
                        <a href={`/advisory/${a.id}`} className="text-[#cbd5e1] font-bold text-sm no-underline flex-1 hover:text-[#10b981] transition-colors">{a.title}</a>
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold flex-shrink-0 text-white" style={{background:tc.bg}}>{a.tag}</span>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="mx-8 mb-8 pt-6 border-t border-[#334155] flex flex-wrap gap-3 items-center justify-center text-xs text-[#94a3b8]">
            <a href="#privacy" className="no-underline font-semibold hover:text-[#10b981] transition-colors">Privacy Policy</a>
            <span className="w-1 h-1 rounded-full bg-[#334155]" />
            <a href="#terms" className="no-underline font-semibold hover:text-[#10b981] transition-colors">Terms of Service</a>
            <span className="w-1 h-1 rounded-full bg-[#334155]" />
            <a href="#support" className="no-underline font-semibold hover:text-[#10b981] transition-colors">Support</a>
            <span className="w-1 h-1 rounded-full bg-[#334155]" />
            <span className="font-semibold">© 2024 AgriPlatform. All rights reserved.</span>
          </footer>
        </main>
      </div>

      {/* Logout Modal */}
      {showLogout && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center" onClick={() => setShowLogout(false)}>
          <div className="bg-[#1a243a] border border-[#334155] rounded-2xl p-8 max-w-sm w-11/12 shadow-2xl text-center" onClick={e => e.stopPropagation()}>
            <div className="text-5xl mb-3">🚪</div>
            <h3 className="text-2xl font-black text-white mb-2">Sign out?</h3>
            <p className="text-[#cbd5e1] text-sm mb-8 leading-relaxed">{t.confirmLogout}</p>
            <div className="flex gap-3 justify-center">
              <button
                className="px-6 py-2.5 rounded-lg text-sm font-extrabold cursor-pointer bg-[#ef4444] text-white hover:bg-[#dc2626] transform hover:-translate-y-0.5 transition-all shadow-lg"
                onClick={() => { logout(); setShowLogout(false); }}
              >
                {t.yes}
              </button>
              <button
                className="px-6 py-2.5 rounded-lg text-sm font-bold cursor-pointer bg-[#1a243a] text-[#cbd5e1] border border-[#334155] hover:bg-[#233049] hover:text-white transition-all"
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