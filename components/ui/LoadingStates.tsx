"use client";

import React from "react";
import {
  BounceLoader,
  PulseLoader,
  BarLoader,
  ClipLoader,
} from "react-spinners";
import Box from "@/components/Box";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}


export const FullPageLoading: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = "#bc2a8d",
}) => {
  return (
    <Box className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <BounceLoader color={color} size={size} />
        <p className="text-neutral-400 text-sm">Loading...</p>
      </div>
    </Box>
  );
};


export const InlineLoading: React.FC<LoadingSpinnerProps> = ({
  size = 20,
  color = "#bc2a8d",
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <PulseLoader color={color} size={size} />
    </div>
  );
};


export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-neutral-800 rounded-md p-3 animate-pulse">
      <div className="w-full aspect-square bg-neutral-700 rounded-md mb-4"></div>
      <div className="h-4 bg-neutral-700 rounded mb-2"></div>
      <div className="h-3 bg-neutral-700 rounded w-2/3"></div>
    </div>
  );
};


export const SongItemSkeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md animate-pulse">
      <div className="relative rounded-md min-h-[48px] min-w-[48px] bg-neutral-700"></div>
      <div className="flex flex-col gap-y-1 overflow-hidden flex-1">
        <div className="h-4 bg-neutral-700 rounded w-3/4"></div>
        <div className="h-3 bg-neutral-700 rounded w-1/2"></div>
      </div>
    </div>
  );
};


export const SearchLoading: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 px-6">
      <div className="text-neutral-400 text-sm flex items-center gap-2">
        <ClipLoader color="#bc2a8d" size={16} />
        Searching...
      </div>
    </div>
  );
};


export const GridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mt-4">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};


export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="flex flex-col gap-2 px-6">
      {Array.from({ length: count }).map((_, index) => (
        <SongItemSkeleton key={index} />
      ))}
    </div>
  );
};


export const NavigationLoading: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <BarLoader color="#bc2a8d" width="100%" height={2} />
    </div>
  );
};


export const ButtonLoading: React.FC<LoadingSpinnerProps> = ({
  size = 16,
  color = "white",
}) => {
  return <ClipLoader color={color} size={size} />;
};


export const ErrorState: React.FC<{
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}> = ({ message = "Something went wrong", onRetry, showRetry = true }) => {
  return (
    <Box className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-neutral-400 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-white text-lg font-medium mb-2">Oops!</h3>
        <p className="text-neutral-400 text-sm mb-4">{message}</p>
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </Box>
  );
};


export const EmptyState: React.FC<{
  title?: string;
  description?: string;
  action?: React.ReactNode;
}> = ({
  title = "No results found",
  description = "Try adjusting your search or filters",
  action,
}) => {
  return (
    <Box className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-neutral-400 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-white text-lg font-medium mb-2">{title}</h3>
        <p className="text-neutral-400 text-sm mb-4">{description}</p>
        {action}
      </div>
    </Box>
  );
};


export const LoadingOverlay: React.FC<{
  isVisible: boolean;
  message?: string;
}> = ({ isVisible, message = "Loading..." }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-neutral-800 rounded-lg p-6 flex flex-col items-center gap-4">
        <BounceLoader color="#bc2a8d" size={40} />
        <p className="text-white text-sm">{message}</p>
      </div>
    </div>
  );
};


export const SuspenseFallback: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <React.Suspense fallback={<FullPageLoading />}>{children}</React.Suspense>
  );
};
