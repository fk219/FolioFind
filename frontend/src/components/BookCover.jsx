import { useState } from "react";

const coverPalettes = [
  { bg: "#5C6245", text: "#F4EEDF", accent: "#D8C7A2" },
  { bg: "#6B2A2A", text: "#F4EEDF", accent: "#D8C7A2" },
  { bg: "#2F3A3A", text: "#F4EEDF", accent: "#B38B4D" },
  { bg: "#B38B4D", text: "#1E1A16", accent: "#4D3A1F" }
];

function paletteFor(title = "") {
  const index = title.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % coverPalettes.length;
  return coverPalettes[index];
}

export default function BookCover({ title, author, src, className = "", eager = false, compact = false }) {
  const [failed, setFailed] = useState(false);
  const palette = paletteFor(title);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={`Cover of ${title}`}
        loading={eager ? "eager" : "lazy"}
        onError={() => setFailed(true)}
        className={`h-full w-full object-contain drop-shadow-[6px_10px_16px_rgba(30,26,22,0.22)] ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full flex-col justify-between overflow-hidden ${
        compact ? "p-2" : "p-4"
      } ${className}`}
      style={{ backgroundColor: palette.bg, color: palette.text }}
      role="img"
      aria-label={`Typographic cover for ${title}`}
    >
      {!compact && (
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] opacity-70">FolioFind</span>
      )}
      <div className="min-w-0">
        <p className={`font-display tracking-tight ${compact ? "line-clamp-3 text-[10px] leading-[1.1]" : "text-xl leading-[1.05]"}`}>
          {title}
        </p>
        <p className={`mt-1 font-mono uppercase opacity-80 ${compact ? "line-clamp-2 text-[6px] tracking-[0.08em]" : "mt-2 text-[9px] tracking-[0.12em]"}`}>
          {author}
        </p>
      </div>
      <span
        className={`h-px ${compact ? "w-4" : "w-8"}`}
        style={{ backgroundColor: palette.accent }}
        aria-hidden="true"
      />
    </div>
  );
}
