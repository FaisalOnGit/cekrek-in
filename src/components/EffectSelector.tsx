import { Effect } from "../utils/effectHelper";

interface EffectSelectorProps {
  effects: Effect[];
  selectedEffect: Effect;
  onEffectChange: (effect: Effect) => void;
  isProcessing: boolean;
}

const EffectSelector = ({
  effects,
  selectedEffect,
  onEffectChange,
  isProcessing,
}: EffectSelectorProps) => {
  return (
    <div className="w-full max-w-4xl mb-6">
      <h3
        className="text-center text-purple-800 font-bold text-lg mb-4"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        PILIH EFFECT
      </h3>

      <div className="flex gap-3 justify-center flex-wrap">
        {effects.map((effect) => (
          <button
            key={effect.id}
            onClick={() => onEffectChange(effect)}
            disabled={isProcessing}
            className={`
              px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 
              hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
              ${
                selectedEffect.id === effect.id
                  ? "bg-purple-600 text-white border-2 border-purple-800"
                  : "bg-white text-purple-600 border-2 border-purple-300 hover:bg-purple-50"
              }
            `}
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            {effect.name}
          </button>
        ))}
      </div>

      {isProcessing && (
        <div className="text-center mt-3">
          <p
            className="text-purple-600 text-xs animate-pulse"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            MEMPROSES EFFECT...
          </p>
        </div>
      )}
    </div>
  );
};

export default EffectSelector;
