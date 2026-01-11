"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import { usePracticeNotes } from "@/hooks/use-practice-notes"

const noteTypeConfig: Record<NoteType, { label: string; icon: React.ReactNode; color: string }> = {
  notes: { label: "Notes", icon: <FileText className="h-4 w-4" />, color: "bg-gray-100 text-gray-700" },
  formulas: { label: "Formulas", icon: <Calculator className="h-4 w-4" />, color: "bg-purple-100 text-purple-700" },
  past_paper: { label: "Past Paper", icon: <BookOpen className="h-4 w-4" />, color: "bg-blue-100 text-blue-700" },
  summary: { label: "Summary", icon: <ScrollText className="h-4 w-4" />, color: "bg-green-100 text-green-700" },
}

const subjectConfig: Record<string, { name: string; icon: typeof Atom; color: string }> = {
  "11111111-1111-1111-1111-111111111111": { name: "Physics", icon: Atom, color: "text-blue-500" },
  "22222222-2222-2222-2222-222222222222": { name: "Mathematics", icon: Calculator, color: "text-emerald-500" },
  "33333333-3333-3333-3333-333333333333": { name: "Russian", icon: Languages, color: "text-red-500" },
}

export default function PracticePage() {
  const { notes, loading, deleteNote } = usePracticeNotes()
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [subjectFilter, setSubjectFilter] = useState<string>("all")

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      searchQuery === "" ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

    const matchesType = typeFilter === "all" || note.noteType === typeFilter
    const matchesSubject = subjectFilter === "all" || note.subjectId === subjectFilter

    return matchesSearch && matchesType && matchesSubject
  })

  const handleDelete = async (noteId: string) => {
    await deleteNote(noteId)
  }

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
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-48 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
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
                const subject = note.subjectId ? subjectConfig[note.subjectId] : null

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
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete note?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete &quot;{note.title}&quot;. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(note.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
                        {note.content?.substring(0, 150) || "No content"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Updated {format(new Date(note.updatedAt), "MMM d, yyyy")}
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
