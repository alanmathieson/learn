"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import remarkGfm from "remark-gfm"
import rehypeKatex from "rehype-katex"
import {
  Save,
  Eye,
  Pencil,
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Sigma,
  Atom,
  Calculator,
  Languages,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { NoteType } from "@/types"
import { usePracticeNote } from "@/hooks/use-practice-notes"

const noteTypes: { value: NoteType; label: string }[] = [
  { value: "notes", label: "Notes" },
  { value: "formulas", label: "Formulas" },
  { value: "past_paper", label: "Past Paper" },
  { value: "summary", label: "Summary" },
]

const subjects = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Physics", icon: Atom, color: "text-blue-500" },
  { id: "22222222-2222-2222-2222-222222222222", name: "Mathematics", icon: Calculator, color: "text-emerald-500" },
  { id: "33333333-3333-3333-3333-333333333333", name: "Russian", icon: Languages, color: "text-red-500" },
]

export default function EditPracticeNotePage() {
  const router = useRouter()
  const params = useParams()
  const noteId = params.noteId as string

  const { note, loading, error, updateNote } = usePracticeNote(noteId)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [noteType, setNoteType] = useState<NoteType>("notes")
  const [subjectId, setSubjectId] = useState<string>("")
  const [activeTab, setActiveTab] = useState("write")
  const [saving, setSaving] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // Initialize form when note loads
  useEffect(() => {
    if (note && !initialized) {
      setTitle(note.title)
      setContent(note.content || "")
      setNoteType(note.noteType)
      setSubjectId(note.subjectId || "none")
      setInitialized(true)
    }
  }, [note, initialized])

  const insertText = (before: string, after: string = "") => {
    const textarea = document.querySelector("textarea")
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end)

    setContent(newText)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      )
    }, 0)
  }

  const handleSave = async () => {
    if (!title || !content) return

    setSaving(true)
    const success = await updateNote({
      title,
      content,
      noteType,
      subjectId: subjectId && subjectId !== "none" ? subjectId : null,
    })
    setSaving(false)

    if (success) {
      router.push("/practice")
    }
  }

  const toolbarButtons = [
    { icon: Bold, action: () => insertText("**", "**"), tooltip: "Bold" },
    { icon: Italic, action: () => insertText("*", "*"), tooltip: "Italic" },
    { icon: Code, action: () => insertText("`", "`"), tooltip: "Code" },
    { icon: List, action: () => insertText("\n- "), tooltip: "Bullet List" },
    { icon: ListOrdered, action: () => insertText("\n1. "), tooltip: "Numbered List" },
    { icon: Sigma, action: () => insertText("$", "$"), tooltip: "Inline Math" },
  ]

  if (error) {
    return (
      <>
        <Header title="Edit Note" />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <Card className="p-6">
              <p className="text-destructive">{error}</p>
              <Button asChild className="mt-4">
                <Link href="/practice">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Practice Notes
                </Link>
              </Button>
            </Card>
          </div>
        </main>
      </>
    )
  }

  if (loading || !initialized) {
    return (
      <>
        <Header title="Edit Note" />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <Skeleton className="h-[500px] w-full" />
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header title="Edit Note" />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/practice">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Practice Notes
            </Link>
          </Button>

          {/* Meta Info */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter note title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Note Type</Label>
                  <Select value={noteType} onValueChange={(v: NoteType) => setNoteType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {noteTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Subject (optional)</Label>
                  <Select value={subjectId} onValueChange={setSubjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          <div className="flex items-center gap-2">
                            <subject.icon className={`h-4 w-4 ${subject.color}`} />
                            {subject.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Editor */}
          <Card>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between border-b p-2">
                  <TabsList>
                    <TabsTrigger value="write" className="flex items-center gap-2">
                      <Pencil className="h-4 w-4" />
                      Write
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="split" className="flex items-center gap-2">
                      Split
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-2">
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 border-r pr-2 mr-2">
                      {toolbarButtons.map((btn, i) => (
                        <Button
                          key={i}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={btn.action}
                          title={btn.tooltip}
                        >
                          <btn.icon className="h-4 w-4" />
                        </Button>
                      ))}
                    </div>

                    <Button onClick={handleSave} disabled={!title || !content || saving}>
                      {saving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </div>

                <TabsContent value="write" className="m-0">
                  <Textarea
                    placeholder="Start writing your note... Use Markdown for formatting and LaTeX for math ($inline$ or $$block$$)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[500px] rounded-none border-0 resize-none font-mono text-sm focus-visible:ring-0"
                  />
                </TabsContent>

                <TabsContent value="preview" className="m-0">
                  <div className="min-h-[500px] p-6 prose prose-sm max-w-none dark:prose-invert">
                    {content ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {content}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-muted-foreground">
                        Start writing to see the preview...
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="split" className="m-0">
                  <div className="grid grid-cols-2 divide-x">
                    <Textarea
                      placeholder="Start writing your note..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[500px] rounded-none border-0 resize-none font-mono text-sm focus-visible:ring-0"
                    />
                    <div className="min-h-[500px] p-6 prose prose-sm max-w-none dark:prose-invert overflow-auto">
                      {content ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkMath, remarkGfm]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {content}
                        </ReactMarkdown>
                      ) : (
                        <p className="text-muted-foreground">
                          Start writing to see the preview...
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Help */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Quick Reference</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium">Markdown</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li><code>**bold**</code></li>
                    <li><code>*italic*</code></li>
                    <li><code># Heading</code></li>
                    <li><code>- List item</code></li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Inline Math</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li><code>$E = mc^2$</code></li>
                    <li><code>$\frac{`{a}`}{`{b}`}$</code></li>
                    <li><code>$\sqrt{`{x}`}$</code></li>
                    <li><code>$\int_a^b$</code></li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Block Math</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li><code>$$...$$</code></li>
                    <li>For equations on their own line</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Code</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li><code>`inline code`</code></li>
                    <li><code>```python</code></li>
                    <li><code>code block</code></li>
                    <li><code>```</code></li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
