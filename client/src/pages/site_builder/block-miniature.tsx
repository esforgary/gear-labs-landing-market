import { useId, type ReactNode } from "react";
import { ink, muted, paper, soft, blue, orange, CopyLines, Landscape } from "./miniatures/primitives";
import { structureScene } from "./miniatures/structure-scenes";
import { contentScene } from "./miniatures/content-scenes";

function layoutScene(key: string, id: string): ReactNode {
  switch (key) {
    case "header-pill":
      return <>
        <rect x="8" y="18" width="136" height="25" rx="12" fill={ink} opacity=".08" />
        <rect x="8" y="14" width="136" height="25" rx="12" fill={paper} stroke={soft} />
        <rect x="17" y="22" width="9" height="9" rx="3" fill={orange} />
        <path d="M36 26h17m7 0h17m7 0h14" stroke={ink} strokeWidth="3" opacity=".65" />
        <rect x="112" y="21" width="23" height="11" rx="5" fill={blue} />
        <text x="15" y="67" fontSize="15" fontWeight="700">Brand.</text>
        <CopyLines x={15} y={77} width={61} />
        <rect x="15" y="90" width="30" height="7" rx="3" fill={orange} opacity=".5" />
        <Landscape x={91} y={55} width={45} height={39} />
      </>;
    case "hero-product":
      return <>
        <text x="12" y="27" fontSize="7" fill={blue} fontWeight="700">NEW / 01</text>
        <text x="12" y="45" fontSize="13" fontWeight="800">Sound.</text>
        <CopyLines x={12} y={55} width={48} />
        <text x="12" y="76" fontSize="10" fontWeight="700">$149</text>
        <rect x="12" y="84" width="43" height="15" rx="5" fill={orange} />
        <path d="M29 91h9m-3-3 3 3-3 3" stroke={ink} strokeWidth="1.8" fill="none" />
        <ellipse cx="108" cy="96" rx="24" ry="4" fill={ink} opacity=".1" />
        <circle cx="107" cy="56" r="32" fill={orange} opacity=".12" />
        <path d="M85 65V48a22 22 0 0 1 44 0v17" fill="none" stroke={ink} strokeWidth="7" />
        <path d="M89 48a18 18 0 0 1 36 0" fill="none" stroke={blue} strokeWidth="3" />
        <rect x="80" y="57" width="13" height="26" rx="6" fill={blue} stroke={ink} strokeWidth="2" />
        <rect x="121" y="57" width="13" height="26" rx="6" fill={blue} stroke={ink} strokeWidth="2" />
      </>;
    case "hero-editorial":
      return <>
        <text x="12" y="20" fontSize="7" fill={blue} fontWeight="700">STUDIO / 2026</text>
        <text x="11" y="46" fontSize="24" fontWeight="800" letterSpacing="-1">Ideas into</text>
        <text x="11" y="70" fontSize="24" fontWeight="800" letterSpacing="-1">impact.</text>
        <path d="M13 79h126" stroke={soft} strokeWidth="2" />
        {["120+", "98%", "24/7"].map((value, index) => <g key={value} transform={`translate(${13 + index * 44} 0)`}>
          <text y="94" fontSize="11" fontWeight="700" fill={index === 1 ? orange : ink}>{value}</text>
          <path d="M0 101h25" stroke={muted} strokeWidth="2" opacity=".4" />
        </g>)}
      </>;
    case "hero-app":
      return <>
        <text x="12" y="25" fontSize="16" fontWeight="800">Gear<tspan fill={blue}>Labs</tspan></text>
        <path d="M12 43h45m-45 7h36" stroke={ink} strokeWidth="4" />
        <path d="M53 46v7" stroke={orange} strokeWidth="2" />
        <CopyLines x={12} y={62} width={46} />
        <rect x="12" y="81" width="26" height="12" rx="4" fill={orange} />
        <rect x="42" y="81" width="26" height="12" rx="4" fill={blue} />
        <rect x="78" y="35" width="65" height="61" rx="6" fill={paper} stroke={soft} />
        {[orange, blue, soft].map((color, index) => <circle key={color} cx={84 + index * 5} cy="41" r="1.5" fill={color} />)}
        <Landscape x={82} y={47} width={57} height={37} />
        <path d="M104 90h6" stroke={blue} strokeWidth="3" strokeLinecap="round" />
        <circle cx="115" cy="90" r="1.5" fill={soft} />
        <circle cx="120" cy="90" r="1.5" fill={soft} />
      </>;
    case "reviews-highlight":
      return <>
        <rect x="9" y="11" width="92" height="90" rx="8" fill={paper} stroke={soft} />
        <text x="17" y="42" fontSize="34" fill={orange} fontFamily="Georgia, serif">“</text>
        <text x="42" y="31" fontSize="9" fill={orange}>★★★★★</text>
        <CopyLines x={18} y={48} width={73} />
        <CopyLines x={18} y={59} width={65} />
        <circle cx="26" cy="83" r="9" fill={blue} opacity=".18" />
        <circle cx="26" cy="80" r="3" fill={blue} />
        <path d="M21 88a5 5 0 0 1 10 0" fill={blue} />
        <path d="M41 81h37m-37 6h26" stroke={muted} strokeWidth="2.5" />
        {[18, 59].map(y => <g key={y}>
          <rect x="107" y={y} width="36" height="35" rx="5" fill={paper} stroke={soft} />
          <circle cx="116" cy={y + 9} r="4" fill={blue} opacity=".5" />
          <path d={`M124 ${y + 9}h12m-23 10h23m-23 5h17`} stroke={muted} strokeWidth="2" opacity=".5" />
        </g>)}
      </>;
    case "background-aurora-grid":
      return <>
        <rect width="152" height="112" fill={ink} />
        <ellipse cx="44" cy="30" rx="96" ry="67" fill={`url(#${id}-glow)`} />
        <ellipse cx="132" cy="30" rx="74" ry="57" fill={`url(#${id}-warm)`} />
        <path d="M76 40 0 112M76 40 30 112M76 40 61 112M76 40 91 112M76 40 122 112M76 40 152 112M0 52h152M0 62h152M0 77h152M0 99h152" stroke={blue} strokeWidth="1" opacity=".55" />
        <path d="M0 48Q40 5 84 35T152 15" fill="none" stroke={blue} strokeWidth="7" opacity=".35" />
        <path d="M0 48Q40 5 84 35T152 15" fill="none" stroke={paper} strokeWidth="1.5" opacity=".5" />
        <circle cx="31" cy="77" r="2" fill={orange} />
        <circle cx="100" cy="62" r="2" fill={paper} />
      </>;
    case "gallery-slider":
      return <>
        <rect x="10" y="10" width="132" height="70" rx="5" fill={paper} />
        <Landscape x={13} y={13} width={126} height={64} />
        {[24, 128].map((x, index) => <g key={x}>
          <circle cx={x} cy="45" r="8" fill={paper} />
          <path d={index ? "m126 42 3 3-3 3" : "m26 42-3 3 3 3"} stroke={ink} strokeWidth="1.8" fill="none" />
        </g>)}
        {[14, 57, 100].map((x, index) => <g key={x}>
          <rect x={x - 2} y="85" width="38" height="23" rx="3" fill={paper} stroke={index === 0 ? orange : soft} strokeWidth="2" />
          <Landscape x={x} y={87} width={34} height={19} />
        </g>)}
      </>;
    default:
      return null;
  }
}

export default function BlockMiniature({ type, variant }: { type: string; variant: string }) {
  const id = useId();
  const key = `${type}-${variant}`;
  const scene = layoutScene(key, id) ?? structureScene(key, id) ?? contentScene(key, id);

  return (
    <span aria-hidden="true" className="block-miniature block-miniature--layout">
      <svg viewBox="0 0 152 112" fill={ink} focusable="false">
        <defs>
          <radialGradient id={`${id}-glow`}><stop stopColor={blue} stopOpacity=".85" /><stop offset="1" stopColor={blue} stopOpacity="0" /></radialGradient>
          <radialGradient id={`${id}-warm`}><stop stopColor={orange} stopOpacity=".6" /><stop offset="1" stopColor={orange} stopOpacity="0" /></radialGradient>
        </defs>
        {scene}
      </svg>
    </span>
  );
}
