/* eslint-disable react-hooks/immutability */
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import AgendaCalendar from '../Components/AgendaCalendar';
import AgendamentoModal from '../Components/AgendamentoModal';
import type { Agendamento, HorarioDisponivel } from '../types';
import { agendamentoService, horarioService, servicoService, profissionalService, pagamentoService } from '../services/apiService';

const Agenda: React.FC = () => {
  const { currentDate } = useOutletContext<{ currentDate: Date }>();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<HorarioDisponivel[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState<HorarioDisponivel | undefined>();
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | undefined>();

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const loadData = async () => {
    const [agendamentosData, horariosData, servicosData, profissionaisData] = await Promise.all([
      agendamentoService.getAll(),
      horarioService.getAll(),
      servicoService.getAll(),
      profissionalService.getAll()
    ]);

    // Enriquecer agendamentos com dados de serviços e profissionais
    const agendamentosEnriquecidos = agendamentosData.map(ag => {
      const servico = servicosData.find(s => s.id === ag.servicoId);
      const horario = horariosData.find(h => h.id === ag.horarioDisponivelId);
      const profissional = horario ? profissionaisData.find(p => p.id === horario.profissionalId) : null;

      return {
        ...ag,
        servicoNome: servico?.nome,
        profissionalNome: profissional?.nome,
        dataHoraInicio: horario?.dataHoraInicio || ag.dataHoraInicio,
        dataHoraFim: horario?.dataHoraFim || ag.dataHoraFim
      };
    });

    setAgendamentos(agendamentosEnriquecidos);

    // Enriquecer horários com nomes de profissionais
    const horariosEnriquecidos = horariosData.map(h => {
      const profissional = profissionaisData.find(p => p.id === h.profissionalId);
      return {
        ...h,
        profissionalNome: profissional?.nome
      };
    });

    setHorariosDisponiveis(horariosEnriquecidos);
  };

  const handleSlotClick = (date: Date, horario?: HorarioDisponivel, agendamento?: Agendamento) => {
    if (agendamento) {
      setSelectedAgendamento(agendamento);
      setSelectedHorario(undefined);
    } else if (horario) {
      setSelectedHorario(horario);
      setSelectedAgendamento(undefined);
    } else {
      // Criar novo horário disponível para este dia/hora
      setSelectedHorario({
        id: `new-${date.getTime()}`,
        profissionalId: '',
        dataHoraInicio: date,
        dataHoraFim: new Date(date.getTime() + 30 * 60000),
        status: 'Disponivel'
      });
      setSelectedAgendamento(undefined);
    }
    setModalOpen(true);
  };

  const handleSave = async (data: Partial<Agendamento>) => {

    const agendamento = await agendamentoService.create(data);

    if (!agendamento) return;

    const urlPagamento = await pagamentoService.criarSessao(agendamento.id);

    if (!urlPagamento) return;

    // redireciona para Stripe
    window.location.href = urlPagamento;

  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Agenda
      </Typography>

      <Box sx={{ width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <AgendaCalendar
          currentDate={currentDate}
          agendamentos={agendamentos}
          horariosDisponiveis={horariosDisponiveis}
          onSlotClick={handleSlotClick}
        />
      </Box>

      <AgendamentoModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedHorario(undefined);
          setSelectedAgendamento(undefined);
        }}
        horario={selectedHorario}
        agendamento={selectedAgendamento}
        onSave={handleSave}
      />
    </Box>
  );
};

export default Agenda;
