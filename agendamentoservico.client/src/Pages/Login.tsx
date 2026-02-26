import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Container,
    Alert,
    CircularProgress
} from "@mui/material";
import { authService } from "../services/apiService";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


const Login: React.FC = () => {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        setLoading(true);

        try {
            await authService.login(email, senha);
            navigate("/");
        } catch (error: any) {
            if (error.response?.status === 401) {
                setErro("Email ou senha inválidos.");
                toast.error("Email ou senha inválidos.")
            } else {
                setErro("Erro ao conectar com o servidor.");
                toast.error("Erro ao conectar com o servidor.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh"
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        p: 5,
                        width: "100%",
                        borderRadius: 3
                    }}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        align="center"
                        sx={{ mb: 4, fontWeight: 600 }}
                    >
                        Sistema de Agendamento
                    </Typography>

                    {erro && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {erro}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        <TextField
                            label="Senha"
                            type="password"
                            fullWidth
                            required
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            sx={{ mb: 4 }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading}
                            sx={{
                                py: 1.5,
                                fontWeight: 600
                            }}
                        >
                            {loading ? <CircularProgress size={24} /> : "Entrar"}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;