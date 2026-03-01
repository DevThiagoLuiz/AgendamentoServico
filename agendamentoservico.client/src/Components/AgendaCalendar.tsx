/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import type { EventInput } from '@fullcalendar/core';

import {
    getStatusColorAgendamento,
    statusColors,
    type AgendaCalendarProps
} from '../types';

import {
    Box,
    useTheme,
    useMediaQuery,
    Typography
} from '@mui/material';

import '../styles/fullcalendar.css';

const AgendaCalendar: React.FC<AgendaCalendarProps> = ({
    currentDate,
    agendamentos,
    horariosDisponiveis,
    onSlotClick
}) => {

    const calendarRef = useRef<FullCalendar | null>(null);

    const theme = useTheme();

    // celular real
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));



    /* =========================================================
       EVENTOS: AGENDAMENTOS
    ========================================================= */

    const eventosAgendamentos = useMemo<EventInput[]>(() => {

        return agendamentos
            .filter(a => a.dataHoraInicio)
            .map(agendamento => {

                const inicio = new Date(agendamento.dataHoraInicio!);

                const fim =
                    agendamento.dataHoraFim
                        ? new Date(agendamento.dataHoraFim)
                        : new Date(inicio.getTime() + 30 * 60000);

                return {
                    id: `ag-${agendamento.id}`,

                    title: agendamento.nomeCliente ?? 'Agendamento',

                    start: inicio,

                    end: fim,

                    backgroundColor:
                        getStatusColorAgendamento(agendamento.status),

                    borderColor:
                        getStatusColorAgendamento(agendamento.status),

                    extendedProps: {

                        tipo: 'agendamento',

                        agendamento

                    }
                };

            });

    }, [agendamentos]);



    /* =========================================================
       EVENTOS: HORARIOS DISPONIVEIS
    ========================================================= */

    const eventosHorarios = useMemo<EventInput[]>(() => {

        const temConflito = (inicio: Date, fim: Date) => {

            return agendamentos.some(a => {

                if (!a.dataHoraInicio) return false;

                const inicioExistente = new Date(a.dataHoraInicio);

                const fimExistente =
                    a.dataHoraFim
                        ? new Date(a.dataHoraFim)
                        : new Date(inicioExistente.getTime() + 30 * 60000);

                return inicio < fimExistente && fim > inicioExistente;

            });

        };

        return horariosDisponiveis
            .filter(h => h.status === 'Disponivel')
            .map(horario => {

                const inicio = new Date(horario.dataHoraInicio);

                const fim = new Date(horario.dataHoraFim);

                const conflito = temConflito(inicio, fim);

                return {

                    id: `hr-${horario.id}`,

                    title: conflito ? 'Indisponível' : 'Disponível',

                    start: inicio,

                    end: fim,

                    backgroundColor:
                        conflito
                            ? statusColors.Bloqueado
                            : statusColors.Disponivel,

                    borderColor:
                        conflito
                            ? statusColors.Bloqueado
                            : statusColors.Disponivel,

                    extendedProps: {

                        tipo: 'horario',

                        horario,

                        bloqueado: conflito

                    }

                };

            });

    }, [horariosDisponiveis, agendamentos]);



    const eventos = useMemo<EventInput[]>(() => {

        return [
            ...eventosHorarios,
            ...eventosAgendamentos
        ];

    }, [eventosAgendamentos, eventosHorarios]);



    /* =========================================================
       NAVEGAÇÃO SEGURA
    ========================================================= */

    useEffect(() => {

        const api = calendarRef.current?.getApi?.();

        if (!api) return;

        api.gotoDate(currentDate);

    }, [currentDate]);



    /* =========================================================
       CLICK EVENTO
    ========================================================= */

    const handleEventClick = (info: any) => {

        const props = info.event.extendedProps;

        const date = new Date(info.event.start);

        if (props.tipo === 'agendamento') {

            onSlotClick(
                date,
                undefined,
                props.agendamento
            );

            return;
        }

        if (
            props.tipo === 'horario'
            &&
            !props.bloqueado
        ) {

            onSlotClick(
                date,
                props.horario
            );

        }

    };



    /* =========================================================
       RENDER EVENTO
    ========================================================= */

    const renderEventContent = (arg: any) => {

        const event = arg.event;

        const start =
            event.start
                ? new Date(event.start)
                : null;

        const hora =
            start
                ? start.toLocaleTimeString(
                    [],
                    {
                        hour: '2-digit',
                        minute: '2-digit'
                    }
                )
                : '';

        return (

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 0.5
                }}
            >

                <Box
                    sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor:
                            event.backgroundColor
                    }}
                />

                <Typography
                    sx={{
                        fontSize: isMobile ? 14 : 13,
                        fontWeight: 600
                    }}
                >

                    {hora}
                    {!isMobile && ' — '}
                    {!isMobile && event.title}

                </Typography>

            </Box>

        );

    };



    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <Box
            sx={{

                p: { xs: 1, md: 3 },

                backgroundColor: '#fff',

                borderRadius: 2,

                boxShadow:
                    '0 4px 24px rgba(0,0,0,0.05)',



                /* MOBILE FIX */

                '& .fc-toolbar-title': {

                    fontSize:
                        isMobile
                            ? 16
                            : 20,

                    fontWeight: 600

                },

                '& .fc-button': {

                    padding:
                        isMobile
                            ? '6px'
                            : '6px 12px',

                    fontSize:
                        isMobile
                            ? 12
                            : 14

                }

            }}
        >

            <FullCalendar
                ref={calendarRef}
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    listPlugin,
                    interactionPlugin
                ]}

                locale={ptBrLocale}

                /* VIEW RESPONSIVA PROFISSIONAL */
                initialView={isMobile ? 'timeGridDay' : 'timeGridWeek'}

                /* HEADER RESPONSIVO */
                headerToolbar={
                    isMobile
                        ? {
                            left: 'prev,next',
                            center: 'title',
                            right: 'today'
                        }
                        : {
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }
                }

                buttonText={{
                    today: 'Hoje',
                    month: 'Mês',
                    week: 'Semana',
                    day: 'Dia'
                }}

                /* EVENTOS */
                events={eventos ?? []}

                eventClick={handleEventClick}

                eventContent={renderEventContent}

                /* CONFIGURAÇÃO DE TEMPO */
                allDaySlot={false}

                slotMinTime="08:00:00"

                slotMaxTime="18:00:00"

                slotDuration="00:30:00"

                slotLabelInterval="01:00"

                slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }}

                /* MELHORIAS VISUAIS */
                nowIndicator={true}

                height="auto"

                contentHeight="auto"

                expandRows={true}

                stickyHeaderDates={true}

                dayMaxEvents={!isMobile}

                eventOverlap={false}

                selectable={false}

                moreLinkText="ver mais"

                eventTextColor="#fff"

                /* TAMANHO CORRETO MOBILE */
                eventMinHeight={28}

                eventShortHeight={22}

                slotMinWidth={isMobile ? 0 : 50}

                dayHeaderFormat={
                    isMobile
                        ? { weekday: 'short', day: 'numeric' }
                        : { weekday: 'short', day: 'numeric', month: 'numeric' }
                }

                /* PERFORMANCE */
                rerenderDelay={10}

            />



            {/* LEGENDA */}

            <Box
                sx={{
                    mt: 2,
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap'
                }}
            >

                {Object.entries(statusColors)
                    .map(([nome, cor]) => (

                        <Box
                            key={nome}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >

                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: 1,
                                    backgroundColor: cor
                                }}
                            />

                            <Typography variant="body2">

                                {nome}

                            </Typography>

                        </Box>

                    ))}

            </Box>

        </Box>

    );

};

export default AgendaCalendar;