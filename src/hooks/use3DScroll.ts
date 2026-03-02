import { useEffect, useRef } from "react";

export type Reveal3DVariant =
    | "rise"         // rotateX from bottom, perspective lift
    | "tilt-left"    // rotateY tilt from left
    | "tilt-right"   // rotateY tilt from right
    | "zoom-depth"   // scale + translateZ
    | "flip-up"      // dramatic rotateX flip
    | "slide-depth"  // X slide with depth
    | "cascade";     // staggered children

interface Use3DScrollOptions {
    variant?: Reveal3DVariant;
    threshold?: number;
    delay?: number;
}

export function use3DScroll<T extends HTMLElement>(options: Use3DScrollOptions = {}) {
    const ref = useRef<T>(null);
    const { variant = "rise", threshold = 0.12, delay = 0 } = options;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Set initial hidden state
        const baseStyle = `
      opacity: 0;
      transition: opacity 1.0s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 1.0s cubic-bezier(0.22, 1, 0.36, 1);
      will-change: transform, opacity;
      transition-delay: ${delay}ms;
    `;

        const initialTransforms: Record<Reveal3DVariant, string> = {
            "rise": "perspective(1200px) rotateX(18deg) translateY(60px) scale(0.96)",
            "tilt-left": "perspective(1200px) rotateY(-22deg) translateX(-60px) scale(0.94)",
            "tilt-right": "perspective(1200px) rotateY(22deg) translateX(60px) scale(0.94)",
            "zoom-depth": "perspective(1200px) scale(0.88) translateZ(-120px)",
            "flip-up": "perspective(1400px) rotateX(32deg) translateY(80px) scale(0.92)",
            "slide-depth": "perspective(1000px) translateX(-80px) translateZ(-60px) scale(0.95)",
            "cascade": "perspective(1200px) rotateX(14deg) translateY(50px) scale(0.97)",
        };

        el.style.cssText += baseStyle + `transform: ${initialTransforms[variant]};`;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.style.opacity = "1";
                    el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateX(0) translateY(0) translateZ(0) scale(1)";
                    observer.disconnect();
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [variant, threshold, delay]);

    return ref;
}

// Staggered children 3D reveal
export function use3DChildrenReveal<T extends HTMLElement>(options: {
    threshold?: number;
    stagger?: number;
    variant?: "rise" | "tilt-left" | "tilt-right" | "zoom-depth";
} = {}) {
    const ref = useRef<T>(null);
    const { threshold = 0.08, stagger = 80, variant = "rise" } = options;

    useEffect(() => {
        const container = ref.current;
        if (!container) return;

        const children = Array.from(container.children) as HTMLElement[];

        const initialTransforms: Record<string, string> = {
            "rise": "perspective(900px) rotateX(20deg) translateY(50px) scale(0.95)",
            "tilt-left": "perspective(900px) rotateY(-18deg) translateX(-40px) scale(0.95)",
            "tilt-right": "perspective(900px) rotateY(18deg) translateX(40px) scale(0.95)",
            "zoom-depth": "perspective(900px) scale(0.82) translateZ(-80px)",
        };

        children.forEach((child, i) => {
            child.style.opacity = "0";
            child.style.transform = initialTransforms[variant];
            child.style.transition = `opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1) ${i * stagger}ms, transform 0.85s cubic-bezier(0.22, 1, 0.36, 1) ${i * stagger}ms`;
            child.style.willChange = "transform, opacity";
        });

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    children.forEach(child => {
                        child.style.opacity = "1";
                        child.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateX(0) translateY(0) translateZ(0) scale(1)";
                    });
                    observer.disconnect();
                }
            },
            { threshold }
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, [threshold, stagger, variant]);

    return ref;
}
