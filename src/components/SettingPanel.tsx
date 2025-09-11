import {
  photoLayouts,
  delayOptions,
  PhotoLayout,
} from "../hooks/usePhotoSession";

interface SettingsPanelProps {
  selectedLayout: PhotoLayout;
  selectedDelay: number;
  onLayoutChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDelayChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onStartSession: () => void;
}

const SettingsPanel = ({
  selectedLayout,
  selectedDelay,
  onLayoutChange,
  onDelayChange,
  onStartSession,
}: SettingsPanelProps) => {
  return (
    <div className="bg-transparent p-2 rounded-2xl mt-2 w-1/2 mb-6">
      <div className="flex gap-6 items-end justify-center">
        <div className="flex-1 max-w-xs">
          <select
            id="layout-select"
            value={selectedLayout.name}
            onChange={onLayoutChange}
            className="w-full p-3 rounded-lg bg-purple-100 text-purple-800 border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-sm font-bold"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            <option value="" disabled>
              Pilih Pose
            </option>
            {photoLayouts.map((layout) => (
              <option key={layout.name} value={layout.name}>
                {layout.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 max-w-xs">
          <select
            id="delay-select"
            value={selectedDelay}
            onChange={onDelayChange}
            className="w-full p-3 rounded-lg bg-purple-100 text-purple-800 border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-sm font-bold"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            <option value="" disabled>
              Pilih Delay
            </option>
            {delayOptions.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onStartSession}
          className="px-8 py-3 rounded-lg text-sm bg-purple-800 hover:bg-purple-700 text-white font-bold transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        >
          MULAI
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
