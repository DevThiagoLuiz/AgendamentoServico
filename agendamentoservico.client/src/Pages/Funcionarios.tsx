import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    IconButton
} from "@mui/material";
import { DataGrid, type GridColDef, type GridRowParams } from "@mui/x-data-grid";
import { Add, Edit, Delete } from "@mui/icons-material";
import type { Profissional } from "../types";
import { profissionalService } from "../services/apiService";
import FuncionarioModal from "../Components/FuncionarioModal";

const Funcionarios: React.FC = () => {
    const [profissionais, setProfissionais] = useState<Profissional[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProfissional, setSelectedProfissional] = useState<Profissional | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProfissionais();
    }, []);

    const loadProfissionais = async () => {
        setLoading(true);
        try {
            const data = await profissionalService.getAll();
            setProfissionais(data);
        } catch (error) {
            console.error("Erro ao carregar funcionários:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setSelectedProfissional(null);
        setModalOpen(true);
    };

    const handleEdit = (profissional: Profissional) => {
        setSelectedProfissional(profissional);
        setModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este funcionário?")) {
            try {
                await profissionalService.delete(id);
                await loadProfissionais();
            } catch (error) {
                console.error("Erro ao excluir funcionário:", error);
            }
        }
    };

    const handleSave = async (data: Partial<Profissional>) => {
        try {
            if (selectedProfissional) {
                await profissionalService.update(selectedProfissional.id, data);
            } else {
                await profissionalService.create(data);
            }

            await loadProfissionais();
        } catch (error) {
            console.error("Erro ao salvar funcionário:", error);
        }
    };

    const columns: GridColDef[] = [
        {
            field: "nome",
            headerName: "Nome",
            flex: 1,
            minWidth: 250
        },
        {
            field: "ativo",
            headerName: "Status",
            width: 120,
            type: "boolean",
            renderCell: (params) => (
                <Box
                    sx={{
                        backgroundColor: params.value ? "#4caf50" : "#9e9e9e",
                        color: "#fff",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        fontWeight: "bold"
                    }}
                >
                    {params.value ? "Ativo" : "Inativo"}
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
                        onClick={() => handleEdit(params.row as Profissional)}
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
                        Funcionários
                    </Typography>

                    <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
                        Adicionar Funcionário
                    </Button>
                </Box>
            </Box>

            <Box component="section">
                <Box sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
                    <DataGrid
                        rows={profissionais}
                        columns={columns}
                        loading={loading}
                        getRowId={(row) => row.id}
                        pageSizeOptions={[10, 25, 50]}
                        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                        disableRowSelectionOnClick
                    />
                </Box>
            </Box>

            <FuncionarioModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedProfissional(null);
                }}
                profissional={selectedProfissional}
                onSave={handleSave}
            />
        </Box>
    );
};

export default Funcionarios;