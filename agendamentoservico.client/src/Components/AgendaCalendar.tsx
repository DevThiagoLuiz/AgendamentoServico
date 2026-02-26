/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/preserve-manual-memoization */
import React, { useMemo, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import type { EventInput } from '@fullcalendar/core';
import { getStatusColorAgendamento, statusColors, type AgendaCalendarProps } from '../types';
import { Box } from '@mui/material';
import '../styles/fullcalendar.css';


const AgendaCalendar: React.FC<AgendaCalendarProps> = ({
    currentDate,
    agendamentos,
    horariosDisponiveis,
    onSlotClick
}) => {
    const calendarRef = useRef<FullCalendar>(null);

 


    // 🔐 Verifica conflito de horário
    const temConflito = (inicio: Date, fim: Date) => {
        return agendamentos.some(a => {
            if (!a.dataHoraInicio) return false;

            const inicioExistente = new Date(a.dataHoraInicio);
            const fimExistente = a.dataHoraFim
                ? new Date(a.dataHoraFim)
                : new Date(inicioExistente.getTime() + 30 * 60000);

            return inicio < fimExistente && fim > inicioExistente;
        });
    };

    // 🟢 Agendamentos
    const eventosAgendamentos = useMemo(() => {
        return agendamentos
            .filter(a => a.dataHoraInicio)
            .map((agendamento): EventInput => {
                const inicio = new Date(agendamento.dataHoraInicio!);
                const fim = agendamento.dataHoraFim
                    ? new Date(agendamento.dataHoraFim)
                    : new Date(inicio.getTime() + 30 * 60000);

                console.log(agendamento.status);
                return {
                    id: `ag-${agendamento.id}`,
                    title: `${agendamento.nomeCliente}`,
                    start: inicio,
                    end: fim,
                    backgroundColor: getStatusColorAgendamento(agendamento.status),
                    borderColor: getStatusColorAgendamento(agendamento.status),
                    extendedProps: {
                        tipo: 'agendamento',
                        agendamento
                    }
                };
            });
    }, [agendamentos]);

    // 🔵 Horários disponíveis
    const eventosHorarios = useMemo(() => {
        return horariosDisponiveis
            .filter(h => h.status === 'Disponivel')
            .map((horario): EventInput => {
                const inicio = new Date(horario.dataHoraInicio);
                const fim = new Date(horario.dataHoraFim);

                const conflito = temConflito(inicio, fim);

                return {
                    id: `hr-${horario.id}`,
                    title: conflito ? 'Indisponível' : 'Disponível',
                    start: inicio,
                    end: fim,
                    backgroundColor: conflito
                        ? statusColors.Bloqueado
                        : statusColors.Disponivel,
                    borderColor: conflito
                        ? statusColors.Bloqueado
                        : statusColors.Disponivel,
                    display: 'block',
                    classNames: conflito
                        ? ['evento-bloqueado']
                        : ['evento-disponivel'],
                    extendedProps: {
                        tipo: 'horario',
                        horario,
                        bloqueado: conflito
                    }
                };
            });
    }, [horariosDisponiveis, agendamentos]);

    const eventos = useMemo(
        () => [...eventosHorarios, ...eventosAgendamentos],
        [eventosHorarios, eventosAgendamentos]
    );

    useEffect(() => {
        if (calendarRef.current) {
            calendarRef.current.getApi().gotoDate(currentDate);
        }
    }, [currentDate]);

    const handleEventClick = (info: any) => {
        const { extendedProps } = info.event;
        const date = new Date(info.event.start);

        //const usuario = authService.getUsuario();
        //const podeAbrir = usuario?.tipo === "Admin" || usuario?.tipo === "Profissional";

        //if (!podeAbrir) return;

        if (extendedProps.tipo === 'agendamento') {
            onSlotClick(date, undefined, extendedProps.agendamento);
            return;
        }

        if (extendedProps.tipo === 'horario' && !extendedProps.bloqueado) {
            onSlotClick(date, extendedProps.horario);
        }
    };

    return (
        <Box
            sx={{
                p: 3,
                backgroundColor: '#f5f7fa',
                borderRadius: 4,
                boxShadow: '0 4px 24px rgba(0,0,0,0.05)'
            }}
        >
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                locale={ptBrLocale}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                buttonText={{
                    today: 'Hoje',
                    month: 'Mês',
                    week: 'Semana',
                    day: 'Dia'
                }}
                events={eventos}
                eventClick={handleEventClick}
                allDaySlot={false}
                slotMinTime="08:00:00"
                slotMaxTime="18:00:00"
                slotDuration="00:30:00"
                nowIndicator={true}
                height="auto"
                eventOverlap={false}
                selectable={false}
                dayMaxEvents={true}
                moreLinkText="ver mais"
                eventTextColor="#fff"
            />
        </Box>
    );
};

export default AgendaCalendar;