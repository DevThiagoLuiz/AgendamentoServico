import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    Typography,
    Chip
} from '@mui/material';
import type { Agendamento, HorarioDisponivel, Servico } from '../types';
import { servicoService, authService } from '../services/apiService';

interface AgendamentoModalProps {
    open: boolean;
    onClose: () => void;
    horario?: HorarioDisponivel;
    agendamento?: Agendamento;
    onSave: (data: Partial<Agendamento>) => Promise<void>;
    onConfirm?: (id: string) => Promise<void>;
    onCancel?: (id: string) => Promise<void>;
}

const AgendamentoModal: React.FC<AgendamentoModalProps> = ({
    open,
    onClose,
    horario,
    agendamento,
    onSave,
    onConfirm,
    onCancel
}) => {
    const usuario = authService.getUsuario();
    const isAdmin = usuario?.tipo === "Admin";
    const isProfissional = usuario?.tipo === "Profissional";
    const podeAbrir = isAdmin || isProfissional;

    const [servicos, setServicos] = useState<Servico[]>([]);
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cpf, setCpf] = useState('');
    const [servicoId, setServicoId] = useState('');
    const [observacoes, setObservacoes] = useState('');

    useEffect(() => {
        if (!open || !podeAbrir) return;

        const loadServicos = async () => {
            const data = await servicoService.getAll();
            setServicos(data);
        };

        loadServicos();
    }, [open, podeAbrir]);

    useEffect(() => {
        if (agendamento) {
            setNome(agendamento.nomeCliente);
            setTelefone(agendamento.telefoneCliente);
            setCpf(agendamento.cpfCliente || '');
            setServicoId(agendamento.servicoId);
            setObservacoes(agendamento.observacoes || '');
        } else if (horario) {
            setNome('');
            setTelefone('');
            setCpf('');
            setServicoId('');
            setObservacoes('');
        }
    }, [agendamento, horario]);

    const getStatusColor = () => {
        switch (agendamento?.status) {
            case "Pendente":
                return "warning";
            case "Confirmado":
                return "success";
            case "Cancelado":
                return "error";
            default:
                return "default";
        }
    };

    const handleSubmit = async () => {
        if (!isAdmin) return;

        if (!nome || !telefone || !servicoId) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        await onSave({
            nomeCliente: nome,
            telefoneCliente: telefone,
            cpfCliente: cpf,
            servicoId,
            horarioDisponivelId: horario?.id,
            observacoes
        });

        onClose();
    };

    const handleConfirm = async () => {
        if (isAdmin && agendamento && onConfirm) {
            await onConfirm(agendamento.id);
            onClose();
        }
    };

    const handleCancel = async () => {
        if (isAdmin && agendamento && onCancel) {
            await onCancel(agendamento.id);
            onClose();
        }
    };

    if (!podeAbrir) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {agendamento ? 'Detalhes do Agendamento' : 'Novo Agendamento'}
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>

                    {agendamento && (
                        <Chip
                            label={agendamento.status}
                            color={getStatusColor()}
                            sx={{ alignSelf: "flex-start" }}
                        />
                    )}

                    {horario && (
                        <Typography variant="body2" color="text.secondary">
                            Horário: {new Date(horario.dataHoraInicio).toLocaleString('pt-BR')}
                        </Typography>
                    )}

                    <TextField
                        label="Nome do Cliente"
                        fullWidth
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        disabled={!isAdmin}
                    />

                    <TextField
                        label="Telefone"
                        fullWidth
                        required
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        disabled={!isAdmin}
                    />

                    <TextField
                        label="CPF (opcional)"
                        fullWidth
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        disabled={!isAdmin}
                    />

                    <TextField
                        label="Serviço"
                        select
                        fullWidth
                        required
                        value={servicoId}
                        onChange={(e) => setServicoId(e.target.value)}
                        disabled={!isAdmin}
                    >
                        {servicos.map((s) => (
                            <MenuItem key={s.id} value={s.id}>
                                {s.nome} - R$ {s.preco.toFixed(2)} ({s.duracaoMinutos}min)
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Observações"
                        fullWidth
                        multiline
                        rows={3}
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        disabled={!isAdmin}
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Fechar</Button>

                {isAdmin && !agendamento && (
                    <Button onClick={handleSubmit} variant="contained">
                        Criar
                    </Button>
                )}

                {isAdmin && agendamento?.status === "Pendente" && (
                    <>
                        <Button onClick={handleCancel} color="error">
                            Cancelar
                        </Button>
                        <Button onClick={handleConfirm} variant="contained" color="success">
                            Confirmar
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default AgendamentoModal;