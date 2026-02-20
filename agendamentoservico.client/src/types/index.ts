export interface Servico {
  id: string;
  nome: string;
  duracaoMinutos: number;
  preco: number;
  descricao?: string;
  ativo: boolean;
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
