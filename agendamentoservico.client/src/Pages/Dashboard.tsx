import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip
} from '@mui/material';
import type { Agendamento, Servico } from '../types';
import { agendamentoService, servicoService } from '../services/apiService';

const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [servicos, setServicos] = useState<Servico[]>([]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const [ags, svs] = await Promise.all([agendamentoService.getAll(), servicoService.getAll()]);
            setAgendamentos(ags);
            setServicos(svs);
            setLoading(false);
        };

        load();
    }, []);

    // Helpers
    const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
    const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const confirmedThisMonth = agendamentos.filter(a => a.status === 'Confirmado' && new Date(a.dataHoraInicio) >= start && new Date(a.dataHoraInicio) <= end);

    // services counts for confirmed this month
    const serviceCount = confirmedThisMonth.reduce<Record<string, number>>((acc, cur) => {
        const key = cur.servicoId || 'unknown';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const topServices = Object.entries(serviceCount)
        .map(([id, count]) => ({ id, count, nome: servicos.find(s => s.id === id)?.nome ?? 'Outro' }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // list of all confirmed in month sorted by date
    const confirmedSorted = confirmedThisMonth.slice().sort((a, b) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime());

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">Visão geral do mês</Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2 }} elevation={1}>
                            <Typography variant="subtitle2" color="text.secondary">Agendamentos confirmados (mês)</Typography>
                            <Typography variant="h3" sx={{ mt: 1, fontWeight: 700 }}>{confirmedThisMonth.length}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Total de agendamentos confirmados neste mês</Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2 }} elevation={1}>
                            <Typography variant="subtitle2" color="text.secondary">Serviços mais agendados</Typography>
                            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {topServices.length === 0 && <Typography color="text.secondary">Nenhum agendamento confirmado neste mês</Typography>}
                                {topServices.map(s => (
                                    <Box key={s.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography>{s.nome}</Typography>
                                        <Chip label={s.count} size="small" color="primary" />
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2 }} elevation={1}>
                            <Typography variant="subtitle2" color="text.secondary">Resumo rápido</Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2">Mês: {now.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</Typography>
                                <Typography variant="body2">Total geral de agendamentos: {agendamentos.length}</Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }} elevation={1}>
                            <Typography variant="h6" sx={{ mb: 1 }}>Lista de confirmados (mês)</Typography>
                            <List dense>
                                {confirmedSorted.map((a) => (
                                    <React.Fragment key={a.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={`${new Date(a.dataHoraInicio).toLocaleString('pt-BR')} — ${a.nomeCliente ?? 'Cliente'}`}
                                                secondary={`${servicos.find(s => s.id === a.servicoId)?.nome ?? 'Serviço desconhecido'}`}
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                    </React.Fragment>
                                ))}
                                {confirmedSorted.length === 0 && <Typography color="text.secondary" sx={{ p: 2 }}>Sem agendamentos confirmados neste mês.</Typography>}
                            </List>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }} elevation={1}>
                            <Typography variant="h6" sx={{ mb: 1 }}>Distribuição por dia</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {(() => {
                                    // group by day
                                    const byDay: Record<string, Agendamento[]> = {};
                                    confirmedSorted.forEach(a => {
                                        const key = new Date(a.dataHoraInicio).toLocaleDateString('pt-BR');
                                        byDay[key] = byDay[key] || [];
                                        byDay[key].push(a);
                                    });

                                    const days = Object.keys(byDay).slice(0, 14);

                                    return days.length === 0 ? (
                                        <Typography color="text.secondary">Nenhum dado para exibir</Typography>
                                    ) : (
                                        days.map(day => (
                                            <Box key={day} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2">{day}</Typography>
                                                <Chip label={byDay[day].length} size="small" />
                                            </Box>
                                        ))
                                    );
                                })()}
                            </Box>
                        </Paper>
                    </Grid>

                </Grid>
            )}
        </Box>
    );
};

export default Dashboard;
