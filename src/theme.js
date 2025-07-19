// Minimalist theme for styled-components (optional)
export const theme = {
  colors: {
    // Primary colors from the image
    primary: "#AF1763", // Vibrant magenta
    background: "#191C24", // Dark gray/black

    // Supporting colors from the image
    blue: "#0D6EFD",
    green: "#198754",
    cyan: "#0DCAF0",
    red: "#AB2E3C",
    yellow: "#FFC107",

    // Additional colors for UI
    white: "#FFFFFF",
    gray: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
    },

    // Component specific colors
    cardBackground: "#232837",
    border: "#374151",
    text: {
      primary: "#FFFFFF",
      secondary: "#BFD4D1",
      muted: "#9CA3AF",
    },
    success: "#198754",
    warning: "#FFC107",
    error: "#AB2E3C",
    info: "#0DCAF0",
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },

  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },

  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
};
