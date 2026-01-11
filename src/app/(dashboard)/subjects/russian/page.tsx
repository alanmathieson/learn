"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { TopicTree } from "@/components/syllabus/topic-tree"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Languages, BookOpen, Clock, Target, AlertCircle } from "lucide-react"
import { ProgressStatus } from "@/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const themeTopics = [
  {
    id: "rus-t01",
    code: "T1",
    title: "Changes in contemporary Russian-speaking society",
    estimatedHours: 8,
    status: "not_started" as ProgressStatus,
    children: [
      { id: "rus-t01-01", code: "T1.1", title: "Changes in family structures", estimatedHours: 2, status: "not_started" as ProgressStatus },
      { id: "rus-t01-02", code: "T1.2", title: "Education and employment", estimatedHours: 2, status: "not_started" as ProgressStatus },
      { id: "rus-t01-03", code: "T1.3", title: "Tourism, travel and Russian-speaking communities", estimatedHours: 2, status: "not_started" as ProgressStatus },
      { id: "rus-t01-04", code: "T1.4", title: "Digital and social media", estimatedHours: 2, status: "not_started" as ProgressStatus },
    ],
  },
  {
    id: "rus-t02",
    code: "T2",
    title: "Russian-speaking culture",
    estimatedHours: 8,
    status: "not_started" as ProgressStatus,
    children: [
      { id: "rus-t02-01", code: "T2.1", title: "Regional customs and traditions", estimatedHours: 2, status: "not_started" as ProgressStatus },
      { id: "rus-t02-02", code: "T2.2", title: "Literature, art, film and music", estimatedHours: 2, status: "not_started" as ProgressStatus },
      { id: "rus-t02-03", code: "T2.3", title: "Influence of past on present", estimatedHours: 2, status: "not_started" as ProgressStatus },
      { id: "rus-t02-04", code: "T2.4", title: "Russian-speaking identity", estimatedHours: 2, status: "not_started" as ProgressStatus },
    ],
  },
  {
    id: "rus-t03",
    code: "T3",
    title: "Political and artistic culture",
    estimatedHours: 8,
    status: "not_started" as ProgressStatus,
    children: [
      { id: "rus-t03-01", code: "T3.1", title: "Political engagement of young people", estimatedHours: 2, status: "not_started" as ProgressStatus },
      { id: "rus-t03-02", code: "T3.2", title: "Festivals, music and sport", estimatedHours: 2, status: "not_started" as ProgressStatus },
      { id: "rus-t03-03", code: "T3.3", title: "How political and artistic culture enrich society", estimatedHours: 2, status: "not_started" as ProgressStatus },
      { id: "rus-t03-04", code: "T3.4", title: "Volunteer work and community engagement", estimatedHours: 2, status: "not_started" as ProgressStatus },
    ],
  },
  {
    id: "rus-t04",
    code: "T4",
    title: "The changing nature of Russian-speaking society",
    estimatedHours: 8,
    status: "not_started" as ProgressStatus,
    children: [
      { id: "rus-t04-01", code: "T4.1", title: "Migration and integration", estimatedHours: 2, status: "not_started" as ProgressStatus },
      { id: "rus-t04-02", code: "T4.2", title: "Cultural diversity, discrimination and racism", estimatedHours: 2, status: "not_started" as ProgressStatus },
      { id: "rus-t04-03", code: "T4.3", title: "Impact of migration on society", estimatedHours: 2, status: "not_started" as ProgressStatus },
      { id: "rus-t04-04", code: "T4.4", title: "Promotion of equality", estimatedHours: 2, status: "not_started" as ProgressStatus },
    ],
  },
]

const skillsTopics = [
  { id: "rus-sk01", code: "SK1", title: "Listening Skills", estimatedHours: 4, status: "not_started" as ProgressStatus },
  { id: "rus-sk02", code: "SK2", title: "Reading Skills", estimatedHours: 4, status: "not_started" as ProgressStatus },
  { id: "rus-sk03", code: "SK3", title: "Translation Skills (Russian to English)", estimatedHours: 4, status: "not_started" as ProgressStatus },
  { id: "rus-sk04", code: "SK4", title: "Translation Skills (English to Russian)", estimatedHours: 4, status: "not_started" as ProgressStatus },
  { id: "rus-sk05", code: "SK5", title: "Writing Skills", estimatedHours: 4, status: "not_started" as ProgressStatus },
  { id: "rus-sk06", code: "SK6", title: "Speaking Skills", estimatedHours: 4, status: "not_started" as ProgressStatus },
]

const literaryTopics = [
  { id: "rus-lit01", code: "LIT1", title: "Literary Work 1", description: "To be confirmed", estimatedHours: 8, status: "not_started" as ProgressStatus },
  { id: "rus-lit02", code: "LIT2", title: "Literary Work 2 / Film", description: "To be confirmed", estimatedHours: 8, status: "not_started" as ProgressStatus },
]

const grammarTopics = [
  {
    id: "rus-gr01",
    code: "GR",
    title: "Grammar Review",
    estimatedHours: 10,
    status: "not_started" as ProgressStatus,
    children: [
      { id: "rus-gr01-01", code: "GR.1", title: "Nouns and cases", estimatedHours: 2, status: "not_started" as ProgressStatus },
      { id: "rus-gr01-02", code: "GR.2", title: "Adjectives and agreement", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "rus-gr01-03", code: "GR.3", title: "Verbs: aspects and tenses", estimatedHours: 2, status: "not_started" as ProgressStatus },
      { id: "rus-gr01-04", code: "GR.4", title: "Verbs of motion", estimatedHours: 1.5, status: "not_started" as ProgressStatus },
      { id: "rus-gr01-05", code: "GR.5", title: "Participles and verbal adverbs", estimatedHours: 1.5, status: "not_started" as ProgressStatus },
      { id: "rus-gr01-06", code: "GR.6", title: "Complex sentences and conjunctions", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "rus-gr01-07", code: "GR.7", title: "Numbers and quantifiers", estimatedHours: 1, status: "not_started" as ProgressStatus },
    ],
  },
]

const otherTopics = [
  { id: "rus-irp", code: "IRP", title: "Independent Research Project", description: "Research presentation for Speaking exam", estimatedHours: 6, status: "not_started" as ProgressStatus },
]

export default function RussianPage() {
  const [themes, setThemes] = useState(themeTopics)
  const [skills, setSkills] = useState(skillsTopics)
  const [literary, setLiterary] = useState(literaryTopics)
  const [grammar, setGrammar] = useState(grammarTopics)
  const [other, setOther] = useState(otherTopics)

  interface TopicItem {
    id: string
    status: ProgressStatus
    children?: TopicItem[]
  }

  const countTopics = (items: TopicItem[]): { total: number; completed: number } => {
    let total = 0
    let completed = 0
    for (const item of items) {
      if (item.children && item.children.length > 0) {
        const childStats = countTopics(item.children)
        total += childStats.total
        completed += childStats.completed
      } else {
        total += 1
        if (item.status === "confident" || item.status === "mastered") completed += 1
      }
    }
    return { total, completed }
  }

  const allTopics: TopicItem[] = [...themes, ...skills, ...literary, ...grammar, ...other]
  const totalStats = countTopics(allTopics)
  const progressPercent = totalStats.total > 0 ? Math.round((totalStats.completed / totalStats.total) * 100) : 0

  const updateStatus = <T extends TopicItem>(
    items: T[],
    id: string,
    status: ProgressStatus
  ): T[] => {
    return items.map((item) => {
      if (item.id === id) return { ...item, status }
      if (item.children) return { ...item, children: updateStatus(item.children, id, status) }
      return item
    }) as T[]
  }

  const handleStatusChange = (id: string, status: ProgressStatus) => {
    setThemes((prev) => updateStatus(prev, id, status))
    setSkills((prev) => updateStatus(prev, id, status))
    setLiterary((prev) => updateStatus(prev, id, status))
    setGrammar((prev) => updateStatus(prev, id, status))
    setOther((prev) => updateStatus(prev, id, status))
  }

  return (
    <>
      <Header title="Russian" />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          <Card className="mb-6 border-2 border-red-200 bg-red-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-red-100 text-red-600">
                  <Languages className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">Russian</h2>
                  <p className="text-muted-foreground mb-4">Pearson Edexcel • 9RU0</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">14 topics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">~60 hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{totalStats.completed} / {totalStats.total} complete</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={progressPercent} className="h-3 flex-1" />
                    <span className="text-sm font-medium w-12">{progressPercent}%</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                <Badge variant="outline">Paper 1 - Listening & Reading • 1 Jun</Badge>
                <Badge variant="outline">Paper 2 - Written Response • 8 Jun</Badge>
                <Badge variant="outline">Paper 3 - Speaking • Apr/May</Badge>
              </div>
            </CardContent>
          </Card>

          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Literary Works Pending</AlertTitle>
            <AlertDescription>
              The literary works for Paper 2 need to be confirmed. Please let us know which texts/films have been chosen.
            </AlertDescription>
          </Alert>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Badge className="bg-red-500">Themes</Badge>
              Papers 1 & 2
            </h3>
            <TopicTree topics={themes} onStatusChange={handleStatusChange} />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Badge variant="secondary">Language Skills</Badge>
              All Papers
            </h3>
            <TopicTree topics={skills} onStatusChange={handleStatusChange} />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Badge variant="secondary">Literary Works</Badge>
              Paper 2
            </h3>
            <TopicTree topics={literary} onStatusChange={handleStatusChange} />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Badge variant="secondary">Grammar</Badge>
              All Papers
            </h3>
            <TopicTree topics={grammar} onStatusChange={handleStatusChange} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Badge variant="secondary">Speaking Exam</Badge>
              Paper 3
            </h3>
            <TopicTree topics={other} onStatusChange={handleStatusChange} />
          </div>
        </div>
      </main>
    </>
  )
}
