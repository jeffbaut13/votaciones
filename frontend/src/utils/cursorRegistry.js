import {
  ArrowRight,
  Circle,
  MoveRight,
  Play,
  Sparkles,
  Grab,
  Eye,
} from "lucide-react";

export const CURSOR_DEFAULT_STATE = {
  key: "default",
  label: "",
  icon: "spark",
  size: "md",
};

export const CURSOR_VARIANTS = {
  default: {
    icon: "spark",
    label: "",
    size: "md",
  },
  play: {
    icon: "play",
    label: "",
    size: "lg",
  },
  next: {
    icon: "arrow",
    label: "",
    size: "md",
  },
  drag: {
    icon: "grab",
    label: "DRAG",
    size: "lg",
  },
  view: {
    icon: "eye",
    label: "VIEW",
    size: "md",
  },
};

export const CURSOR_ICONS = {
  arrow: MoveRight,
  dot: Circle,
  eye: Eye,
  grab: Grab,
  play: Play,
  spark: Sparkles,
};

export function resolveCursorState(target) {
  if (!target || !(target instanceof Element)) {
    return CURSOR_DEFAULT_STATE;
  }

  const element = target.closest("[data-cursor], [data-cursor-label], [data-cursor-icon]");

  if (!element) {
    return CURSOR_DEFAULT_STATE;
  }

  const variantKey = element.getAttribute("data-cursor") || "default";
  const variant = CURSOR_VARIANTS[variantKey] || CURSOR_VARIANTS.default;
  const label = element.getAttribute("data-cursor-label") || variant.label;
  const icon = element.getAttribute("data-cursor-icon") || variant.icon;
  const size = element.getAttribute("data-cursor-size") || variant.size;

  return {
    key: variantKey,
    label,
    icon,
    size,
    hint: element.getAttribute("data-cursor-hint") || "",
    showArrow: variantKey === "next" || element.getAttribute("data-cursor-arrow") === "true",
  };
}

export function getCursorSize(size) {
  switch (size) {
    case "sm":
      return 58;
    case "lg":
      return 84;
    default:
      return 70;
  }
}

export function getCursorIcon(iconKey) {
  return CURSOR_ICONS[iconKey] || ArrowRight;
}
