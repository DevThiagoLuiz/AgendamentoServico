import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRowParams } from '@mui/x-data-grid';
import { Add, Edit, Delete } from '@mui/icons-material';
import type { Servico } from '../types';
import { servicoService } from '../services/apiService';
import ServicoModal from '../Components/ServicoModal';

const Servicos: React.FC = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadServicos();
  }, []);

  const loadServicos = async () => {
    setLoading(true);
    try {
      const data = await servicoService.getAll();
      setServicos(data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedServico(null);
    setModalOpen(true);
  };

  const handleEdit = (servico: Servico) => {
    setSelectedServico(servico);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await servicoService.delete(id);
        await loadServicos();
      } catch (error) {
        console.error('Erro ao excluir serviço:', error);
        alert('Erro ao excluir serviço');
      }
    }
  };

  const handleSave = async (data: Partial<Servico>) => {
    try {
      if (selectedServico) {
        await servicoService.update(selectedServico.id, data);
      } else {
        await servicoService.create(data);
      }
      await loadServicos();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      alert('Erro ao salvar serviço');
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'nome',
      headerName: 'Nome',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'duracaoMinutos',
      headerName: 'Duração (min)',
      width: 130,
      type: 'number'
    },
    {
      field: 'preco',
      headerName: 'Preço',
      width: 120,
      type: 'number',
      valueFormatter: (value) => {
        return `R$ ${value.toFixed(2)}`;
      }
    },
    {
      field: 'ativo',
      headerName: 'Status',
      width: 100,
      type: 'boolean',
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: params.value ? '#4caf50' : '#9e9e9e',
            color: '#fff',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}
        >
          {params.value ? 'Ativo' : 'Inativo'}
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      renderCell: (params: GridRowParams) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row as Servico)}
            color="primary"
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
            color="error"
          >
            <Delete />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Serviços
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
            Adicionar Serviço
          </Button>
        </Box>
      </Box>

      <Box component="section">
        <Box sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
          <DataGrid
            rows={servicos}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.id}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell': { borderBottom: '1px solid rgba(0,0,0,0.06)' },
              '& .MuiDataGrid-columnHeaders': { backgroundColor: 'background.default', fontWeight: 'bold' }
            }}
            autoHeight={false}
          />
        </Box>
      </Box>

      <ServicoModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedServico(null);
        }}
        servico={selectedServico}
        onSave={handleSave}
      />
    </Box>
  );
};

export default Servicos;
