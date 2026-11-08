import React from 'react';
import { Palette, RotateCcw } from 'lucide-react';

export interface ColorSwatchItem {
  label: string;
  hex: number;
}

export const STUDIO_COLOR_SWATCHES: ColorSwatchItem[] = [
  { label: '크림슨 레드', hex: 0xe11d48 },
  { label: '오닉스 블랙', hex: 0x18181b },
  { label: '펄 화이트', hex: 0xf8fafc },
  { label: '네온 핫핑크', hex: 0xec4899 },
  { label: '로열 골드', hex: 0xfbbf24 },
  { label: '바이올렛', hex: 0x7c3aed },
  { label: '코발트 블루', hex: 0x2563eb },
  { label: '에메랄드', hex: 0x059669 },
  { label: '월넛 브라운', hex: 0x78350f },
  { label: '사이버 시안', hex: 0x06b6d4 },
  { label: '로즈골드', hex: 0xf472b6 },
  { label: '실버 크롬', hex: 0xcbd5e1 },
];

interface ColorPaletteBarProps {
  title: string;
  currentColorHex?: number;
  defaultColorHex?: number;
  onSelectColor: (hex: number) => void;
  onResetColor?: () => void;
  darkTheme?: boolean;
}

export const ColorPaletteBar: React.FC<ColorPaletteBarProps> = ({
  title,
  currentColorHex,
  defaultColorHex = 0xe11d48,
  onSelectColor,
  onResetColor,
  darkTheme = false,
}) => {
  const effectiveHex = currentColorHex ?? defaultColorHex;
  const hexString = `#${effectiveHex.toString(16).padStart(6, '0')}`;

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace('#', '');
    const parsed = parseInt(raw, 16);
    if (!Number.isNaN(parsed)) {
      onSelectColor(parsed);
    }
  };

  return (
    <div
      className={`p-2.5 rounded-2xl border space-y-2 ${
        darkTheme
          ? 'bg-zinc-950/90 border-zinc-800 text-white'
          : 'bg-white border-zinc-200/90 text-zinc-900'
      }`}
    >
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-bold">
          <Palette className="w-3.5 h-3.5 text-pink-500 shrink-0" />
          <span className="truncate">{title}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <label
            className={`relative flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-bold cursor-pointer transition-colors ${
              darkTheme
                ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
                : 'bg-zinc-100 border-zinc-200 text-zinc-800 hover:bg-zinc-200'
            }`}
            title="원하는 RGB 색상을 직접 선택"
          >
            <span
              className="w-3 h-3 rounded-full border border-black/20"
              style={{ backgroundColor: hexString }}
            />
            <span>직접 색상 선택</span>
            <input
              type="color"
              value={hexString}
              onChange={handleColorInputChange}
              className="sr-only"
            />
          </label>

          {currentColorHex !== undefined && onResetColor && (
            <button
              type="button"
              onClick={onResetColor}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                darkTheme
                  ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
              title="원래 기본 색상으로 복원"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>기본색</span>
            </button>
          )}
        </div>
      </div>

      {/* 12색 추천 스와치 그리드 */}
      <div className="grid grid-cols-12 gap-1">
        {STUDIO_COLOR_SWATCHES.map((swatch) => {
          const isSelected = currentColorHex === swatch.hex;
          const swatchHexStr = `#${swatch.hex.toString(16).padStart(6, '0')}`;
          return (
            <button
              key={swatch.hex}
              type="button"
              onClick={() => onSelectColor(swatch.hex)}
              title={swatch.label}
              className={`w-full aspect-square rounded-lg border transition-transform ${
                isSelected
                  ? 'ring-2 ring-amber-400 scale-110 z-10 border-white'
                  : 'border-black/20 hover:scale-105'
              }`}
              style={{ backgroundColor: swatchHexStr }}
            />
          );
        })}
      </div>
    </div>
  );
};

