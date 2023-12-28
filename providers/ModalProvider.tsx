'use client';

import UploadModal from '@/components/UploadModal';


import { useEffect, useState } from 'react';



const ModalProvider: React.FC = () => {
  const [isMounted, setisMounted] = useState(false);

  useEffect(() => {
    setisMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <UploadModal />
    </>
  );
};

export default ModalProvider;
