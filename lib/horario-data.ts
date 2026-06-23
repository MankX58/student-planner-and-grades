export type Subject = {
  id: string
  name: string
  bg: string
  border: string
}

export type ClassSession = {
  id: string
  subjectId: string
  day: number
  block: number
  group: string
  room: string
}

export type Grade = {
  id: string
  name: string
  score: number
  weight: number
}

export type Exam = {
  id: string
  subjectId: string
  date: string
  group: "individual" | "grupal"
  kind: "examen" | "presentacion"
  weight: number
}

// NUEVO: una falta registrada
export type Absence = {
  id: string
  subjectId: string
  date: string // yyyy-mm-dd
}

// NUEVO: configuración de horas por materia
export type SubjectConfig = {
  directHours: number // horas de trabajo directo de clase
}

export const DAYS = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"]
export const BLOCKS = ["6 a 8", "8 a 10", "10 a 12", "12 a 2", "2 a 4", "4 a 6"]

export const COLORS_PALETTE = [
  { bg: "#fbeec6", border: "#e0b53e" },
  { bg: "#f5aaa3", border: "#e26b60" },
  { bg: "#aecdee", border: "#5b94d6" },
  { bg: "#d8e7f6", border: "#8fb8e0" },
  { bg: "#f4c79c", border: "#df9750" },
  { bg: "#bcdcab", border: "#7cb45f" },
  { bg: "#f3e8ff", border: "#c084fc" },
  { bg: "#ccfbf1", border: "#2dd4bf" },
  { bg: "#ffedd5", border: "#fb923c" },
]

export const PASSING_GRADE = 3.0
export const FINAL_WEIGHT = 25

export const DEFAULT_CLASSES: ClassSession[] = []

export function getSubject(subjects: Subject[], id: string) {
  return subjects.find((s) => s.id === id)
}

export function accumulatedPoints(grades: Grade[]) {
  return grades.reduce((acc, g) => acc + (g.score * g.weight) / 100, 0)
}

export function coveredWeight(grades: Grade[]) {
  return grades.reduce((acc, g) => acc + g.weight, 0)
}

export function neededOnFinal(grades: Grade[]) {
  const points = accumulatedPoints(grades)
  return (PASSING_GRADE - points) / (FINAL_WEIGHT / 100)
}

// NUEVO: calcula el límite de faltas permitidas
// límite = floor((horas * 0.20) / 2)
// con la falta (límite + 1) la materia queda cancelada
export function absenceLimit(directHours: number): number {
  return Math.floor((directHours * 0.2) / 2)
}