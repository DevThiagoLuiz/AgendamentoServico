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

const API_BASE_URL = "https://localhost:7152/api";

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
            localStorage.setItem("tipo", JSON.stringify(data.usuario.tipo));

            toast.success("Login realizado com sucesso!");
            return data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                toast.error("Email ou senha inválidos");
            } else {
                toast.error("Email ou senha inválidos");
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
/*             USER              */
/* ============================= */

export const usuarioService = {
    getAll: async (): Promise<Usuario[]> => {
        try {
            const { data } = await api.get("/usuarios");
            return data;
        } catch {
            toast.error("Erro ao buscar usuários");
            return [];
        }
    },

    create: async (payload: Partial<Usuario> & { senha?: string }) => {
        try {
            const { data } = await api.post("/usuarios", payload);
            toast.success("Usuário criado com sucesso!");
            return data;
        } catch {
            toast.error("Erro ao criar usuário");
            return null;
        }
    },

    update: async (id: string, payload: Partial<Usuario> & { senha?: string }) => {
        try {
            const { data } = await api.put(`/usuarios/${id}`, payload);
            toast.success("Usuário atualizado com sucesso!");
            return data;
        } catch {
            toast.error("Erro ao atualizar usuário");
            return null;
        }
    },

    delete: async (id: string) => {
        try {
            await api.delete(`/usuarios/${id}`);
            toast.success("Usuário excluído!");
            return true;
        } catch {
            toast.error("Erro ao excluir usuário");
            return false;
        }
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

    getById: async (id: string): Promise<Servico | null> => {
        try {
            const { data } = await api.get(`/Servico/${id}`);
            return data;
        } catch {
            toast.error("Erro ao buscar serviço");
            return null;
        }
    },

    create: async (payload: Partial<Servico>): Promise<Servico | null> => {
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
    },

    update: async (
        id: string,
        payload: Partial<Servico>
    ): Promise<Servico | null> => {
        try {
            const { data } = await api.put(`/Servico/${id}`, {
                Nome: payload.nome,
                DuracaoMinutos: payload.duracaoMinutos,
                Preco: payload.preco,
                Ativo: payload.ativo
            });

            toast.success("Serviço atualizado com sucesso!");
            return data;
        } catch {
            toast.error("Erro ao atualizar serviço");
            return null;
        }
    },

    delete: async (id: string): Promise<boolean> => {
        try {
            await api.delete(`/Servico/${id}`);
            toast.success("Serviço excluído com sucesso!");
            return true;
        } catch {
            toast.error("Erro ao excluir serviço");
            return false;
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
    },

    getById: async (id: string): Promise<Profissional | null> => {
        try {
            const { data } = await api.get(`/Profissional/${id}`);
            return data;
        } catch {
            toast.error("Erro ao buscar profissional");
            return null;
        }
    },

    create: async (
        payload: Partial<Profissional>
    ): Promise<Profissional | null> => {
        try {
            const { data } = await api.post("/Profissional", {
                Nome: payload.nome,
                Ativo: payload.ativo ?? true
            });

            toast.success("Funcionário criado com sucesso!");
            return data;
        } catch {
            toast.error("Erro ao criar funcionário");
            return null;
        }
    },

    update: async (
        id: string,
        payload: Partial<Profissional>
    ): Promise<Profissional | null> => {
        try {
            const { data } = await api.put(`/Profissional/${id}`, {
                Nome: payload.nome,
                Ativo: payload.ativo
            });

            toast.success("Funcionário atualizado com sucesso!");
            return data;
        } catch {
            toast.error("Erro ao atualizar funcionário");
            return null;
        }
    },

    delete: async (id: string): Promise<boolean> => {
        try {
            await api.delete(`/Profissional/${id}`);
            toast.success("Profissional excluído com sucesso!");
            return true;
        } catch {
            toast.error("Erro ao excluir profissional");
            return false;
        }
    }
};

/* ============================= */
/*           HORÁRIOS            */
/* ============================= */

export const horarioService = {
    getAll: async (): Promise<HorarioDisponivel[]> => {
        try {
            const { data } = await api.get("/HorarioDisponivel");
            return data;
        } catch {
            toast.error("Erro ao buscar horários");
            return [];
        }
    },

    getByProfissional: async (
        profissionalId: string
    ): Promise<HorarioDisponivel[]> => {
        try {
            const { data } = await api.get(
                `/HorarioDisponivel/profissional/${profissionalId}`
            );
            return data;
        } catch {
            toast.error("Erro ao buscar horários do profissional");
            return [];
        }
    },

    create: async (
        payload: Partial<HorarioDisponivel>
    ): Promise<HorarioDisponivel | null> => {
        try {
            const { data } = await api.post("/HorarioDisponivel", payload);
            toast.success("Horário criado com sucesso!");
            return data;
        } catch {
            toast.error("Erro ao criar horário");
            return null;
        }
    },

    createIntervalo: async (payload: {
        profissionalId: string;
        data: string;
        horaInicio: string;
        horaFim: string;
        intervaloMinutos: number;
    }): Promise<boolean> => {
        try {
            await toast.promise(
                api.post("/HorarioDisponivel/intervalo", payload),
                {
                    pending: "Criando horários...",
                    success: "Horários criados com sucesso!",
                    error: "Erro ao criar horários"
                }
            );
            return true;
        } catch {
            return false;
        }
    },

    updateStatus: async (
        id: string,
        status: string
    ): Promise<HorarioDisponivel | null> => {
        try {
            const { data } = await api.put(`/HorarioDisponivel/${id}`, { status });
            toast.success("Status atualizado!");
            return data;
        } catch {
            toast.error("Erro ao atualizar status");
            return null;
        }
    },

    delete: async (id: string): Promise<boolean> => {
        try {
            await api.delete(`/HorarioDisponivel/${id}`);
            toast.success("Horário excluído!");
            return true;
        } catch {
            toast.error("Erro ao excluir horário");
            return false;
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

    create: async (
        payload: Partial<Agendamento>
    ): Promise<Agendamento | null> => {
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
        } catch {
            toast.error("Erro ao criar agendamento");
            return null;
        }
    },

    confirm: async (id: string): Promise<Agendamento | null> => {
        try {
            const { data } = await api.put(`/Agendamento/confirm/${id}`);
            toast.success("Agendamento confirmado!");
            return data;
        } catch {
            toast.error("Erro ao confirmar agendamento");
            return null;
        }
    },

    cancel: async (id: string): Promise<Agendamento | null> => {
        try {
            const { data } = await api.put(`/Agendamento/cancel/${id}`);
            toast.warning("Agendamento cancelado!");
            return data;
        } catch {
            toast.error("Erro ao cancelar agendamento");
            return null;
        }
    }

};

/* ============================= */
/*          PAGAMENTO            */
/* ============================= */

export const pagamentoService = {

    criarSessao: async (agendamentoId: string): Promise<string | null> => {
        try {
            const { data } = await api.post(`/pagamento/criar-sessao/${agendamentoId}`);
            return data.url;
        } catch {
            toast.error("Erro ao iniciar pagamento");
            return null;
        }
    }
};

export default api;