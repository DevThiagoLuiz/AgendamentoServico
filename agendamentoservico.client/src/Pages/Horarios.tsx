import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    IconButton
} from "@mui/material";
import {
    DataGrid,
    type GridColDef,
    type GridRowParams
} from "@mui/x-data-grid";
import { Add, Edit, Delete } from "@mui/icons-material";
import type { HorarioDisponivel } from "../types";
import { horarioService } from "../services/apiService";
import HorarioModal from "../Components/HorarioModal";

const Horarios: React.FC = () => {
    const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedHorario, setSelectedHorario] =
        useState<HorarioDisponivel | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadHorarios();
    }, []);

    const loadHorarios = async () => {
        setLoading(true);
        try {
            const data = await horarioService.getAll();
            setHorarios(data);
        } catch (error) {
            console.error("Erro ao carregar horários:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setSelectedHorario(null);
        setModalOpen(true);
    };

    const handleEdit = (horario: HorarioDisponivel) => {
        setSelectedHorario(horario);
        setModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este horário?")) {
            try {
                await horarioService.delete(id);
                await loadHorarios();
            } catch (error) {
                console.error("Erro ao excluir horário:", error);
            }
        }
    };

    const handleSave = async (data: any) => {
        try {
            if (selectedHorario) {
                // edição = atualizar status
                await horarioService.updateStatus(
                    selectedHorario.id,
                    data.status
                );
            } else {
                // criação = intervalo
                await horarioService.createIntervalo(data);
            }

            await loadHorarios();
        } catch (error) {
            console.error("Erro ao salvar horário:", error);
        }
    };

    const columns: GridColDef[] = [
        {
            field: "dataHoraInicio",
            headerName: "Início",
            flex: 1,
            minWidth: 180,
            renderCell: (params) =>
                new Date(params.value).toLocaleString()
        },
        {
            field: "dataHoraFim",
            headerName: "Fim",
            flex: 1,
            minWidth: 180,
            renderCell: (params) =>
                new Date(params.value).toLocaleString()
        },
        {
            field: "status",
            headerName: "Status",
            width: 140,
            renderCell: (params) => (
                <Box
                    sx={{
                        backgroundColor:
                            params.value === "Disponivel"
                                ? "#4caf50"
                                : params.value === "Confirmado"
                                    ? "#2196f3"
                                    : params.value === "Pendente"
                                        ? "#ff9800"
                                        : "#9e9e9e",
                        color: "#fff",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        fontWeight: "bold"
                    }}
                >
                    {params.value}
                </Box>
            )
        },
        {
            field: "actions",
            headerName: "Ações",
            width: 150,
            sortable: false,
            renderCell: (params: GridRowParams) => (
                <Box>
                    <IconButton
                        size="small"
                        onClick={() =>
                            handleEdit(params.row as HorarioDisponivel)
                        }
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
                        Horários
                    </Typography>

                    <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
                        Criar Horários
                    </Button>
                </Box>
            </Box>

            <Box component="section">
                <Box sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
                    <DataGrid
                        rows={horarios}
                        columns={columns}
                        loading={loading}
                        getRowId={(row) => row.id}
                        pageSizeOptions={[10, 25, 50]}
                        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                        disableRowSelectionOnClick
                    />
                </Box>
            </Box>

            <HorarioModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedHorario(null);
                }}
                horario={selectedHorario}
                onSave={handleSave}
            />
        </Box>
    );
};

export default Horarios;