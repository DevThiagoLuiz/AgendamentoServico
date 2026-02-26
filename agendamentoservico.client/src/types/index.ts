/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Servico {
  id: string;
  nome: string;
  duracaoMinutos: number;
  preco: number;
  descricao?: string;
  ativo: boolean;
}
export interface Usuario {
    id: string;
    nome: string;
    email: string;
    tipo: "Admin" | "Profissional";
    ativo: boolean;
    criadoEm: string;
    profissionalId: number;
}
export interface Profissional {
  id: string;
  nome: string;
  especialidade?: string;
  foto?: string;
  ativo: boolean;
}

export interface HorarioDisponivel {
  id: string;
  profissionalId: string;
  profissionalNome?: string;
  dataHoraInicio: Date | string;
  dataHoraFim: Date | string;
  status: 'Disponivel' | 'Pendente' | 'Confirmado' | 'Bloqueado';
}

export interface Agendamento {
  id: string;
  nomeCliente: string;
  telefoneCliente: string;
  cpfCliente?: string;
  horarioDisponivelId: string;
  servicoId: string;
  servicoNome?: string;
  profissionalNome?: string;
  status: 'Pendente' | 'Confirmado' | 'Cancelado';
  observacoes?: string;
  dataHoraInicio?: Date | string;
  dataHoraFim?: Date | string;
  criadoEm?: Date | string;
}

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: 'cliente' | 'funcionario' | 'admin';
}

export interface AgendaCalendarProps {
    currentDate: Date;
    agendamentos: Agendamento[];
    horariosDisponiveis: HorarioDisponivel[];
    onSlotClick: (
        date: Date,
        horario?: HorarioDisponivel,
        agendamento?: Agendamento
    ) => void;
}

export const statusColors = {
    Pendente: '#ff9800',
    Confirmado: '#4caf50',
    Cancelado: '#9e9e9e',
    Disponivel: '#2196f3',
    Bloqueado: '#cfd8dc'
};


export const getStatusColorAgendamento = (status: any) => {
    switch (status) {
        case 1:
            return statusColors.Confirmado;

        case 2:
            return statusColors.Cancelado;

        case 0:
            return statusColors.Pendente;

        default:
            return statusColors.Pendente;
    }
};