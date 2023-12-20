import { useState } from 'react';

import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';


const LikeButton: React.FC = () => {
  const [isLiked, setIsLiked] = useState(false);
  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;
  const handleLike = () => {
    setIsLiked((prevLiked) => !prevLiked);
  };

  return (
    <button
      className={`cursor-pointer hover:opacity-75 transition ${
        isLiked ? 'text-red-500' : ''
      }`}
      onClick={handleLike}
    >

      <Icon color={isLiked ? '#BE3144' : 'white'} size={25} />
    </button>
  );
};

export default LikeButton;