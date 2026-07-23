// Shared design tokens — keep in sync with Settlement / Card Payment pages
export const T = {
  bg: "#F3F4F0",
  surface: "#FFFFFF",
  ink: "#14213D",
  inkSoft: "#5B6472",
  border: "#E3E4DE",
  accent: "#0E7C66",
  accentSoft: "#E4F1EC",
  amber: "#B7791F",
  amberSoft: "#FBF0DE",
  red: "#B3261E",
  redSoft: "#FBE9E7",
  slate: "#7C8592",
  slateSoft: "#EEF0EE",
};

export const displayFont = "'Space Grotesk', 'IBM Plex Sans', sans-serif";
export const bodyFont = "'Inter', 'IBM Plex Sans', sans-serif";
export const monoFont = "'IBM Plex Mono', 'SFMono-Regular', monospace";

// Notification type → visual style. Extend as backend adds new notification types.
export const NOTIFICATION_TYPES = {
  payment_success: { label: "Payment", color: T.accent, bg: T.accentSoft },
  payment_failed: { label: "Payment", color: T.red, bg: T.redSoft },
  settlement: { label: "Settlement", color: T.accent, bg: T.accentSoft },
  security: { label: "Security", color: T.amber, bg: T.amberSoft },
  otp: { label: "Verification", color: T.slate, bg: T.slateSoft },
  system: { label: "System", color: T.slate, bg: T.slateSoft },
};