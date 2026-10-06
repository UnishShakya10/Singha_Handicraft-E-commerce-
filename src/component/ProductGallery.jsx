import { useState } from "react";
import ImageMagnifier from "./ImageMagnifier";

const ProductGallery = ({ images, name }) => {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      <div className="flex gap-3 overflow-x-auto md:max-h-[560px] md:w-24 md:flex-col md:overflow-y-auto md:overflow-x-hidden">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show image ${index + 1} of ${name}`}
            aria-pressed={active === index}
            className={`shrink-0 overflow-hidden rounded-lg border-2 transition ${
              active === index
                ? "border-[#c9a227]"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <img
              src={image}
              alt=""
              className="size-20 object-cover md:h-24 md:w-20"
            />
          </button>
        ))}
      </div>

      <div className="h-[min(560px,calc(100vw-3rem))] min-h-80 flex-1 overflow-hidden rounded border border-black/10 bg-white shadow-xl">
        <ImageMagnifier src={images[active]} alt={name} zoom={3} />
      </div>
    </div>
  );
};

export default ProductGallery;
