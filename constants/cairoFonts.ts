// Cairo Font Family Configuration
export const CAIRO_FONTS = {
  light: require("../assets/fonts/Cairo-Light.ttf"),
  regular: require("../assets/fonts/Cairo-Regular.ttf"),
  medium: require("../assets/fonts/Cairo-Medium.ttf"),
  semiBold: require("../assets/fonts/Cairo-SemiBold.ttf"),
  bold: require("../assets/fonts/Cairo-Bold.ttf"),
  extraLight: require("../assets/fonts/Cairo-ExtraLight.ttf"),
} as const;

export type CairoFontWeight = keyof typeof CAIRO_FONTS;
