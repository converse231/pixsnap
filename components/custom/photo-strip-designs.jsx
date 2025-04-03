import React from "react";

// Design categories with various options
const photoStripDesigns = {
  // Solid color designs
  solid: [
    { id: "pastel-pink", label: "Pink", color: "#FFD1DC", pattern: null },
    { id: "pastel-blue", label: "Blue", color: "#BFDFFF", pattern: null },
    { id: "pastel-green", label: "Green", color: "#BFFCC6", pattern: null },
    { id: "pastel-purple", label: "Purple", color: "#E0C1F4", pattern: null },
    { id: "pastel-yellow", label: "Yellow", color: "#FFFACD", pattern: null },
  ],

  // Gradient designs
  gradient: [
    {
      id: "gradient-sunset",
      label: "Sunset",
      color: null,
      pattern: null,
      gradient: "linear-gradient(to bottom, #FF512F, #F09819)",
    },
    {
      id: "gradient-ocean",
      label: "Ocean",
      color: null,
      pattern: null,
      gradient: "linear-gradient(to bottom, #2193b0, #6dd5ed)",
    },
    {
      id: "gradient-berry",
      label: "Berry",
      color: null,
      pattern: null,
      gradient: "linear-gradient(to bottom, #8E2DE2, #4A00E0)",
    },
    {
      id: "gradient-mint",
      label: "Mint",
      color: null,
      pattern: null,
      gradient: "linear-gradient(to bottom, #11998e, #38ef7d)",
    },
    {
      id: "gradient-dusk",
      label: "Dusk",
      color: null,
      pattern: null,
      gradient: "linear-gradient(to bottom, #141E30, #243B55)",
    },
  ],

  // Pattern designs
  pattern: [
    {
      id: "pattern-dots",
      label: "Dots",
      color: "#F8F9FA",
      pattern: "radial-gradient(circle, #777 1px, transparent 1px)",
      patternSize: "10px 10px",
    },
    {
      id: "pattern-stripes",
      label: "Stripes",
      color: "#DBE4FF",
      pattern:
        "linear-gradient(45deg, #ADB5BD 25%, transparent 25%, transparent 50%, #ADB5BD 50%, #ADB5BD 75%, transparent 75%, transparent)",
      patternSize: "10px 10px",
    },
    {
      id: "pattern-diamonds",
      label: "Diamonds",
      color: "#FFE3E3",
      pattern:
        "linear-gradient(45deg, #AAAAAA 25%, transparent 25%, transparent 75%, #AAAAAA 75%, #AAAAAA), linear-gradient(45deg, #AAAAAA 25%, transparent 25%, transparent 75%, #AAAAAA 75%, #AAAAAA)",
      patternSize: "16px 16px",
      patternPosition: "0 0, 8px 8px",
    },
    {
      id: "pattern-confetti",
      label: "Confetti",
      color: "#FAF0FF",
      pattern:
        "radial-gradient(#FF88DD 3px, transparent 3px), radial-gradient(#5673EB 3px, transparent 3px), radial-gradient(#44E577 3px, transparent 3px)",
      patternSize: "30px 30px",
      patternPosition: "0 0, 10px 10px, 20px 20px",
    },
    {
      id: "pattern-triangles",
      label: "Triangles",
      color: "#E7F5FF",
      pattern:
        "linear-gradient(30deg, #91A7FF 12%, transparent 12.5%, transparent 87%, #91A7FF 87.5%, #91A7FF), linear-gradient(150deg, #91A7FF 12%, transparent 12.5%, transparent 87%, #91A7FF 87.5%, #91A7FF), linear-gradient(30deg, #91A7FF 12%, transparent 12.5%, transparent 87%, #91A7FF 87.5%, #91A7FF), linear-gradient(150deg, #91A7FF 12%, transparent 12.5%, transparent 87%, #91A7FF 87.5%, #91A7FF), linear-gradient(60deg, #CFD8FF 25%, transparent 25.5%, transparent 75%, #CFD8FF 75%, #CFD8FF), linear-gradient(60deg, #CFD8FF 25%, transparent 25.5%, transparent 75%, #CFD8FF 75%, #CFD8FF)",
      patternSize: "20px 35px",
      patternPosition: "0 0, 0 0, 10px 18px, 10px 18px, 0 0, 10px 18px",
    },
  ],

  // Theme designs
  theme: [
    {
      id: "theme-retro",
      label: "Retro",
      color: "#FFD166",
      pattern:
        "repeating-linear-gradient(45deg, #FF6B6B 0, #FF6B6B 5%, #FFD166 5%, #FFD166 10%)",
      patternSize: "10px 10px",
    },
    {
      id: "theme-neon",
      label: "Neon",
      color: "#000",
      pattern: null,
      gradient: "linear-gradient(to bottom, #000, #0F0F0F)",
      borderGlow: "0 0 5px #0ff, 0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff",
    },
    {
      id: "theme-vintage",
      label: "Vintage",
      color: "#F8F0E3",
      pattern:
        "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C4B7A6' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E\")",
    },
    {
      id: "theme-tech",
      label: "Tech",
      color: "#0D1B2A",
      pattern:
        "linear-gradient(to right, #1B263B 1px, transparent 1px), linear-gradient(to bottom, #1B263B 1px, transparent 1px)",
      patternSize: "20px 20px",
      accent: "#4CC9F0",
    },
    {
      id: "theme-tropical",
      label: "Tropical",
      color: "#ECFDF5",
      pattern:
        "url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310B981' fill-opacity='0.4'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
    },
  ],
};

// Function to get all designs as a flat array
const getAllDesigns = () => {
  let allDesigns = [];

  Object.keys(photoStripDesigns).forEach((category) => {
    allDesigns = [...allDesigns, ...photoStripDesigns[category]];
  });

  return allDesigns;
};

// Function to get design by ID
const getDesignById = (designId) => {
  const allDesigns = getAllDesigns();
  return allDesigns.find((design) => design.id === designId) || allDesigns[0];
};

// Function to apply design styles to container
const applyDesignStyles = (design) => {
  if (!design) return {};

  const baseStyles = {
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "100%",
    aspectRatio: "9/30",
  };

  // Apply solid color
  if (design.color) {
    baseStyles.backgroundColor = design.color;
  }

  // Apply gradient
  if (design.gradient) {
    baseStyles.backgroundImage = design.gradient;
  }

  // Apply pattern
  if (design.pattern) {
    baseStyles.backgroundImage = design.pattern;

    if (design.patternSize) {
      baseStyles.backgroundSize = design.patternSize;
    }

    if (design.patternPosition) {
      baseStyles.backgroundPosition = design.patternPosition;
    }
  }

  // Apply special theme effects
  if (design.borderGlow) {
    baseStyles.boxShadow = design.borderGlow;
  }

  // Apply accent color if specified
  if (design.accent) {
    baseStyles.borderColor = design.accent;
    baseStyles.border = `2px solid ${design.accent}`;
  }

  return baseStyles;
};

// Design category component for selection UI
const DesignCategorySelector = ({
  category,
  designs,
  activeDesignId,
  onSelectDesign,
}) => {
  return (
    <div className="design-category mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2 capitalize">
        {category}
      </h3>
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
        {designs.map((design) => (
          <div
            key={design.id}
            className={`aspect-[9/16] rounded-md overflow-hidden cursor-pointer transition-all hover:scale-105 ${
              activeDesignId === design.id
                ? "ring-2 ring-purple-600 ring-offset-1 scale-105 z-10"
                : "ring-1 ring-gray-200"
            }`}
            onClick={() => onSelectDesign(design.id)}
          >
            {/* Design thumbnail */}
            <div
              className="w-full h-full relative"
              style={{
                backgroundColor: design.color || "#FFF",
                backgroundImage: design.gradient || design.pattern || "none",
                backgroundSize: design.patternSize || "cover",
                backgroundPosition: design.patternPosition || "center",
                boxShadow: design.borderGlow || "none",
                border: design.accent ? `1px solid ${design.accent}` : "none",
              }}
            >
              {/* Sample photo frame placeholders */}
              <div className="absolute inset-0 p-1 flex flex-col justify-around">
                {[1, 2, 3, 4].map((num) => (
                  <div
                    key={num}
                    className="bg-white/90 rounded-sm border border-white"
                    style={{ height: "20%" }}
                  />
                ))}

                {/* Design name tooltip on hover */}
                <div className="absolute bottom-0 left-0 right-0 text-center text-[8px] font-medium bg-black/50 text-white py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {design.label}
                </div>

                {/* Selected indicator */}
                {activeDesignId === design.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-purple-600/80 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ✓
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main design selector component
const PhotoStripDesignSelector = ({ activeDesignId, onSelectDesign }) => {
  return (
    <div className="photo-strip-design-selector">
      {Object.entries(photoStripDesigns).map(([category, designs]) => (
        <DesignCategorySelector
          key={category}
          category={category}
          designs={designs}
          activeDesignId={activeDesignId}
          onSelectDesign={onSelectDesign}
        />
      ))}
    </div>
  );
};

export {
  photoStripDesigns,
  getAllDesigns,
  getDesignById,
  applyDesignStyles,
  PhotoStripDesignSelector,
};
