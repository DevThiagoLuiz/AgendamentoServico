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
    MenuItem
} from "@mui/material";
import type { Usuario } from "../types";

interface Props {
    open: boolean;
    onClose: () => void;
    usuario: Usuario | null;
    onSave: (data: any) => void;
    isAdmin: boolean;
}

const UsuarioModal: React.FC<Props> = ({
    open,
    onClose,
    usuario,
    onSave,
    isAdmin
}) => {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [tipo, setTipo] = useState<"Admin" | "Profissional">("Profissional");
    const [ativo, setAtivo] = useState(true);

    useEffect(() => {
        if (usuario) {
            setNome(usuario.nome);
            setEmail(usuario.email);
            setTipo(usuario.tipo);
            setAtivo(usuario.ativo);
        } else {
            setNome("");
            setEmail("");
            setSenha("");
            setTipo("Profissional");
            setAtivo(true);
        }
    }, [usuario]);

    const handleSubmit = () => {
        onSave({
            nome,
            email,
            senha,
            tipo: isAdmin ? tipo : "Profissional",
            ativo
        });

        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {usuario ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <TextField
                    label="Nome"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />

                <TextField
                    label="Email"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    label="Senha"
                    type="password"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />

                {isAdmin && (
                    <TextField
                        select
                        label="Tipo"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value as any)}
                    >
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Profissional">Profissional</MenuItem>
                    </TextField>
                )}

                <FormControlLabel
                    control={
                        <Switch
                            checked={ativo}
                            onChange={(e) => setAtivo(e.target.checked)}
                        />
                    }
                    label="Ativo"
                />
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