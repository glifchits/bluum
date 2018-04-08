import { Platform } from "react-native";

// Typography
export const FONT_REG =
  Platform.OS === "android" ? "avenir-next-regular" : "AvenirNext-Regular";
export const FONT_BOLD =
  Platform.OS === "android" ? "avenir-next-bold" : "AvenirNext-DemiBold";

// Colors

export const OFF_BLACK = "#1C1713";
export const DARK_BROWN = "#442E2D";
export const BROWN = "#654241";
export const LIGHT_BROWN = "#B6906C";
export const OFF_WHITE = "F5F5F5";
export const BORDER_COLOR_GREY = "#d9d9d9";

// Misc

export const BORDER_RADIUS = 5;

// Shadows

export const SHADOW_COLOR = "rgba(53,53,53,0.08)";
export const SHADOW_OFFSET = { width: 0, height: 5 };
export const SHADOW_RADIUS = 15;
