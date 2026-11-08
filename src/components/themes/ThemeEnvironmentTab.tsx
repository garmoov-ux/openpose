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
} from 'lucide-react';

interface ThemeVisualStyle {
  gradient: string;
  accent: string;
  icon: React.ReactNode;
}

const THEME_VISUALS: Record<string, ThemeVisualStyle> = {
  alley_downtown_street: { gradient: 'from-amber-900 via-stone-900 to-zinc-950', accent: '#f59e0b', icon: <Building2 className="w-5 h-5 text-amber-400" /> },
  backstage_fitting_lounge: { gradient: 'from-rose-950 via-fuchsia-950 to-zinc-950', accent: '#f43f5e', icon: <Sparkles className="w-5 h-5 text-rose-400" /> },
  extreme_high_tension_special: { gradient: 'from-purple-950 via-red-950 to-zinc-950', accent: '#e11d48', icon: <Flame className="w-5 h-5 text-red-400" /> },
  glasshouse_sunroom_lounge: { gradient: 'from-sky-900 via-emerald-950 to-zinc-950', accent: '#38bdf8', icon: <SunMedium className="w-5 h-5 text-sky-300" /> },
  gothic_rococo_salon: { gradient: 'from-indigo-950 via-purple-950 to-zinc-950', accent: '#a855f7', icon: <Crown className="w-5 h-5 text-purple-300" /> },
  house_indoor_room: { gradient: 'from-orange-950 via-stone-900 to-zinc-950', accent: '#fb923c', icon: <Home className="w-5 h-5 text-orange-300" /> },
  infinity_pool_yacht: { gradient: 'from-cyan-900 via-blue-950 to-zinc-950', accent: '#06b6d4', icon: <Waves className="w-5 h-5 text-cyan-300" /> },
  luxury_hotel_penthouse: { gradient: 'from-slate-800 via-indigo-950 to-zinc-950', accent: '#818cf8', icon: <Landmark className="w-5 h-5 text-indigo-300" /> },
  maldives_beach_villa: { gradient: 'from-emerald-900 via-cyan-950 to-zinc-950', accent: '#34d399', icon: <Trees className="w-5 h-5 text-emerald-300" /> },
  onsen_ryokan_spa: { gradient: 'from-teal-950 via-stone-900 to-zinc-950', accent: '#2dd4bf', icon: <Waves className="w-5 h-5 text-teal-300" /> },
  pilates_mirror_studio: { gradient: 'from-zinc-800 via-neutral-900 to-zinc-950', accent: '#e2e8f0', icon: <Camera className="w-5 h-5 text-zinc-200" /> },
  private_ceo_office: { gradient: 'from-slate-900 via-zinc-900 to-zinc-950', accent: '#60a5fa', icon: <Briefcase className="w-5 h-5 text-blue-300" /> },
  private_jet_cabin: { gradient: 'from-amber-950 via-slate-900 to-zinc-950', accent: '#fbbf24', icon: <Crown className="w-5 h-5 text-amber-300" /> },
  private_stretch_limousine: { gradient: 'from-fuchsia-900 via-blue-950 to-zinc-950', accent: '#e879f9', icon: <TrainFront className="w-5 h-5 text-fuchsia-300" /> },
  vip_aroma_oil_spa: { gradient: 'from-rose-950 via-stone-950 to-zinc-950', accent: '#fb7185', icon: <Moon className="w-5 h-5 text-rose-300" /> },
  vip_gym_sauna_suite: { gradient: 'from-blue-950 via-slate-900 to-zinc-950', accent: '#38bdf8', icon: <Building2 className="w-5 h-5 text-sky-300" /> },
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
    setSelectedThemeId,
    setSelectedEnvIndex,
    setSelectedLightIndex,
    rollRandomEnvironment,
  } = useThemeSoloStore();

  const currentTheme = THEMES_DATA[selectedThemeId];
  const themeEntries = Object.entries(THEMES_DATA) as [SoloThemeId, typeof currentTheme][];

  return (
    <div className="block space-y-3 text-xs pb-4">
      {/* 상단 세부 장소 & 조명 선택 바 */}
      <div className="p-3 bg-zinc-100/90 rounded-2xl flex flex-col gap-2.5 border border-zinc-200/70">
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
            className="w-full bg-white text-zinc-900 border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
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
            className="w-full bg-white text-zinc-900 border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
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
          16대 테마 공간 미리보기
        </span>
        <button
          onClick={rollRandomEnvironment}
          className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold rounded-full transition-colors active:scale-95"
          title="배경 & 조명 무작위 추천"
        >
          <Dices className="w-3.5 h-3.5 text-blue-600" />
          <span>무작위 배경</span>
        </button>
      </div>

      {/* 높이 제한 없이 전체 스크롤되는 2열 비주얼 테마 프리뷰 */}
      <div className="grid grid-cols-2 gap-2.5">
        {themeEntries.map(([id, theme], index) => {
          const isSelected = selectedThemeId === id;
          const visual = THEME_VISUALS[id] || THEME_VISUALS.alley_downtown_street;

          return (
            <button
              key={id}
              onClick={() => setSelectedThemeId(id)}
              className={`group relative p-2 rounded-2xl text-left transition-all border flex flex-col gap-2 ${
                isSelected
                  ? 'bg-zinc-900 text-white border-blue-600 ring-2 ring-blue-600/25 shadow-md'
                  : 'bg-white text-zinc-900 border-zinc-200/90 hover:border-zinc-400 hover:shadow-sm'
              }`}
            >
              {/* 공간 무드 & 조명 비주얼 프리뷰 썸네일 */}
              <div
                className={`relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-gradient-to-br ${visual.gradient} flex flex-col justify-between p-2.5 border border-white/10`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/40 text-white/90 backdrop-blur-xs">
                    테마 {String(index + 1).padStart(2, '0')}
                  </span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                <div className="flex items-end justify-between">
                  <div className="p-1.5 rounded-lg bg-black/35 backdrop-blur-xs border border-white/10">
                    {visual.icon}
                  </div>
                  <span className="text-[9px] text-white/80 font-medium">
                    장소 {theme.environments.length}곳
                  </span>
                </div>
              </div>

              <div className="px-0.5">
                <div className="font-bold text-[11px] truncate">{theme.titleKo}</div>
                <div
                  className={`text-[10px] mt-0.5 line-clamp-1 ${
                    isSelected ? 'text-zinc-400' : 'text-zinc-500'
                  }`}
                >
                  {theme.descriptionKo}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
