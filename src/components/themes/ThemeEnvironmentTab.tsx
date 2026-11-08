import React from 'react';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { THEMES_DATA } from '@/data/themesSolo/themesData';
import { SoloThemeId } from '@/types/themeSolo';
import { Dices, MapPin, Sun } from 'lucide-react';

function formatEnvironmentKo(env: string, idx: number, themeTitle: string): string {
  if (/sunlit brick|brick backstreet/i.test(env)) return `${idx + 1}. 햇살 드는 벽돌 골목길`;
  if (/neon/i.test(env)) return `${idx + 1}. 네온 조명 스트리트`;
  if (/penthouse|skyline/i.test(env)) return `${idx + 1}. 도심 스카이라인 펜트하우스`;
  if (/yacht|pool/i.test(env)) return `${idx + 1}. 럭셔리 요트 갑판 & 풀`;
  if (/balcony|terrace/i.test(env)) return `${idx + 1}. 야외 테라스 & 발코니`;
  if (/window|glass/i.test(env)) return `${idx + 1}. 통유리창 자연광 라운지`;
  if (/couch|sofa|velvet/i.test(env)) return `${idx + 1}. 벨벳 소파 & 응접실`;
  if (/bed|bedroom/i.test(env)) return `${idx + 1}. 아늑한 침실 인테리어`;
  return `${idx + 1}. ${themeTitle} 세부 장소 #${idx + 1}`;
}

function formatLightingKo(light: string, idx: number): string {
  if (/golden hour|sunset/i.test(light)) return `${idx + 1}. 황금빛 석양 골든아워`;
  if (/neon|dramatic/i.test(light)) return `${idx + 1}. 선명한 네온 컬러 앰비언트`;
  if (/soft|diffused|studio/i.test(light)) return `${idx + 1}. 부드러운 스튜디오 확산광`;
  if (/morning|sunrise|daylight/i.test(light)) return `${idx + 1}. 맑은 아침 자연광`;
  if (/night|dark|moody/i.test(light)) return `${idx + 1}. 딥 나이트 무드 조명`;
  return `${idx + 1}. 프리미엄 앰비언트 조명 #${idx + 1}`;
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
    <div className="flex flex-col gap-4 text-xs">
      {/* 16개 테마 카드 그리드 */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[#141414] text-[13px] tracking-tight">
          16대 솔로 테마 공간
        </span>
        <button
          onClick={rollRandomEnvironment}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#f3f3f3] hover:bg-[#e0e0e0] text-[#141414] font-medium rounded-full transition-colors active:scale-95"
          title="배경 & 조명 무작위 추첨"
        >
          <Dices className="w-3.5 h-3.5 text-[#0066ff]" />
          <span>랜덤 배경</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
        {themeEntries.map(([id, theme]) => {
          const isSelected = selectedThemeId === id;
          return (
            <button
              key={id}
              onClick={() => setSelectedThemeId(id)}
              className={`p-2.5 rounded-[16px] text-left transition-all border ${
                isSelected
                  ? 'bg-[#141414] text-[#ffffff] border-[#141414]'
                  : 'bg-[#ffffff] text-[#141414] border-[#e0e0e0] hover:bg-[#f3f3f3]'
              }`}
            >
              <div className="font-semibold text-[11px] truncate">{theme.titleKo}</div>
              <div
                className={`text-[10px] mt-0.5 line-clamp-1 ${
                  isSelected ? 'text-[#adadad]' : 'text-[#707070]'
                }`}
              >
                {theme.descriptionKo}
              </div>
            </button>
          );
        })}
      </div>

      {/* 세부 배경 장소 선택 (22~50종) */}
      <div className="flex flex-col gap-1.5 pt-2 border-t border-[#f0f0f0]">
        <div className="flex items-center justify-between text-[#707070]">
          <span className="flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#0066ff]" />
            세부 배경 장소 ({currentTheme.environments.length}종)
          </span>
          <span className="font-mono text-[11px]">#{selectedEnvIndex + 1}</span>
        </div>
        <select
          value={selectedEnvIndex}
          onChange={(e) => setSelectedEnvIndex(Number(e.target.value))}
          className="w-full bg-[#f0f0f0] text-[#141414] rounded-[16px] px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#141414] cursor-pointer"
        >
          {currentTheme.environments.map((env, idx) => (
            <option key={idx} value={idx}>
              {formatEnvironmentKo(env, idx, currentTheme.titleKo)}
            </option>
          ))}
        </select>
      </div>

      {/* 조명 및 주변 소품 선택 (5~20종) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[#707070]">
          <span className="flex items-center gap-1 font-medium">
            <Sun className="w-3.5 h-3.5 text-[#0066ff]" />
            시간대 조명 & 소품 ({currentTheme.lightings.length}종)
          </span>
          <span className="font-mono text-[11px]">#{selectedLightIndex + 1}</span>
        </div>
        <select
          value={selectedLightIndex}
          onChange={(e) => setSelectedLightIndex(Number(e.target.value))}
          className="w-full bg-[#f0f0f0] text-[#141414] rounded-[16px] px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#141414] cursor-pointer"
        >
          {currentTheme.lightings.map((light, idx) => (
            <option key={idx} value={idx}>
              {formatLightingKo(light, idx)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

