import React, { useState } from 'react';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { useEditorStore } from '@/stores/useEditorStore';
import {
  ROOM_PROP_CATALOG,
  ROOM_PROP_CATEGORIES,
  RoomPropCategory,
  getRoomPropDef,
} from '@/data/themesSolo/roomPropCatalog';
import { ColorPaletteBar } from '../common/ColorPaletteBar';
import { Sofa, Plus, Trash2, Eye, EyeOff, RotateCcw, Move, RotateCw } from 'lucide-react';

export const RoomPropsManagerView: React.FC = () => {
  const [activeCat, setActiveCat] = useState<'all' | RoomPropCategory>('all');
  const { setGizmoMode, gizmoMode, setSelectedBoneName } = useEditorStore();
  const {
    roomProps,
    selectedPropUid,
    setSelectedPropUid,
    addRoomProp,
    toggleRoomProp,
    removeRoomProp,
    updateRoomPropTransform,
    updateRoomPropColor,
    resetRoomPropsToDefault,
    clearAllRoomProps,
  } = useThemeSoloStore();

  const selectedPropInstance = roomProps.find((p) => p.uid === selectedPropUid) || roomProps[0];
  const selectedPropDef = selectedPropInstance ? getRoomPropDef(selectedPropInstance.propId) : undefined;
  const filteredCatalog =
    activeCat === 'all' ? ROOM_PROP_CATALOG : ROOM_PROP_CATALOG.filter((item) => item.category === activeCat);

  const handleSelectInstance = (uid: string) => {
    setSelectedBoneName(null);
    setSelectedPropUid(selectedPropUid === uid ? null : uid);
    setGizmoMode('translate');
  };

  const handleRotateSelected = (deltaRad: number) => {
    if (!selectedPropInstance) return;
    updateRoomPropTransform(
      selectedPropInstance.uid,
      selectedPropInstance.position,
      Number((selectedPropInstance.rotationY + deltaRad).toFixed(3))
    );
  };

  const handleResetSelectedPos = () => {
    if (!selectedPropInstance || !selectedPropDef) return;
    updateRoomPropTransform(
      selectedPropInstance.uid,
      [selectedPropDef.defaultPos[0], selectedPropDef.defaultPos[1], selectedPropDef.defaultPos[2]],
      selectedPropDef.defaultRotY ?? 0
    );
  };

  return (
    <div className="space-y-3 text-xs">
      <div className="p-3 bg-zinc-100/95 rounded-2xl border border-zinc-200/90 space-y-2.5">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 font-bold text-zinc-900">
            <Sofa className="w-4 h-4 text-amber-600" />
            <span>현재 방 배치 사물 ({roomProps.length}개)</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={resetRoomPropsToDefault}
              className="flex items-center gap-1 px-2 py-1 bg-zinc-900 text-white rounded-full text-[10.5px] font-bold hover:bg-zinc-800 transition-colors"
              title="기본 가구·소품 세트로 복원"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span>기본 세팅 복원</span>
            </button>
            <button
              onClick={clearAllRoomProps}
              className="px-2 py-1 bg-white text-zinc-600 border border-zinc-200 rounded-full text-[10.5px] font-semibold hover:bg-zinc-200 transition-colors"
              title="방 안의 모든 소품 비우기"
            >
              전체 비우기
            </button>
          </div>
        </div>

        <p className="text-[10.5px] text-zinc-500 leading-snug">
          사물을 클릭하면 아래에서 색상 변경(12색 팔레트·RGB 피커) 및 3D 이동·회전 기즈모 조절이 가능합니다.
        </p>

        <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-0.5">
          {roomProps.map((inst) => {
            const def = getRoomPropDef(inst.propId);
            if (!def) return null;
            const isSelected = selectedPropInstance?.uid === inst.uid;
            const effectiveHex = inst.customColorHex ?? def.colorHex;
            const hexStr = `#${effectiveHex.toString(16).padStart(6, '0')}`;

            return (
              <div
                key={inst.uid}
                className={`flex items-center justify-between gap-1 px-2 py-1.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-amber-500 ring-2 ring-amber-500/25'
                    : inst.visible
                    ? 'bg-white text-zinc-900 border-zinc-200/90 hover:border-zinc-400'
                    : 'bg-zinc-100/70 text-zinc-400 border-zinc-200/60'
                }`}
              >
                <button
                  onClick={() => handleSelectInstance(inst.uid)}
                  className="flex items-center gap-1.5 min-w-0 flex-1 text-left"
                >
                  <span className="w-3 h-3 rounded-full shrink-0 border border-black/20" style={{ backgroundColor: hexStr }} />
                  <span className="font-bold text-[10.5px] truncate">{def.nameKo}</span>
                </button>
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    onClick={() => toggleRoomProp(inst.uid)}
                    className={`p-1 rounded-md transition-colors ${
                      isSelected ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-500'
                    }`}
                  >
                    {inst.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => removeRoomProp(inst.uid)}
                    className={`p-1 rounded-md transition-colors ${
                      isSelected ? 'hover:bg-zinc-800 text-rose-400' : 'hover:bg-rose-50 text-rose-500'
                    }`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {selectedPropInstance && selectedPropDef && (
          <div className="p-2.5 bg-zinc-900 text-white rounded-2xl flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-amber-400 truncate">선택 사물: {selectedPropDef.nameKo}</span>
              <span className="text-[10px] text-zinc-400 font-mono">
                X:{selectedPropInstance.position[0].toFixed(1)} Z:{selectedPropInstance.position[2].toFixed(1)}
              </span>
            </div>

            <ColorPaletteBar
              title={`${selectedPropDef.nameKo} 색상 변경`}
              currentColorHex={selectedPropInstance.customColorHex}
              defaultColorHex={selectedPropDef.colorHex}
              onSelectColor={(hex) => updateRoomPropColor(selectedPropInstance.uid, hex)}
              onResetColor={() => updateRoomPropColor(selectedPropInstance.uid, undefined)}
              darkTheme
            />

            <div className="grid grid-cols-4 gap-1">
              <button
                onClick={() => setGizmoMode(gizmoMode === 'translate' ? 'rotate' : 'translate')}
                className="flex items-center justify-center gap-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[10px] font-bold text-amber-300"
              >
                <Move className="w-3 h-3" />
                <span>{gizmoMode === 'translate' ? '이동 기즈모' : '회전 기즈모'}</span>
              </button>
              <button
                onClick={() => handleRotateSelected(-Math.PI / 4)}
                className="flex items-center justify-center gap-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[10px] font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>좌 45°</span>
              </button>
              <button
                onClick={() => handleRotateSelected(Math.PI / 4)}
                className="flex items-center justify-center gap-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[10px] font-semibold"
              >
                <RotateCw className="w-3 h-3" />
                <span>우 45°</span>
              </button>
              <button
                onClick={handleResetSelectedPos}
                className="flex items-center justify-center gap-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[10px] font-semibold text-zinc-300"
              >
                <span>원위치</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {ROOM_PROP_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`px-2 py-1.5 rounded-xl text-[10.5px] font-bold transition-all border text-center truncate ${
              activeCat === cat.id
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-zinc-100 text-zinc-600 border-zinc-200/80 hover:text-zinc-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {filteredCatalog.map((item) => {
          const matching = roomProps.filter((p) => p.propId === item.id);
          const count = matching.length;
          const activeColor = matching[matching.length - 1]?.customColorHex ?? item.colorHex;
          const hexStr = `#${activeColor.toString(16).padStart(6, '0')}`;

          return (
            <div
              key={item.id}
              className={`p-2 rounded-2xl border flex flex-col justify-between gap-1.5 transition-all ${
                count > 0
                  ? 'bg-zinc-900 text-white border-amber-500/90 shadow-xs'
                  : 'bg-white text-zinc-900 border-zinc-200/90 hover:border-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded truncate border border-black/10"
                  style={{
                    backgroundColor: hexStr,
                    color: activeColor > 0xc0c0c0 ? '#18181b' : '#ffffff',
                  }}
                >
                  {item.badge}
                </span>
                {count > 0 && <span className="text-[9.5px] font-bold text-amber-400 shrink-0">{count}개</span>}
              </div>

              <button
                onClick={() =>
                  matching.length > 0 ? handleSelectInstance(matching[matching.length - 1].uid) : addRoomProp(item.id)
                }
                className="font-bold text-[10.5px] leading-tight line-clamp-2 text-left hover:underline"
              >
                {item.nameKo}
              </button>

              <div className="flex items-center gap-1 pt-0.5">
                <button
                  onClick={() => addRoomProp(item.id)}
                  className={`flex-1 flex items-center justify-center gap-0.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                    count > 0
                      ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
                      : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  <span>추가</span>
                </button>
                {count > 0 && (
                  <button
                    onClick={() => removeRoomProp(matching[matching.length - 1].uid)}
                    className="px-1.5 py-1 rounded-lg bg-zinc-800 text-rose-400 hover:bg-zinc-700 text-[10px] font-bold"
                  >
                    빼기
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
