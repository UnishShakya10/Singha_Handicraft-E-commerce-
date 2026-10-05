import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "gold",
  primaryShade: 5,
  colors: {
    gold: [
      "#fbf8ed",
      "#f4edd4",
      "#eadca8",
      "#e0c96e",
      "#d4b445",
      "#c9a227",
      "#a17d16",
      "#7d6011",
      "#5c470c",
      "#3d3008",
    ],
  },
  fontFamily: "Outfit, sans-serif",
  headings: {
    fontFamily: "Cormorant Garamond, serif",
    fontWeight: "600",
  },
  defaultRadius: "xs",
  black: "#0b0b0b",
  cursorType: "pointer",
});
