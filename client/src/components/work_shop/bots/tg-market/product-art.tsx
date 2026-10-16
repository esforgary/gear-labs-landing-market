import { useState } from "react";

type ProductArtProps = {
  product: { name: string; imageUrl: string; color: string };
  className?: string;
};

export function ProductArt({ product, className = "" }: ProductArtProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  if (/^(https?:\/\/|data:image\/)/i.test(product.imageUrl) && failedUrl !== product.imageUrl) {
    return <img className={className} src={product.imageUrl} alt={product.name} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailedUrl(product.imageUrl)} />;
  }
  const kind = product.imageUrl.replace(/^demo:/, "");
  const color = product.color || "#5b8bd4";
  return (
    <svg className={className} viewBox="0 0 160 128" role="img" aria-label={product.name}>
      <rect width="160" height="128" rx="18" fill={color} opacity=".12" />
      <circle cx="123" cy="28" r="34" fill="white" opacity=".6" />
      <ellipse cx="80" cy="107" rx="45" ry="7" fill="#17314a" opacity=".09" />
      {kind === "headphones" ? <g strokeLinejoin="round">
        <path d="M43 71V57a37 37 0 0 1 74 0v14" fill="none" stroke="#263b50" strokeWidth="13" />
        <path d="M44 57a36 36 0 0 1 72 0" fill="none" stroke={color} strokeWidth="6" />
        <rect x="32" y="61" width="25" height="39" rx="11" fill={color} />
        <rect x="103" y="61" width="25" height="39" rx="11" fill={color} />
        <rect x="47" y="65" width="11" height="31" rx="5" fill="#263b50" />
        <rect x="102" y="65" width="11" height="31" rx="5" fill="#263b50" />
        <path d="M38 69v16M120 69v16" stroke="white" strokeWidth="3" strokeLinecap="round" opacity=".45" />
      </g> : kind === "keyboard" ? <g transform="rotate(-8 80 65)">
        <rect x="15" y="40" width="130" height="58" rx="9" fill="#263b50" />
        <rect x="17" y="36" width="126" height="57" rx="8" fill="white" />
        {Array.from({ length: 30 }, (_, i) => <rect key={i} x={23 + (i % 10) * 11.5} y={43 + Math.floor(i / 10) * 11.5} width="8.5" height="8" rx="2" fill={i === 0 || i > 27 ? color : "#dbe4ed"} />)}
        <rect x="23" y="78" width="19" height="8" rx="2" fill={color} />
        <rect x="46" y="78" width="60" height="8" rx="2" fill="#dbe4ed" />
        <rect x="110" y="78" width="26" height="8" rx="2" fill={color} />
      </g> : kind === "speaker" ? <g>
        <rect x="48" y="20" width="64" height="88" rx="24" fill="#25394b" />
        <ellipse cx="80" cy="33" rx="29" ry="12" fill={color} />
        <ellipse cx="80" cy="32" rx="22" ry="7" fill="#1d2c3c" />
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M54 ${49 + i * 7}h52`} stroke={color} strokeWidth="2" opacity=".6" />)}
        <path d="M75 31h10m-5-5v10" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx="80" cy="99" r="2.5" fill="#83e7b9" />
      </g> : kind === "watch" ? <g transform="rotate(12 80 64)">
        <rect x="64" y="10" width="32" height="108" rx="12" fill={color} />
        <rect x="54" y="34" width="52" height="60" rx="16" fill="#263b50" />
        <rect x="59" y="39" width="42" height="50" rx="12" fill="#102332" />
        <circle cx="80" cy="63" r="16" fill="none" stroke="#80dbc2" strokeWidth="4" strokeDasharray="77 24" transform="rotate(-90 80 63)" />
        <path d="M80 52v12l7 4" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <rect x="106" y="51" width="4" height="12" rx="2" fill="#667c8d" />
      </g> : kind === "mouse" ? <g transform="rotate(-18 80 64)">
        <rect x="51" y="22" width="58" height="85" rx="29" fill="#263b50" />
        <rect x="50" y="18" width="58" height="84" rx="29" fill={color} />
        <path d="M79 20v36M52 56h54" stroke="white" strokeWidth="1.5" opacity=".5" />
        <rect x="75" y="32" width="8" height="17" rx="4" fill="#263b50" />
        <path d="M60 67v12a18 18 0 0 0 10 16" fill="none" stroke="white" strokeWidth="3" opacity=".3" strokeLinecap="round" />
      </g> : <g>
        <path d="M63 34V26a17 17 0 0 1 34 0v8" fill="none" stroke="#263b50" strokeWidth="7" />
        <path d="M46 42a14 14 0 0 1 14-14h40a14 14 0 0 1 14 14l6 54a12 12 0 0 1-12 13H52a12 12 0 0 1-12-13z" fill={color} />
        <rect x="54" y="65" width="52" height="32" rx="9" fill="#263b50" opacity=".25" />
        <path d="M61 73h38" stroke="white" strokeWidth="2" opacity=".65" />
        <rect x="71" y="43" width="18" height="10" rx="3" fill="white" opacity=".8" />
        <path d="M102 76v7" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </g>}
    </svg>
  );
}
