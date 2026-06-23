"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { COLORS_PALETTE, type Subject, type ClassSession, type Grade, type Exam } from "@/lib/horario-data"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  subjects: Subject[]
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>
  setClasses: React.Dispatch<React.SetStateAction<ClassSession[]>>
  setGrades: React.Dispatch<React.SetStateAction<Record<string, Grade[]>>>
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>
}

export function MateriasDialog({
  open,
  onOpenChange,
  subjects,
  setSubjects,
  setClasses,
  setGrades,
  setExams,
}: Props) {
  const [draftName, setDraftName] = useState("")
  const [draftColor, setDraftColor] = useState(COLORS_PALETTE[0])

  function handleAdd() {
    if (!draftName.trim()) return
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      name: draftName.trim(),
      bg: draftColor.bg,
      border: draftColor.border,
    }
    setSubjects((prev) => [...prev, newSubject])
    setDraftName("")
  }

  function handleDelete(id: string) {
    if (!confirm("¿Seguro que deseas eliminar esta materia? Se perderán todas sus clases, notas y exámenes asociados.")) return
    
    setSubjects((prev) => prev.filter((s) => s.id !== id))
    setClasses((prev) => prev.filter((c) => c.subjectId !== id))
    setExams((prev) => prev.filter((e) => e.subjectId !== id))
    setGrades((prev) => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] animate-scale-in max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Administrar Materias</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Añadir materia */}
          <div className="space-y-3 bg-muted/30 p-3 rounded-lg border">
            <Label className="text-sm font-semibold">Nueva Materia</Label>
            <Input
              placeholder="Ej: Matemáticas"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd()
              }}
            />
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Color</Label>
              <div className="flex flex-wrap gap-2">
                {COLORS_PALETTE.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setDraftColor(c)}
                    className={`size-6 rounded-full transition-transform ${
                      draftColor.bg === c.bg ? "scale-110 ring-2 ring-primary ring-offset-1" : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: c.bg, border: `1px solid ${c.border}` }}
                    type="button"
                  />
                ))}
              </div>
            </div>
            <Button onClick={handleAdd} className="w-full" disabled={!draftName.trim()}>
              <Plus className="size-4 mr-1" /> Añadir
            </Button>
          </div>

          {/* Lista de materias */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Tus Materias ({subjects.length})</Label>
            {subjects.length === 0 ? (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                No tienes materias creadas.
              </p>
            ) : (
              <ul className="space-y-2">
                {subjects.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-md border animate-fade-in"
                    style={{ backgroundColor: s.bg, borderColor: s.border }}
                  >
                    <span className="text-sm font-medium text-neutral-900 truncate">{s.name}</span>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 text-neutral-900/50 hover:text-neutral-900 hover:bg-black/10 rounded transition-colors"
                      title="Eliminar materia"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
