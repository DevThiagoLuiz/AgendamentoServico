/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem
} from "@mui/material";
import type { HorarioDisponivel, Profissional } from "../types";
import { profissionalService } from "../services/apiService";

interface Props {
    open: boolean;
    onClose: () => void;
    horario: HorarioDisponivel | null;
    onSave: (data: any) => void;
}

const HorarioModal: React.FC<Props> = ({
    open,
    onClose,
    horario,
    onSave
}) => {
    const isEdit = !!horario;

    const [profissionais, setProfissionais] = useState<Profissional[]>([]);

    const [profissionalId, setProfissionalId] = useState("");
    const [dataDia, setDataDia] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFim, setHoraFim] = useState("");
    const [intervaloMinutos, setIntervaloMinutos] = useState(60);
    const [status, setStatus] = useState("Disponivel");

    useEffect(() => {
        profissionalService.getAll().then(setProfissionais);
    }, []);

    useEffect(() => {
        if (horario) {
            setStatus(horario.status);
        } else {
            setProfissionalId("");
            setDataDia("");
            setHoraInicio("");
            setHoraFim("");
            setIntervaloMinutos(60);
            setStatus("Disponivel");
        }
    }, [horario]);

    const handleSubmit = () => {
        if (isEdit) {
            onSave({ status });
        } else {
            onSave({
                profissionalId,
                data: dataDia,
                horaInicio,
                horaFim,
                intervaloMinutos
            });
        }

        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {isEdit ? "Editar Horário" : "Criar Horários"}
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                {isEdit ? (
                    <TextField
                        select
                        fullWidth
                        label="Status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <MenuItem value="Disponivel">Disponível</MenuItem>
                        <MenuItem value="Pendente">Pendente</MenuItem>
                        <MenuItem value="Confirmado">Confirmado</MenuItem>
                        <MenuItem value="Bloqueado">Bloqueado</MenuItem>
                    </TextField>
                ) : (
                    <>
                        <TextField
                            select
                            label="Profissional"
                            fullWidth
                            value={profissionalId}
                            onChange={(e) =>
                                setProfissionalId(e.target.value)
                            }
                            sx={{ mb: 2 }}
                        >
                            {profissionais.map((p) => (
                                <MenuItem key={p.id} value={p.id}>
                                    {p.nome}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            type="date"
                            label="Data"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={dataDia}
                            onChange={(e) => setDataDia(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            type="time"
                            label="Hora Início"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={horaInicio}
                            onChange={(e) =>
                                setHoraInicio(e.target.value)
                            }
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            type="time"
                            label="Hora Fim"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={horaFim}
                            onChange={(e) => setHoraFim(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            select
                            label="Intervalo"
                            fullWidth
                            value={intervaloMinutos}
                            onChange={(e) =>
                                setIntervaloMinutos(
                                    Number(e.target.value)
                                )
                            }
                        >
                            <MenuItem value={15}>15 min</MenuItem>
                            <MenuItem value={30}>30 min</MenuItem>
                            <MenuItem value={60}>60 min</MenuItem>
                            <MenuItem value={90}>90 min</MenuItem>
                            <MenuItem value={120}>120 min</MenuItem>
                        </TextField>
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    {isEdit ? "Salvar" : "Criar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default HorarioModal;