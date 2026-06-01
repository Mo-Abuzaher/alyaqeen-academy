import React from "react";
// @ts-ignore - Ignore remote URL import for TypeScript checking
import FramerComponent from "https://framerusercontent.com/modules/ZTEU12pw279uCaYGplDE/flEBg8cIFvgL7Nlp2veI/PfNYR4E67.js";

// Adapt the exported component to have the same color scheme as we have on our website.
// Our website uses #064E3B (Deep Emerald Green) and #D4AF37 (Antique Matte Gold) for key highlights.
const AdaptedExpandableDrawers = React.forwardRef((props: any, ref: any) => {
  return (
    <FramerComponent
      {...props}
      ref={ref}
      // Overriding colors to match the website's new luxury, high-contrast feel
      drawer1Color={props.drawer1Color || "rgba(6, 78, 59, 0.05)"} // Elegant pristine soft Emerald Green tint
      drawer2Color={props.drawer2Color || "rgba(212, 175, 55, 0.05)"} // Warm premium soft Matte Gold tint
      drawer3Color={props.drawer3Color || "rgba(6, 78, 59, 0.09)"} // Slightly deeper elegant Emerald Green tint
      drawer4Color={props.drawer4Color || "rgba(212, 175, 55, 0.09)"} // Slightly deeper elegant Matte Gold tint
    />
  );
});

AdaptedExpandableDrawers.displayName = "AdaptedExpandableDrawers";

export * from "https://framerusercontent.com/modules/ZTEU12pw279uCaYGplDE/flEBg8cIFvgL7Nlp2veI/PfNYR4E67.js";
export default AdaptedExpandableDrawers;
