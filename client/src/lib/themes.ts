export const themes = {
  theme1: {
    name: "Sunset Passion",
    colors: {
      primary: "#DC586D",
      primaryLight: "#FB9590",
      primaryDark: "#A33757",
      secondary: "#FFBB94",
      accent: "#852E4E",
      dark: "#4C1D3D",
      background: "#FFFFFF",
      backgroundDark: "#1A1A1A",
      surface: "#F8F9FA",
      surfaceDark: "#2D2D2D",
      text: "#1A1A1A",
      textDark: "#FFFFFF",
    }
  },
  theme2: {
    name: "Purple Dream",
    colors: {
      primary: "#A56ABD",
      primaryLight: "#E7DBEF",
      primaryDark: "#6E3482",
      secondary: "#F5EBFA",
      accent: "#49225B",
      dark: "#49225B",
      background: "#FFFFFF",
      backgroundDark: "#1A1A1A",
      surface: "#F8F9FA",
      surfaceDark: "#2D2D2D",
      text: "#1A1A1A",
      textDark: "#FFFFFF",
    }
  },
  theme3: {
    name: "Earth Tone",
    colors: {
      primary: "#796254",
      primaryLight: "#C4B6A9",
      primaryDark: "#523F31",
      secondary: "#EADDD3",
      accent: "#9D8A7C",
      dark: "#2D1E17",
      background: "#FFFFFF",
      backgroundDark: "#1A1A1A",
      surface: "#F8F9FA",
      surfaceDark: "#2D2D2D",
      text: "#1A1A1A",
      textDark: "#FFFFFF",
    }
  },
  theme4: {
    name: "Nature Green",
    colors: {
      primary: "#98A77C",
      primaryLight: "#CFE1B9",
      primaryDark: "#728156",
      secondary: "#E7F5DC",
      accent: "#B6C99B",
      dark: "#88976C",
      background: "#FFFFFF",
      backgroundDark: "#1A1A1A",
      surface: "#F8F9FA",
      surfaceDark: "#2D2D2D",
      text: "#1A1A1A",
      textDark: "#FFFFFF",
    }
  },
  theme5: {
    name: "Ocean Blue",
    colors: {
      primary: "#5483B3",
      primaryLight: "#C1E8FF",
      primaryDark: "#052659",
      secondary: "#7DA0CA",
      accent: "#021024",
      dark: "#021024",
      background: "#FFFFFF",
      backgroundDark: "#1A1A1A",
      surface: "#F8F9FA",
      surfaceDark: "#2D2D2D",
      text: "#1A1A1A",
      textDark: "#FFFFFF",
    }
  },
  theme6: {
    name: "Fire Red",
    colors: {
      primary: "#C0191F",
      primaryLight: "#E51E1B",
      primaryDark: "#7D1416",
      secondary: "#4D474F",
      accent: "#371211",
      dark: "#282F32",
      background: "#FFFFFF",
      backgroundDark: "#1A1A1A",
      surface: "#F8F9FA",
      surfaceDark: "#2D2D2D",
      text: "#1A1A1A",
      textDark: "#FFFFFF",
    }
  },
  theme7: {
    name: "Emerald Gradient",
    colors: {
      primary: "#156F69",
      primaryLight: "#16A085",
      primaryDark: "#14253E",
      secondary: "#168777",
      accent: "#153D4C",
      dark: "#140C30",
      background: "#FFFFFF",
      backgroundDark: "#1A1A1A",
      surface: "#F8F9FA",
      surfaceDark: "#2D2D2D",
      text: "#1A1A1A",
      textDark: "#FFFFFF",
    }
  }
};

export type ThemeKey = keyof typeof themes;
export type Theme = typeof themes[ThemeKey];
