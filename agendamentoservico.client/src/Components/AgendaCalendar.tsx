import React, { useMemo, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import type { EventInput } from '@fullcalendar/core';
import type { Agendamento, HorarioDisponivel } from '../types';
import { Box } from '@mui/material';
import '../styles/fullcalendar.css';

interface AgendaCalendarProps {
  currentDate: Date;
  agendamentos: Agendamento[];
  horariosDisponiveis: HorarioDisponivel[];
  onSlotClick: (date: Date, horario?: HorarioDisponivel, agendamento?: Agendamento) => void;
  viewMode?: 'month' | 'week';
}

const statusColors = {
  Pendente: '#ff9800', // Amarelo/Laranja
  Confirmado: '#4caf50', // Verde
  Disponivel: '#2196f3', // Azul
  Cancelado: '#9e9e9e' // Cinza
};

const AgendaCalendar: React.FC<AgendaCalendarProps> = ({
  currentDate,
  agendamentos,
  horariosDisponiveis,
  onSlotClick,
  viewMode = 'month'
}) => {
  const calendarRef = useRef<FullCalendar>(null);

  // Converte agendamentos para eventos do FullCalendar
  const eventosAgendamentos = useMemo(() => {
    return agendamentos.map((agendamento): EventInput => {
      if (!agendamento.dataHoraInicio) {
        return {
          id: agendamento.id,
          title: `${agendamento.nomeCliente} - ${agendamento.servicoNome || 'Serviço'}`,
          start: new Date().toISOString(),
          backgroundColor: statusColors[agendamento.status] || statusColors.Pendente,
          borderColor: statusColors[agendamento.status] || statusColors.Pendente,
          extendedProps: {
            tipo: 'agendamento',
            agendamento
          }
        };
      }

      const inicio = new Date(agendamento.dataHoraInicio);
      const fim = agendamento.dataHoraFim ? new Date(agendamento.dataHoraFim) : new Date(inicio.getTime() + 30 * 60000);
      const hora = inicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      return {
        id: agendamento.id,
        title: `${hora} - ${agendamento.nomeCliente}`,
        start: inicio.toISOString(),
        end: fim.toISOString(),
        backgroundColor: statusColors[agendamento.status] || statusColors.Pendente,
        borderColor: statusColors[agendamento.status] || statusColors.Pendente,
        extendedProps: {
          tipo: 'agendamento',
          agendamento,
          hora,
          servicoNome: agendamento.servicoNome
        }
      };
    });
  }, [agendamentos]);

  // Converte horários disponíveis para eventos do FullCalendar (apenas alguns para não poluir)
  const eventosHorarios = useMemo(() => {
    // Mostra apenas alguns horários disponíveis por dia para não poluir o calendário
    const horariosPorDia = new Map<string, HorarioDisponivel[]>();
    
    horariosDisponiveis.forEach(horario => {
      if (horario.status === 'Disponivel') {
        const data = new Date(horario.dataHoraInicio);
        const chave = `${data.getFullYear()}-${data.getMonth()}-${data.getDate()}`;
        
        if (!horariosPorDia.has(chave)) {
          horariosPorDia.set(chave, []);
        }
        
        const horariosDoDia = horariosPorDia.get(chave)!;
        if (horariosDoDia.length < 3) {
          horariosDoDia.push(horario);
        }
      }
    });

    const eventos: EventInput[] = [];
    horariosPorDia.forEach((horarios, chave) => {
      horarios.forEach(horario => {
        const inicio = new Date(horario.dataHoraInicio);
        const fim = new Date(horario.dataHoraFim);
        const hora = inicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        eventos.push({
          id: horario.id,
          title: `${hora} - Disponível`,
          start: inicio.toISOString(),
          end: fim.toISOString(),
          backgroundColor: statusColors.Disponivel,
          borderColor: statusColors.Disponivel,
          display: 'block',
          extendedProps: {
            tipo: 'horario',
            horario,
            hora
          }
        });
      });
    });

    return eventos;
  }, [horariosDisponiveis]);

  const eventos = useMemo(() => {
    return [...eventosAgendamentos, ...eventosHorarios];
  }, [eventosAgendamentos, eventosHorarios]);

  // Atualiza a data do calendário quando currentDate muda
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(currentDate);
    }
  }, [currentDate]);

  const handleEventClick = (info: any) => {
    const { extendedProps } = info.event;
    
    if (extendedProps.tipo === 'agendamento') {
      const agendamento = extendedProps.agendamento as Agendamento;
      const date = new Date(info.event.start);
      onSlotClick(date, undefined, agendamento);
    } else if (extendedProps.tipo === 'horario') {
      const horario = extendedProps.horario as HorarioDisponivel;
      const date = new Date(info.event.start);
      onSlotClick(date, horario);
    }
  };

  const handleDateClick = (info: any) => {
    const date = new Date(info.date);
    onSlotClick(date);
  };

  return (
    <Box sx={{ p: 2 }}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={ptBrLocale}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth'
        }}
        events={eventos}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        editable={false}
        selectable={false}
        dayMaxEvents={5}
        moreLinkText="mais"
        height="auto"
        eventDisplay="block"
        eventTextColor="#fff"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
      />
    </Box>
  );
};

export default AgendaCalendar;
