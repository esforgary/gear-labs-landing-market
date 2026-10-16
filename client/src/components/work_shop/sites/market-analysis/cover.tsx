import { useId } from "react";
import "./market-analysis.scss";

export function MarketAnalysisCover() {
  const gradient = useId();
  return <div className="market-analysis-cover" aria-hidden="true">
    <svg viewBox="0 0 760 430" fill="none">
      <defs><linearGradient id={gradient} x1="232" y1="170" x2="660" y2="390" gradientUnits="userSpaceOnUse"><stop stopColor="#1b756f"/><stop offset="1" stopColor="#413264"/></linearGradient></defs>
      <rect width="760" height="430" rx="20" fill="#0c1119"/>
      <path d="M155 0v430" stroke="#27313e"/>
      <rect x="18" y="24" width="28" height="28" rx="9" fill="#98e4c4"/>
      <path d="m24 42 6-12 6 9 5-8" stroke="#12362f" strokeWidth="3"/>
      <text x="55" y="44" fill="#f0f5fb" fontSize="22" fontWeight="600">Meridian</text>
      <text x="21" y="87" fill="#63778d" fontSize="10" letterSpacing="1.3">WORKSPACE</text>
      {["Обзор рынков", "Акции", "Валюты", "Новости", "Избранное"].map((label, i) => <g key={label}>
        {i === 0 && <rect x="12" y="102" width="130" height="32" rx="8" fill="#213c35"/>}
        <rect x="23" y={113 + i * 42} width="11" height="11" rx="3" stroke={i ? "#708398" : "#99e7c5"}/>
        <text x="43" y={122 + i * 42} fill={i ? "#8a9cae" : "#a3ebca"} fontSize="12">{label}</text>
      </g>)}
      <rect x="18" y="362" width="118" height="40" rx="10" fill="#19222f"/>
      <text x="36" y="387" fill="#9aafc5" fontSize="11">● Свет / Тень</text>
      <text x="185" y="42" fill="#91a4b8" fontSize="11">Глобальный рынок / Обзор</text>
      <circle cx="715" cy="36" r="12" fill="#26343f"/>
      <text x="185" y="86" fill="#f0f5fb" fontSize="27" fontWeight="600">Мировые рынки</text>
      <text x="186" y="107" fill="#8296ab" fontSize="11">Активы, валюты и новости — в одном терминале</text>
      {[{x:185,a:"EUR / USD",b:"1.1648",c:"+0.24%"},{x:369,a:"GBP / USD",b:"1.3421",c:"+0.18%"},{x:553,a:"USD / JPY",b:"147.32",c:"−0.32%"}].map(card=><g key={card.a}>
        <rect x={card.x} y="130" width="166" height="74" rx="12" fill="#17212c" stroke="#293544"/>
        <text x={card.x+14} y="152" fill="#91a6bc" fontSize="10">{card.a}</text>
        <text x={card.x+14} y="182" fill="#e8eef6" fontSize="22" fontWeight="600">{card.b}</text>
        <text x={card.x+111} y="180" fill="#91e3be" fontSize="10">{card.c}</text>
      </g>)}
      <rect x="185" y="224" width="346" height="181" rx="15" fill={`url(#${gradient})`}/>
      <text x="204" y="249" fill="#a9e6ce" fontSize="10" letterSpacing="1">НОВОСТНОЙ РАДАР</text>
      <text x="204" y="278" fill="#f0f5fb" fontSize="23" fontWeight="600">Пульс рынка</text>
      <text x="204" y="298" fill="#bfced6" fontSize="11">События, источники и рыночные сигналы</text>
      <path d="m205 370 31-12 23 9 29-28 29 12 24-30 23 11 26-20 29 12 31-29 29 8" stroke="#9aefd2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="549" y="224" width="170" height="181" rx="15" fill="#17212c" stroke="#293544"/>
      <text x="565" y="250" fill="#cdd8e5" fontSize="12">Активы в фокусе</text>
      {["AAPL", "NVDA", "MSFT", "GOOGL"].map((ticker,i)=><g key={ticker}><circle cx="574" cy={278+i*33} r="9" fill={i%2 ? "#3b4c73":"#244f49"}/><text x="591" y={282+i*33} fill="#c4d1e0" fontSize="10">{ticker}</text><path d={`m664 ${281+i*33} 9-6 7 3 15-8`} stroke="#91e3be" strokeWidth="2"/></g>)}
    </svg>
  </div>;
}
