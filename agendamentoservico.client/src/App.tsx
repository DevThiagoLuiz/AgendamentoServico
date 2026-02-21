import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "./Components/Layout/MainLayout";
import Agenda from "./Pages/Agenda";
import Servicos from "./Pages/Servicos";
import Funcionarios from "./Pages/Funcionarios";
import Login from "./Pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Horarios from "./Pages/Horarios";

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#3b82f6',
        },
        secondary: {
            main: '#64748b',
        },
    },
});

const App: React.FC = () => {
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="colored"
            />
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <Routes>
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<Agenda />} />
                            <Route path="servicos" element={<Servicos />} />
                            <Route path="funcionarios" element={<Funcionarios />} />
                            <Route path="horarios" element={<Horarios />} />
                            <Route path="login" element={<Login />} />
                        </Route>
                    </Routes>
                </Router>
            </ThemeProvider>
        </>
    );
};

export default App;