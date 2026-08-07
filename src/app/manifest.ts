import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Voices of Truth",
    short_name: "Voices",
    description:
      "A bilingual directory of renowned Islamic scholars and preachers worldwide.",
    start_url: "/en",
    display: "standalone",
    background_color: "#1b2433",
    theme_color: "#1b2433",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
