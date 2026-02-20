import React, { useEffect, useState } from "react";
import { getHorariosByProfissional } from "../api/api";
import { Button, Grid, Typography } from "@mui/material";
import AgendamentoModal from "./AgendamentoModal";

interface Props {
  profissionalId: string;
}

const statusColor = {
  Disponivel: "#4caf50",
  Pendente: "#ff9800",
  Confirmado: "#2196f3",
};

const Agenda: React.FC<Props> = () => {
   const [horarios, setHorarios] = useState<any[]>([]);
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState<string>("");

  // Carrega todos os profissionais e horários
  const loadHorarios = async () => {
    const profRes = await getProfissionais();
    setProfissionais(profRes.data);

    // Busca todos os horários por profissional
    let todosHorarios: any[] = [];
    for (let p of profRes.data) {
      const res = await getHorariosByProfissional(p.id);
      // Adiciona o nome do profissional em cada horário
      todosHorarios = [...todosHorarios, ...res.data.map((h: any) => ({ ...h, profissionalNome: p.nome }))];
    }
    setHorarios(todosHorarios);
  };

  useEffect(() => {
    loadHorarios();
  }, []);

  const handleOpenModal = (horarioId: string, status: string) => {
    if (status !== "Disponivel") return; // só agenda se disponível
    setSelectedHorario(horarioId);
    setModalOpen(true);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Agenda</Typography>
      <Grid container spacing={2}>
        {horarios.map(h => (
          <Grid item key={h.id}>
            <Button
              variant="contained"
              sx={{ backgroundColor: statusColor[h.status], minWidth: 180 }}
              onClick={() => handleOpenModal(h.id, h.status)}
            >
              {h.profissionalNome} <br />
              {new Date(h.dataHoraInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(h.dataHoraFim).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Button>
          </Grid>
        ))}
      </Grid>

      <AgendamentoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        profissionalId={""} // será definido pelo backend a partir do horário
        horarioId={selectedHorario}
        onAgendamentoCreated={loadHorarios}
      />
    </div>
  );
};

export default Agenda;