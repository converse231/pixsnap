import WelcomeBanner from "@/components/custom/welcome-banner";
import CameraSection from "@/components/custom/camera-section";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Photography-themed background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700"></div>

      {/* Camera grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      {/* Photo frames decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-10 -right-20 w-64 h-64 bg-white/5 rounded-lg transform rotate-12 border-4 border-white/10"></div>
        <div className="absolute top-1/4 -left-10 w-40 h-52 bg-white/5 rounded-lg transform -rotate-6 border-4 border-white/10"></div>
        <div className="absolute bottom-10 right-1/4 w-52 h-40 bg-white/5 rounded-lg transform rotate-6 border-4 border-white/10"></div>
      </div>

      {/* Light leaks and camera flare effect */}
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-rose-500/30 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-96 bg-gradient-to-t from-blue-600/20 to-transparent"></div>

      {/* Content container */}
      <div className="relative z-10 container mx-auto p-8">
        <WelcomeBanner />

        <div className="mt-4 flex items-center justify-between">
          <div className="bg-white/10 backdrop-blur-sm py-2 px-4 rounded-lg">
            {/* <span className="text-white/80 text-sm">
              Ready to capture moments
            </span> */}
          </div>
        </div>

        <CameraSection />
      </div>
    </div>
  );
}
