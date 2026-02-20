import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";
import { getServicos, createAgendamento } from "../api/api";

interface Props {
  open: boolean;
  onClose: () => void;
  profissionalId: string;
  horarioId: string;
  onAgendamentoCreated: () => void;
}

const AgendamentoModal: React.FC<Props> = ({ open, onClose, profissionalId, horarioId, onAgendamentoCreated }) => {
  const [servicos, setServicos] = useState<any[]>([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [servicoId, setServicoId] = useState("");

  useEffect(() => {
    getServicos().then(res => setServicos(res.data));
  }, []);

  const handleSubmit = async () => {
    await createAgendamento({
      NomeCliente: nome,
      TelefoneCliente: telefone,
      HorarioDisponivelId: horarioId,
      ServicoId: servicoId
    });
    onAgendamentoCreated();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Novo Agendamento</DialogTitle>
      <DialogContent>
        <TextField
          label="Nome"
          fullWidth
          margin="dense"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />
        <TextField
          label="Telefone"
          fullWidth
          margin="dense"
          value={telefone}
          onChange={e => setTelefone(e.target.value)}
        />
        <TextField
          label="Serviço"
          select
          fullWidth
          margin="dense"
          value={servicoId}
          onChange={e => setServicoId(e.target.value)}
        >
          {servicos.map(s => (
            <MenuItem key={s.id} value={s.id}>
              {s.nome}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Agendar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgendamentoModal;