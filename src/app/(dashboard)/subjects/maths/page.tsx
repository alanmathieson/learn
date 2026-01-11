"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { TopicTree } from "@/components/syllabus/topic-tree"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calculator, BookOpen, Clock, Target } from "lucide-react"
import { ProgressStatus } from "@/types"

const initialTopics = [
  // Pure Mathematics
  {
    id: "mat-p01",
    code: "1",
    title: "Proof",
    estimatedHours: 3,
    status: "not_started" as ProgressStatus,
    children: [
      { id: "mat-p01-01", code: "1.1", title: "Proof by deduction", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "mat-p01-02", code: "1.2", title: "Proof by exhaustion", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "mat-p01-03", code: "1.3", title: "Disproof by counter example", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "mat-p01-04", code: "1.4", title: "Proof by contradiction", estimatedHours: 1, status: "not_started" as ProgressStatus },
    ],
  },
  {
    id: "mat-p02",
    code: "2",
    title: "Algebra and Functions",
    estimatedHours: 6,
    status: "not_started" as ProgressStatus,
    children: [
      { id: "mat-p02-01", code: "2.1", title: "Laws of indices", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "mat-p02-02", code: "2.2", title: "Surds", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "mat-p02-03", code: "2.3", title: "Quadratic functions", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "mat-p02-04", code: "2.4", title: "Simultaneous equations", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "mat-p02-05", code: "2.5", title: "Inequalities", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "mat-p02-06", code: "2.6", title: "Polynomials and factor theorem", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "mat-p02-07", code: "2.7", title: "Graphs of functions", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "mat-p02-08", code: "2.8", title: "Composite and inverse functions", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "mat-p02-09", code: "2.9", title: "Graph transformations", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "mat-p02-10", code: "2.10", title: "Partial fractions", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
    ],
  },
  { id: "mat-p03", code: "3", title: "Coordinate Geometry in the (x,y) plane", estimatedHours: 4, status: "not_started" as ProgressStatus },
  { id: "mat-p04", code: "4", title: "Sequences and Series", estimatedHours: 5, status: "not_started" as ProgressStatus },
  {
    id: "mat-p05",
    code: "5",
    title: "Trigonometry",
    estimatedHours: 6,
    status: "not_started" as ProgressStatus,
    children: [
      { id: "mat-p05-01", code: "5.1", title: "Sine, cosine, tangent definitions", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "mat-p05-02", code: "5.2", title: "Small angle approximations", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "mat-p05-03", code: "5.3", title: "Trig graphs and exact values", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "mat-p05-04", code: "5.4", title: "Sec, cosec, cot and inverse trig", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "mat-p05-05", code: "5.5", title: "Trig identities", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "mat-p05-06", code: "5.6", title: "Double angle and compound angle formulae", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "mat-p05-07", code: "5.7", title: "Solving trig equations", estimatedHours: 1, status: "not_started" as ProgressStatus },
    ],
  },
  { id: "mat-p06", code: "6", title: "Exponentials and Logarithms", estimatedHours: 4, status: "not_started" as ProgressStatus },
  {
    id: "mat-p07",
    code: "7",
    title: "Differentiation",
    estimatedHours: 6,
    status: "not_started" as ProgressStatus,
    children: [
      { id: "mat-p07-01", code: "7.1", title: "Derivatives and differentiation from first principles", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "mat-p07-02", code: "7.2", title: "Standard derivatives", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "mat-p07-03", code: "7.3", title: "Applications: tangents, normals, stationary points", estimatedHours: 1.5, status: "not_started" as ProgressStatus },
      { id: "mat-p07-04", code: "7.4", title: "Product, quotient, chain rules", estimatedHours: 1.5, status: "not_started" as ProgressStatus },
      { id: "mat-p07-05", code: "7.5", title: "Implicit and parametric differentiation", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "mat-p07-06", code: "7.6", title: "Differential equations", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
    ],
  },
  {
    id: "mat-p08",
    code: "8",
    title: "Integration",
    estimatedHours: 6,
    status: "not_started" as ProgressStatus,
    children: [
      { id: "mat-p08-01", code: "8.1", title: "Fundamental theorem of calculus", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "mat-p08-02", code: "8.2", title: "Standard integrals", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "mat-p08-03", code: "8.3", title: "Definite integrals and areas", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "mat-p08-04", code: "8.4", title: "Integration as limit of sum", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "mat-p08-05", code: "8.5", title: "Integration by substitution and parts", estimatedHours: 1.5, status: "not_started" as ProgressStatus },
      { id: "mat-p08-06", code: "8.6", title: "Integration using partial fractions", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "mat-p08-07", code: "8.7", title: "Solving differential equations", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "mat-p08-08", code: "8.8", title: "Interpreting solutions", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
    ],
  },
  { id: "mat-p09", code: "9", title: "Numerical Methods", estimatedHours: 3, status: "not_started" as ProgressStatus },
  { id: "mat-p10", code: "10", title: "Vectors", estimatedHours: 3, status: "not_started" as ProgressStatus },
]

const statisticsTopics = [
  { id: "mat-s01", code: "S1", title: "Statistical Sampling", estimatedHours: 2, status: "not_started" as ProgressStatus },
  { id: "mat-s02", code: "S2", title: "Data Presentation and Interpretation", estimatedHours: 3, status: "not_started" as ProgressStatus },
  { id: "mat-s03", code: "S3", title: "Probability", estimatedHours: 4, status: "not_started" as ProgressStatus },
  {
    id: "mat-s04",
    code: "S4",
    title: "Statistical Distributions",
    estimatedHours: 4,
    status: "not_started" as ProgressStatus,
    children: [
      { id: "mat-s04-01", code: "S4.1", title: "Discrete distributions and binomial", estimatedHours: 2, status: "not_started" as ProgressStatus },
      { id: "mat-s04-02", code: "S4.2", title: "Normal distribution", estimatedHours: 1.5, status: "not_started" as ProgressStatus },
      { id: "mat-s04-03", code: "S4.3", title: "Selecting distributions", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
    ],
  },
  { id: "mat-s05", code: "S5", title: "Statistical Hypothesis Testing", estimatedHours: 4, status: "not_started" as ProgressStatus },
]

const mechanicsTopics = [
  { id: "mat-m06", code: "M6", title: "Quantities and Units in Mechanics", estimatedHours: 1, status: "not_started" as ProgressStatus },
  {
    id: "mat-m07",
    code: "M7",
    title: "Kinematics",
    estimatedHours: 4,
    status: "not_started" as ProgressStatus,
    children: [
      { id: "mat-m07-01", code: "M7.1", title: "Language of kinematics", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "mat-m07-02", code: "M7.2", title: "Kinematics graphs", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "mat-m07-03", code: "M7.3", title: "Constant acceleration (suvat)", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "mat-m07-04", code: "M7.4", title: "Calculus in kinematics", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "mat-m07-05", code: "M7.5", title: "Projectiles", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
    ],
  },
  { id: "mat-m08", code: "M8", title: "Forces and Newton\'s Laws", estimatedHours: 4, status: "not_started" as ProgressStatus },
  { id: "mat-m09", code: "M9", title: "Moments", estimatedHours: 2, status: "not_started" as ProgressStatus },
]

export default function MathsPage() {
  const [pureTopics, setPureTopics] = useState(initialTopics)
  const [statsTopics, setStatsTopics] = useState(statisticsTopics)
  const [mechTopics, setMechTopics] = useState(mechanicsTopics)

  const countTopics = (items: typeof pureTopics): { total: number; completed: number } => {
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

  const pureStats = countTopics(pureTopics)
  const statsStats = countTopics(statsTopics)
  const mechStats = countTopics(mechTopics)
  const totalStats = {
    total: pureStats.total + statsStats.total + mechStats.total,
    completed: pureStats.completed + statsStats.completed + mechStats.completed,
  }
  const progressPercent = totalStats.total > 0 ? Math.round((totalStats.completed / totalStats.total) * 100) : 0

  const updateStatus = (
    items: typeof pureTopics,
    id: string,
    status: ProgressStatus
  ): typeof pureTopics => {
    return items.map((item) => {
      if (item.id === id) return { ...item, status }
      if (item.children) return { ...item, children: updateStatus(item.children, id, status) }
      return item
    })
  }

  const handleStatusChange = (id: string, status: ProgressStatus) => {
    setPureTopics((prev) => updateStatus(prev, id, status))
    setStatsTopics((prev) => updateStatus(prev, id, status))
    setMechTopics((prev) => updateStatus(prev, id, status))
  }

  return (
    <>
      <Header title="Mathematics" />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          <Card className="mb-6 border-2 border-emerald-200 bg-emerald-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                  <Calculator className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">Mathematics</h2>
                  <p className="text-muted-foreground mb-4">Pearson Edexcel • 9MA0</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">19 topics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">~72 hours</span>
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
                <Badge variant="outline">Paper 1 - Pure Maths 1 • 3 Jun</Badge>
                <Badge variant="outline">Paper 2 - Pure Maths 2 • 11 Jun</Badge>
                <Badge variant="outline">Paper 3 - Stats & Mechanics • 18 Jun</Badge>
              </div>
            </CardContent>
          </Card>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Badge className="bg-emerald-500">Pure Mathematics</Badge>
              Papers 1 & 2
            </h3>
            <TopicTree topics={pureTopics} onStatusChange={handleStatusChange} />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Badge variant="secondary">Statistics</Badge>
              Paper 3, Section A
            </h3>
            <TopicTree topics={statsTopics} onStatusChange={handleStatusChange} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Badge variant="secondary">Mechanics</Badge>
              Paper 3, Section B
            </h3>
            <TopicTree topics={mechTopics} onStatusChange={handleStatusChange} />
          </div>
        </div>
      </main>
    </>
  )
}
