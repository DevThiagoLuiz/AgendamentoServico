import axios from 'axios';
import type { 
  Servico, 
  Profissional, 
  HorarioDisponivel, 
  Agendamento 
} from '../types';
import {
  mockServicos,
  mockProfissionais,
  mockHorariosDisponiveis,
  mockAgendamentos
} from '../data/mockData';

const API_BASE_URL = 'https://localhost:5001/api';
let useMock = false;

// Verifica se o backend está disponível
const checkBackend = async (): Promise<boolean> => {
  try {
    await axios.get(`${API_BASE_URL}/Servico`, { timeout: 2000 });
    return true;
  } catch {
    return false;
  }
};

// Inicializa verificando o backend
checkBackend().then(available => {
  useMock = !available;
  if (useMock) {
    console.log('Backend não disponível, usando dados mock');
  } else {
    console.log('Conectado ao backend');
  }
});

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000
});

// Serviços
export const servicoService = {
  getAll: async (): Promise<Servico[]> => {
    if (useMock) return mockServicos;
    try {
      const res = await api.get('/Servico');
      return res.data;
    } catch {
      return mockServicos;
    }
  },
  getById: async (id: string): Promise<Servico | null> => {
    if (useMock) {
      return mockServicos.find(s => s.id === id) || null;
    }
    try {
      const res = await api.get(`/Servico/${id}`);
      return res.data;
    } catch {
      return mockServicos.find(s => s.id === id) || null;
    }
  },
  create: async (data: Partial<Servico>): Promise<Servico> => {
    if (useMock) {
      const novo: Servico = {
        id: Date.now().toString(),
        nome: data.nome || '',
        duracaoMinutos: data.duracaoMinutos || 30,
        preco: data.preco || 0,
        ativo: data.ativo !== undefined ? data.ativo : true
      };
      mockServicos.push(novo);
      return novo;
    }
    try {
      const res = await api.post('/Servico', {
        Nome: data.nome,
        DuracaoMinutos: data.duracaoMinutos,
        Preco: data.preco,
        Ativo: data.ativo !== undefined ? data.ativo : true
      });
      return res.data;
    } catch {
      const novo: Servico = {
        id: Date.now().toString(),
        nome: data.nome || '',
        duracaoMinutos: data.duracaoMinutos || 30,
        preco: data.preco || 0,
        ativo: data.ativo !== undefined ? data.ativo : true
      };
      mockServicos.push(novo);
      return novo;
    }
  },
  update: async (id: string, data: Partial<Servico>): Promise<Servico | null> => {
    if (useMock) {
      const servico = mockServicos.find(s => s.id === id);
      if (servico) {
        Object.assign(servico, data);
        return servico;
      }
      return null;
    }
    try {
      const res = await api.put(`/Servico/${id}`, {
        Nome: data.nome,
        DuracaoMinutos: data.duracaoMinutos,
        Preco: data.preco,
        Ativo: data.ativo
      });
      return res.data;
    } catch {
      const servico = mockServicos.find(s => s.id === id);
      if (servico) {
        Object.assign(servico, data);
        return servico;
      }
      return null;
    }
  },
  delete: async (id: string): Promise<boolean> => {
    if (useMock) {
      const index = mockServicos.findIndex(s => s.id === id);
      if (index !== -1) {
        mockServicos.splice(index, 1);
        return true;
      }
      return false;
    }
    try {
      await api.delete(`/Servico/${id}`);
      return true;
    } catch {
      const index = mockServicos.findIndex(s => s.id === id);
      if (index !== -1) {
        mockServicos.splice(index, 1);
        return true;
      }
      return false;
    }
  }
};

export const profissionalService = {
  getAll: async (): Promise<Profissional[]> => {
    if (useMock) return mockProfissionais;
    try {
      const res = await api.get('/Profissional');
      return res.data;
    } catch {
      return mockProfissionais;
    }
  },
  getById: async (id: string): Promise<Profissional | null> => {
    if (useMock) {
      return mockProfissionais.find(p => p.id === id) || null;
    }
    try {
      const res = await api.get(`/Profissional/${id}`);
      return res.data;
    } catch {
      return mockProfissionais.find(p => p.id === id) || null;
    }
  }
};

export const horarioService = {
  getAll: async (): Promise<HorarioDisponivel[]> => {
    if (useMock) return mockHorariosDisponiveis;
    try {
      const res = await api.get('/HorarioDisponivel');
      return res.data;
    } catch {
      return mockHorariosDisponiveis;
    }
  },
  getByProfissional: async (profissionalId: string): Promise<HorarioDisponivel[]> => {
    if (useMock) {
      return mockHorariosDisponiveis.filter(h => h.profissionalId === profissionalId);
    }
    try {
      const res = await api.get(`/HorarioDisponivel/profissional/${profissionalId}`);
      return res.data;
    } catch {
      return mockHorariosDisponiveis.filter(h => h.profissionalId === profissionalId);
    }
  }
};

export const agendamentoService = {
  getAll: async (): Promise<Agendamento[]> => {
    if (useMock) return mockAgendamentos;
    try {
      const res = await api.get('/Agendamento');
      return res.data;
    } catch {
      return mockAgendamentos;
    }
  },
  create: async (data: Partial<Agendamento>): Promise<Agendamento> => {
    if (useMock) {
      const novo: Agendamento = {
        id: Date.now().toString(),
        nomeCliente: data.nomeCliente || '',
        telefoneCliente: data.telefoneCliente || '',
        cpfCliente: data.cpfCliente,
        horarioDisponivelId: data.horarioDisponivelId || '',
        servicoId: data.servicoId || '',
        status: 'Pendente',
        observacoes: data.observacoes,
        criadoEm: new Date()
      };
      mockAgendamentos.push(novo);
      return novo;
    }
    try {
      const res = await api.post('/Agendamento', {
        NomeCliente: data.nomeCliente,
        TelefoneCliente: data.telefoneCliente,
        HorarioDisponivelId: data.horarioDisponivelId,
        ServicoId: data.servicoId,
        Observacoes: data.observacoes
      });
      return res.data;
    } catch {
      // Fallback para mock em caso de erro
      const novo: Agendamento = {
        id: Date.now().toString(),
        nomeCliente: data.nomeCliente || '',
        telefoneCliente: data.telefoneCliente || '',
        cpfCliente: data.cpfCliente,
        horarioDisponivelId: data.horarioDisponivelId || '',
        servicoId: data.servicoId || '',
        status: 'Pendente',
        observacoes: data.observacoes,
        criadoEm: new Date()
      };
      mockAgendamentos.push(novo);
      return novo;
    }
  },
  confirm: async (id: string): Promise<Agendamento | null> => {
    if (useMock) {
      const agendamento = mockAgendamentos.find(a => a.id === id);
      if (agendamento) {
        agendamento.status = 'Confirmado';
        return agendamento;
      }
      return null;
    }
    try {
      const res = await api.put(`/Agendamento/confirm/${id}`);
      return res.data;
    } catch {
      const agendamento = mockAgendamentos.find(a => a.id === id);
      if (agendamento) {
        agendamento.status = 'Confirmado';
        return agendamento;
      }
      return null;
    }
  },
  cancel: async (id: string): Promise<Agendamento | null> => {
    if (useMock) {
      const agendamento = mockAgendamentos.find(a => a.id === id);
      if (agendamento) {
        agendamento.status = 'Cancelado';
        return agendamento;
      }
      return null;
    }
    try {
      const res = await api.put(`/Agendamento/cancel/${id}`);
      return res.data;
    } catch {
      const agendamento = mockAgendamentos.find(a => a.id === id);
      if (agendamento) {
        agendamento.status = 'Cancelado';
        return agendamento;
      }
      return null;
    }
  }
};
