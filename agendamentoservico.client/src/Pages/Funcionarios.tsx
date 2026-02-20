import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Person } from '@mui/icons-material';
import type { Profissional, HorarioDisponivel } from '../types';
import { profissionalService, horarioService } from '../services/apiService';

const Funcionarios: React.FC = () => {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [selectedProfissional, setSelectedProfissional] = useState<Profissional | null>(null);
  const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadProfissionais();
  }, []);

  const loadProfissionais = async () => {
    const data = await profissionalService.getAll();
    setProfissionais(data.filter(p => p.ativo));
  };

  const handleClickProfissional = async (profissional: Profissional) => {
    setSelectedProfissional(profissional);
    const horariosData = await horarioService.getByProfissional(profissional.id);
    setHorarios(horariosData);
    setDialogOpen(true);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Funcionários
      </Typography>
      
      <Grid container spacing={3}>
        {profissionais.map((profissional) => (
          <Grid item xs={12} sm={6} md={4} key={profissional.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#3b82f6', width: 56, height: 56 }}>
                    <Person sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{profissional.nome}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {profissional.especialidade || 'Sem especialidade'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleClickProfissional(profissional)}>
                  Ver Horários
                </Button>
                <Button size="small">Editar</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Horários Disponíveis - {selectedProfissional?.nome}
        </DialogTitle>
        <DialogContent>
          <List>
            {horarios.slice(0, 10).map((horario) => (
              <ListItem key={horario.id}>
                <ListItemText
                  primary={new Date(horario.dataHoraInicio).toLocaleString('pt-BR')}
                  secondary={`Status: ${horario.status}`}
                />
              </ListItem>
            ))}
            {horarios.length > 10 && (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                ... e mais {horarios.length - 10} horários
              </Typography>
            )}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Funcionarios;
