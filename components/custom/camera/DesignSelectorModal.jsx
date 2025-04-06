import React from "react";
import { X } from "lucide-react";
import { PhotoStripDesignSelector } from "../photo-strip-designs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const DesignSelectorModal = ({
  showDesignSelector,
  setShowDesignSelector,
  stripDesign,
  setStripDesign,
}) => {
  return (
    <Dialog open={showDesignSelector} onOpenChange={setShowDesignSelector}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Choose Photo Strip Design</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh]">
          <div>
            <PhotoStripDesignSelector
              activeDesignId={stripDesign}
              onSelectDesign={(designId) => {
                setStripDesign(designId);
                setShowDesignSelector(false);
              }}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DesignSelectorModal;
