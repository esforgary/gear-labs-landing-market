export function ScenariosPhotoEditorCover() {
  return <svg viewBox="0 0 640 400" width="100%" height="100%" aria-hidden="true" style={{ display: "block", background: "#0d1117" }}>
    <rect x="16" y="16" width="608" height="368" rx="14" fill="#161b22" stroke="#30363d" />
    <text x="36" y="46" fill="#e6edf3" fontSize="17" fontFamily="Arial" fontWeight="600">Scenarios / Photo editor</text>
    <rect x="474" y="28" width="126" height="28" rx="7" fill="#58a6ff" /><text x="503" y="47" fill="#0d1117" fontSize="12" fontFamily="Arial">Export PNG</text>
    <path d="M16 68H624M66 68V384M474 68V384" stroke="#30363d" />
    {[90,132,174,216,258,300].map((y,i)=><g key={y}><rect x="29" y={y} width="24" height="26" rx="5" fill={i===0?'#1b304a':'#21262d'}/><path d={`M35 ${y+8}h12m-6-4v12`} stroke={i===0?'#58a6ff':'#8b949e'} strokeWidth="2"/></g>)}
    <rect x="91" y="111" width="354" height="225" rx="2" fill="#bddef2" />
    <circle cx="371" cy="158" r="29" fill="#ffbc72" />
    <path d="M91 292 200 168 300 296 360 218 445 304V336H91Z" fill="#4a6b83" /><path d="m91 317 140-105 144 124H91Z" fill="#203a52" />
    <text x="113" y="304" fill="white" fontSize="39" fontFamily="Arial" fontWeight="700">EXPLORE.</text>
    <rect x="108" y="264" width="224" height="50" fill="none" stroke="#58a6ff" strokeWidth="2" />
    {[108,332].flatMap(x=>[264,314].map(y=><rect key={`${x}-${y}`} x={x-3} y={y-3} width="6" height="6" fill="white" stroke="#58a6ff"/>))}
    <text x="490" y="95" fill="#e6edf3" fontSize="12" fontFamily="Arial">Layers</text>
    {['Explore.','Mountains','Background'].map((name,i)=><g key={name}><rect x="486" y={110+i*39} width="126" height="32" rx="5" fill={i===0?'#1b304a':'#21262d'}/><text x="497" y={130+i*39} fill="#c9d1d9" fontSize="10" fontFamily="Arial">{name}</text></g>)}
    <text x="490" y="259" fill="#8b949e" fontSize="11" fontFamily="Arial">Opacity</text><path d="M490 280H607" stroke="#30363d" strokeWidth="4"/><path d="M490 280H580" stroke="#58a6ff" strokeWidth="4"/><circle cx="580" cy="280" r="5" fill="#58a6ff" />
    <text x="490" y="314" fill="#8b949e" fontSize="11" fontFamily="Arial">Fill</text><rect x="490" y="325" width="117" height="25" rx="5" fill="#e6edf3" />
  </svg>;
}
