import type { ReactNode } from "react";
import { Avatar, CopyLines, Landscape, blue, ink, muted, orange, paper, soft } from "./primitives";

function Button({ x, y, width = 40, label = "Start", color = orange }: { x: number; y: number; width?: number; label?: string; color?: string }) {
  return <g><rect x={x} y={y} width={width} height="13" rx="4" fill={color} /><text x={x + width / 2} y={y + 9} textAnchor="middle" fontSize="7" fontWeight="700" fill={color === blue ? paper : ink}>{label}</text></g>;
}

function Pin({ x, y, color = orange }: { x: number; y: number; color?: string }) {
  return <g transform={`translate(${x} ${y})`}><path d="M0 9C-2 6-7 2-7-2a7 7 0 0 1 14 0C7 2 2 6 0 9Z" fill={color} stroke={paper} strokeWidth="1.5" /><circle cy="-2" r="2" fill={paper} /></g>;
}

function StreetMap({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  return <svg x={x} y={y} width={width} height={height} viewBox="0 0 100 80" preserveAspectRatio="none">
    <path d="M0 0h100v80H0Z" fill={soft} />
    <path d="M66-5Q39 20 65 41T55 85" fill="none" stroke={blue} strokeWidth="13" opacity=".3" />
    <path d="M-5 18 105 57M20-5 43 85M-5 64 105 10M85-5 72 85" fill="none" stroke={paper} strokeWidth="6" />
    <path d="m3 31 16 6-6 14-13-4ZM83 60l16 5v15H78Z" fill={blue} opacity=".13" />
    <path d="M7 9h15m54 57h14" stroke={muted} strokeWidth="2" opacity=".35" />
  </svg>;
}

function Product({ index, x, y }: { index: number; x: number; y: number }) {
  const color = index % 2 ? orange : blue;
  const shapes = [
    <g key="laptop"><rect x="5" y="2" width="22" height="15" rx="2" fill={ink} /><rect x="7" y="4" width="18" height="11" fill={color} /><path d="M1 20h30l-3 3H4Z" fill={muted} /></g>,
    <g key="headphones"><path d="M7 15V10a9 9 0 0 1 18 0v5" fill="none" stroke={ink} strokeWidth="3" /><rect x="4" y="12" width="6" height="11" rx="3" fill={color} /><rect x="22" y="12" width="6" height="11" rx="3" fill={color} /></g>,
    <g key="phone"><rect x="10" width="14" height="25" rx="3" fill={ink} /><rect x="12" y="3" width="10" height="18" rx="1" fill={color} /><circle cx="17" cy="23" r="1" fill={paper} /></g>,
    <g key="camera"><rect x="3" y="6" width="27" height="18" rx="3" fill={ink} /><path d="m10 6 2-4h8l2 4Z" fill={muted} /><circle cx="17" cy="15" r="7" fill={color} /><circle cx="17" cy="15" r="3.5" fill={ink} /><circle cx="27" cy="9" r="1" fill={paper} /></g>,
    <g key="watch"><path d="M12 0h10v25H12Z" fill={color} /><rect x="9" y="5" width="16" height="15" rx="5" fill={ink} /><path d="M17 8v5l4 2" stroke={paper} strokeWidth="1.5" fill="none" /></g>,
    <g key="keyboard"><rect x="1" y="7" width="31" height="16" rx="3" fill={muted} /><path d="M5 11h23M5 15h23M10 19h13" stroke={paper} strokeWidth="2" strokeDasharray="3 1" /></g>,
  ];
  return <g transform={`translate(${x} ${y})`}>{shapes[index % shapes.length]}</g>;
}

function Socials({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <circle cx="5" cy="5" r="5" fill={blue} /><path d="m2 5 6-2-2 5-1-2Z" fill={paper} />
    <rect x="15" width="10" height="10" rx="3" fill={orange} /><circle cx="20" cy="5" r="2.4" fill="none" stroke={ink} strokeWidth="1" />
    <rect x="30" width="10" height="10" rx="3" fill={ink} /><path d="m34 3 4 2-4 2Z" fill={paper} />
  </g>;
}

export function structureScene(key: string, id: string): ReactNode {
  switch (key) {
    case "header-logo":
      return <>
        <rect x="6" y="10" width="140" height="29" rx="4" fill={paper} stroke={soft} />
        <path d="m14 24 6-7 6 7-6 7Z" fill={orange} />
        <text x="30" y="27" fontSize="9" fontWeight="800">Brand</text>
        <path d="M65 24h12m5 0h12m5 0h10" stroke={muted} strokeWidth="2.5" />
        <Button x={118} y={18} width={21} label="Go" color={blue} />
        <text x="13" y="61" fontSize="13" fontWeight="800">Ideas live.</text>
        <CopyLines x={13} y={72} width={62} />
        <Button x={13} y={87} width={40} />
        <Landscape x={89} y={55} width={48} height={43} />
      </>;
    case "header-store":
      return <>
        <rect x="5" y="9" width="142" height="38" rx="4" fill={paper} stroke={soft} />
        <text x="12" y="25" fontSize="12" fontWeight="800">Shop.</text>
        <rect x="51" y="15" width="66" height="15" rx="5" fill={soft} />
        <circle cx="58" cy="21" r="3" fill="none" stroke={muted} strokeWidth="1.2" /><path d="m60 23 3 3M69 22h32" stroke={muted} strokeWidth="1.2" />
        <path d="M123 17h3l2 10h9l2-7h-12" fill="none" stroke={blue} strokeWidth="1.8" /><circle cx="130" cy="31" r="1.5" fill={blue} /><circle cx="136" cy="31" r="1.5" fill={blue} />
        <path d="M13 39h21m9 0h18m9 0h22m9 0h19" stroke={muted} strokeWidth="2" />
        <text x="12" y="64" fontSize="10" fontWeight="700">New arrivals</text>
        {[11, 57, 103].map((x, index) => <g key={x}><rect x={x} y="71" width="38" height="31" rx="4" fill={soft} /><Product index={index} x={x + 3} y={75} /></g>)}
      </>;
    case "hero-majestic":
      return <>
        <text x="11" y="21" fontSize="7" fill={blue} fontWeight="700">YOUR NEW WORLD</text>
        <text x="11" y="43" fontSize="18" fontWeight="800">Your</text>
        <text x="11" y="62" fontSize="18" fontWeight="800">city.</text>
        <CopyLines x={11} y={72} width={45} />
        <Button x={11} y={88} width={45} label="Launch →" />
        <circle cx="112" cy="35" r="19" fill={orange} opacity=".3" />
        <path d="M70 90V58h15V41h18V25h17v27h20v38Z" fill={blue} opacity=".25" />
        <path d="M77 95V66h17V48h18v47m8 0V59h19v36" fill={blue} />
        <path d="M99 54h8m-8 7h8m-8 7h8m-25 4h6m-6 7h6m37-13h8m-8 7h8" stroke={paper} strokeWidth="2" opacity=".75" />
        <path d="M71 99h73" stroke={ink} strokeWidth="2" />
        {[80, 90].map(y => <g key={y}><rect x="96" y={y} width="39" height="8" rx="2" fill={ink} /><circle cx="102" cy={y + 4} r="1.5" fill={orange} /><path d={`M109 ${y + 4}h20`} stroke={paper} strokeWidth="1.5" opacity=".6" /></g>)}
      </>;
    case "hero-majestic-strip":
      return <>
        <text x="9" y="18" fontSize="9" fontWeight="800">Explore the collection</text>
        {[9, 26, 43, 60, 103, 120, 137].map((x, index) => <g key={x}>
          <rect x={x} y="27" width={index === 3 ? 40 : 14} height="74" rx="3" fill={index === 3 ? blue : soft} />
          {index === 3 ? <>
            <circle cx="87" cy="43" r="7" fill={orange} />
            <path d="m61 84 17-29 20 38H61Z" fill={paper} opacity=".65" />
            <path d="m70 91 17-19 11 19Z" fill={ink} opacity=".4" />
            <text x="65" y="97" fontSize="7" fill={paper} fontWeight="700">Discover</text>
          </> : <>
            <circle cx={x + 7} cy={40 + index % 3 * 5} r="4" fill={muted} opacity=".6" />
            <path d={`M${x + 2} 89V${65 - index % 3 * 8}l5-6 5 6v24Z`} fill={ink} opacity={.2 + index % 3 * .1} />
          </>}
        </g>)}
      </>;
    case "cards-services":
      return <>
        <text x="11" y="24" fontSize="13" fontWeight="800">What we do</text>
        {["Design", "Build", "Grow"].map((label, index) => <g key={label} transform={`translate(${10 + index * 45} 37)`}>
          <rect width="41" height="65" rx="5" fill={paper} stroke={soft} />
          <rect x="6" y="7" width="19" height="19" rx="5" fill={index === 1 ? blue : orange} opacity=".2" />
          <path d={index === 0 ? "m10 21 1-5 8-8 4 4-8 8Z" : index === 1 ? "m13 12-4 5 4 4m7-9 4 5-4 4m-2-10-3 13" : "M10 22v-4m6 4V12m6 10V8"} fill="none" stroke={index === 1 ? blue : orange} strokeWidth="2" strokeLinejoin="round" />
          <text x="6" y="39" fontSize="8" fontWeight="700">{label}</text>
          <CopyLines x={6} y={48} width={28} />
          <path d="M6 59h14" stroke={blue} strokeWidth="2" />
        </g>)}
      </>;
    case "cards-metrics":
      return <>
        <text x="11" y="22" fontSize="12" fontWeight="800">Results in numbers</text>
        {["98%", "24h", "4.9", "12k"].map((value, index) => <g key={value} transform={`translate(${10 + index % 2 * 68} ${31 + Math.floor(index / 2) * 38})`}>
          <rect width="63" height="33" rx="5" fill={paper} stroke={soft} />
          <text x="7" y="18" fontSize="17" fontWeight="800" fill={index % 2 ? orange : blue}>{value}</text>
          <text x="7" y="27" fontSize="6" fill={muted}>{["Success rate", "Fast response", "Client rating", "Happy clients"][index]}</text>
          <path d="m46 18 4-5 4 2 4-7" stroke={index % 2 ? orange : blue} strokeWidth="1.5" fill="none" />
        </g>)}
      </>;
    case "cards-process":
      return <>
        <text x="11" y="24" fontSize="13" fontWeight="800">From idea to launch</text>
        <path d="M30 49h94" stroke={blue} strokeWidth="2" strokeDasharray="3 3" />
        {["Brief", "Design", "Launch"].map((label, index) => <g key={label} transform={`translate(${11 + index * 46} 0)`}>
          <circle cx="18" cy="49" r="12" fill={index === 2 ? orange : blue} />
          <text x="18" y="53" textAnchor="middle" fontSize="10" fontWeight="800" fill={index === 2 ? ink : paper}>0{index + 1}</text>
          <text x="0" y="77" fontSize="9" fontWeight="700">{label}</text>
          <CopyLines x={0} y={87} width={34} />
          <path d="M0 101h17" stroke={soft} strokeWidth="3" />
        </g>)}
      </>;
    case "cards-tabs":
      return <>
        <text x="11" y="22" fontSize="13" fontWeight="800">Built for your team</text>
        {["Design", "Speed", "Support"].map((label, index) => <g key={label}>
          <rect x={10 + index * 45} y="31" width="42" height="15" rx="4" fill={index === 0 ? blue : soft} />
          <text x={31 + index * 45} y="41" textAnchor="middle" fontSize="7" fontWeight="700" fill={index === 0 ? paper : muted}>{label}</text>
        </g>)}
        <text x="12" y="64" fontSize="10" fontWeight="700">One workspace.</text>
        <CopyLines x={12} y={74} width={61} />
        <Button x={12} y={88} width={40} label="Explore" />
        <rect x="87" y="56" width="54" height="45" rx="5" fill={paper} stroke={soft} />
        <path d="M92 65h44" stroke={soft} strokeWidth="2" />
        <rect x="93" y="72" width="16" height="20" rx="3" fill={blue} opacity=".2" />
        <path d="m97 81 3 3 5-7" fill="none" stroke={blue} strokeWidth="2" />
        <path d="M115 74h19m-19 6h15m-15 6h19m-19 6h10" stroke={muted} strokeWidth="2" opacity=".55" />
      </>;
    case "form-compact":
      return <>
        <rect x="30" y="7" width="92" height="98" rx="8" fill={paper} stroke={soft} />
        <circle cx="76" cy="20" r="6" fill={blue} /><path d="m73 20 2 2 4-4" stroke={paper} strokeWidth="1.5" fill="none" />
        <text x="76" y="37" textAnchor="middle" fontSize="12" fontWeight="800">Welcome back</text>
        {["Email address", "••••••••"].map((label, index) => <g key={label}><rect x="39" y={44 + index * 20} width="74" height="16" rx="4" fill={soft} /><text x="45" y={55 + index * 20} fontSize="7" fill={muted}>{label}</text></g>)}
        <Button x={39} y={84} width={74} label="Sign in →" />
      </>;
    case "form-split":
      return <>
        <rect x="8" y="10" width="60" height="92" rx="7" fill={blue} />
        <text x="16" y="30" fontSize="10" fontWeight="800" fill={paper}>Your voice</text>
        <text x="16" y="43" fontSize="12" fontWeight="800" fill={paper}>matters.</text>
        <text x="16" y="61" fontSize="8" fill={orange}>★★★★★</text>
        <Avatar x={16} y={75} size={17} color={paper} />
        <path d="M38 80h22m-22 6h15" stroke={paper} strokeWidth="2" opacity=".65" />
        <text x="77" y="24" fontSize="10" fontWeight="700">Leave a review</text>
        <text x="77" y="38" fontSize="10" fill={orange}>★★★★★</text>
        <rect x="77" y="45" width="66" height="29" rx="4" fill={soft} /><path d="M82 52h45m-45 5h36" stroke={muted} strokeWidth="1.5" opacity=".5" />
        <rect x="77" y="78" width="66" height="10" rx="3" fill={soft} /><text x="82" y="85" fontSize="6" fill={muted}>Your email</text>
        <Button x={77} y={93} width={66} label="Send review" />
      </>;
    case "map-contact":
      return <>
        <text x="10" y="24" fontSize="13" fontWeight="800">Come say hello</text>
        <StreetMap x={65} y={34} width={78} height={69} />
        <Pin x={107} y={63} />
        <rect x="85" y="82" width="47" height="13" rx="4" fill={paper} /><text x="108" y="91" textAnchor="middle" fontSize="7" fontWeight="700">Our studio</text>
        <text x="10" y="46" fontSize="8" fontWeight="700">GearLabs</text>
        <CopyLines x={10} y={56} width={42} />
        <path d="M10 74h32m-32 6h40" stroke={muted} strokeWidth="2" opacity=".6" />
        <Button x={10} y={91} width={43} label="Directions" />
      </>;
    case "map-points":
      return <>
        <text x="10" y="21" fontSize="12" fontWeight="800">Pick-up locations</text>
        <StreetMap x={8} y={29} width={136} height={73} />
        <Pin x={41} y={60} color={blue} /><Pin x={109} y={49} /><Pin x={85} y={85} color={blue} />
        <rect x="13" y="81" width="52" height="16" rx="4" fill={paper} /><circle cx="21" cy="89" r="3" fill={orange} /><text x="28" y="92" fontSize="7" fontWeight="700">3 locations</text>
        <rect x="131" y="76" width="9" height="21" rx="2" fill={paper} /><path d="M133 82h5m-2.5-2.5v5m-2.5 7h5" stroke={ink} strokeWidth="1" />
      </>;
    case "catalog-grid":
    case "catalog-feature":
      return <>
        <text x="10" y="16" fontSize="11" fontWeight="800">{key === "catalog-grid" ? "The collection" : "Find your next favorite"}</text>
        {Array.from({ length: 6 }, (_, index) => <g key={index} transform={`translate(${10 + index % 3 * 45} ${23 + Math.floor(index / 3) * 35})`}>
          <rect width="41" height="32" rx="4" fill={paper} stroke={soft} />
          <rect x="2" y="2" width="37" height="20" rx="3" fill={soft} />
          <g transform="translate(8 3) scale(.72)"><Product index={index} x={0} y={0} /></g>
          <text x="4" y="29" fontSize="6" fontWeight="700">${[1290, 260, 780, 540, 310, 140][index]}</text>
          <rect x="29" y="25" width="8" height="5" rx="2" fill={orange} />
        </g>)}
        {key === "catalog-grid" ? <>
          {["‹", "1", "2", "3", "›"].map((value, index) => <g key={index}><rect x={42 + index * 14} y="97" width="11" height="11" rx="3" fill={index === 1 ? blue : soft} /><text x={47.5 + index * 14} y="105" textAnchor="middle" fontSize="7" fill={index === 1 ? paper : muted}>{value}</text></g>)}
        </> : <Button x={43} y={96} width={66} label="Load more ↓" />}
      </>;
    case "pricing-classic":
      return <>
        <text x="76" y="20" textAnchor="middle" fontSize="13" fontWeight="800">A plan for everyone</text>
        {["Basic", "Pro", "Max"].map((label, index) => <g key={label} transform={`translate(${9 + index * 46} 31)`}>
          <rect width="42" height="73" rx="5" fill={paper} stroke={index === 1 ? blue : soft} strokeWidth={index === 1 ? 2 : 1} />
          <text x="7" y="15" fontSize="8" fontWeight="700" fill={index === 1 ? blue : ink}>{label}</text>
          <text x="7" y="32" fontSize="16" fontWeight="800">${[9, 29, 59][index]}</text>
          {[42, 49, 56].map(y => <g key={y}><path d={`m6 ${y - 1} 2 2 3-4`} fill="none" stroke={blue} strokeWidth="1.4" /><path d={`M15 ${y}h19`} stroke={muted} strokeWidth="1.5" opacity=".55" /></g>)}
          <rect x="6" y="62" width="30" height="7" rx="3" fill={index === 1 ? blue : orange} />
        </g>)}
      </>;
    case "pricing-focus":
      return <>
        <rect width="152" height="112" fill={ink} />
        <ellipse cx="39" cy="63" rx="78" ry="69" fill={`url(#${id}-glow)`} opacity=".4" />
        <text x="12" y="31" fontSize="16" fontWeight="800" fill={paper}>Go Pro.</text>
        <text x="12" y="49" fontSize="7" fill={paper}>More possibilities.</text>
        <path d="M12 60h49m-49 6h37" stroke={paper} strokeWidth="2" opacity=".45" />
        <text x="12" y="91" fontSize="8" fill={orange}>Cancel anytime</text>
        <rect x="79" y="11" width="63" height="92" rx="7" fill={paper} />
        <rect x="87" y="18" width="47" height="12" rx="4" fill={orange} /><text x="110" y="26" textAnchor="middle" fontSize="6" fontWeight="700">MOST POPULAR</text>
        <text x="88" y="48" fontSize="21" fontWeight="800">$29</text><text x="125" y="48" fontSize="7" fill={muted}>/mo</text>
        {[60, 69, 78].map(y => <g key={y}><path d={`m88 ${y} 2 2 4-5`} stroke={blue} strokeWidth="1.5" fill="none" /><path d={`M100 ${y}h30`} stroke={muted} strokeWidth="2" opacity=".6" /></g>)}
        <Button x={87} y={85} width={47} label="Choose Pro" color={blue} />
      </>;
    case "faq-simple":
      return <>
        <text x="11" y="24" fontSize="13" fontWeight="800">Questions? Answers.</text>
        {["How long does it take?", "Can I customize it?", "What is included?"].map((label, index) => <g key={label}>
          <rect x="10" y={35 + (index ? index * 23 + 10 : 0)} width="132" height={index ? 19 : 28} rx="4" fill={index ? paper : soft} stroke={soft} />
          <text x="17" y={47 + (index ? index * 23 + 10 : 0)} fontSize="8" fontWeight="700">{label}</text>
          <path d={`M129 ${44 + (index ? index * 23 + 10 : 0)}h6${index ? "m-3-3v6" : ""}`} stroke={blue} strokeWidth="1.5" />
          {!index && <path d="M17 56h99" stroke={muted} strokeWidth="1.5" opacity=".55" />}
        </g>)}
      </>;
    case "faq-split":
      return <>
        <rect x="9" y="13" width="56" height="88" rx="6" fill={blue} />
        <circle cx="25" cy="29" r="9" fill={paper} opacity=".2" /><text x="25" y="33" textAnchor="middle" fontSize="12" fontWeight="800" fill={paper}>?</text>
        <text x="17" y="51" fontSize="11" fontWeight="800" fill={paper}>Need</text><text x="17" y="64" fontSize="11" fontWeight="800" fill={paper}>a hand?</text>
        <Button x={16} y={80} width={42} label="Ask us →" />
        {["How to start?", "Your timeline?", "Can I edit?"].map((label, index) => <g key={label}>
          <text x="74" y={28 + index * 29} fontSize="8" fontWeight="700">{label}</text>
          <path d={`M134 ${25 + index * 29}h6${index ? "m-3-3v6" : ""}`} stroke={blue} strokeWidth="1.5" />
          <path d={`M73 ${48 + index * 25}h69`} stroke={soft} />
          {!index && <CopyLines x={74} y={37} width={57} />}
        </g>)}
      </>;
    case "footer-compact":
      return <>
        <Landscape x={11} y={11} width={44} height={32} />
        <text x="65" y="23" fontSize="10" fontWeight="700">Made for you.</text><CopyLines x={65} y={33} width={63} />
        <path d="M9 55h134" stroke={soft} strokeWidth="2" />
        <text x="11" y="76" fontSize="14" fontWeight="800">Brand.</text>
        <path d="M72 72h17m6 0h17m6 0h21" stroke={muted} strokeWidth="2.5" />
        <text x="11" y="97" fontSize="7" fill={muted}>© 2026 Brand</text><Socials x={100} y={87} />
      </>;
    case "footer-columns":
      return <>
        <path d="M9 17h134" stroke={soft} strokeWidth="2" />
        <text x="11" y="39" fontSize="14" fontWeight="800">Brand.</text><CopyLines x={11} y={51} width={44} />
        {["Explore", "Contact"].map((label, index) => <g key={label} transform={`translate(${72 + index * 39} 0)`}>
          <text y="37" fontSize="8" fontWeight="700">{label}</text>
          <path d="M0 49h26m-26 9h22m-22 9h26m-26 9h18" stroke={muted} strokeWidth="2" opacity=".6" />
        </g>)}
        <Socials x={11} y={69} />
        <path d="M11 89h130" stroke={soft} />
        <text x="11" y="102" fontSize="6" fill={muted}>© 2026 Brand</text><text x="102" y="102" fontSize="6" fill={muted}>Privacy · Terms</text>
      </>;
    case "footer-cta":
      return <>
        <rect x="8" y="8" width="136" height="44" rx="6" fill={blue} />
        <text x="17" y="27" fontSize="13" fontWeight="800" fill={paper}>Let's build</text><text x="17" y="42" fontSize="13" fontWeight="800" fill={paper}>something.</text>
        <Button x={99} y={24} width={36} label="Let's talk" />
        <text x="11" y="70" fontSize="12" fontWeight="800">Brand.</text>
        <text x="11" y="82" fontSize="6" fill={muted}>hello@brand.studio</text>
        {[81, 115].map(x => <g key={x}><path d={`M${x} 64h23`} stroke={ink} strokeWidth="2.5" /><path d={`M${x} 72h23m-23 7h18m-18 7h21`} stroke={muted} strokeWidth="2" opacity=".5" /></g>)}
        <Socials x={11} y={93} /><text x="92" y="103" fontSize="6" fill={muted}>© 2026 Brand</text>
      </>;
    default:
      return null;
  }
}
