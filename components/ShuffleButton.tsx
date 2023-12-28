import React from "react";
import { FaShuffle } from "react-icons/fa6";

interface ShuffleButtonProps {
    shuffleMode: boolean;
    toggleShuffle: () => void;
  }
  

  const ShuffleButton: React.FC<ShuffleButtonProps> = ({
    shuffleMode,
    toggleShuffle,
  }) => {
  return (
    <button onClick={toggleShuffle}>
      {shuffleMode ? (
        <FaShuffle color="white" size={20} />
      ) : (
        <FaShuffle color="gray" size={20} />
      )}
    </button>
  );
};

export default ShuffleButton;