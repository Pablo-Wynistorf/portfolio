import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { t } from "@/i18n/t";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function Lightbox({
  images,
  index,
  onChange,
}: {
  images: { src: string; alt: string }[];
  index: number | null;
  onChange: (i: number | null) => void;
}) {
  const go = useCallback(
    (d: number) => index !== null && onChange((index + d + images.length) % images.length),
    [index, images.length, onChange],
  );

  useEffect(() => {
    if (index === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", key);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.documentElement.style.overflow = "";
    };
  }, [index, go, onChange]);

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onChange(null)}
          role="dialog"
          aria-modal="true"
        >
          <AnimatePresence mode="popLayout">
            <motion.img
              key={images[index].src}
              src={images[index].src}
              alt={images[index].alt}
              initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
              className="max-h-[85vh] max-w-[92vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </AnimatePresence>
          <p className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-wider text-paper/70">
            {images[index].alt} · {index + 1}/{images.length}
          </p>
          <button
            aria-label={t.lightbox.close}
            className="absolute right-6 top-6 p-3 text-paper hover:text-red"
            onClick={() => onChange(null)}
          >
            <X className="h-5 w-5" />
          </button>
          {images.length > 1 && (
            <>
              <button
                aria-label={t.lightbox.prev}
                className="absolute left-4 p-3 text-paper hover:text-red"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                aria-label={t.lightbox.next}
                className="absolute right-4 p-3 text-paper hover:text-red"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
