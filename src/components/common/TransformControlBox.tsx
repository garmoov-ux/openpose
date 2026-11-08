import React from 'react';
import { Move, RotateCw, Maximize2, RotateCcw, X } from 'lucide-react';
import { GizmoMode } from '@/types';

interface TransformControlBoxProps {
  title: string;
  accentColor?: 'amber' | 'blue' | 'rose';
  position: [number, number, number];
  rotation: [number, number, number]; // radians [rx, ry, rz]
  scale: number;
  gizmoMode: GizmoMode;
  isGizmoAttached: boolean;
  onSetGizmoMode: (mode: GizmoMode) => void;
  onDetachGizmo: () => void;
  onChangeTransform: (
    nextPos: [number, number, number],
    nextRot: [number, number, number],
    nextScale: number
  ) => void;
  onReset: () => void;
}

const RAD2DEG = 180 / Math.PI;
const DEG2RAD = Math.PI / 180;

export const TransformControlBox: React.FC<TransformControlBoxProps> = ({
  title,
  accentColor = 'amber',
  position,
  rotation,
  scale,
  gizmoMode,
  isGizmoAttached,
  onSetGizmoMode,
  onDetachGizmo,
  onChangeTransform,
  onReset,
}) => {
  const accentText =
    accentColor === 'blue' ? 'text-blue-400' : accentColor === 'rose' ? 'text-rose-400' : 'text-amber-400';

  const setAxisPos = (axis: 0 | 1 | 2, val: number) => {
    const next: [number, number, number] = [position[0], position[1], position[2]];
    next[axis] = Number(Math.max(-3.0, Math.min(3.0, val)).toFixed(3));
    onChangeTransform(next, rotation, scale);
  };

  const setAxisRotDeg = (axis: 0 | 1 | 2, deg: number) => {
    const next: [number, number, number] = [rotation[0], rotation[1], rotation[2]];
    next[axis] = Number((deg * DEG2RAD).toFixed(3));
    onChangeTransform(position, next, scale);
  };

  const setScaleVal = (nextScale: number) => {
    const clamped = Number(Math.max(0.3, Math.min(2.5, nextScale)).toFixed(2));
    onChangeTransform(position, rotation, clamped);
  };

  return (
    <div className="p-2.5 bg-zinc-900 text-white rounded-2xl space-y-2 text-[10.5px] border border-zinc-800">
      <div className="flex items-center justify-between gap-1">
        <span className={`font-bold truncate ${accentText}`}>{title}</span>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold"
            title="위치·회전·크기 원위치 초기화"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>초기화</span>
          </button>
          {isGizmoAttached && (
            <button
              type="button"
              onClick={onDetachGizmo}
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-semibold"
              title="3D 기즈모 해제"
            >
              <X className="w-2.5 h-2.5" />
              <span>해제</span>
            </button>
          )}
        </div>
      </div>

      {/* 3D 기즈모 모드 전환 */}
      <div className="grid grid-cols-3 gap-1">
        <button
          type="button"
          onClick={() => onSetGizmoMode('translate')}
          className={`flex items-center justify-center gap-1 py-1 rounded-lg font-bold transition-colors ${
            isGizmoAttached && gizmoMode === 'translate'
              ? 'bg-amber-500 text-zinc-950'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
          }`}
        >
          <Move className="w-3 h-3" />
          <span>이동 기즈모</span>
        </button>
        <button
          type="button"
          onClick={() => onSetGizmoMode('rotate')}
          className={`flex items-center justify-center gap-1 py-1 rounded-lg font-bold transition-colors ${
            isGizmoAttached && gizmoMode === 'rotate'
              ? 'bg-amber-500 text-zinc-950'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
          }`}
        >
          <RotateCw className="w-3 h-3" />
          <span>회전 기즈모</span>
        </button>
        <button
          type="button"
          onClick={() => onSetGizmoMode('scale')}
          className={`flex items-center justify-center gap-1 py-1 rounded-lg font-bold transition-colors ${
            isGizmoAttached && gizmoMode === 'scale'
              ? 'bg-amber-500 text-zinc-950'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
          }`}
        >
          <Maximize2 className="w-3 h-3" />
          <span>크기 기즈모</span>
        </button>
      </div>

      {/* X / Y / Z 이동 슬라이더 */}
      <div className="space-y-1 bg-zinc-950/60 p-2 rounded-xl">
        <div className="text-[10px] font-bold text-zinc-400">위치 이동 (X 좌우 · Y 높이 · Z 전후)</div>
        {(['X', 'Y', 'Z'] as const).map((label, idx) => {
          const axis = idx as 0 | 1 | 2;
          const val = position[axis];
          const min = axis === 1 ? -0.6 : -2.5;
          const max = axis === 1 ? 1.8 : 2.5;
          return (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-3 font-bold text-zinc-300">{label}</span>
              <button
                type="button"
                onClick={() => setAxisPos(axis, val - 0.05)}
                className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[9.5px]"
              >
                -
              </button>
              <input
                type="range"
                min={min}
                max={max}
                step={0.02}
                value={val}
                onChange={(e) => setAxisPos(axis, parseFloat(e.target.value))}
                className="flex-1 accent-amber-400 h-1.5 cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setAxisPos(axis, val + 0.05)}
                className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[9.5px]"
              >
                +
              </button>
              <span className="w-9 text-right font-mono text-[9.5px] text-zinc-300">{val.toFixed(2)}</span>
            </div>
          );
        })}
      </div>

      {/* X / Y / Z 회전 슬라이더 */}
      <div className="space-y-1 bg-zinc-950/60 p-2 rounded-xl">
        <div className="text-[10px] font-bold text-zinc-400">3축 회전 (X 피치 · Y 요 · Z 롤)</div>
        {(['X', 'Y', 'Z'] as const).map((label, idx) => {
          const axis = idx as 0 | 1 | 2;
          const deg = Math.round(rotation[axis] * RAD2DEG);
          return (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-3 font-bold text-zinc-300">{label}</span>
              <button
                type="button"
                onClick={() => setAxisRotDeg(axis, deg - 15)}
                className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[9.5px]"
              >
                -15°
              </button>
              <input
                type="range"
                min={-180}
                max={180}
                step={5}
                value={Math.max(-180, Math.min(180, deg))}
                onChange={(e) => setAxisRotDeg(axis, parseFloat(e.target.value))}
                className="flex-1 accent-amber-400 h-1.5 cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setAxisRotDeg(axis, deg + 15)}
                className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[9.5px]"
              >
                +15°
              </button>
              <span className="w-9 text-right font-mono text-[9.5px] text-zinc-300">{deg}°</span>
            </div>
          );
        })}
      </div>

      {/* 크기(Scale) 슬라이더 */}
      <div className="flex items-center gap-1.5 bg-zinc-950/60 px-2 py-1.5 rounded-xl">
        <span className="font-bold text-zinc-300 shrink-0">크기 배율</span>
        <button
          type="button"
          onClick={() => setScaleVal(scale - 0.1)}
          className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[9.5px]"
        >
          -
        </button>
        <input
          type="range"
          min={0.4}
          max={2.2}
          step={0.05}
          value={scale}
          onChange={(e) => setScaleVal(parseFloat(e.target.value))}
          className="flex-1 accent-amber-400 h-1.5 cursor-pointer"
        />
        <button
          type="button"
          onClick={() => setScaleVal(scale + 0.1)}
          className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[9.5px]"
        >
          +
        </button>
        <span className="w-9 text-right font-mono text-[9.5px] text-amber-300">{scale.toFixed(2)}x</span>
      </div>
    </div>
  );
};

