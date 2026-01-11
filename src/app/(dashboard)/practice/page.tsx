"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import {
  Plus,
  Search,
  FileText,
  Calculator,
  BookOpen,
  ScrollText,
  Atom,
  Languages,
  Pencil,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { NoteType } from "@/types"

interface PracticeNote {
  id: string
  title: string
  noteType: NoteType
  subjectId?: string
  updatedAt: Date
  preview: string
}

const noteTypeConfig: Record<NoteType, { label: string; icon: React.ReactNode; color: string }> = {
  notes: { label: "Notes", icon: <FileText className="h-4 w-4" />, color: "bg-gray-100 text-gray-700" },
  formulas: { label: "Formulas", icon: <Calculator className="h-4 w-4" />, color: "bg-purple-100 text-purple-700" },
  past_paper: { label: "Past Paper", icon: <BookOpen className="h-4 w-4" />, color: "bg-blue-100 text-blue-700" },
  summary: { label: "Summary", icon: <ScrollText className="h-4 w-4" />, color: "bg-green-100 text-green-700" },
}

const subjectConfig = {
  physics: { name: "Physics", icon: Atom, color: "text-blue-500" },
  maths: { name: "Mathematics", icon: Calculator, color: "text-emerald-500" },
  russian: { name: "Russian", icon: Languages, color: "text-red-500" },
}

// Sample notes
const sampleNotes: PracticeNote[] = [
  {
    id: "1",
    title: "Quantum Physics Key Formulas",
    noteType: "formulas",
    subjectId: "physics",
    updatedAt: new Date("2026-01-10"),
    preview: "E = hf, λ = h/p, photoelectric effect equations...",
  },
  {
    id: "2",
    title: "Integration by Parts Practice",
    noteType: "past_paper",
    subjectId: "maths",
    updatedAt: new Date("2026-01-09"),
    preview: "Past paper questions on integration techniques with worked solutions...",
  },
  {
    id: "3",
    title: "Russian Essay Phrases",
    noteType: "notes",
    subjectId: "russian",
    updatedAt: new Date("2026-01-08"),
    preview: "Useful phrases for essay writing: С одной стороны... с другой стороны...",
  },
  {
    id: "4",
    title: "Electricity Summary",
    noteType: "summary",
    subjectId: "physics",
    updatedAt: new Date("2026-01-07"),
    preview: "Key concepts: Current, voltage, resistance, Ohm's law, power...",
  },
]

export default function PracticePage() {
  const [notes] = useState<PracticeNote[]>(sampleNotes)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [subjectFilter, setSubjectFilter] = useState<string>("all")

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      searchQuery === "" ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.preview.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === "all" || note.noteType === typeFilter
    const matchesSubject = subjectFilter === "all" || note.subjectId === subjectFilter

    return matchesSearch && matchesType && matchesSubject
  })

  return (
    <>
      <Header title="Practice Notes" />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Practice Notes</h2>
              <p className="text-muted-foreground">
                Create and manage your revision notes with Markdown and LaTeX support
              </p>
            </div>
            <Button asChild>
              <Link href="/practice/new">
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Note Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(noteTypeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      {config.icon}
                      {config.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {Object.entries(subjectConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <config.icon className={`h-4 w-4 ${config.color}`} />
                      {config.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Note Type Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {Object.entries(noteTypeConfig).map(([key, config]) => {
              const count = notes.filter((n) => n.noteType === key).length
              return (
                <Card
                  key={key}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setTypeFilter(key)}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`p-2 rounded ${config.color}`}>{config.icon}</div>
                    <div>
                      <p className="font-medium">{config.label}</p>
                      <p className="text-sm text-muted-foreground">{count} notes</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Notes Grid */}
          {filteredNotes.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Notes Found</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  {searchQuery || typeFilter !== "all" || subjectFilter !== "all"
                    ? "No notes match your filters. Try adjusting your search."
                    : "Start creating practice notes to help with your revision."}
                </p>
                <Button asChild>
                  <Link href="/practice/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Note
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNotes.map((note) => {
                const typeConfig = noteTypeConfig[note.noteType]
                const subject = note.subjectId
                  ? subjectConfig[note.subjectId as keyof typeof subjectConfig]
                  : null

                return (
                  <Card key={note.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={typeConfig.color}>{typeConfig.label}</Badge>
                          {subject && (
                            <Badge variant="outline" className="font-normal">
                              <subject.icon className={`h-3 w-3 mr-1 ${subject.color}`} />
                              {subject.name}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href={`/practice/${note.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg mt-2">
                        <Link href={`/practice/${note.id}`} className="hover:underline">
                          {note.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {note.preview}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Updated {format(note.updatedAt, "MMM d, yyyy")}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
