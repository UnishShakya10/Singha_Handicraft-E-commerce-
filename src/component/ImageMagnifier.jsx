import { useState } from "react";

const ImageMagnifier = ({ src, alt, zoom = 3 }) => {
  const [zoomed, setZoomed] = useState(false);
  const [position, setPosition] = useState("50% 50%");

  const updatePosition = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setPosition(`${x}% ${y}%`);
  };

  return (
    <button
      type="button"
      className={`relative block h-full w-full overflow-hidden bg-white ${
        zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
      }`}
      aria-label={zoomed ? `Reset zoom on ${alt}` : `Zoom in on ${alt}`}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setZoomed(true);
      }}
      onPointerMove={updatePosition}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setZoomed(false);
      }}
      onClick={(event) => {
        if (event.detail === 0 || event.nativeEvent.pointerType === "touch") {
          setZoomed((current) => !current);
        }
      }}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-contain transition-transform duration-200"
        style={{
          transform: `scale(${zoomed ? zoom : 1})`,
          transformOrigin: position,
        }}
      />
    </button>
  );
};

export default ImageMagnifier;
