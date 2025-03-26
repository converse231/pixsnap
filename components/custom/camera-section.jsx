"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Expand,
  Image,
  Video,
  XCircle,
  Clock,
  Palette,
  User,
  Download,
  Repeat,
  Loader,
} from "lucide-react";

function CameraSection() {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoInterval, setPhotoInterval] = useState(3); // Default 3 seconds
  const [stripBgColor, setStripBgColor] = useState("pastel-pink");
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [photoSessionActive, setPhotoSessionActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [useFrontCamera, setUseFrontCamera] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const countdownTimerRef = useRef(null);

  const stripBgColors = [
    { id: "pastel-pink", label: "Pink", color: "#FFD1DC" },
    { id: "pastel-blue", label: "Blue", color: "#BFDFFF" },
    { id: "pastel-green", label: "Green", color: "#BFFCC6" },
    { id: "pastel-purple", label: "Purple", color: "#E0C1F4" },
    { id: "pastel-yellow", label: "Yellow", color: "#FFFACD" },
  ];

  const intervalOptions = [
    { value: 3, label: "3s" },
    { value: 5, label: "5s" },
    { value: 10, label: "10s" },
  ];

  // Get current background color object
  const getCurrentBgColor = () => {
    return stripBgColors.find((c) => c.id === stripBgColor) || stripBgColors[0];
  };

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

  const capturePhoto = (photoIndex) => {
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

    // Get the selected background color
    const selectedColor = stripBgColors.find((c) => c.id === stripBgColor);
    console.log(`Using background color: ${selectedColor?.color}`);

    // Draw background color first
    context.fillStyle = selectedColor ? selectedColor.color : "#FFFFFF";
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

    // Convert to image data
    const imageData = canvas.toDataURL("image/jpeg");
    console.log(`Photo captured: (${imageData.substring(0, 30)}...)`);

    // Add the photo to our array
    setCapturedPhotos((prev) => {
      const newPhotos = [...prev];
      newPhotos[photoIndex] = imageData;
      console.log(`Photo added to array at index ${photoIndex}`);
      console.log(
        `Array now contains ${newPhotos.filter((p) => p).length} photos`
      );
      return newPhotos;
    });

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
  };

  const downloadPhotoStrip = () => {
    console.log("Download requested for photo strip");

    try {
      // Create a new canvas to combine all photos
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Check if we have 4 photos
      if (capturedPhotos.filter((p) => p).length < 4) {
        console.log("Cannot download - need 4 photos");
        alert("Cannot download - need 4 complete photos");
        return;
      }

      // Get current background color
      const currentColor = getCurrentBgColor();
      const bgColor = currentColor.color;

      // Set dimensions to match the preview - use the same aspect ratio of 9/30
      const stripWidth = 300;
      const stripHeight = stripWidth * (30 / 9); // Maintain aspect ratio
      canvas.width = stripWidth;
      canvas.height = stripHeight;

      // Radius for rounded corners of entire strip
      const cornerRadius = 12;
      const borderWidth = 3; // White border thickness

      // Helper function to draw rounded rectangle
      const drawRoundedRect = (x, y, width, height, radius) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(
          x + width,
          y + height,
          x + width - radius,
          y + height
        );
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      };

      // Fill background with rounded corners
      ctx.fillStyle = bgColor;
      drawRoundedRect(0, 0, stripWidth, stripHeight, cornerRadius);
      ctx.fill();

      // Calculate sizes proportionally to match preview
      const padding = stripWidth * 0.03; // 3% padding
      const frameRadius = 6; // Rounded corners for frames
      const headerFooterHeight = stripHeight * 0.15;
      const photoAreaHeight = stripHeight - headerFooterHeight;
      const photoFrameHeight = photoAreaHeight / 4.3; // Slightly taller frames
      const photoGap = stripWidth * 0.02;

      // Draw photos first
      const photoSection = {
        x: padding,
        y: headerFooterHeight * 0.2, // Top portion is header
        width: stripWidth - padding * 2,
        height: photoAreaHeight,
      };

      // Draw each photo synchronously
      let loadedCount = 0;
      const drawNextPhoto = (index) => {
        if (index >= capturedPhotos.length || !capturedPhotos[index]) {
          if (index >= capturedPhotos.length) {
            // All photos processed, create download
            finishDownload();
          } else if (index < capturedPhotos.length) {
            // Skip empty slots
            drawNextPhoto(index + 1);
          }
          return;
        }

        const img = document.createElement("img");
        img.onload = () => {
          // Position for this photo frame
          const frameY = photoSection.y + index * (photoFrameHeight + photoGap);

          // Draw white border frame with rounded corners
          ctx.fillStyle = "#FFFFFF";
          drawRoundedRect(
            photoSection.x,
            frameY,
            photoSection.width,
            photoFrameHeight,
            frameRadius
          );
          ctx.fill();

          // Draw photo inside with small margin (for white border)
          const innerMargin = borderWidth;

          // Need to clip the photo to rounded corners
          ctx.save();
          ctx.beginPath();
          drawRoundedRect(
            photoSection.x + innerMargin,
            frameY + innerMargin,
            photoSection.width - innerMargin * 2,
            photoFrameHeight - innerMargin * 2,
            Math.max(1, frameRadius - 2)
          );
          ctx.clip();

          // Calculate aspect ratio scaling
          const imgAspect = img.width / img.height;
          const frameAspect =
            (photoSection.width - innerMargin * 2) /
            (photoFrameHeight - innerMargin * 2);

          let drawWidth,
            drawHeight,
            offsetX = 0,
            offsetY = 0;

          if (imgAspect > frameAspect) {
            // Image is wider than frame - scale by height and center horizontally
            drawHeight = photoFrameHeight - innerMargin * 2;
            drawWidth = drawHeight * imgAspect;
            offsetX = (photoSection.width - innerMargin * 2 - drawWidth) / 2;
          } else {
            // Image is taller than frame - scale by width and center vertically
            drawWidth = photoSection.width - innerMargin * 2;
            drawHeight = drawWidth / imgAspect;
            offsetY = (photoFrameHeight - innerMargin * 2 - drawHeight) / 2;
          }

          // Draw the image centered and filling the frame
          ctx.drawImage(
            img,
            photoSection.x + innerMargin + offsetX,
            frameY + innerMargin + offsetY,
            drawWidth,
            drawHeight
          );

          ctx.restore();

          // Draw white border outline
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = borderWidth;
          drawRoundedRect(
            photoSection.x,
            frameY,
            photoSection.width,
            photoFrameHeight,
            frameRadius
          );
          ctx.stroke();

          loadedCount++;

          // Process next photo
          drawNextPhoto(index + 1);
        };

        img.onerror = (err) => {
          console.error(`Failed to load image ${index}:`, err);
          drawNextPhoto(index + 1);
        };

        img.src = capturedPhotos[index];
      };

      // Draw footer once all photos are loaded
      const drawFooter = () => {
        const footerY = stripHeight - headerFooterHeight * 0.7;

        // Draw footer content
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("PixSnap", stripWidth / 2, footerY + 20);

        ctx.font = "12px sans-serif";
        ctx.fillText(
          new Date().toLocaleDateString(),
          stripWidth / 2,
          footerY + 40
        );
      };

      const finishDownload = () => {
        try {
          // Draw footer
          drawFooter();

          // Convert canvas to data URL
          const dataUrl = canvas.toDataURL("image/jpeg", 1.0);

          // Create download link
          const link = document.createElement("a");
          const timestamp = new Date().getTime();
          link.download = `pixsnap-${timestamp}.jpg`;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          console.log("Photo strip downloaded successfully");
        } catch (err) {
          console.error("Error creating download:", err);
          alert("Sorry, there was an error creating your download.");
        }
      };

      // Start drawing process with the first photo
      drawNextPhoto(0);
    } catch (error) {
      console.error("Error in downloadPhotoStrip:", error);
      alert("Sorry, there was an error processing your photo strip.");
    }
  };

  const resetPhotoBooth = () => {
    console.log("Resetting photo booth to defaults");
    // Clear all captured photos
    setCapturedPhotos([]);
    // Reset to default background color
    setStripBgColor("pastel-pink");
    // Reset to default interval
    setPhotoInterval(3);
    // Additional resets if needed
    setCurrentPhotoIndex(0);
    setPhotoSessionActive(false);
    setCountdownActive(false);
    setCountdown(0);
  };

  // Generate photo frames for the strip preview
  const renderPhotoStripPreview = () => {
    const currentColor = getCurrentBgColor();

    return (
      <div
        className="photo-strip-container relative rounded-xl overflow-hidden flex flex-col"
        style={{
          backgroundColor: currentColor.color,
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          width: "100%",
          maxWidth: "100%",
          aspectRatio: "9/30",
        }}
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
        <div className="strip-footer text-center pb-3 pt-6 sm:pb-4 sm:pt-8 px-2 border-t-2 border-white/30">
          <span className="text-white text-xs font-medium">PixSnap</span>
          <p className="text-white text-[10px] sm:text-xs font-medium">
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-8xl mx-auto px-3 md:px-0 sm:px-4 mt-4 sm:mt-8">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Camera Preview Section */}
        <div className="w-full lg:w-[75%] bg-black rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl flex flex-col">
          <div className="relative flex-1 aspect-video flex items-center justify-center">
            {/* Video Element for Camera Stream */}
            {cameraActive && (
              <>
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                  onLoadedMetadata={handleVideoLoaded}
                  onError={(e) => {
                    console.error("Video error:", e);
                    setCameraError(
                      "Error displaying video feed. Please try again."
                    );
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
              <div className="flex flex-col items-center justify-center text-gray-500 p-4 text-center">
                <p className="mt-3 sm:mt-4 text-base sm:text-lg mb-4 sm:mb-6">
                  Camera Preview
                </p>

                {cameraError ? (
                  <div className="text-center mb-4 px-2">
                    <div className="flex items-center justify-center text-red-500 mb-2">
                      <XCircle
                        size={18}
                        className="sm:size-20 md:size-22 mr-2"
                      />
                      <span>Camera Error</span>
                    </div>
                    <p className="text-red-400 text-xs sm:text-sm max-w-md px-2 sm:px-4">
                      {cameraError}
                    </p>
                  </div>
                ) : null}

                {/* Camera Control Button */}
                <motion.button
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleCamera}
                >
                  <Camera className="sm:size-18 md:size-6" />
                  Turn on camera
                </motion.button>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="flex flex-col items-center justify-center text-gray-500">
                <div className="animate-spin mb-4">
                  <Loader size={24} className="sm:size-28 md:size-8" />
                </div>
                <p className="text-sm sm:text-base">Accessing camera...</p>
              </div>
            )}

            {/* Camera control buttons when active */}
            {cameraActive && !countdownActive && !photoSessionActive && (
              <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center space-x-3 sm:space-x-4 px-2">
                <motion.button
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 sm:px-6 rounded-full flex items-center justify-center gap-1 sm:gap-2 shadow-lg text-xs sm:text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startPhotoSession}
                >
                  <Camera size={14} className="sm:size-16 md:size-5" />
                  <span>Take Photos</span>
                </motion.button>

                <motion.button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 sm:px-6 rounded-full flex items-center justify-center gap-1 sm:gap-2 shadow-lg text-xs sm:text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleCamera}
                >
                  <XCircle size={14} className="sm:size-16 md:size-5" />
                  <span>Turn off</span>
                </motion.button>
              </div>
            )}

            {/* Session Progress Indicator */}
            {photoSessionActive && !countdownActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="text-center px-4">
                  <div className="animate-pulse mb-3 sm:mb-4">
                    <Camera
                      // size={28}
                      className="sm:size-32 md:size-36 text-white mx-auto"
                    />
                  </div>
                  <p className="text-white text-sm sm:text-base md:text-lg font-medium">
                    Get ready for photo {currentPhotoIndex + 1} of 4
                  </p>
                </div>
              </div>
            )}

            {/* Camera switch button - only shown on mobile when camera is active */}
            {cameraActive &&
              isMobile &&
              !countdownActive &&
              !photoSessionActive && (
                <button
                  onClick={switchCamera}
                  className="absolute top-3 left-3 bg-black/50 rounded-full p-2 text-white/80 hover:text-white transition z-10"
                  title="Switch camera"
                >
                  <Repeat size={18} />
                </button>
              )}

            {/* Expand Button */}
            <button className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/50 rounded-md p-1.5 sm:p-2 text-white/80 hover:text-white transition">
              <Expand size={14} className="sm:size-16 md:size-5" />
            </button>
          </div>

          {/* Camera Settings */}
          <div className="bg-white dark:bg-gray-100 px-3 py-2 sm:px-4 sm:py-3 flex flex-wrap gap-2 sm:gap-3 items-center justify-between">
            {/* Background Color */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Palette size={14} className="text-gray-700 hidden sm:inline" />
              <span className="text-gray-700 text-xs sm:text-sm font-medium">
                Background:
              </span>
              <div className="flex bg-gray-200 rounded-md">
                {stripBgColors.map((color) => (
                  <button
                    key={color.id}
                    className={`px-1 py-1 min-w-[1.8rem] sm:min-w-[2.5rem] text-xs sm:text-sm rounded-md transition flex items-center justify-center ${
                      stripBgColor === color.id
                        ? "ring-2 ring-purple-600 ring-offset-1 z-10"
                        : ""
                    }`}
                    style={{
                      backgroundColor: color.color,
                      color: stripBgColor === color.id ? "#000" : "#333",
                    }}
                    onClick={() => setStripBgColor(color.id)}
                    title={color.label}
                  >
                    {stripBgColor === color.id && "✓"}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Interval */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Clock size={14} className="text-gray-700 hidden sm:inline" />
              <span className="text-gray-700 text-xs sm:text-sm font-medium">
                Countdown:
              </span>
              <div className="flex bg-gray-200 rounded-md">
                {intervalOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition ${
                      photoInterval === option.value
                        ? "bg-purple-600 text-white"
                        : "text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setPhotoInterval(option.value)}
                    disabled={photoSessionActive || countdownActive}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button (replacing Photo Strip Label) */}
            <div className="flex items-center">
              <button
                onClick={resetPhotoBooth}
                className="text-gray-700 text-xs sm:text-sm font-medium bg-gray-200 hover:bg-gray-300 px-2 sm:px-3 py-1 rounded-md flex items-center gap-1 transition-colors"
                title="Reset photo booth to defaults"
              >
                <XCircle
                  size={12}
                  className="sm:size-14 md:size-6 text-red-500"
                />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Photo Strip Preview - Vertical Format */}
        <div className="w-full lg:w-[25%] flex flex-row lg:flex-col items-center justify-center lg:justify-start gap-4 mt-2 sm:mt-3 lg:mt-0">
          {/* Photo Strip Preview Container */}
          <div className="w-full max-w-[180px] sm:max-w-[200px] lg:max-w-[230px] flex justify-center">
            {renderPhotoStripPreview()}
          </div>

          <div className="flex flex-col items-center gap-3 w-full max-w-[180px] sm:max-w-[200px] lg:max-w-[230px]">
            {/* Status and Instructions */}
            <div className="text-center w-full">
              {capturedPhotos.length === 0 ? (
                <p className="text-white/70 text-xs sm:text-sm text-center">
                  Take photos to create your photo strip
                </p>
              ) : capturedPhotos.length < 4 ? (
                <p className="text-white/70 text-xs sm:text-sm">
                  {4 - capturedPhotos.length} more to complete
                </p>
              ) : (
                <p className="text-white/70 text-xs sm:text-sm">
                  Photo strip complete!
                </p>
              )}
            </div>

            {/* Download button (shown only when photo strip is complete) */}
            {capturedPhotos.length >= 4 && (
              <motion.button
                className="w-full max-w-[230px] bg-purple-600 hover:bg-purple-700 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-md flex items-center justify-center gap-2 text-xs sm:text-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={downloadPhotoStrip}
              >
                <Download size={14} className="sm:size-6" />
                Download Strip
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CameraSection;
