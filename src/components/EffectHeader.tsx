interface EffectHeaderProps {
  photoCount: number;
  selectedEffectName: string;
}

const EffectHeader = ({
  photoCount,
  selectedEffectName,
}: EffectHeaderProps) => {
  return (
    <div className="relative z-10 p-6 flex justify-between items-start">
      <div
        className="text-xl text-purple-800 hover:scale-105 transition-transform"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        CEKREK.IN
      </div>
      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-purple-300 shadow-lg">
        <div className="text-purple-600 font-bold text-sm">
          {photoCount} Foto | {selectedEffectName}
        </div>
      </div>
    </div>
  );
};

export default EffectHeader;
