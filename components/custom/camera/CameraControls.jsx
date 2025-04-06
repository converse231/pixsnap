import React from "react";
import { Clock, Palette, XCircle } from "lucide-react";
import { getDesignById } from "../photo-strip-designs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <div className="bg-card backdrop-blur-md border-t px-4 py-3 sm:px-6 sm:py-4 flex flex-wrap md:flex-nowrap gap-3 sm:gap-4 items-center justify-between">
      {/* Design Selector Button */}
      <div className="flex items-center gap-2 order-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDesignSelector(true)}
          className="gap-2"
        >
          <Palette className="size-4 text-muted-foreground" />
          <span className="text-xs sm:text-sm font-medium">
            Design:{" "}
            <span className="font-semibold">
              {getDesignById(stripDesign).label}
            </span>
          </span>
        </Button>
      </div>

      {/* Interval Selector */}
      <div className="flex items-center gap-2 order-2">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" />
          <div className="flex gap-1">
            {intervalOptions.map((option) => (
              <Button
                key={option.value}
                variant={photoInterval === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setPhotoInterval(option.value)}
                disabled={photoSessionActive || countdownActive}
                className={cn(
                  "text-xs px-3 min-w-[40px]",
                  photoInterval === option.value && "shadow-sm"
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="order-3">
        <Button
          variant="outline"
          size="sm"
          onClick={resetPhotoBooth}
          className="gap-2 text-destructive hover:text-destructive-foreground hover:bg-destructive"
        >
          <XCircle className="size-4" />
          <span className="text-xs sm:text-sm font-medium">Reset</span>
        </Button>
      </div>
    </div>
  );
};

export default CameraControls;
