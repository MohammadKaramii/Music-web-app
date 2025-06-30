"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NavigationLoading } from "@/components/ui/LoadingStates";

interface NavigationWrapperProps {
  children: React.ReactNode;
}

const NavigationWrapper: React.FC<NavigationWrapperProps> = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsNavigating(true);

    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {isNavigating && <NavigationLoading />}
      {children}
    </>
  );
};

export default NavigationWrapper;
