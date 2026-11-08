import React from 'react';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { THEMES_DATA } from '@/data/themesSolo/themesData';
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
  accent: string;
  propsLabel: string;
  icon: React.ReactNode;
}

const THEME_VISUALS: Record<string, ThemeVisualStyle> = {
  alley_downtown_street: { gradient: 'from-amber-900 via-stone-900 to-zinc-950', accent: '#f59e0b', propsLabel: '벽돌담·가로등·벤치', icon: <Building2 className="w-4 h-4 text-amber-400" /> },
  backstage_fitting_lounge: { gradient: 'from-rose-950 via-fuchsia-950 to-zinc-950', accent: '#f43f5e', propsLabel: '조명거울·스툴·행거', icon: <Sparkles className="w-4 h-4 text-rose-400" /> },
  extreme_high_tension_special: { gradient: 'from-purple-950 via-red-950 to-zinc-950', accent: '#e11d48', propsLabel: '네온아치·포디움', icon: <Flame className="w-4 h-4 text-red-400" /> },
  glasshouse_sunroom_lounge: { gradient: 'from-sky-900 via-emerald-950 to-zinc-950', accent: '#38bdf8', propsLabel: '온실프레임·화분·소파', icon: <SunMedium className="w-4 h-4 text-sky-300" /> },
  gothic_rococo_salon: { gradient: 'from-indigo-950 via-purple-950 to-zinc-950', accent: '#a855f7', propsLabel: '벨벳소파·대리석기둥', icon: <Crown className="w-4 h-4 text-purple-300" /> },
  house_indoor_room: { gradient: 'from-orange-950 via-stone-900 to-zinc-950', accent: '#fb923c', propsLabel: '침대·볼스터·무드등', icon: <Home className="w-4 h-4 text-orange-300" /> },
  infinity_pool_yacht: { gradient: 'from-cyan-900 via-blue-950 to-zinc-950', accent: '#06b6d4', propsLabel: '선베드·풀데크·난간', icon: <Waves className="w-4 h-4 text-cyan-300" /> },
  luxury_hotel_penthouse: { gradient: 'from-slate-800 via-indigo-950 to-zinc-950', accent: '#818cf8', propsLabel: '라운지소파·기둥·테이블', icon: <Landmark className="w-4 h-4 text-indigo-300" /> },
  maldives_beach_villa: { gradient: 'from-emerald-900 via-cyan-950 to-zinc-950', accent: '#34d399', propsLabel: '데이베드·카바나·수면', icon: <Trees className="w-4 h-4 text-emerald-300" /> },
  onsen_ryokan_spa: { gradient: 'from-teal-950 via-stone-900 to-zinc-950', accent: '#2dd4bf', propsLabel: '히노키욕조·온천수·바위', icon: <Waves className="w-4 h-4 text-teal-300" /> },
  pilates_mirror_studio: { gradient: 'from-zinc-800 via-neutral-900 to-zinc-950', accent: '#e2e8f0', propsLabel: '발레바·리포머·거울', icon: <Camera className="w-4 h-4 text-zinc-200" /> },
  private_ceo_office: { gradient: 'from-slate-900 via-zinc-900 to-zinc-950', accent: '#60a5fa', propsLabel: 'CEO데스크·체어·창틀', icon: <Briefcase className="w-4 h-4 text-blue-300" /> },
  private_jet_cabin: { gradient: 'from-amber-950 via-slate-900 to-zinc-950', accent: '#fbbf24', propsLabel: 'VIP시트·캐빈프레임', icon: <Crown className="w-4 h-4 text-amber-300" /> },
  private_stretch_limousine: { gradient: 'from-fuchsia-900 via-blue-950 to-zinc-950', accent: '#e879f9', propsLabel: '리무진시트·네온바', icon: <TrainFront className="w-4 h-4 text-fuchsia-300" /> },
  vip_aroma_oil_spa: { gradient: 'from-rose-950 via-stone-950 to-zinc-950', accent: '#fb7185', propsLabel: '스파베드·볼스터·램프', icon: <Moon className="w-4 h-4 text-rose-300" /> },
  vip_gym_sauna_suite: { gradient: 'from-blue-950 via-slate-900 to-zinc-950', accent: '#38bdf8', propsLabel: '웨이트벤치·바·미러', icon: <Building2 className="w-4 h-4 text-sky-300" /> },
};

function formatEnvironmentKo(env: string, idx: number, themeTitle: string): string {
  if (/sunlit brick|brick backstreet/i.test(env)) return `${idx + 1}. 햇살 드는 벽돌 골목길`;
  if (/neon/i.test(env)) return `${idx + 1}. 네온 조명 스트리트`;
  if (/penthouse|skyline/i.test(env)) return `${idx + 1}. 도심 스카이라인 펜트하우스`;
  if (/yacht|pool/i.test(env)) return `${idx + 1}. 럭셔리 요트 갑판 & 풀`;
  if (/balcony|terrace/i.test(env)) return `${idx + 1}. 야외 테라스 & 발코니`;
  if (/window|glass/i.test(env)) return `${idx + 1}. 통유리창 자연광 라운지`;
  if (/couch|sofa|velvet/i.test(env)) return `${idx + 1}. 벨벳 소파 & 응접실`;
  if (/bed|bedroom/i.test(env)) return `${idx + 1}. 아늑한 침실 인테리어`;
  return `${idx + 1}. ${themeTitle} 세부 장소 ${idx + 1}`;
}

function formatLightingKo(light: string, idx: number): string {
  if (/golden hour|sunset/i.test(light)) return `${idx + 1}. 황금빛 석양 골든아워`;
  if (/neon|dramatic/i.test(light)) return `${idx + 1}. 선명한 네온 컬러 앰비언트`;
  if (/soft|diffused|studio/i.test(light)) return `${idx + 1}. 부드러운 스튜디오 확산광`;
  if (/morning|sunrise|daylight/i.test(light)) return `${idx + 1}. 맑은 아침 자연광`;
  if (/night|dark|moody/i.test(light)) return `${idx + 1}. 딥 나이트 무드 조명`;
  return `${idx + 1}. 프리미엄 앰비언트 조명 ${idx + 1}`;
}

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

  return (
    <div className="block space-y-3 text-xs pb-4">
      {/* 상단 3D 테마 사물 표시 스위치 및 세부 장소 & 조명 선택 바 */}
      <div className="p-3 bg-zinc-100/90 rounded-2xl flex flex-col gap-2.5 border border-zinc-200/70">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80">
          <span className="flex items-center gap-1.5 font-bold text-zinc-900">
            <Sofa className="w-4 h-4 text-amber-600" />
            <span>3D 테마 배경 사물 (소파·침대·욕조·가로등)</span>
          </span>
          <button
            onClick={() => setShowThemeProps(!showThemeProps)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
              showThemeProps
                ? 'bg-zinc-900 text-amber-400 shadow-xs'
                : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
            }`}
          >
            {showThemeProps ? '사물 표시 중' : '사물 숨김'}
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-zinc-700 font-semibold">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              세부 배경 장소 ({currentTheme.environments.length}종)
            </span>
            <span className="text-[10px] text-blue-600 font-bold">{selectedEnvIndex + 1}번</span>
          </div>
          <select
            value={selectedEnvIndex}
            onChange={(e) => setSelectedEnvIndex(Number(e.target.value))}
            className="w-full bg-white text-zinc-900 border border-zinc-200 rounded-xl px-2.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
          >
            {currentTheme.environments.map((env, idx) => (
              <option key={idx} value={idx}>
                {formatEnvironmentKo(env, idx, currentTheme.titleKo)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-zinc-700 font-semibold">
            <span className="flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              시간대 조명 & 무드 ({currentTheme.lightings.length}종)
            </span>
            <span className="text-[10px] text-blue-600 font-bold">{selectedLightIndex + 1}번</span>
          </div>
          <select
            value={selectedLightIndex}
            onChange={(e) => setSelectedLightIndex(Number(e.target.value))}
            className="w-full bg-white text-zinc-900 border border-zinc-200 rounded-xl px-2.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
          >
            {currentTheme.lightings.map((light, idx) => (
              <option key={idx} value={idx}>
                {formatLightingKo(light, idx)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 16대 테마 비주얼 미리보기 그리드 헤더 */}
      <div className="flex items-center justify-between pt-1">
        <span className="font-bold text-zinc-900 text-xs tracking-tight">
          16대 테마 & 3D 사물 공간 (3열)
        </span>
        <button
          onClick={rollRandomEnvironment}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold rounded-full transition-colors active:scale-95"
          title="배경 & 조명 무작위 추천"
        >
          <Dices className="w-3.5 h-3.5 text-blue-600" />
          <span>무작위 배경</span>
        </button>
      </div>

      {/* 3열 비주얼 테마 프리뷰 (grid-cols-3) */}
      <div className="grid grid-cols-3 gap-2.5">
        {themeEntries.map(([id, theme], index) => {
          const isSelected = selectedThemeId === id;
          const visual = THEME_VISUALS[id] || THEME_VISUALS.alley_downtown_street;

          return (
            <button
              key={id}
              onClick={() => setSelectedThemeId(id)}
              className={`group relative p-2 rounded-2xl text-left transition-all border flex flex-col gap-1.5 ${
                isSelected
                  ? 'bg-zinc-900 text-white border-blue-600 ring-2 ring-blue-600/25 shadow-md'
                  : 'bg-white text-zinc-900 border-zinc-200/90 hover:border-zinc-400 hover:shadow-sm'
              }`}
            >
              <div
                className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br ${visual.gradient} flex flex-col justify-between p-2 border border-white/10`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/45 text-white/95 backdrop-blur-xs">
                    {String(index + 1).padStart(2, '0')}번
                  </span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                <div className="flex items-end justify-between gap-1">
                  <div className="p-1.5 rounded-lg bg-black/35 backdrop-blur-xs border border-white/10">
                    {visual.icon}
                  </div>
                  <span className="text-[9px] text-amber-200 font-semibold truncate">
                    {visual.propsLabel}
                  </span>
                </div>
              </div>

              <div className="px-0.5">
                <div className="font-bold text-[11px] truncate">{theme.titleKo}</div>
                <div
                  className={`text-[10px] mt-0.5 truncate ${
                    isSelected ? 'text-zinc-400' : 'text-zinc-500'
                  }`}
                >
                  {visual.propsLabel}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
