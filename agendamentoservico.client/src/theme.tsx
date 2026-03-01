import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            // roxo profissional
            main: "#6b21a8",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#7c3aed",
        },
        background: {
            default: "#f8fafc",
            paper: "#ffffff",
        },
    },
    typography: {
        fontFamily: [
            'Inter',
            'Roboto',
            'Segoe UI',
            'Helvetica Neue',
            'Arial',
            'sans-serif',
        ].join(','),
        h6: {
            fontWeight: 700,
            letterSpacing: '0.2px'
        }
    },
    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8
                }
            }
        }
    }
});

theme = responsiveFontSizes(theme);

export default theme;
