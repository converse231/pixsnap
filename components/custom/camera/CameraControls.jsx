import React from "react";
import { Clock, Palette, XCircle } from "lucide-react";
import { getDesignById } from "../photo-strip-designs";

const CameraControls = ({
  photoInterval,
  setPhotoInterval,
  stripDesign,
  setShowDesignSelector,
  resetPhotoBooth,
  photoSessionActive,
  countdownActive,
  intervalOptions,
}) => {
  return (
    <div className="bg-gray-900 dark:bg-gray-800 px-3 py-3 sm:px-5 sm:py-4 flex flex-wrap md:flex-nowrap gap-3 sm:gap-4 items-center justify-between">
      {/* Design Selector Button */}
      <div className="flex items-center gap-2 order-1">
        <Palette size={16} className="text-white/80 hidden sm:inline" />
        <button
          onClick={() => setShowDesignSelector(true)}
          className="text-white/90 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 transition-colors flex items-center gap-1.5"
        >
          <span>Design:</span>
          <span className="font-semibold">
            {getDesignById(stripDesign).label}
          </span>
        </button>
      </div>

      {/* Time Interval */}
      <div className="flex items-center gap-2 order-2 md:ml-2">
        <Clock size={16} className="text-white/80 hidden sm:inline" />
        <span className="text-white/90 text-xs sm:text-sm font-medium">
          Countdown:
        </span>
        <div className="flex bg-white/10 rounded-md overflow-hidden">
          {intervalOptions.map((option) => (
            <button
              key={option.value}
              className={`px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm transition ${
                photoInterval === option.value
                  ? "bg-purple-600 text-white"
                  : "text-white/80 hover:bg-white/15"
              }`}
              onClick={() => setPhotoInterval(option.value)}
              disabled={photoSessionActive || countdownActive}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex items-center order-3 sm:ml-auto">
        <button
          onClick={resetPhotoBooth}
          className="text-white/90 text-xs sm:text-sm font-medium bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
          title="Reset photo booth to defaults"
        >
          <XCircle size={14} className="sm:size-16 md:size-5 text-red-400" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default CameraControls;
