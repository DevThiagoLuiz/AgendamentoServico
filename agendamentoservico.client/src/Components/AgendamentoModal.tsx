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
  Typography
} from '@mui/material';
import type { Agendamento, HorarioDisponivel, Servico, Profissional } from '../types';
import { servicoService, profissionalService } from '../services/apiService';

interface AgendamentoModalProps {
  open: boolean;
  onClose: () => void;
  horario?: HorarioDisponivel;
  agendamento?: Agendamento;
  onSave: (data: Partial<Agendamento>) => Promise<void>;
}

const AgendamentoModal: React.FC<AgendamentoModalProps> = ({
  open,
  onClose,
  horario,
  agendamento,
  onSave
}) => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [servicoId, setServicoId] = useState('');
  const [profissionalId, setProfissionalId] = useState('');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const [servicosData, profissionaisData] = await Promise.all([
        servicoService.getAll(),
        profissionalService.getAll()
      ]);
      setServicos(servicosData);
      setProfissionais(profissionaisData);
    };
    if (open) {
      loadData();
    }
  }, [open]);

  useEffect(() => {
    if (agendamento) {
      setNome(agendamento.nomeCliente);
      setTelefone(agendamento.telefoneCliente);
      setCpf(agendamento.cpfCliente || '');
      setServicoId(agendamento.servicoId);
      setObservacoes(agendamento.observacoes || '');
    } else if (horario) {
      setProfissionalId(horario.profissionalId);
      setNome('');
      setTelefone('');
      setCpf('');
      setServicoId('');
      setObservacoes('');
    }
  }, [agendamento, horario]);

  const handleSubmit = async () => {
    if (!nome || !telefone || !servicoId) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    await onSave({
      nomeCliente: nome,
      telefoneCliente: telefone,
      cpfCliente: cpf,
      servicoId,
      horarioDisponivelId: horario?.id || agendamento?.horarioDisponivelId,
      observacoes
    });

    onClose();
    // Reset form
    setNome('');
    setTelefone('');
    setCpf('');
    setServicoId('');
    setObservacoes('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {agendamento ? 'Detalhes do Agendamento' : 'Novo Agendamento'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
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
            disabled={!!agendamento}
          />
          
          <TextField
            label="Telefone"
            fullWidth
            required
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(11) 98765-4321"
            disabled={!!agendamento}
          />
          
          <TextField
            label="CPF (opcional)"
            fullWidth
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="123.456.789-00"
            disabled={!!agendamento}
          />
          
          <TextField
            label="Serviço"
            select
            fullWidth
            required
            value={servicoId}
            onChange={(e) => setServicoId(e.target.value)}
            disabled={!!agendamento}
          >
            {servicos.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.nome} - R$ {s.preco.toFixed(2)} ({s.duracaoMinutos}min)
              </MenuItem>
            ))}
          </TextField>
          
          {horario && (
            <TextField
              label="Funcionário"
              select
              fullWidth
              value={profissionalId}
              onChange={(e) => setProfissionalId(e.target.value)}
              disabled
            >
              {profissionais
                .filter((p) => p.id === horario.profissionalId)
                .map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nome}
                  </MenuItem>
                ))}
            </TextField>
          )}
          
          <TextField
            label="Observações"
            fullWidth
            multiline
            rows={3}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            disabled={!!agendamento}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        {!agendamento && (
          <Button onClick={handleSubmit} variant="contained">
            Confirmar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AgendamentoModal;
