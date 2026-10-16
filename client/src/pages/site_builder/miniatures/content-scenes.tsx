import type { ReactNode } from "react";
import { Avatar, CopyLines, Landscape, blue, ink, muted, orange, paper, soft } from "./primitives";

function ChartHeading() {
  return <>
    <text x="13" y="22" fontSize="12" fontWeight="750">Growth</text>
    <text x="137" y="21" fontSize="8" textAnchor="end" fill={blue}>+24%</text>
    <path d="M13 29h60" stroke={muted} strokeWidth="2" opacity=".4" />
  </>;
}

function EffectCopy() {
  return <g fill={paper}>
    <text x="76" y="44" textAnchor="middle" fontSize="8" letterSpacing="2">STUDIO</text>
    <text x="76" y="62" textAnchor="middle" fontSize="17" fontWeight="800">Make it move.</text>
    <rect x="56" y="74" width="40" height="12" rx="6" />
    <path d="M69 80h14m-3-3 3 3-3 3" fill="none" stroke={ink} strokeWidth="1.5" />
  </g>;
}

export function contentScene(key: string, id: string): ReactNode {
  switch (key) {
    case "reviews-row":
      return <>
        <text x="12" y="22" fontSize="12" fontWeight="750">People say</text>
        {[-29, 35, 99].map((x, index) => <g key={x}>
          <rect x={x} y="34" width="59" height="64" rx="6" fill={paper} stroke={soft} />
          <text x={x + 7} y="48" fontSize="8" fill={orange}>★★★★★</text>
          <CopyLines x={x + 7} y={59} width={44} />
          <path d={`M${x + 7} 69h30`} stroke={muted} strokeWidth="2" opacity=".5" />
          <Avatar x={x + 7} y={78} size={12} color={index === 1 ? orange : blue} />
          <path d={`M${x + 24} 84h25`} stroke={ink} strokeWidth="2.5" />
        </g>)}
      </>;
    case "reviews-slider":
      return <>
        <rect x="10" y="12" width="132" height="80" rx="8" fill={paper} stroke={soft} />
        <rect x="16" y="18" width="39" height="67" rx="5" fill={blue} opacity=".12" />
        <Avatar x={19} y={29} size={33} />
        <path d="M22 74h26m-22 5h18" stroke={blue} strokeWidth="2" opacity=".5" />
        <text x="65" y="32" fontSize="9" fill={orange}>★★★★★</text>
        <text x="64" y="48" fontSize="12" fontWeight="750">Great work.</text>
        <CopyLines x={65} y={57} width={64} />
        <path d="M65 76h36" stroke={ink} strokeWidth="3" />
        <path d="m15 99-3 3 3 3m122-6 3 3-3 3" stroke={ink} strokeWidth="1.8" fill="none" />
        <rect x="63" y="100" width="12" height="4" rx="2" fill={orange} />
        <circle cx="82" cy="102" r="2" fill={soft} /><circle cx="91" cy="102" r="2" fill={soft} />
      </>;
    case "marquee-light":
      return <>
        <text x="13" y="30" fontSize="16" fontWeight="800">Always moving.</text>
        <CopyLines x={13} y={41} width={82} />
        <path d="M0 59h152M0 91h152" stroke={orange} strokeWidth="1.5" opacity=".5" />
        <rect y="60" width="152" height="30" fill={orange} opacity=".1" />
        {[-25, 45, 115].map((x, index) => <g key={x}>
          <circle cx={x} cy="75" r="3" fill={orange} />
          <text x={x + 9} y="78" fontSize="9" fontWeight="700">{["DESIGN", "BUILD", "LAUNCH"][index]}</text>
        </g>)}
        <path d="M60 101h31m-4-3 4 3-4 3" stroke={blue} strokeWidth="1.5" fill="none" />
      </>;
    case "marquee-card":
      return <>
        <rect x="22" y="11" width="111" height="79" rx="7" fill={soft} />
        <rect x="17" y="16" width="115" height="79" rx="7" fill={paper} stroke={soft} />
        <rect x="10" y="22" width="121" height="78" rx="7" fill={paper} stroke={blue} strokeOpacity=".35" />
        <text x="20" y="40" fontSize="10" fontWeight="750" fill={blue}>01</text>
        <rect x="82" y="31" width="39" height="12" rx="6" fill={orange} opacity=".18" />
        <text x="101" y="39" fontSize="6" textAnchor="middle" fontWeight="700">LIVE UPDATE</text>
        <text x="20" y="61" fontSize="14" fontWeight="800">What's new?</text>
        <CopyLines x={20} y={71} width={88} />
        <rect x="20" y="88" width="13" height="3" rx="1.5" fill={blue} />
        <circle cx="40" cy="89.5" r="1.5" fill={soft} /><circle cx="47" cy="89.5" r="1.5" fill={soft} />
        <path d="m116 86 3 3-3 3" stroke={ink} strokeWidth="1.5" fill="none" />
      </>;
    case "marquee-typing":
      return <>
        <text x="13" y="31" fontSize="10" fontWeight="700" fill={muted}>WE HELP YOU</text>
        <text x="12" y="59" fontSize="23" fontWeight="800">Create.</text>
        <path d="M99 38v25" stroke={orange} strokeWidth="3" />
        <path d="M13 68h115" stroke={soft} />
        <text x="13" y="86" fontSize="10" fill={blue}>Design</text>
        <text x="62" y="86" fontSize="10" fill={muted} opacity=".6">Build</text>
        <text x="99" y="86" fontSize="10" fill={muted} opacity=".6">Grow</text>
        <path d="M13 93h33" stroke={orange} strokeWidth="2" />
      </>;
    case "progress-bars":
      return <>
        <text x="13" y="22" fontSize="13" fontWeight="750">Our skills</text>
        {[{ label: "Design", value: 90 }, { label: "Development", value: 75 }, { label: "Strategy", value: 60 }].map(({ label, value }, index) => <g key={label}>
          <text x="13" y={39 + index * 27} fontSize="8" fontWeight="650">{label}</text>
          <text x="139" y={39 + index * 27} textAnchor="end" fontSize="8" fill={blue}>{value}%</text>
          <rect x="13" y={45 + index * 27} width="126" height="6" rx="3" fill={soft} />
          <rect x="13" y={45 + index * 27} width={value * 1.26} height="6" rx="3" fill={index === 1 ? orange : blue} />
        </g>)}
      </>;
    case "progress-circle":
      return <>
        <text x="13" y="24" fontSize="13" fontWeight="750">Our expertise</text>
        {[90, 75, 60].map((value, index) => <g key={value} transform={`translate(${29 + index * 47} 62)`}>
          <circle r="18" fill="none" stroke={soft} strokeWidth="5" />
          <circle r="18" fill="none" stroke={index === 1 ? orange : blue} strokeWidth="5" pathLength="100" strokeDasharray={`${value} 100`} strokeLinecap="round" transform="rotate(-90)" />
          <text y="4" textAnchor="middle" fontSize="12" fontWeight="750">{value}<tspan fontSize="6">%</tspan></text>
          <text y="36" textAnchor="middle" fontSize="7" fill={muted}>{["DESIGN", "CODE", "STRATEGY"][index]}</text>
        </g>)}
      </>;
    case "stats-line":
      return <>
        <ChartHeading />
        <path d="M21 43h116M21 61h116M21 79h116M21 96h116" stroke={soft} />
        <path d="M21 43v53h116" stroke={muted} strokeWidth="1" opacity=".5" fill="none" />
        <path d="m24 86 28-14 27 5 28-30 27-7v56H24Z" fill={blue} opacity=".12" />
        <path d="m24 86 28-14 27 5 28-30 27-7" fill="none" stroke={blue} strokeWidth="3" strokeLinejoin="round" />
        {[[24, 86], [52, 72], [79, 77], [107, 47], [134, 40]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3" fill={paper} stroke={blue} strokeWidth="2" />)}
        {["JAN", "FEB", "MAR", "APR"].map((label, index) => <text key={label} x={23 + index * 33} y="107" fontSize="6" fill={muted}>{label}</text>)}
      </>;
    case "stats-bar":
      return <>
        <ChartHeading />
        <path d="M18 46h120M18 69h120M18 94h120" stroke={soft} />
        {[31, 46, 38, 58].map((height, index) => <g key={index}>
          <rect x={25 + index * 29} y={94 - height} width="15" height={height} rx="2" fill={index === 3 ? orange : blue} opacity={index === 3 ? 1 : .45 + index * .2} />
          <text x={32.5 + index * 29} y={88 - height} fontSize="7" textAnchor="middle" fill={muted}>{[45, 67, 55, 84][index]}</text>
          <text x={32.5 + index * 29} y="106" fontSize="6" textAnchor="middle" fill={muted}>Q{index + 1}</text>
        </g>)}
      </>;
    case "stats-pie":
      return <>
        <ChartHeading />
        <circle cx="46" cy="70" r="29" fill={blue} />
        <path d="M46 70V41a29 29 0 0 1 27.58 37.96Z" fill={orange} />
        <path d="m46 70 27.58 8.96A29 29 0 0 1 29 93.46Z" fill={soft} stroke={paper} />
        <path d="M46 41v29L29 93.46m17-23 27.58 8.96" fill="none" stroke={paper} strokeWidth="2" />
        {[{ label: "Design", value: "55%", color: blue }, { label: "Build", value: "30%", color: orange }, { label: "Other", value: "15%", color: muted }].map(({ label, value, color }, index) => <g key={label}>
          <rect x="87" y={46 + index * 20} width="6" height="6" rx="1.5" fill={color} />
          <text x="98" y={52 + index * 20} fontSize="7">{label}</text>
          <text x="98" y={60 + index * 20} fontSize="6" fill={muted}>{value}</text>
        </g>)}
      </>;
    case "article-nav":
      return <>
        <rect x="8" y="13" width="42" height="87" rx="4" fill={soft} opacity=".65" />
        <text x="14" y="27" fontSize="7" fontWeight="750">Contents</text>
        {[40, 56, 72, 88].map((y, index) => <g key={y}>
          <text x="14" y={y} fontSize="6" fill={index === 0 ? orange : muted}>0{index + 1}</text>
          <path d={`M25 ${y - 2}h18`} stroke={index === 0 ? orange : muted} strokeWidth="2" opacity=".7" />
        </g>)}
        <text x="59" y="27" fontSize="12" fontWeight="750">The story</text>
        <CopyLines x={59} y={38} width={79} />
        {[58, 83].map(y => <g key={y}>
          <path d={`M59 ${y}h49`} stroke={ink} strokeWidth="3" />
          <CopyLines x={59} y={y + 10} width={79} />
        </g>)}
      </>;
    case "article-image-flow":
      return <>
        <text x="12" y="24" fontSize="15" fontWeight="750">A new perspective</text>
        <Landscape x={12} y={35} width={58} height={41} />
        {[38, 50, 62].map(y => <CopyLines key={y} x={79} y={y} width={60} />)}
        <CopyLines x={12} y={85} width={127} />
        <CopyLines x={12} y={97} width={118} />
      </>;
    case "article-infobox":
      return <>
        <text x="12" y="25" fontSize="15" fontWeight="750">City guide</text>
        {[38, 51, 64, 77].map(y => <CopyLines key={y} x={12} y={y} width={67} />)}
        <rect x="88" y="14" width="53" height="83" rx="3" fill={paper} stroke={soft} />
        <Landscape x={92} y={18} width={45} height={31} />
        <rect x="92" y="54" width="45" height="10" fill={blue} opacity=".12" />
        {[59, 71, 83, 93].map(y => <g key={y}>
          <path d={`M93 ${y}h15m7 0h18`} stroke={y === 59 ? blue : muted} strokeWidth="2" opacity=".65" />
          {y !== 93 && <path d={`M92 ${y + 5}h45`} stroke={soft} />}
        </g>)}
        <path d="M12 100h126" stroke={muted} strokeWidth="2" opacity=".4" />
      </>;
    case "background-scroll-gradient":
      return <>
        <defs><linearGradient id={`${id}-scroll`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={blue} /><stop offset=".55" stopColor={ink} /><stop offset="1" stopColor={orange} /></linearGradient></defs>
        <rect width="152" height="112" fill={`url(#${id}-scroll)`} />
        <EffectCopy />
        <rect x="141" y="16" width="3" height="78" rx="1.5" fill={paper} opacity=".25" />
        <rect x="141" y="37" width="3" height="24" rx="1.5" fill={paper} />
        <path d="M132 82v12m-3-3 3 3 3-3" stroke={paper} strokeWidth="1.5" fill="none" />
      </>;
    case "background-scroll-orbs":
      return <>
        <rect width="152" height="112" fill={ink} />
        <circle cx="26" cy="24" r="65" fill={`url(#${id}-glow)`} />
        <circle cx="127" cy="90" r="68" fill={`url(#${id}-warm)`} />
        <circle cx="126" cy="16" r="26" fill={`url(#${id}-glow)`} />
        <EffectCopy />
      </>;
    case "background-edge-particles":
      return <>
        <rect width="152" height="112" fill={ink} />
        <ellipse cx="0" cy="50" rx="46" ry="80" fill={`url(#${id}-glow)`} />
        <ellipse cx="152" cy="50" rx="46" ry="80" fill={`url(#${id}-warm)`} />
        {[[8, 14], [21, 28], [9, 48], [30, 61], [15, 80], [25, 99], [139, 12], [127, 29], [144, 49], [131, 73], [144, 93], [117, 103]].map(([x, y], index) => <g key={index}>
          <circle cx={x} cy={y} r={index % 3 === 0 ? 2.5 : 1.5} fill={index < 6 ? blue : orange} />
          <path d={`M${x} ${y}l${index < 6 ? -8 : 8} ${index % 2 ? 9 : -9}`} stroke={index < 6 ? blue : orange} opacity=".35" />
        </g>)}
        <EffectCopy />
      </>;
    case "background-spark-stars":
      return <>
        <rect width="152" height="112" fill={ink} />
        <ellipse cx="76" cy="58" rx="75" ry="55" fill={`url(#${id}-glow)`} opacity=".5" />
        {[[19, 19, 6], [65, 14, 4], [132, 24, 8], [17, 72, 4], [117, 88, 5], [42, 99, 5]].map(([x, y, r], index) => <path key={index} d={`M${x} ${y - r}q0 ${r} ${r} ${r}q-${r} 0-${r} ${r}q0-${r}-${r}-${r}q${r} 0 ${r}-${r}Z`} fill={index % 2 ? orange : paper} />)}
        {[[40, 29], [100, 16], [141, 65], [80, 98], [7, 42], [138, 103]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="1.2" fill={paper} opacity=".7" />)}
        <EffectCopy />
      </>;
    case "background-spotlight-rings":
      return <>
        <rect width="152" height="112" fill={ink} />
        <ellipse cx="104" cy="28" rx="84" ry="65" fill={`url(#${id}-glow)`} />
        <ellipse cx="46" cy="96" rx="77" ry="57" fill={`url(#${id}-warm)`} opacity=".7" />
        {[35, 50, 66].map((r, index) => <ellipse key={r} cx="92" cy="52" rx={r} ry={r * .67} fill="none" stroke={index === 1 ? orange : blue} strokeWidth={index === 1 ? 2 : 1} opacity=".65" transform="rotate(-30 92 52)" />)}
        <circle cx="126" cy="13" r="3" fill={paper} />
        <EffectCopy />
      </>;
    case "gallery-mosaic":
      return <>
        <Landscape x={9} y={12} width={75} height={55} />
        <Landscape x={89} y={12} width={54} height={32} />
        <Landscape x={89} y={49} width={54} height={51} />
        <Landscape x={9} y={72} width={34} height={28} />
        <Landscape x={48} y={72} width={36} height={28} />
        <rect x="14" y="49" width="46" height="12" rx="3" fill={paper} opacity=".9" />
        <text x="19" y="57" fontSize="6" fontWeight="700">OUR PLACES</text>
      </>;
    case "team-cards":
      return <>
        <text x="12" y="22" fontSize="13" fontWeight="750">Meet the team</text>
        {[9, 56, 103].map((x, index) => <g key={x}>
          <rect x={x} y="33" width="40" height="70" rx="5" fill={paper} stroke={soft} />
          <rect x={x + 3} y="36" width="34" height="35" rx="3" fill={index === 1 ? orange : blue} opacity=".12" />
          <Avatar x={x + 7} y={42} size={26} color={index === 1 ? orange : blue} />
          <text x={x + 6} y="82" fontSize="8" fontWeight="700">{["Anna", "Alex", "Maya"][index]}</text>
          <text x={x + 6} y="92" fontSize="6" fill={muted}>{["Design", "Frontend", "Strategy"][index]}</text>
        </g>)}
      </>;
    case "team-line":
      return <>
        <text x="12" y="20" fontSize="12" fontWeight="750">Our experts</text>
        {[30, 56, 82].map((y, index) => <g key={y}>
          <Avatar x={13} y={y} size={20} color={index === 1 ? orange : blue} />
          <text x="42" y={y + 8} fontSize="8" fontWeight="700">{["Anna Moroz", "Alex Volkov", "Maya Sokol"][index]}</text>
          <path d={`M42 ${y + 16}h68`} stroke={muted} strokeWidth="2" opacity=".5" />
          <rect x="117" y={y + 3} width="22" height="11" rx="5" fill={soft} />
          <path d={`M123 ${y + 8}h9`} stroke={blue} strokeWidth="2" />
          {index < 2 && <path d={`M13 ${y + 23}h126`} stroke={soft} />}
        </g>)}
      </>;
    case "team-spotlight":
      return <>
        <rect x="9" y="11" width="77" height="91" rx="6" fill={paper} stroke={soft} />
        <rect x="13" y="15" width="69" height="49" rx="4" fill={blue} opacity=".12" />
        <Avatar x={28} y={21} size={38} />
        <text x="16" y="77" fontSize="10" fontWeight="750">Anna Moroz</text>
        <text x="16" y="87" fontSize="7" fill={blue}>Lead designer</text>
        <path d="M16 95h56" stroke={muted} strokeWidth="2" opacity=".4" />
        {[12, 35, 58, 81].map((y, index) => <g key={y}>
          <rect x="93" y={y} width="50" height="20" rx="4" fill={paper} stroke={soft} />
          <Avatar x={97} y={y + 3} size={14} color={index % 2 ? orange : blue} />
          <path d={`M116 ${y + 8}h21m-21 5h15`} stroke={muted} strokeWidth="2" opacity=".7" />
        </g>)}
      </>;
    default:
      return null;
  }
}
