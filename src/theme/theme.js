import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#302F3B",
      secondary: "#31314F",
      light: "skyblue",
    },
    secondary: {
      main: "#952430",
    },
    otherColor: {
      main: "#999",
      yellow: "#FFE014",
      success: "#43a047",
      error: "#d32f2f",
    },
    text: {
      main: "#f5f5f5",
      gray: "#999999",
      error: "#D61900",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#55658A",
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          "&:hover": {
            backgroundColor: "rgb(0,0,0, 0.3)",
            "& .MuiListItemIcon-root": {},
          },
          "&.Mui-selected": {
            backgroundColor: "#1E2432",
            color: "#F5F5F5",
            "& .MuiListItemIcon-root": {
              color: "#F5F5F5",
            },
          },
          "&.Mui-selected:hover": {
            backgroundColor: "#55658A",
          },
        },
      },
    },
  },
});
