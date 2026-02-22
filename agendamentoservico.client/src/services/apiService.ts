/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type {
    Servico,
    Profissional,
    HorarioDisponivel,
    Agendamento,
    Usuario
} from "../types";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 8000
});

/* ============================= */
/*        INTERCEPTORS           */
/* ============================= */

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// 🔥 Logout automático se token expirar
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

/* ============================= */
/*             USER              */
/* ============================= */

export const usuarioService = {
    async getAll(): Promise<Usuario[]> {
        const { data } = await api.get("/usuarios");
        return data;
    },

    async create(payload: Partial<Usuario> & { senha?: string }) {
        const { data } = await api.post("/usuarios", payload);
        return data;
    },

    async update(id: string, payload: Partial<Usuario> & { senha?: string }) {
        const { data } = await api.put(`/usuarios/${id}`, payload);
        return data;
    },

    async delete(id: string) {
        await api.delete(`/usuarios/${id}`);
    }
};

/* ============================= */
/*             AUTH              */
/* ============================= */

export const authService = {
    login: async (email: string, senha: string) => {
        try {
            const { data } = await api.post("/auth/login", {
                email,
                senha
            });

            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify(data.usuario));

            toast.success("Login realizado com sucesso!");
            return data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                toast.error("Email ou senha inválidos");
            } else {
                toast.error("Erro ao realizar login");
            }
            return null;
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "/login";
    },

    getUsuario: () => {
        const user = localStorage.getItem("usuario");
        return user ? JSON.parse(user) : null;
    },

    isAdmin: () => {
        const user = authService.getUsuario();
        return user?.tipo === "Admin";
    }
};

/* ============================= */
/*           SERVIÇOS            */
/* ============================= */

export const servicoService = {
    getAll: async (): Promise<Servico[]> => {
        try {
            const { data } = await api.get("/Servico");
            return data;
        } catch {
            toast.error("Erro ao buscar serviços");
            return [];
        }
    },

    create: async (payload: Partial<Servico>) => {
        try {
            const { data } = await api.post("/Servico", {
                Nome: payload.nome,
                DuracaoMinutos: payload.duracaoMinutos,
                Preco: payload.preco,
                Ativo: payload.ativo ?? true
            });

            toast.success("Serviço criado com sucesso!");
            return data;
        } catch {
            toast.error("Erro ao criar serviço");
            return null;
        }
    }
};

/* ============================= */
/*        PROFISSIONAIS          */
/* ============================= */

export const profissionalService = {
    getAll: async (): Promise<Profissional[]> => {
        try {
            const { data } = await api.get("/Profissional");
            return data;
        } catch {
            toast.error("Erro ao buscar profissionais");
            return [];
        }
    }
};

/* ============================= */
/*           HORÁRIOS            */
/* ============================= */

export const horarioService = {
    getByProfissional: async (
        profissionalId: string
    ): Promise<HorarioDisponivel[]> => {
        try {
            const { data } = await api.get(
                `/HorarioDisponivel/profissional/${profissionalId}`
            );
            return data;
        } catch {
            toast.error("Erro ao buscar horários");
            return [];
        }
    }
};

/* ============================= */
/*         AGENDAMENTOS          */
/* ============================= */

export const agendamentoService = {
    getAll: async (): Promise<Agendamento[]> => {
        try {
            const { data } = await api.get("/Agendamento");
            return data;
        } catch {
            toast.error("Erro ao buscar agendamentos");
            return [];
        }
    },

    create: async (payload: Partial<Agendamento>) => {
        try {
            const { data } = await api.post("/Agendamento", {
                NomeCliente: payload.nomeCliente,
                TelefoneCliente: payload.telefoneCliente,
                HorarioDisponivelId: payload.horarioDisponivelId,
                ServicoId: payload.servicoId,
                Observacoes: payload.observacoes
            });

            toast.success("Agendamento criado com sucesso!");
            return data;
        } catch (error: any) {
            if (error.response?.data?.errors) {
                toast.error("Erro de validação nos dados.");
            } else {
                toast.error("Erro ao criar agendamento.");
            }
            return null;
        }
    },

    confirm: async (id: string) => {
        try {
            const { data } = await api.put(`/Agendamento/confirmar/${id}`);
            toast.success("Agendamento confirmado!");
            return data;
        } catch (error: any) {
            if (error.response?.status === 403) {
                toast.error("Apenas Admin pode confirmar.");
            } else {
                toast.error("Erro ao confirmar agendamento.");
            }
            return null;
        }
    },

    cancel: async (id: string) => {
        try {
            const { data } = await api.put(`/Agendamento/cancelar/${id}`);
            toast.warning("Agendamento cancelado!");
            return data;
        } catch {
            toast.error("Erro ao cancelar agendamento.");
            return null;
        }
    }
};

export default api;