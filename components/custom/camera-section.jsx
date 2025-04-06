"use client";

import React, { useState, useRef, useEffect } from "react";
import * as htmlToImage from "html-to-image";

// Import sub-components
import CameraView from "./camera/CameraView";
import CameraControls from "./camera/CameraControls";
import PhotoStripPreview from "./camera/PhotoStripPreview";
import DesignSelectorModal from "./camera/DesignSelectorModal";
import DownloadProgress from "./camera/DownloadProgress";

function CameraSection() {
  // State for camera
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [useFrontCamera, setUseFrontCamera] = useState(false);

  // State for photo strip and settings
  const [photoInterval, setPhotoInterval] = useState(3); // Default 3 seconds
  const [stripDesign, setStripDesign] = useState("pastel-pink");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showDesignSelector, setShowDesignSelector] = useState(false);

  // State for photo session
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [photoSessionActive, setPhotoSessionActive] = useState(false);

  // State for download
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [imageQuality, setImageQuality] = useState(0.8);
  const [photoCache, setPhotoCache] = useState({});

  // Refs
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const photoStripRef = useRef(null);

  const intervalOptions = [
    { value: 3, label: "3s" },
    { value: 5, label: "5s" },
    { value: 10, label: "10s" },
  ];

  // Check if device is mobile and set state accordingly
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Handle cleanup when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
      clearAllTimers();
    };
  }, []);

  const clearAllTimers = () => {
    console.log("Clearing all timers");
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  };

  // Handle video element onLoadedMetadata event
  const handleVideoLoaded = () => {
    console.log("Video loaded and ready to play");
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.error("Error playing video:", err);
        setCameraError("Could not play video stream. Please try again.");
      });
    }
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      setLoading(true);

      console.log("Requesting camera access...");

      // Set appropriate camera constraints based on device
      const constraints = {
        video: {
          facingMode: isMobile
            ? useFrontCamera
              ? "user"
              : "environment"
            : "user",
          width: { ideal: isMobile ? 720 : 1280 },
          height: { ideal: isMobile ? 1280 : 720 },
        },
        audio: false,
      };

      // Try to access camera with these constraints
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      console.log("Camera access granted, setting up stream...");
      // Store stream reference for cleanup
      streamRef.current = stream;

      // Wait a moment before setting video source to ensure DOM is ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log("Video source object set");
        } else {
          console.error("Video ref is null!");
          setCameraError(
            "Browser video element not available. Please refresh and try again."
          );
          stopCamera();
        }
      }, 100);

      setCameraActive(true);
      setLoading(false);
    } catch (error) {
      console.error("Error accessing camera:", error);

      // If initial attempt fails with environment camera on mobile, try user-facing camera
      if (isMobile && error.name === "OverconstrainedError") {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: useFrontCamera ? "environment" : "user", // Try opposite camera
              width: { ideal: 720 },
              height: { ideal: 1280 },
            },
            audio: false,
          });

          streamRef.current = stream;

          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              console.log("Video source object set (fallback camera)");
              setUseFrontCamera(!useFrontCamera); // Update camera direction state
              setCameraActive(true);
              setLoading(false);
            } else {
              throw new Error("Video ref is null");
            }
          }, 100);

          return;
        } catch (fallbackError) {
          console.error("Fallback camera also failed:", fallbackError);
        }
      }

      setCameraError(
        error.name === "NotAllowedError"
          ? "Camera access denied. Please allow camera access to use this feature."
          : error.name === "NotReadableError"
          ? "Camera is already in use by another application. Please close other applications and try again."
          : error.name === "OverconstrainedError"
          ? "Camera doesn't meet requirements. Try a different camera."
          : "Unable to access camera. Please make sure your device has a camera and try again."
      );
      setCameraActive(false);
      setLoading(false);
    }
  };

  const switchCamera = async () => {
    if (!isMobile) return;

    // Toggle the camera direction
    setUseFrontCamera((prev) => !prev);

    // Stop the current camera stream
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Restart camera with new direction
    startCamera();
  };

  const stopCamera = () => {
    console.log("Stopping camera...");

    // First clear all timers to prevent further captures
    clearAllTimers();

    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Ensure we mark the session as inactive when stopping camera
    setPhotoSessionActive(false);
    setCameraActive(false);
  };

  const toggleCamera = () => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const startPhotoSession = () => {
    if (!cameraActive) return;

    console.log("========== STARTING NEW PHOTO SESSION ==========");

    // Clear any existing timers first
    clearAllTimers();

    // Reset photo session
    setCapturedPhotos([]);
    setPhotoSessionActive(true);
    setCurrentPhotoIndex(0);
    setCountdownActive(false);
    setCountdown(0);

    console.log("Photos reset, currentPhotoIndex set to 0");

    // Start the first countdown after a short delay
    setTimeout(() => {
      startCountdown(0);
    }, 300);
  };

  const startCountdown = (photoIndex) => {
    // Multiple safety checks
    if (!cameraActive) {
      console.log("Cannot start countdown - camera inactive");
      setPhotoSessionActive(false);
      return;
    }

    if (photoIndex >= 4) {
      console.log(
        "SAFETY: Attempted to start countdown for photo beyond limit"
      );
      setPhotoSessionActive(false);
      return;
    }

    if (countdownTimerRef.current) {
      console.log("Clearing existing countdown timer before starting new one");
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    console.log(`Starting countdown for photo at index ${photoIndex}`);

    setCountdown(photoInterval);
    setCountdownActive(true);

    console.log(`Countdown started: ${photoInterval} seconds`);

    let remainingTime = photoInterval;

    countdownTimerRef.current = setInterval(() => {
      remainingTime--;
      console.log(`Countdown: ${remainingTime} seconds remaining`);

      setCountdown(remainingTime);

      if (remainingTime <= 0) {
        console.log("Countdown finished, capturing photo");
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
        setCountdownActive(false);

        // Only if camera is still active, capture the photo
        if (cameraActive && videoRef.current && canvasRef.current) {
          setTimeout(() => {
            capturePhoto(photoIndex);
          }, 100);
        } else {
          console.log(
            "Camera became inactive during countdown, canceling session"
          );
          setPhotoSessionActive(false);
        }
      }
    }, 1000);
  };

  const capturePhoto = async (photoIndex) => {
    try {
      console.log(`capturePhoto called with index ${photoIndex}`);

      if (!cameraActive || !videoRef.current || !canvasRef.current) {
        console.log("Cannot capture - camera inactive or refs null");
        setPhotoSessionActive(false);
        return;
      }

      // Don't take more photos if we already have 4 or index is out of bounds
      if (photoIndex >= 4) {
        console.log("STOPPING: Photo index >= 4, ending session");
        setPhotoSessionActive(false);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      console.log(`Canvas set to ${canvas.width}x${canvas.height}`);

      // Draw the current video frame to the canvas
      const context = canvas.getContext("2d");

      // Draw the video frame with default white background
      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Then draw the video frame
      const margin = 20; // Margin around the photo
      context.drawImage(
        video,
        margin,
        margin,
        canvas.width - margin * 2,
        canvas.height - margin * 2
      );

      // Draw a frame or border
      context.strokeStyle = "#FFFFFF";
      context.lineWidth = 5;
      context.strokeRect(
        margin - 5,
        margin - 5,
        canvas.width - margin * 2 + 10,
        canvas.height - margin * 2 + 10
      );

      // Add retry mechanism for failed captures
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          const imageData = canvas.toDataURL("image/jpeg", imageQuality);
          setCapturedPhotos((prev) => {
            const newPhotos = [...prev];
            newPhotos[photoIndex] = imageData;
            return newPhotos;
          });

          // Cache the captured photo using an object instead of Map
          setPhotoCache((prev) => ({
            ...prev,
            [photoIndex]: imageData,
          }));
          break;
        } catch (error) {
          retryCount++;
          if (retryCount === maxRetries) {
            throw new Error("Failed to capture photo after multiple attempts");
          }
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      // Move to next photo
      const nextPhotoIndex = photoIndex + 1;
      console.log(`Setting currentPhotoIndex to ${nextPhotoIndex}`);
      setCurrentPhotoIndex(nextPhotoIndex);

      if (nextPhotoIndex < 4) {
        console.log(`Planning to take next photo at index ${nextPhotoIndex}`);
        // We have more photos to take - wait a bit and start next countdown
        const nextPhotoTimeout = setTimeout(() => {
          console.log(
            `Starting countdown for next photo at index ${nextPhotoIndex}`
          );
          if (cameraActive) {
            startCountdown(nextPhotoIndex);
          } else {
            console.log("Camera became inactive, canceling next photo");
            setPhotoSessionActive(false);
          }
        }, 1500);
      } else {
        // We're done with the session
        console.log("COMPLETE: All 4 photos taken, ending session");
        setPhotoSessionActive(false);
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
      // Handle error gracefully
      setPhotoSessionActive(false);
      // Show error to user
    }
  };

  const downloadPhotoStrip = async () => {
    setDownloading(true);
    setDownloadProgress(10); // Show initial progress

    try {
      if (!photoStripRef.current || capturedPhotos.length < 4) {
        throw new Error("Photo strip is not ready");
      }

      // Update progress
      setDownloadProgress(30);

      // Use html-to-image to capture the exact photo strip element
      const dataUrl = await htmlToImage.toPng(photoStripRef.current, {
        quality: imageQuality,
        pixelRatio: 2, // Higher resolution
        style: {
          // Ensure the element is rendered with proper dimensions for capture
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      // Update progress
      setDownloadProgress(80);

      // Download the image
      const link = document.createElement("a");
      link.download = `pixsnap-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadProgress(100);
    } catch (error) {
      console.error("Error generating photo strip:", error);
      // Show error to user
    } finally {
      setTimeout(() => {
        setDownloading(false);
        setDownloadProgress(0);
      }, 500);
    }
  };

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  // Reset photo booth to defaults
  const resetPhotoBooth = () => {
    console.log("Resetting photo booth to defaults");
    // Clear all captured photos
    setCapturedPhotos([]);
    // Reset to default design
    setStripDesign("pastel-pink");
    // Reset to default interval
    setPhotoInterval(3);
    // Additional resets if needed
    setCurrentPhotoIndex(0);
    setPhotoSessionActive(false);
    setCountdownActive(false);
    setCountdown(0);
  };

  return (
    <div
      className={`mx-auto w-full ${isFullScreen ? "fixed inset-0 z-50" : ""}`}
    >
      {/* Title and Introduction - Hide in fullscreen */}
      {!isFullScreen && (
        <div className="mb-4 sm:mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            PixSnap Photo Booth
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto">
            Take fun photo strips with your camera! Perfect for memories,
            parties, or just for fun.
          </p>
        </div>
      )}

      <div
        className={`flex ${
          isFullScreen ? "flex-col h-full" : "flex-col lg:flex-row"
        } gap-4 sm:gap-6 items-start`}
      >
        {/* Camera Preview Section */}
        <div
          className={`w-full ${
            isFullScreen ? "h-full" : "lg:w-full"
          } bg-black rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl flex flex-col`}
        >
          {/* Camera View Component */}
          <CameraView
            cameraActive={cameraActive}
            loading={loading}
            countdownActive={countdownActive}
            photoSessionActive={photoSessionActive}
            countdown={countdown}
            currentPhotoIndex={currentPhotoIndex}
            cameraError={cameraError}
            isMobile={isMobile}
            videoRef={videoRef}
            canvasRef={canvasRef}
            startPhotoSession={startPhotoSession}
            toggleCamera={toggleCamera}
            switchCamera={switchCamera}
            toggleFullScreen={toggleFullScreen}
            isFullScreen={isFullScreen}
            handleVideoLoaded={handleVideoLoaded}
          />

          {/* Camera Controls Component */}
          <CameraControls
            photoInterval={photoInterval}
            setPhotoInterval={setPhotoInterval}
            stripDesign={stripDesign}
            setShowDesignSelector={setShowDesignSelector}
            resetPhotoBooth={resetPhotoBooth}
            photoSessionActive={photoSessionActive}
            countdownActive={countdownActive}
            intervalOptions={intervalOptions}
          />
        </div>

        {/* Photo Strip Preview - Hide in fullscreen */}
        {!isFullScreen && (
          <div
            className={`w-full ${
              isFullScreen
                ? "max-w-[200px] mx-auto mt-6"
                : "lg:w-fit lg:sticky lg:top-4"
            } flex flex-row lg:flex-col items-center justify-center lg:justify-start gap-4 sm:gap-5 mt-4 sm:mt-5 lg:mt-0`}
          >
            {/* Photo Strip Preview Component */}
            <div className="w-full max-w-[180px] sm:max-w-[200px] lg:max-w-[250px]">
              <PhotoStripPreview
                capturedPhotos={capturedPhotos}
                stripDesign={stripDesign}
                photoStripRef={photoStripRef}
                downloadPhotoStrip={downloadPhotoStrip}
              />
            </div>
          </div>
        )}
      </div>

      {/* Design Selector Modal Component */}
      <DesignSelectorModal
        showDesignSelector={showDesignSelector}
        setShowDesignSelector={setShowDesignSelector}
        stripDesign={stripDesign}
        setStripDesign={setStripDesign}
      />

      {/* Download Progress Component */}
      <DownloadProgress
        downloading={downloading}
        downloadProgress={downloadProgress}
      />
    </div>
  );
}

export default CameraSection;
