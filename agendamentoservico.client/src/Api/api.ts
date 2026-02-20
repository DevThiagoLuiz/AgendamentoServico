import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:5001/api", // seu backend
});

export const getProfissionais = () => api.get("/Profissional");
export const getHorariosByProfissional = (id: string) =>
  api.get(`/HorarioDisponivel/profissional/${id}`);
export const getServicos = () => api.get("/Servico");

export const createAgendamento = (data: any) =>
  api.post("/Agendamento", data);

export const confirmAgendamento = (id: string) =>
  api.put(`/Agendamento/confirm/${id}`);

export const cancelAgendamento = (id: string) =>
  api.put(`/Agendamento/cancel/${id}`);

export default api;