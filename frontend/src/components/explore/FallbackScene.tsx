import { images } from "@/data/images";
import { Figure } from "@/components/ui/section";

/**
 * FallbackScene — shown on devices or browsers where the interactive scene
 * should not run (low-power mobile, reduced-motion, WebGL unavailable).
 */
export function FallbackScene() {
  return (
    <div>
      <Figure
        src={images.aerial}
        alt="Aerial view of a countryside property with lawns and a pool"
        ratio="16/9"
      />
      <p className="mt-3 text-[0.7rem] tracking-wide text-muted-foreground">
        A static view is shown on this device. The interactive walkthrough will
        be available on larger screens once the 3D model is published.
      </p>
    </div>
  );
}
