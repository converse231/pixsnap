import React from "react";
import {
  Camera,
  XCircle,
  Repeat,
  Expand,
  Loader,
  X,
  Maximize,
  Minimize,
} from "lucide-react";
import { motion } from "framer-motion";
import ActionButton from "./ActionButton";

const CameraView = ({
  cameraActive,
  loading,
  countdownActive,
  photoSessionActive,
  countdown,
  currentPhotoIndex,
  cameraError,
  isMobile,
  videoRef,
  canvasRef,
  startPhotoSession,
  toggleCamera,
  switchCamera,
  toggleFullScreen,
  isFullScreen,
  handleVideoLoaded,
}) => {
  return (
    <div
      className={`relative flex-1 aspect-video flex items-center justify-center ${
        isFullScreen ? "h-full" : ""
      }`}
    >
      {/* Video Element for Camera Stream */}
      {cameraActive && (
        <>
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover ${
              isFullScreen ? "rounded-none" : ""
            }`}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={handleVideoLoaded}
            onError={(e) => {
              console.error("Video error:", e);
            }}
          />
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}

      {/* Countdown Display */}
      {countdownActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="text-white text-5xl sm:text-7xl md:text-9xl font-bold animate-pulse bg-black/40 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center">
            {countdown}
          </div>
          {photoSessionActive && (
            <div className="absolute top-4 sm:top-6 left-0 right-0 text-center">
              <span className="bg-purple-600 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-white text-sm sm:text-base font-bold">
                Photo {currentPhotoIndex + 1} of 4
              </span>
            </div>
          )}
        </div>
      )}

      {/* Camera Placeholder - shown when camera is not active */}
      {!cameraActive && !loading && (
        <div
          className={`flex flex-col items-center justify-center text-gray-500 p-4 text-center ${
            isFullScreen ? "h-full" : "h-[300px] sm:h-[400px] md:h-[500px]"
          }`}
        >
          <div className="bg-gray-900/50 p-6 sm:p-8 rounded-xl max-w-md">
            <div className="mb-4 sm:mb-6">
              <Camera className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400" />
            </div>
            <p className="text-base sm:text-xl mb-4 sm:mb-6 text-gray-300 font-medium">
              Create Your Photo Strip
            </p>

            {cameraError ? (
              <div className="text-center mb-6 px-2">
                <div className="flex items-center justify-center text-red-500 mb-2">
                  <XCircle size={18} className="sm:size-20 md:size-22 mr-2" />
                  <span>Camera Error</span>
                </div>
                <p className="text-red-400 text-xs sm:text-sm max-w-md px-2 sm:px-4">
                  {cameraError}
                </p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm sm:text-base mb-6">
                Access your camera to take a series of 4 photos that will be
                combined into a classic photo strip.
              </p>
            )}

            {/* Camera Control Button */}
            <ActionButton
              onClick={toggleCamera}
              icon={<Camera />}
              className="mx-auto py-3 px-8"
            >
              Turn on camera
            </ActionButton>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div
          className={`flex flex-col items-center justify-center text-gray-500 ${
            isFullScreen ? "h-full" : "h-[300px] sm:h-[400px] md:h-[500px]"
          }`}
        >
          <div className="animate-spin mb-4">
            <Loader size={32} className="sm:size-40 md:size-48" />
          </div>
          <p className="text-sm sm:text-base text-gray-300">
            Accessing camera...
          </p>
        </div>
      )}

      {/* Camera control buttons when active */}
      {cameraActive && !countdownActive && !photoSessionActive && (
        <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center space-x-4 sm:space-x-5 px-2">
          <ActionButton onClick={startPhotoSession} icon={<Camera />}>
            Take Photos
          </ActionButton>

          <ActionButton
            onClick={toggleCamera}
            icon={<XCircle />}
            variant="danger"
          >
            Turn off
          </ActionButton>
        </div>
      )}

      {/* Session Progress Indicator */}
      {photoSessionActive && !countdownActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="text-center px-4 bg-black/40 py-6 px-8 rounded-2xl">
            <div className="animate-pulse mb-3 sm:mb-4">
              <Camera className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white mx-auto" />
            </div>
            <p className="text-white text-sm sm:text-base md:text-lg font-medium">
              Get ready for photo {currentPhotoIndex + 1} of 4
            </p>
          </div>
        </div>
      )}

      {/* Camera switch button - only shown on mobile when camera is active */}
      {cameraActive && isMobile && !countdownActive && !photoSessionActive && (
        <button
          onClick={switchCamera}
          className="absolute top-3 left-3 bg-black/60 rounded-full p-2.5 text-white/90 hover:text-white hover:bg-black/80 transition z-10"
          title="Switch camera"
        >
          <Repeat size={20} />
        </button>
      )}

      {/* Expand Button */}
      <button
        onClick={toggleFullScreen}
        className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/60 rounded-md p-2 sm:p-2.5 text-white/90 hover:text-white hover:bg-black/80 transition z-10"
        title={isFullScreen ? "Exit full screen" : "Full screen"}
      >
        {isFullScreen ? (
          <Minimize size={16} className="sm:size-18 md:size-5" />
        ) : (
          <Maximize size={16} className="sm:size-18 md:size-5" />
        )}
      </button>
    </div>
  );
};

export default CameraView;
