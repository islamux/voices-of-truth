import localFont from "next/font/local";

const fontUI = localFont({
  src: "../fonts/inter-var.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const fontBody = localFont({
  src: [
    {
      path: "../fonts/source-serif-var.woff2",
      weight: "200 900",
      style: "normal",
    },
    {
      path: "../fonts/source-serif-italic-var.woff2",
      weight: "200 900",
      style: "italic",
    },
  ],
  variable: "--font-source",
  display: "swap",
});

const fontDisplay = localFont({
  src: [
    { path: "../fonts/amiri-400.woff2", weight: "400" },
    { path: "../fonts/amiri-700.woff2", weight: "700" },
  ],
  variable: "--font-amiri",
  display: "swap",
});

const fontArabicUI = localFont({
  src: [
    { path: "../fonts/ruqaa-400.woff2", weight: "400" },
    { path: "../fonts/ruqaa-700.woff2", weight: "700" },
  ],
  variable: "--font-ruqaa",
  display: "swap",
});

export const fontVariables = `${fontUI.variable} ${fontBody.variable} ${fontDisplay.variable} ${fontArabicUI.variable}`;
