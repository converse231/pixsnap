import React from "react";
import { Loader } from "lucide-react";

const DownloadProgress = ({ downloading, downloadProgress }) => {
  if (!downloading) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-[92%] flex flex-col items-center">
        <Loader
          className="animate-spin mb-4 text-purple-600 dark:text-purple-400"
          size={40}
        />
        <p className="text-gray-800 dark:text-white text-lg mb-3">
          Generating your photo strip...
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${downloadProgress}%` }}
          ></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
          Please wait, this may take a moment
        </p>
      </div>
    </div>
  );
};

export default DownloadProgress;
