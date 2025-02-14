// loader.js
const tl = gsap.timeline({
  repeat: -1,
  repeatDelay: 0.5,
  defaults: { duration: 0.6, ease: "power2.inOut" },
});
gsap.set("#target1", { rotation: 45, svgOrigin: "50 50" });
gsap.set("#target2", { rotation: 135, svgOrigin: "50 50" });
tl.to("line", { attr: { x2: 100 } });
tl.to("#target1", { rotation: 0 }, "turn");
tl.to("#target2", { rotation: 180 }, "turn");
tl.to("#target1", { y: -10 }, "move");
tl.to("#target2", { y: 10 }, "move");
tl.to("#theSquare", { attr: { height: 22, y: 38 } }, "move");
tl.to("line", { attr: { x1: 50, x2: 50 } });
tl.to("text", { duration: 1, opacity: 0, ease: "none" });

// Export the timeline for optional control later
export const loaderTimeline = tl;
