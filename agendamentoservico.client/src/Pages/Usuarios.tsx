import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    IconButton
} from "@mui/material";
import { DataGrid, type GridColDef, type GridRowParams } from "@mui/x-data-grid";
import { Add, Edit, Delete } from "@mui/icons-material";
import type { Profissional, Usuario } from "../types";
import { profissionalService, usuarioService } from "../services/apiService";
import UsuarioModal from "../Components/UsuarioModal";

const Usuarios: React.FC = () => {

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(false);
    const [profissionais, setProfissionais] = useState<Profissional[]>([]);

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


    const userTipo = localStorage.getItem("tipo")?.replace(/['"]/g, '').trim(); // salvo no login

    useEffect(() => {
        loadUsuarios();
    }, []);

    const loadUsuarios = async () => {
        setLoading(true);
        try {
            const data = await usuarioService.getAll();
            setUsuarios(data);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setSelectedUsuario(null);
        setModalOpen(true);
    };

    const handleEdit = (usuario: Usuario) => {
        setSelectedUsuario(usuario);
        setModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Deseja excluir este usuário?")) {
            await usuarioService.delete(id);
            await loadUsuarios();
        }
    };

    const handleSave = async (data: any) => {
        if (selectedUsuario) {
            await usuarioService.update(selectedUsuario.id, data);
        } else {
            await usuarioService.create(data);
        }

        await loadUsuarios();
    };

    const columns: GridColDef[] = [
        { field: "nome", headerName: "Nome", flex: 1, minWidth: 200 },
        { field: "email", headerName: "Email", flex: 1, minWidth: 250 },
        { field: "tipo", headerName: "Tipo", width: 150 },
        {
            field: "ativo",
            headerName: "Status",
            width: 120,
            type: "boolean"
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
                        onClick={() => handleEdit(params.row as Usuario)}
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
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    Usuários
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAdd}
                >
                    Adicionar Usuário
                </Button>
            </Box>

            <Box sx={{ height: 600 }}>
                <DataGrid
                    rows={usuarios}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row.id}
                    pageSizeOptions={[10]}
                    disableRowSelectionOnClick
                />
            </Box>

            <UsuarioModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedUsuario(null);
                }}
                usuario={selectedUsuario}
                onSave={handleSave}
                isAdmin={userTipo === "Admin"}
                profissionais={profissionais}
            />
        </Box>
    );
};

export default Usuarios;