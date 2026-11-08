import React from 'react';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { THEMES_DATA } from '@/data/themesSolo/themesData';
import {
  translateEnvironmentItem,
  translateLightingItem,
} from '@/data/themesSolo/environmentTranslator';
import { SoloThemeId } from '@/types/themeSolo';
import {
  Dices,
  MapPin,
  Sun,
  Building2,
  Sparkles,
  Flame,
  SunMedium,
  Crown,
  Home,
  Waves,
  Landmark,
  Briefcase,
  Moon,
  Camera,
  TrainFront,
  Trees,
  Check,
  Sofa,
} from 'lucide-react';

interface ThemeVisualStyle {
  gradient: string;
  propsLabel: string;
  icon: React.ReactNode;
}

const THEME_VISUALS: Record<string, ThemeVisualStyle> = {
  alley_downtown_street: { gradient: 'from-amber-900 via-stone-900 to-zinc-950', propsLabel: '벽돌아치·카페벤치·가로등', icon: <Building2 className="w-4 h-4 text-amber-400" /> },
  backstage_fitting_lounge: { gradient: 'from-rose-950 via-fuchsia-950 to-zinc-950', propsLabel: '조명거울·화장대·행거', icon: <Sparkles className="w-4 h-4 text-rose-400" /> },
  extreme_high_tension_special: { gradient: 'from-purple-950 via-red-950 to-zinc-950', propsLabel: '원형베드·미러·네온부스', icon: <Flame className="w-4 h-4 text-red-400" /> },
  glasshouse_sunroom_lounge: { gradient: 'from-sky-900 via-emerald-950 to-zinc-950', propsLabel: '보태니컬온실·데이베드', icon: <SunMedium className="w-4 h-4 text-sky-300" /> },
  gothic_rococo_salon: { gradient: 'from-indigo-950 via-purple-950 to-zinc-950', propsLabel: '체스터필드소파·대리석기둥', icon: <Crown className="w-4 h-4 text-purple-300" /> },
  house_indoor_room: { gradient: 'from-orange-950 via-stone-900 to-zinc-950', propsLabel: '옷장·침대·화장대·키친·욕실', icon: <Home className="w-4 h-4 text-orange-300" /> },
  infinity_pool_yacht: { gradient: 'from-cyan-900 via-blue-950 to-zinc-950', propsLabel: '요트선베드·인피니티풀', icon: <Waves className="w-4 h-4 text-cyan-300" /> },
  luxury_hotel_penthouse: { gradient: 'from-slate-800 via-indigo-950 to-zinc-950', propsLabel: '펜트하우스·바·자쿠지', icon: <Landmark className="w-4 h-4 text-indigo-300" /> },
  maldives_beach_villa: { gradient: 'from-emerald-900 via-cyan-950 to-zinc-950', propsLabel: '수상방갈로·카바나·라군', icon: <Trees className="w-4 h-4 text-emerald-300" /> },
  onsen_ryokan_spa: { gradient: 'from-teal-950 via-stone-900 to-zinc-950', propsLabel: '히노끼노천탕·다다미·쇼지창', icon: <Waves className="w-4 h-4 text-teal-300" /> },
  pilates_mirror_studio: { gradient: 'from-zinc-800 via-neutral-900 to-zinc-950', propsLabel: '리포머·캐딜락·발레바·거울', icon: <Camera className="w-4 h-4 text-zinc-200" /> },
  private_ceo_office: { gradient: 'from-slate-900 via-zinc-900 to-zinc-950', propsLabel: 'CEO데스크·서재책장·소파', icon: <Briefcase className="w-4 h-4 text-blue-300" /> },
  private_jet_cabin: { gradient: 'from-amber-950 via-slate-900 to-zinc-950', propsLabel: '오벌기내창·VIP리클라이너', icon: <Crown className="w-4 h-4 text-amber-300" /> },
  private_stretch_limousine: { gradient: 'from-fuchsia-900 via-blue-950 to-zinc-950', propsLabel: '리무진J시트·오닉스샴페인바', icon: <TrainFront className="w-4 h-4 text-fuchsia-300" /> },
  vip_aroma_oil_spa: { gradient: 'from-rose-950 via-stone-950 to-zinc-950', propsLabel: '아로마베드·스톤욕조·캔들', icon: <Moon className="w-4 h-4 text-rose-300" /> },
  vip_gym_sauna_suite: { gradient: 'from-blue-950 via-slate-900 to-zinc-950', propsLabel: '웨이트벤치·덤벨랙·건식사우나', icon: <Building2 className="w-4 h-4 text-sky-300" /> },
};

export const ThemeEnvironmentTab: React.FC = () => {
  const {
    selectedThemeId,
    selectedEnvIndex,
    selectedLightIndex,
    showThemeProps,
    setSelectedThemeId,
    setSelectedEnvIndex,
    setSelectedLightIndex,
    setShowThemeProps,
    rollRandomEnvironment,
  } = useThemeSoloStore();

  const currentTheme = THEMES_DATA[selectedThemeId];
  const themeEntries = Object.entries(THEMES_DATA) as [SoloThemeId, typeof currentTheme][];
  const translatedEnvs = currentTheme.environments.map((env, idx) =>
    translateEnvironmentItem(env, idx, selectedThemeId)
  );

  return (
    <div className="block space-y-3.5 text-xs pb-4">
      {/* 1. 상단 3D 사물 토글 및 시간대 조명 선택 바 */}
      <div className="p-3 bg-zinc-100/90 rounded-2xl flex flex-col gap-2.5 border border-zinc-200/70">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold text-zinc-900">
            <Sofa className="w-4 h-4 text-amber-600" />
            <span>themes_solo 16개 파일 · 380종 세부 배경 사물</span>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={rollRandomEnvironment}
              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-zinc-200 text-zinc-800 font-semibold rounded-full border border-zinc-200 text-[11px] transition-colors"
              title="380종 배경 무작위 추천"
            >
              <Dices className="w-3.5 h-3.5 text-blue-600" />
              <span>랜덤</span>
            </button>
            <button
              onClick={() => setShowThemeProps(!showThemeProps)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                showThemeProps
                  ? 'bg-zinc-900 text-amber-400 shadow-xs'
                  : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
              }`}
            >
              {showThemeProps ? '사물 ON' : '사물 OFF'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1 border-t border-zinc-200/70">
          <span className="flex items-center gap-1 text-[11px] font-bold text-zinc-700 shrink-0">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            조명 ({currentTheme.lightings.length}종)
          </span>
          <select
            value={selectedLightIndex}
            onChange={(e) => setSelectedLightIndex(Number(e.target.value))}
            className="flex-1 bg-white text-zinc-900 border border-zinc-200 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
          >
            {currentTheme.lightings.map((light, idx) => (
              <option key={idx} value={idx}>
                {translateLightingItem(light, idx)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. 1단계: 16개 테마 파일 (3열 그리드) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-0.5">
          <span className="font-bold text-zinc-900 text-xs">
            1. 대분류 테마 파일 선택 (16종 · 3열)
          </span>
          <span className="text-[11px] font-bold text-blue-600">{currentTheme.titleKo}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {themeEntries.map(([id, theme], index) => {
            const isSelected = selectedThemeId === id;
            const visual = THEME_VISUALS[id] || THEME_VISUALS.alley_downtown_street;

            return (
              <button
                key={id}
                onClick={() => setSelectedThemeId(id)}
                className={`group relative p-2 rounded-2xl text-left transition-all border flex flex-col gap-1 ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-blue-600 ring-2 ring-blue-600/25 shadow-md'
                    : 'bg-white text-zinc-900 border-zinc-200/90 hover:border-zinc-400'
                }`}
              >
                <div
                  className={`relative w-full h-12 rounded-xl overflow-hidden bg-gradient-to-br ${visual.gradient} flex items-center justify-between px-2 border border-white/10`}
                >
                  <div className="p-1.5 rounded-lg bg-black/35 border border-white/10">
                    {visual.icon}
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/45 text-amber-200">
                    {theme.environments.length}개 장소
                  </span>
                </div>
                <div className="px-0.5">
                  <div className="font-bold text-[11px] truncate">
                    {String(index + 1).padStart(2, '0')}. {theme.titleKo}
                  </div>
                  <div className={`text-[9px] truncate ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {visual.propsLabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 2단계: 선택한 테마 파일 내부의 모든 세부 장소 & 3D 사물 세트 (22~50종 · 3열 그리드) */}
      <div className="space-y-1.5 pt-2 border-t border-zinc-200/80">
        <div className="flex items-center justify-between px-0.5">
          <span className="flex items-center gap-1 font-bold text-zinc-900 text-xs">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>
              2. {currentTheme.titleKo} 세부 장소 ({translatedEnvs.length}종 · 3열)
            </span>
          </span>
          <span className="text-[11px] font-bold text-amber-600">
            {selectedEnvIndex + 1}번 세트 적용 중
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {translatedEnvs.map((item) => {
            const isActive = selectedEnvIndex === item.index;
            return (
              <button
                key={item.index}
                onClick={() => setSelectedEnvIndex(item.index)}
                className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between gap-1 ${
                  isActive
                    ? 'bg-zinc-900 text-white border-amber-500 ring-2 ring-amber-500/25 shadow-sm'
                    : 'bg-zinc-50 hover:bg-white text-zinc-800 border-zinc-200/90 hover:border-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-[10px] font-bold leading-tight line-clamp-2 ${
                      isActive ? 'text-white' : 'text-zinc-900'
                    }`}
                  >
                    {item.titleKo}
                  </span>
                  {isActive && <Check className="w-3 h-3 text-amber-400 shrink-0" />}
                </div>
                <span
                  className={`text-[9px] font-semibold truncate ${
                    isActive ? 'text-amber-300' : 'text-zinc-500'
                  }`}
                >
                  {item.propsKo}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
