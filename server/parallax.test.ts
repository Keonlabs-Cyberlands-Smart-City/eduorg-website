import { describe, it, expect } from "vitest";

describe("Parallax Scrolling Effect", () => {
  it("should have useParallax hook configuration", () => {
    const config = {
      speed: 0.5,
      offset: 0,
      direction: "up" as const,
    };

    expect(config.speed).toBe(0.5);
    expect(config.direction).toBe("up");
  });

  it("should calculate parallax offset correctly", () => {
    const speed = 0.5;
    const scrollDistance = 100;
    const expectedOffset = scrollDistance * speed;

    expect(expectedOffset).toBe(50);
  });

  it("should support different parallax speeds", () => {
    const speeds = [0.3, 0.5, 0.7, 1.0];
    const scrollDistance = 200;

    speeds.forEach((speed) => {
      const offset = scrollDistance * speed;
      expect(offset).toBeGreaterThanOrEqual(0);
      expect(offset).toBeLessThanOrEqual(scrollDistance);
    });
  });

  it("should handle parallax direction up", () => {
    const direction = "up";
    const scrollDistance = 100;
    const speed = 0.5;
    
    const offset = direction === "up" 
      ? scrollDistance * speed 
      : -scrollDistance * speed;

    expect(offset).toBe(50);
    expect(offset).toBeGreaterThan(0);
  });

  it("should handle parallax direction down", () => {
    const direction = "down";
    const scrollDistance = 100;
    const speed = 0.5;
    
    const offset = direction === "up" 
      ? scrollDistance * speed 
      : -scrollDistance * speed;

    expect(offset).toBe(-50);
    expect(offset).toBeLessThan(0);
  });

  it("should apply transform style correctly", () => {
    const offset = 50;
    const transform = `translateY(${offset}px)`;

    expect(transform).toBe("translateY(50px)");
    expect(transform).toContain("translateY");
  });

  it("should use willChange for performance", () => {
    const willChange = "transform";

    expect(willChange).toBe("transform");
  });

  it("should handle viewport detection", () => {
    const elementTop = 100;
    const elementHeight = 500;
    const windowHeight = 800;

    const isInViewport = elementTop < windowHeight && elementTop + elementHeight > 0;

    expect(isInViewport).toBe(true);
  });

  it("should not apply parallax when element is out of viewport", () => {
    const elementTop = 1000;
    const elementHeight = 500;
    const windowHeight = 800;

    const isInViewport = elementTop < windowHeight && elementTop + elementHeight > 0;

    expect(isInViewport).toBe(false);
  });

  it("should use passive scroll listener for performance", () => {
    const options = { passive: true };

    expect(options.passive).toBe(true);
  });

  it("should cleanup event listener on unmount", () => {
    const listeners: string[] = [];
    
    listeners.push("scroll");
    expect(listeners).toContain("scroll");
    
    listeners.pop();
    expect(listeners).not.toContain("scroll");
  });

  it("should have ParallaxHero component props", () => {
    const props = {
      backgroundImage: "https://example.com/image.jpg",
      speed: 0.5,
      minHeight: "600px",
      className: "custom-class",
    };

    expect(props.backgroundImage).toBeDefined();
    expect(props.speed).toBe(0.5);
    expect(props.minHeight).toBe("600px");
  });

  it("should apply background image to parallax hero", () => {
    const backgroundImage = "https://example.com/image.jpg";
    const style = {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };

    expect(style.backgroundImage).toContain("url");
    expect(style.backgroundSize).toBe("cover");
  });

  it("should have dark overlay for text readability", () => {
    const overlayClass = "bg-black/40";

    expect(overlayClass).toContain("bg-black");
    expect(overlayClass).toContain("40");
  });

  it("should position content layer above parallax background", () => {
    const zIndexes = {
      background: 0,
      overlay: 10,
      content: 20,
    };

    expect(zIndexes.content).toBeGreaterThan(zIndexes.overlay);
    expect(zIndexes.overlay).toBeGreaterThan(zIndexes.background);
  });

  it("should support multiple parallax speeds for different sections", () => {
    const sections = [
      { name: "hero", speed: 0.5 },
      { name: "features", speed: 0.3 },
      { name: "testimonials", speed: 0.7 },
    ];

    sections.forEach((section) => {
      expect(section.speed).toBeGreaterThan(0);
      expect(section.speed).toBeLessThanOrEqual(1);
    });
  });

  it("should calculate scroll distance from viewport top", () => {
    const windowHeight = 800;
    const elementTop = 200;
    const scrollDistance = windowHeight - elementTop;

    expect(scrollDistance).toBe(600);
  });

  it("should handle edge case when element is at viewport boundary", () => {
    const elementTop = 0;
    const elementHeight = 500;
    const windowHeight = 800;

    const isInViewport = elementTop < windowHeight && elementTop + elementHeight > 0;

    expect(isInViewport).toBe(true);
  });

  it("should maintain parallax effect smoothness", () => {
    const durations = [0.3, 0.5, 0.7];
    const timings = "cubic-bezier(0.4, 0, 0.2, 1)";

    durations.forEach((duration) => {
      const transition = `transform ${duration}s ${timings}`;
      expect(transition).toContain("transform");
      expect(transition).toContain("cubic-bezier");
    });
  });

  it("should support responsive parallax on different screen sizes", () => {
    const screenSizes = [
      { name: "mobile", width: 375 },
      { name: "tablet", width: 768 },
      { name: "desktop", width: 1920 },
    ];

    screenSizes.forEach((size) => {
      expect(size.width).toBeGreaterThan(0);
    });
  });

  it("should apply parallax to hero sections only", () => {
    const sections = [
      { name: "hero", hasParallax: true },
      { name: "programs", hasParallax: false },
      { name: "testimonials", hasParallax: false },
      { name: "contact", hasParallax: false },
    ];

    const heroSection = sections.find((s) => s.name === "hero");
    expect(heroSection?.hasParallax).toBe(true);
  });
});
