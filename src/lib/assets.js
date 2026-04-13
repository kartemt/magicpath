const BASE = import.meta.env.BASE_URL;

export const ASSET = {
  screen1:      `${BASE}assets/screen1-hero.png`,
  screen2:      `${BASE}assets/screen2-choice.png`,
  screen4:      `${BASE}assets/screen4-path.png`,
  manifestDark: `${BASE}assets/manifest-bg-dark.png`,
  manifestLight:`${BASE}assets/manifest-bg-light.png`,
  artifacts: {
    spark: `${BASE}assets/artifact-spark.png`,
    key:   `${BASE}assets/artifact-key.png`,
    heart: `${BASE}assets/artifact-heart.png`,
    star:  `${BASE}assets/artifact-star.png`,
    moon:  `${BASE}assets/artifact-moon.png`,
  },
};

/**
 * Returns inline style for a full-screen background image with gradient overlay.
 * @param {string} url - image URL
 * @param {string} position - CSS background-position (default: 'center center')
 * @param {number} topDark - opacity of top overlay (hides baked-in header text)
 * @param {number} bottomDark - opacity of bottom overlay (readability for CTAs)
 */
export function bgImage(url, {
  position = 'center center',
  topDark = 0.72,
  bottomDark = 0.94,
} = {}) {
  return {
    backgroundImage: [
      // Top black overlay — hides baked-in title text from the image
      `linear-gradient(to bottom, rgba(14,26,46,${topDark}) 0%, rgba(14,26,46,0.25) 35%, rgba(14,26,46,0.1) 55%, rgba(14,26,46,0.45) 75%, rgba(14,26,46,${bottomDark}) 100%)`,
      `url(${url})`,
    ].join(', '),
    backgroundSize: 'cover',
    backgroundPosition: position,
    backgroundRepeat: 'no-repeat',
  };
}
