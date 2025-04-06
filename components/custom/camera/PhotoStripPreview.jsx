import React from "react";
import { User, Download } from "lucide-react";
import { motion } from "framer-motion";
import { getDesignById, applyDesignStyles } from "../photo-strip-designs";
import ActionButton from "./ActionButton";

const PhotoStripPreview = ({
  capturedPhotos,
  stripDesign,
  photoStripRef,
  downloadPhotoStrip,
}) => {
  const currentDesign = getDesignById(stripDesign);
  const designStyles = applyDesignStyles(currentDesign);

  // Determine if design is dark to adjust text color
  const isDarkDesign =
    currentDesign.id.includes("neon") ||
    currentDesign.id.includes("tech") ||
    currentDesign.id.includes("dusk");

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full shadow-xl">
        <div
          ref={photoStripRef}
          className="photo-strip-container relative rounded-xl overflow-hidden flex flex-col"
          style={designStyles}
        >
          {/* Photo Frames */}
          <div className="photo-frames flex-1 flex flex-col justify-around gap-1 sm:gap-2 p-2 sm:p-3">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="photo-frame relative rounded-md overflow-hidden bg-white border-2 border-white"
                  style={{ height: "23%" }}
                >
                  {capturedPhotos[i] ? (
                    <img
                      src={capturedPhotos[i]}
                      alt={`Photo ${i + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/30">
                      <User
                        size={12}
                        className="sm:size-14 md:size-6 text-gray-700/40"
                      />
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Strip Footer */}
          <div
            className={`strip-footer text-center pb-3 pt-6 sm:pb-4 sm:pt-8 px-2 border-t-2 ${
              isDarkDesign ? "border-white/40" : "border-white/30"
            }`}
          >
            <span
              className={`text-xs font-bold ${
                isDarkDesign ? "text-card-foreground" : "text-gray-800"
              }`}
            >
              PixSnap Photo Booth
            </span>
            <p
              className={`text-[10px] sm:text-xs font-medium ${
                isDarkDesign ? "text-card-foreground" : "text-gray-700"
              }`}
            >
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-col items-center gap-3 w-full">
        {/* Status and Instructions */}
        <div className="text-center w-full bg-gray-800/50 rounded-md py-2 px-3">
          {capturedPhotos.length === 0 ? (
            <p className="text-white/80 text-xs sm:text-sm text-center">
              Take photos to create your photo strip
            </p>
          ) : capturedPhotos.length < 4 ? (
            <p className="text-white/80 text-xs sm:text-sm">
              <span className="text-purple-400 font-medium">
                {capturedPhotos.length}/4
              </span>{" "}
              photos taken - {4 - capturedPhotos.length} more to complete
            </p>
          ) : (
            <p className="text-green-400 text-xs sm:text-sm font-medium">
              Photo strip complete! ✓
            </p>
          )}
        </div>

        {/* Download button (shown only when photo strip is complete) */}
        {capturedPhotos.length >= 4 ? (
          <ActionButton
            onClick={downloadPhotoStrip}
            icon={<Download />}
            className="w-full"
          >
            Download Photo Strip
          </ActionButton>
        ) : (
          <p className="text-white/50 text-xs italic text-center">
            {capturedPhotos.length > 0
              ? "Continue taking photos to complete your strip"
              : "Download option will appear after you complete the photo strip"}
          </p>
        )}
      </div>
    </div>
  );
};

export default PhotoStripPreview;
