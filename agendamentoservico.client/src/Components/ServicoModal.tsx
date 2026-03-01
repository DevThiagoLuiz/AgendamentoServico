import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControlLabel,
  Switch
} from '@mui/material';
import type { Servico } from '../types';

interface ServicoModalProps {
  open: boolean;
  onClose: () => void;
  servico?: Servico | null;
  onSave: (data: Partial<Servico>) => Promise<void>;
}

const ServicoModal: React.FC<ServicoModalProps> = ({
  open,
  onClose,
  servico,
  onSave
}) => {
  const [nome, setNome] = useState('');
  const [duracaoMinutos, setDuracaoMinutos] = useState<number>(30);
  const [preco, setPreco] = useState<number>(0);
  const [ativo, setAtivo] = useState<boolean>(true);

  useEffect(() => {
    if (servico) {
      setNome(servico.nome);
      setDuracaoMinutos(servico.duracaoMinutos);
      setPreco(servico.preco);
      setAtivo(servico.ativo);
    } else {
      // Reset form para novo serviço
      setNome('');
      setDuracaoMinutos(30);
      setPreco(0);
      setAtivo(true);
    }
  }, [servico, open]);

  const handleSubmit = async () => {
    if (!nome || duracaoMinutos <= 0 || preco < 0) {
      alert('Preencha todos os campos obrigatórios corretamente');
      return;
    }

    await onSave({
      nome,
      duracaoMinutos,
      preco,
      ativo
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {servico ? 'Editar Serviço' : 'Novo Serviço'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Box component="form" sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' } }}>
            <TextField
              label="Nome do Serviço"
              fullWidth
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              inputProps={{ maxLength: 150 }}
              helperText={`${nome.length}/150 caracteres`}
            />

            <TextField
              label="Duração (minutos)"
              type="number"
              required
              value={duracaoMinutos}
              onChange={(e) => setDuracaoMinutos(parseInt(e.target.value) || 0)}
              inputProps={{ min: 1 }}
            />

            <TextField
              label="Preço (R$)"
              type="number"
              required
              value={preco}
              onChange={(e) => setPreco(parseFloat(e.target.value) || 0)}
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{
                startAdornment: <span style={{ marginRight: 8 }}>R$</span>
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={ativo}
                  onChange={(e) => setAtivo(e.target.checked)}
                  color="primary"
                />
              }
              label="Serviço Ativo"
              sx={{ gridColumn: '1 / -1' }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          {servico ? 'Salvar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServicoModal;
