// Design tokens centralized
const tokens = {
  palette: {
    primary: { main: "#3781E3" },
    secondary: { main: "#7027A0" },
    background: { default: "#E6F7FF", paper: "#FFFFFF" },
    success: { main: "#10b981" },
    error: { main: "#ef4444" },
    warning: { main: "#f59e0b" },
    text: { primary: "#2B2B2B" },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  shadows: [
    "none",
    "0px 1px 2px rgba(0,0,0,0.05)",
    "0px 1px 3px rgba(0,0,0,0.1)",
    "0px 2px 6px rgba(0,0,0,0.1)",
    "0px 4px 12px rgba(0,0,0,0.12)",
    ...Array(20).fill("0px 8px 20px rgba(0,0,0,0.12)"),
  ],
  typography: {
    fontFamily: '"Nunito", Arial, sans-serif',
    h1: { fontSize: "2rem", fontWeight: 800 },
    h2: { fontSize: "1.6rem", fontWeight: 700 },
    h3: { fontSize: "1.3rem", fontWeight: 700 },
    body1: { fontSize: "1rem", fontWeight: 400 },
    button: { textTransform: "none", fontWeight: 700 },
  },
};

export default tokens;
