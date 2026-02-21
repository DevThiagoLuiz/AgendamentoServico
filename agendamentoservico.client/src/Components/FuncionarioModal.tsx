/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControlLabel,
    Switch
} from "@mui/material";
import type { Profissional } from "../types";

interface Props {
    open: boolean;
    onClose: () => void;
    profissional: Profissional | null;
    onSave: (data: Partial<Profissional>) => void;
}

const FuncionarioModal: React.FC<Props> = ({
    open,
    onClose,
    profissional,
    onSave
}) => {
    const [nome, setNome] = useState("");
    const [ativo, setAtivo] = useState(true);

    useEffect(() => {
        if (profissional) {
            setNome(profissional.nome);
            setAtivo(profissional.ativo);
        } else {
            setNome("");
            setAtivo(true);
        }
    }, [profissional]);

    const handleSubmit = () => {
        onSave({ nome, ativo });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {profissional ? "Editar Funcionário" : "Novo Funcionário"}
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <TextField
                    label="Nome"
                    fullWidth
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    sx={{ mb: 2 }}
                />

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

export default FuncionarioModal;