import React from "react";
import { XCircle } from "lucide-react";
import { PhotoStripDesignSelector } from "../photo-strip-designs";

const DesignSelectorModal = ({
  showDesignSelector,
  setShowDesignSelector,
  stripDesign,
  setStripDesign,
}) => {
  // If modal is not shown, return null
  if (!showDesignSelector) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={() => setShowDesignSelector(false)}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 max-w-xl w-[92%] max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white dark:bg-gray-800 pt-1 pb-2 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Choose Photo Strip Design
          </h2>
          <button
            onClick={() => setShowDesignSelector(false)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close design selector"
          >
            <XCircle size={20} />
          </button>
        </div>

        <div className="py-2">
          <PhotoStripDesignSelector
            activeDesignId={stripDesign}
            onSelectDesign={(designId) => {
              setStripDesign(designId);
            }}
          />
        </div>

        <div className="mt-5 flex justify-end sticky bottom-0 pt-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md text-sm mr-2"
            onClick={() => setShowDesignSelector(false)}
          >
            Cancel
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm"
            onClick={() => setShowDesignSelector(false)}
          >
            Apply Design
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesignSelectorModal;
