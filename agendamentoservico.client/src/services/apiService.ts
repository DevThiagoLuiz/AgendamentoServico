/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type {
    Servico,
    Profissional,
    HorarioDisponivel,
    Agendamento
} from "../types";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000
});

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