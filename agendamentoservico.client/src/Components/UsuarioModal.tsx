import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControlLabel,
    Switch,
    MenuItem,
    Box
} from "@mui/material";
import type { Usuario, Profissional } from "../types";

interface Props {
    open: boolean;
    onClose: () => void;
    usuario: Usuario | null;
    onSave: (data: any) => void;
    isAdmin: boolean;
    profissionais: Profissional[];
}

const UsuarioModal: React.FC<Props> = ({
    open,
    onClose,
    usuario,
    onSave,
    isAdmin,
    profissionais
}) => {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [tipo, setTipo] = useState<"Admin" | "Profissional">("Profissional");
    const [ativo, setAtivo] = useState(true);
    const [profissionalId, setProfissionalId] = useState<string>(""); // 👈 NOVO

    useEffect(() => {
        if (usuario) {
            setNome(usuario.nome);
            setEmail(usuario.email);
            setTipo(usuario.tipo);
            setAtivo(usuario.ativo);
            setProfissionalId(usuario.profissionalId ?? "");
        } else {
            setNome("");
            setEmail("");
            setSenha("");
            setTipo("Profissional");
            setAtivo(true);
            setProfissionalId("");
        }
    }, [usuario]);

    const handleSubmit = () => {
        onSave({
            nome,
            email,
            senha,
            tipo: isAdmin ? tipo : "Profissional",
            ativo,
            profissionalId: tipo === "Profissional" ? profissionalId : null
        });

        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {usuario ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Box component="form" sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                    <TextField
                        label="Nome"
                        fullWidth
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />

                    <TextField
                        label="Email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        label="Senha"
                        type="password"
                        fullWidth
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />

                    {isAdmin && (
                        <TextField
                            select
                            label="Tipo"
                            fullWidth
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value as "Admin" | "Profissional")}
                        >
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="Profissional">Profissional</MenuItem>
                        </TextField>
                    )}

                    <TextField
                        select
                        label="Funcionário vinculado"
                        fullWidth
                        value={profissionalId}
                        onChange={(e) => setProfissionalId(e.target.value)}
                        sx={{ gridColumn: '1 / -1' }}
                    >
                        <MenuItem value="">Nenhum</MenuItem>
                        {profissionais != null && profissionais.filter((p) => p.ativo).map((prof) => (
                            <MenuItem key={prof.id} value={prof.id}>{prof.nome}</MenuItem>
                        ))}
                    </TextField>

                    <FormControlLabel
                        control={<Switch checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />}
                        label="Ativo"
                        sx={{ gridColumn: '1 / -1' }}
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UsuarioModal;