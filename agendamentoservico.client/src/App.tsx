import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "./Components/Layout/MainLayout";
import Agenda from "./Pages/Agenda";
import Servicos from "./Pages/Servicos";
import Funcionarios from "./Pages/Funcionarios";
import Login from "./Pages/Login";
import Horarios from "./Pages/Horarios";
import Usuarios from "./Pages/Usuarios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

// Componente interno para rotas privadas
const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Componente interno para rotas privadas com role "Admin"
const AdminRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const token = localStorage.getItem("token");
    const tipo = localStorage.getItem("tipo")?.replace(/['"]/g, '').trim();

    if (!token || tipo != "Admin") {
        return <Navigate to="/" replace />; // redireciona para home se não for admin
    }
    return children;
};

const App: React.FC = () => {
    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <Routes>
                        <Route path="/" element={<MainLayout />}>
                            {/* Rota pública */}
                            <Route index element={<Agenda />} />
                            <Route path="login" element={<Login />} />

                            {/* Rotas privadas */}
                            <Route
                                path="servicos"
                                element={
                                    <PrivateRoute>
                                        <Servicos />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="funcionarios"
                                element={
                                    <PrivateRoute>
                                        <Funcionarios />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="horarios"
                                element={
                                    <PrivateRoute>
                                        <Horarios />
                                    </PrivateRoute>
                                }
                            />

                            {/* Rota Admin */}
                            <Route
                                path="usuarios"
                                element={
                                    <AdminRoute>
                                        <Usuarios />
                                    </AdminRoute>
                                }
                            />
                        </Route>
                    </Routes>
                </Router>
            </ThemeProvider>
        </>
    );
};

export default App;