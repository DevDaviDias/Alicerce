export interface UsuarioPerfil {
  uid: string;
  nome: string;
  email: string;
  fotoUrl?: string;
  criadoEm: string;
}

export interface Habito {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  frequencia: "diaria" | "semanal";
  concluidoHoje: boolean;
  streak: number;
  emoji: string;
}

export interface Treino {
  id: string;
  nome: string;
  categoria: string; // ex: "Força", "Cardio", "Mobilidade"
  duracao: string; // ex: "45 min"
  exercicios: string[];
  concluido: boolean;
  data: string;
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: "receita" | "despesa";
  categoria: string;
  data: string;
}

export interface Materia {
  id: string;
  nome: string;
  metaHoras: number;
  horasEstudadas: number;
}

export interface HistoricoEstudo {
  id: string;
  materia: string;
  duracaoSegundos: number;
  comentario?: string;
  data: string;
}

export interface EntradaDiario {
  id: string;
  data: string;
  texto: string;
  humor: string;
  destaque: string;
  fotoUrl?: string;
}

export interface RegistroSaude {
  id: string;
  data: string;
  sono: number; // horas dormidas
  agua: number; // litros
  peso?: number;
  notas: string;
}
