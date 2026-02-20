import type { Servico, Profissional, HorarioDisponivel, Agendamento, Usuario } from '../types';

export const mockServicos: Servico[] = [
  {
    id: '1',
    nome: 'Corte de Cabelo',
    duracaoMinutos: 30,
    preco: 50.00,
    descricao: 'Corte moderno e estiloso',
    ativo: true
  },
  {
    id: '2',
    nome: 'Manicure Completa',
    duracaoMinutos: 60,
    preco: 35.00,
    descricao: 'Manicure com esmaltação',
    ativo: true
  },
  {
    id: '3',
    nome: 'Massagem Relaxante',
    duracaoMinutos: 90,
    preco: 120.00,
    descricao: 'Massagem terapêutica completa',
    ativo: true
  },
  {
    id: '4',
    nome: 'Design de Sobrancelhas',
    duracaoMinutos: 30,
    preco: 40.00,
    descricao: 'Design e henna',
    ativo: true
  },
  {
    id: '5',
    nome: 'Tratamento Facial',
    duracaoMinutos: 75,
    preco: 150.00,
    descricao: 'Limpeza e hidratação profunda',
    ativo: true
  }
];

export const mockProfissionais: Profissional[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    especialidade: 'Cabeleireira',
    ativo: true
  },
  {
    id: '2',
    nome: 'Ana Costa',
    especialidade: 'Manicure',
    ativo: true
  },
  {
    id: '3',
    nome: 'João Santos',
    especialidade: 'Massagista',
    ativo: true
  },
  {
    id: '4',
    nome: 'Carla Oliveira',
    especialidade: 'Esteticista',
    ativo: true
  }
];

// Função para gerar horários disponíveis para um profissional
const gerarHorariosDisponiveis = (profissionalId: string, dias: number = 30): HorarioDisponivel[] => {
  const horarios: HorarioDisponivel[] = [];
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < dias; i++) {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() + i);
    
    // Horários de trabalho: 9h às 18h, intervalos de 30min
    for (let hora = 9; hora < 18; hora++) {
      for (let minuto of [0, 30]) {
        const inicio = new Date(data);
        inicio.setHours(hora, minuto, 0, 0);
        
        const fim = new Date(inicio);
        fim.setMinutes(fim.getMinutes() + 30);
        
        horarios.push({
          id: `${profissionalId}-${inicio.getTime()}`,
          profissionalId,
          dataHoraInicio: inicio,
          dataHoraFim: fim,
          status: 'Disponivel'
        });
      }
    }
  }
  
  return horarios;
};

export const mockHorariosDisponiveis: HorarioDisponivel[] = [
  ...gerarHorariosDisponiveis('1'),
  ...gerarHorariosDisponiveis('2'),
  ...gerarHorariosDisponiveis('3'),
  ...gerarHorariosDisponiveis('4')
];

// Função para gerar agendamentos mock com datas relativas ao mês atual
const gerarAgendamentosMock = (): Agendamento[] => {
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();
  
  return [
    {
      id: '1',
      nomeCliente: 'Felipe Augusto',
      telefoneCliente: '(11) 98765-4321',
      cpfCliente: '123.456.789-00',
      horarioDisponivelId: '1-mock-1',
      servicoId: '1',
      servicoNome: 'Corte de Cabelo',
      profissionalNome: 'Maria Silva',
      status: 'Confirmado',
      observacoes: 'Corte moderno',
      dataHoraInicio: new Date(anoAtual, mesAtual, 2, 11, 30),
      dataHoraFim: new Date(anoAtual, mesAtual, 2, 12, 0),
      criadoEm: new Date()
    },
    {
      id: '2',
      nomeCliente: 'Joanne Rowling',
      telefoneCliente: '(11) 97654-3210',
      horarioDisponivelId: '2-mock-2',
      servicoId: '2',
      servicoNome: 'Manicure Completa',
      profissionalNome: 'Ana Costa',
      status: 'Pendente',
      dataHoraInicio: new Date(anoAtual, mesAtual, 2, 14, 30),
      dataHoraFim: new Date(anoAtual, mesAtual, 2, 15, 30),
      criadoEm: new Date()
    },
    {
      id: '3',
      nomeCliente: 'Henry Thoreau',
      telefoneCliente: '(11) 96543-2109',
      horarioDisponivelId: '3-mock-3',
      servicoId: '3',
      servicoNome: 'Massagem Relaxante',
      profissionalNome: 'João Santos',
      status: 'Confirmado',
      dataHoraInicio: new Date(anoAtual, mesAtual, 5, 17, 0),
      dataHoraFim: new Date(anoAtual, mesAtual, 5, 18, 30),
      criadoEm: new Date()
    },
    {
      id: '4',
      nomeCliente: 'Bruna Martins',
      telefoneCliente: '(11) 95432-1098',
      horarioDisponivelId: '1-mock-4',
      servicoId: '4',
      servicoNome: 'Design de Sobrancelhas',
      profissionalNome: 'Carla Oliveira',
      status: 'Pendente',
      dataHoraInicio: new Date(anoAtual, mesAtual, 3, 14, 0),
      dataHoraFim: new Date(anoAtual, mesAtual, 3, 14, 30),
      criadoEm: new Date()
    },
    {
      id: '5',
      nomeCliente: 'Akira Kurosawa',
      telefoneCliente: '(11) 94321-0987',
      horarioDisponivelId: '2-mock-5',
      servicoId: '5',
      servicoNome: 'Tratamento Facial',
      profissionalNome: 'Carla Oliveira',
      status: 'Pendente',
      dataHoraInicio: new Date(anoAtual, mesAtual, 4, 13, 0),
      dataHoraFim: new Date(anoAtual, mesAtual, 4, 14, 15),
      criadoEm: new Date()
    },
    {
      id: '6',
      nomeCliente: 'Barbara Tales',
      telefoneCliente: '(11) 93210-9876',
      horarioDisponivelId: '3-mock-6',
      servicoId: '3',
      servicoNome: 'Massagem Relaxante',
      profissionalNome: 'João Santos',
      status: 'Confirmado',
      dataHoraInicio: new Date(anoAtual, mesAtual, 4, 14, 30),
      dataHoraFim: new Date(anoAtual, mesAtual, 4, 16, 0),
      criadoEm: new Date()
    },
    {
      id: '7',
      nomeCliente: 'Juliana Costa',
      telefoneCliente: '(11) 92109-8765',
      horarioDisponivelId: '4-mock-7',
      servicoId: '2',
      servicoNome: 'Manicure Completa',
      profissionalNome: 'Ana Costa',
      status: 'Confirmado',
      dataHoraInicio: new Date(anoAtual, mesAtual, 5, 14, 30),
      dataHoraFim: new Date(anoAtual, mesAtual, 5, 15, 30),
      criadoEm: new Date()
    },
    {
      id: '8',
      nomeCliente: 'Maria Eugênia',
      telefoneCliente: '(11) 91098-7654',
      horarioDisponivelId: '1-mock-8',
      servicoId: '1',
      servicoNome: 'Corte de Cabelo',
      profissionalNome: 'Maria Silva',
      status: 'Confirmado',
      dataHoraInicio: new Date(anoAtual, mesAtual, 5, 14, 0),
      dataHoraFim: new Date(anoAtual, mesAtual, 5, 14, 30),
      criadoEm: new Date()
    }
  ];
};

export const mockAgendamentos: Agendamento[] = gerarAgendamentosMock();

export const mockUsuarios: Usuario[] = [
  {
    id: '1',
    email: 'cliente@teste.com',
    nome: 'Cliente Teste',
    role: 'cliente'
  },
  {
    id: '2',
    email: 'funcionario@teste.com',
    nome: 'Funcionário Teste',
    role: 'funcionario'
  },
  {
    id: '3',
    email: 'admin@teste.com',
    nome: 'Admin Teste',
    role: 'admin'
  }
];
