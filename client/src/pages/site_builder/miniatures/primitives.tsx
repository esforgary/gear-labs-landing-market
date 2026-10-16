export const ink = "var(--text-primary)";
export const muted = "var(--text-secondary)";
export const paper = "var(--surface)";
export const soft = "var(--surface-muted)";
export const blue = "var(--blue)";
export const orange = "var(--orange)";

export function CopyLines({ x, y, width }: { x: number; y: number; width: number }) {
  return <path d={`M${x} ${y}h${width}m-${width} 5h${width * 0.8}`} stroke={muted} strokeWidth="2" opacity=".5" />;
}

export function Landscape({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  return (
    <svg x={x} y={y} width={width} height={height} viewBox="0 0 100 60" preserveAspectRatio="none">
      <path fill={blue} opacity=".18" d="M0 0h100v60H0z" />
      <circle cx="76" cy="17" r="8" fill={orange} />
      <path d="M0 52 31 18 68 60H0Z" fill={blue} opacity=".6" />
      <path d="m40 60 33-30 27 22v8Z" fill={blue} />
    </svg>
  );
}

export function Avatar({ x, y, size = 20, color = blue }: { x: number; y: number; size?: number; color?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${size / 20})`}>
    <circle cx="10" cy="10" r="10" fill={color} opacity=".16" />
    <circle cx="10" cy="7" r="3.5" fill={color} />
    <path d="M4 17a6 6 0 0 1 12 0" fill={color} />
  </g>;
}
