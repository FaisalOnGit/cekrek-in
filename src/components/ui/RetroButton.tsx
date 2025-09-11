import React from "react";

interface RetroButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const RetroButton: React.FC<RetroButtonProps> = ({
  children,
  onClick,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{ fontFamily: '"Press Start 2P", monospace' }}
      className="mx-auto px-6 py-4 bg-[#6B4BB2] text-white text-sm rounded relative z-10
        border-4 border-[#452C7D] shadow-[4px_4px_0_0_#E99AEA] 
        hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition"
    >
      {children}
    </button>
  );
};

export default RetroButton;
