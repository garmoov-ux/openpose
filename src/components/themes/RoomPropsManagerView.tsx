import React, { useState } from 'react';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { useEditorStore } from '@/stores/useEditorStore';
import { ROOM_PROP_CATALOG, ROOM_PROP_CATEGORIES, RoomPropCategory, getRoomPropDef } from '@/data/themesSolo/roomPropCatalog';
import { ColorPaletteBar } from '../common/ColorPaletteBar';
import { TransformControlBox } from '../common/TransformControlBox';
import { Sofa, Plus, Trash2, Eye, EyeOff, Ban, User, Users, Search } from 'lucide-react';
import { GizmoMode } from '@/types';

export const RoomPropsManagerView: React.FC = () => {
  const [activeCat, setActiveCat] = useState<'all' | RoomPropCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { setGizmoMode, gizmoMode, setSelectedBoneName } = useEditorStore();
  const {
    roomProps, selectedPropUid, activeTransformTarget, mainMannequinTransform, partnerMannequinTransform,
    showPartnerGuide, setSelectedPropUid, setActiveTransformTarget, setMainMannequinTransform,
    setPartnerMannequinTransform, resetMannequinTransform, addRoomProp, toggleRoomProp,
    removeRoomProp, updateRoomPropTransform, updateRoomPropColor, clearAllRoomProps,
  } = useThemeSoloStore();

  const selectedPropInstance = roomProps.find((p) => p.uid === selectedPropUid) || roomProps[0];
  const selectedPropDef = selectedPropInstance ? getRoomPropDef(selectedPropInstance.propId) : undefined;
  const filteredCatalog = ROOM_PROP_CATALOG.filter((item) => {
    const matchesCategory = activeCat === 'all' || item.category === activeCat;
    const query = searchQuery.trim().toLocaleLowerCase();
    const matchesSearch = !query || `${item.nameKo} ${item.badge} ${item.promptEn}`.toLocaleLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleSelectInstance = (uid: string) => {
    setSelectedBoneName(null);
    if (selectedPropUid === uid && activeTransformTarget === 'prop') {
      setSelectedPropUid(null);
      setActiveTransformTarget('none');
    } else {
      setSelectedPropUid(uid);
      setActiveTransformTarget('prop');
      setGizmoMode('translate');
    }
  };

  const handleSelectMannequinTarget = (target: 'main' | 'partner') => {
    setSelectedBoneName(null);
    setSelectedPropUid(null);
    if (activeTransformTarget === target) setActiveTransformTarget('none');
    else { setActiveTransformTarget(target); setGizmoMode('translate'); }
  };

  const handleSetPropGizmoMode = (mode: GizmoMode) => {
    if (selectedPropInstance) {
      setSelectedBoneName(null);
      setSelectedPropUid(selectedPropInstance.uid);
      setActiveTransformTarget('prop');
    }
    setGizmoMode(mode);
  };

  return (
    <div className="space-y-3 text-xs">
      {/* 마네킹 3D 이동·회전·크기 제어 바로가기 */}
      <div className="p-2.5 bg-zinc-100/95 rounded-2xl border border-zinc-200/90 space-y-2">
        <div className="flex items-center justify-between gap-1.5">
          <span className="font-bold text-zinc-900">마네킹 3D 이동·회전·크기 제어 (X/Y/Z)</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleSelectMannequinTarget('main')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold transition-colors ${
                activeTransformTarget === 'main' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-200'
              }`}
            >
              <User className="w-3 h-3" />
              <span>메인 마네킹</span>
            </button>
            {showPartnerGuide && (
              <button
                type="button"
                onClick={() => handleSelectMannequinTarget('partner')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold transition-colors ${
                  activeTransformTarget === 'partner' ? 'bg-rose-600 text-white shadow-xs' : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-200'
                }`}
              >
                <Users className="w-3 h-3" />
                <span>파트너 마네킹</span>
              </button>
            )}
          </div>
        </div>

        {(activeTransformTarget === 'main' || activeTransformTarget === 'partner') && (
          <TransformControlBox
            title={activeTransformTarget === 'main' ? '메인 마네킹 3D 위치·회전·크기' : '파트너 마네킹 3D 위치·회전·크기'}
            accentColor={activeTransformTarget === 'main' ? 'blue' : 'rose'}
            position={activeTransformTarget === 'main' ? mainMannequinTransform.position : partnerMannequinTransform.position}
            rotation={activeTransformTarget === 'main' ? mainMannequinTransform.rotation : partnerMannequinTransform.rotation}
            scale={activeTransformTarget === 'main' ? mainMannequinTransform.scale : partnerMannequinTransform.scale}
            gizmoMode={gizmoMode}
            isGizmoAttached
            onSetGizmoMode={(mode) => setGizmoMode(mode)}
            onDetachGizmo={() => setActiveTransformTarget('none')}
            onChangeTransform={(nextPos, nextRot, nextScale) =>
              activeTransformTarget === 'main'
                ? setMainMannequinTransform({ position: nextPos, rotation: nextRot, scale: nextScale })
                : setPartnerMannequinTransform({ position: nextPos, rotation: nextRot, scale: nextScale })
            }
            onReset={() => resetMannequinTransform(activeTransformTarget)}
          />
        )}
      </div>

      {/* 현재 방 배치 사물 & 전체 해제 */}
      <div className="p-3 bg-zinc-100/95 rounded-2xl border border-zinc-200/90 space-y-2.5">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 font-bold text-zinc-900">
            <Sofa className="w-4 h-4 text-amber-600" />
            <span>현재 공간 배치 ({roomProps.length}개)</span>
          </div>
          <button
            onClick={clearAllRoomProps}
            disabled={roomProps.length === 0}
            className="flex items-center gap-1 px-2.5 py-1 bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-200 disabled:text-zinc-400 text-white rounded-full text-[10.5px] font-bold transition-colors shadow-xs"
            title="모든 공간 배치 해제"
          >
            <Ban className="w-3 h-3" />
            <span>전체 해제</span>
          </button>
        </div>

        <p className="text-[10.5px] text-zinc-500 leading-snug">
          아래 항목을 추가한 뒤 선택하면 색상과 위치, 방향, 크기를 조절할 수 있습니다.
        </p>

        {roomProps.length > 0 && (
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
                      className={`p-1 rounded-md transition-colors ${isSelected ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-500'}`}
                    >
                      {inst.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => removeRoomProp(inst.uid)}
                      className={`p-1 rounded-md transition-colors ${isSelected ? 'hover:bg-zinc-800 text-rose-400' : 'hover:bg-rose-50 text-rose-500'}`}
                      title="해제"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedPropInstance && selectedPropDef && (
          <div className="space-y-2">
            <ColorPaletteBar
              title={`${selectedPropDef.nameKo} 색상 변경`}
              currentColorHex={selectedPropInstance.customColorHex}
              defaultColorHex={selectedPropDef.colorHex}
              onSelectColor={(hex) => updateRoomPropColor(selectedPropInstance.uid, hex)}
              onResetColor={() => updateRoomPropColor(selectedPropInstance.uid, undefined)}
              darkTheme
            />

            <TransformControlBox
              title={`선택 사물: ${selectedPropDef.nameKo}`}
              accentColor="amber"
              position={selectedPropInstance.position}
              rotation={[selectedPropInstance.rotationX || 0, selectedPropInstance.rotationY || 0, selectedPropInstance.rotationZ || 0]}
              scale={selectedPropInstance.scale ?? 1.0}
              gizmoMode={gizmoMode}
              isGizmoAttached={selectedPropUid === selectedPropInstance.uid && activeTransformTarget === 'prop'}
              onSetGizmoMode={handleSetPropGizmoMode}
              onDetachGizmo={() => { setSelectedPropUid(null); setActiveTransformTarget('none'); }}
              onChangeTransform={(nextPos, nextRot, nextScale) =>
                updateRoomPropTransform(selectedPropInstance.uid, nextPos, nextRot[1], nextScale, nextRot[0], nextRot[2])
              }
              onReset={() =>
                updateRoomPropTransform(
                  selectedPropInstance.uid,
                  [selectedPropDef.defaultPos[0], selectedPropDef.defaultPos[1], selectedPropDef.defaultPos[2]],
                  selectedPropDef.defaultRotY ?? 0, 1.0, 0, 0
                )
              }
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {ROOM_PROP_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`px-2 py-1.5 rounded-xl text-[10.5px] font-bold transition-all border text-center truncate ${
              activeCat === cat.id ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-100 text-zinc-600 border-zinc-200/80 hover:text-zinc-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <label className="relative block">
        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="공간 항목 검색"
          aria-label="공간 항목 검색"
          className="min-h-10 w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </label>

      <div className="grid max-h-[min(52vh,520px)] grid-cols-3 gap-2 overflow-y-auto pr-1">
        {filteredCatalog.length === 0 && <p role="status" className="col-span-3 rounded-xl border border-dashed border-zinc-300 bg-white p-4 text-center text-sm text-zinc-600">검색 결과가 없습니다. 검색어나 분류를 바꿔 보세요.</p>}
        {filteredCatalog.map((item) => {
          const matching = roomProps.filter((p) => p.propId === item.id);
          const count = matching.length;
          const activeColor = matching[matching.length - 1]?.customColorHex ?? item.colorHex;
          const hexStr = `#${activeColor.toString(16).padStart(6, '0')}`;

          return (
            <div
              key={item.id}
              className={`p-2 rounded-2xl border flex flex-col justify-between gap-1.5 transition-all ${
                count > 0 ? 'bg-zinc-900 text-white border-amber-500/90 shadow-xs' : 'bg-white text-zinc-900 border-zinc-200/90 hover:border-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded truncate border border-black/10"
                  style={{ backgroundColor: hexStr, color: activeColor > 0xc0c0c0 ? '#18181b' : '#ffffff' }}
                >
                  {item.badge}
                </span>
                {count > 0 && <span className="text-[9.5px] font-bold text-amber-400 shrink-0">{count}개</span>}
              </div>

              <button
                onClick={() => (matching.length > 0 ? handleSelectInstance(matching[matching.length - 1].uid) : addRoomProp(item.id))}
                className="font-bold text-[10.5px] leading-tight line-clamp-2 text-left hover:underline"
              >
                {item.nameKo}
              </button>

              <div className="flex items-center gap-1 pt-0.5">
                <button
                  onClick={() => addRoomProp(item.id)}
                  className={`flex-1 flex items-center justify-center gap-0.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                    count > 0 ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400' : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
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
                    해제
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
