"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { plannerData } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import type { ClassSession, Exam, Grade } from "@/lib/horario-data"
import { DEFAULT_CLASSES } from "@/lib/horario-data"

export type PlannerState = {
  subjects: import("@/lib/horario-data").Subject[]
  classes: ClassSession[]
  grades: Record<string, Grade[]>
  exams: Exam[]
}

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

/**
 * Devuelve los datos del planeador del usuario. Si todavía no tiene una fila,
 * crea una con los valores por defecto y la devuelve.
 */
export async function getPlannerData(): Promise<PlannerState> {
  const userId = await getUserId()

  const rows = await db.select().from(plannerData).where(eq(plannerData.userId, userId)).limit(1)

  if (rows.length === 0) {
    const initial: PlannerState = {
      subjects: [],
      classes: DEFAULT_CLASSES,
      grades: {},
      exams: [],
    }
    await db.insert(plannerData).values({ userId, ...initial })
    return initial
  }

  const row = rows[0]
  return {
    subjects: (row.subjects as import("@/lib/horario-data").Subject[]) ?? [],
    classes: (row.classes as ClassSession[]) ?? [],
    grades: (row.grades as Record<string, Grade[]>) ?? {},
    exams: (row.exams as Exam[]) ?? [],
  }
}

/**
 * Guarda el estado completo del planeador del usuario (upsert por userId).
 */
export async function savePlannerData(state: PlannerState): Promise<void> {
  const userId = await getUserId()

  await db
    .insert(plannerData)
    .values({
      userId,
      subjects: state.subjects,
      classes: state.classes,
      grades: state.grades,
      exams: state.exams,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: plannerData.userId,
      set: {
        subjects: state.subjects,
        classes: state.classes,
        grades: state.grades,
        exams: state.exams,
        updatedAt: new Date(),
      },
    })
}

/**
 * Migra datos provenientes de localStorage SOLO si la fila del usuario está
 * "vacía" (es decir, igual a los valores por defecto y sin notas ni exámenes).
 * Devuelve el estado resultante.
 */
export async function migrateFromLocal(local: PlannerState): Promise<PlannerState> {
  const userId = await getUserId()

  const current = await getPlannerData()

  const isPristine =
    current.subjects.length === 0 &&
    Object.keys(current.grades).length === 0 &&
    current.exams.length === 0 &&
    JSON.stringify(current.classes) === JSON.stringify(DEFAULT_CLASSES)

  const hasLocalData =
    (local.subjects ?? []).length > 0 ||
    Object.keys(local.grades ?? {}).length > 0 ||
    (local.exams ?? []).length > 0 ||
    JSON.stringify(local.classes ?? []) !== JSON.stringify(DEFAULT_CLASSES)

  if (isPristine && hasLocalData) {
    await savePlannerData(local)
    return local
  }

  return current
}
