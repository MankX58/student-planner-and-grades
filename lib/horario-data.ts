export type Subject = {
  id: string
  name: string
  /** color de fondo (pastel) */
  bg: string
  /** color de borde/acento más saturado */
  border: string
}

export type ClassSession = {
  id: string
  subjectId: string
  day: number // 0 = Lunes ... 4 = Viernes
  block: number // índice dentro de BLOCKS (franja horaria)
  group: string // número de grupo (402, 62, 61, ...)
  room: string // salón (texto libre)
}

export type Grade = {
  id: string
  name: string
  /** nota obtenida (escala 0 - 5) */
  score: number
  /** cuánto vale dentro del 100% (porcentaje) */
  weight: number
}

export type Exam = {
  id: string
  subjectId: string
  date: string // yyyy-mm-dd
  group: "individual" | "grupal"
  kind: "examen" | "presentacion"
  weight: number
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
export const FINAL_WEIGHT = 25 // el final siempre vale 25%

export const DEFAULT_CLASSES: ClassSession[] = []

export function getSubject(subjects: Subject[], id: string) {
  return subjects.find((s) => s.id === id)
}

/** Suma de puntos ya asegurados: Σ(nota * peso/100) */
export function accumulatedPoints(grades: Grade[]) {
  return grades.reduce((acc, g) => acc + (g.score * g.weight) / 100, 0)
}

/** Porcentaje del curso ya calificado */
export function coveredWeight(grades: Grade[]) {
  return grades.reduce((acc, g) => acc + g.weight, 0)
}

/**
 * Nota necesaria en el final (que vale 25%) para que el acumulado
 * quede como mínimo en PASSING_GRADE (3.0).
 */
export function neededOnFinal(grades: Grade[]) {
  const points = accumulatedPoints(grades)
  return (PASSING_GRADE - points) / (FINAL_WEIGHT / 100)
}
