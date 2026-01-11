"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { TopicTree } from "@/components/syllabus/topic-tree"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Atom, BookOpen, Clock, Target } from "lucide-react"
import { ProgressStatus } from "@/types"

// Static physics topics data (would come from database)
const initialTopics = [
  {
    id: "phy-01",
    code: "1",
    title: "Physical Quantities and Units",
    estimatedHours: 3,
    status: "not_started" as ProgressStatus,
    children: [
      { id: "phy-01-01", code: "1.1", title: "Physical quantities", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "phy-01-02", code: "1.2", title: "SI units", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "phy-01-03", code: "1.3", title: "Errors and uncertainties", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "phy-01-04", code: "1.4", title: "Scalars and vectors", estimatedHours: 1, status: "not_started" as ProgressStatus },
    ],
  },
  {
    id: "phy-02",
    code: "2",
    title: "Kinematics",
    estimatedHours: 4,
    status: "not_started" as ProgressStatus,
    children: [
      { id: "phy-02-01", code: "2.1", title: "Equations of motion", estimatedHours: 1.5, status: "not_started" as ProgressStatus },
      { id: "phy-02-02", code: "2.2", title: "Motion graphs", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "phy-02-03", code: "2.3", title: "Free fall", estimatedHours: 0.75, status: "not_started" as ProgressStatus },
      { id: "phy-02-04", code: "2.4", title: "Projectile motion", estimatedHours: 0.75, status: "not_started" as ProgressStatus },
    ],
  },
  {
    id: "phy-03",
    code: "3",
    title: "Dynamics",
    estimatedHours: 4,
    status: "not_started" as ProgressStatus,
    children: [
      { id: "phy-03-01", code: "3.1", title: "Momentum and Newton's laws", estimatedHours: 1.5, status: "not_started" as ProgressStatus },
      { id: "phy-03-02", code: "3.2", title: "Linear momentum and impulse", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "phy-03-03", code: "3.3", title: "Conservation of momentum", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "phy-03-04", code: "3.4", title: "Elastic and inelastic collisions", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
    ],
  },
  { id: "phy-04", code: "4", title: "Forces, Density and Pressure", estimatedHours: 3, status: "not_started" as ProgressStatus },
  { id: "phy-05", code: "5", title: "Work, Energy and Power", estimatedHours: 4, status: "not_started" as ProgressStatus },
  { id: "phy-06", code: "6", title: "Deformation of Solids", estimatedHours: 2, status: "not_started" as ProgressStatus },
  {
    id: "phy-07",
    code: "7",
    title: "Waves",
    estimatedHours: 4,
    status: "not_started" as ProgressStatus,
    children: [
      { id: "phy-07-01", code: "7.1", title: "Progressive waves", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "phy-07-02", code: "7.2", title: "Transverse and longitudinal waves", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "phy-07-03", code: "7.3", title: "Doppler effect", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "phy-07-04", code: "7.4", title: "Electromagnetic spectrum", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "phy-07-05", code: "7.5", title: "Polarisation", estimatedHours: 1, status: "not_started" as ProgressStatus },
    ],
  },
  { id: "phy-08", code: "8", title: "Superposition", estimatedHours: 3, status: "not_started" as ProgressStatus },
  {
    id: "phy-09",
    code: "9",
    title: "Electricity",
    estimatedHours: 4,
    status: "not_started" as ProgressStatus,
    children: [
      { id: "phy-09-01", code: "9.1", title: "Electric current", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
      { id: "phy-09-02", code: "9.2", title: "Potential difference and power", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "phy-09-03", code: "9.3", title: "Resistance and resistivity", estimatedHours: 1.5, status: "not_started" as ProgressStatus },
      { id: "phy-09-04", code: "9.4", title: "I-V characteristics", estimatedHours: 1, status: "not_started" as ProgressStatus },
    ],
  },
  { id: "phy-10", code: "10", title: "D.C. Circuits", estimatedHours: 4, status: "not_started" as ProgressStatus },
  { id: "phy-11", code: "11", title: "Particle Physics", estimatedHours: 3, status: "not_started" as ProgressStatus },
  { id: "phy-12", code: "12", title: "Circular Motion", estimatedHours: 3, status: "not_started" as ProgressStatus },
  { id: "phy-13", code: "13", title: "Gravitational Fields", estimatedHours: 4, status: "not_started" as ProgressStatus },
  { id: "phy-14", code: "14", title: "Temperature", estimatedHours: 2, status: "not_started" as ProgressStatus },
  { id: "phy-15", code: "15", title: "Ideal Gases", estimatedHours: 3, status: "not_started" as ProgressStatus },
  { id: "phy-16", code: "16", title: "Thermodynamics", estimatedHours: 4, status: "not_started" as ProgressStatus },
  {
    id: "phy-17",
    code: "17",
    title: "Oscillations",
    estimatedHours: 4,
    status: "not_started" as ProgressStatus,
    children: [
      { id: "phy-17-01", code: "17.1", title: "Simple harmonic motion", estimatedHours: 1.5, status: "not_started" as ProgressStatus },
      { id: "phy-17-02", code: "17.2", title: "Energy in SHM", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "phy-17-03", code: "17.3", title: "Damped oscillations", estimatedHours: 0.75, status: "not_started" as ProgressStatus },
      { id: "phy-17-04", code: "17.4", title: "Forced oscillations and resonance", estimatedHours: 0.75, status: "not_started" as ProgressStatus },
    ],
  },
  { id: "phy-18", code: "18", title: "Electric Fields", estimatedHours: 4, status: "not_started" as ProgressStatus },
  { id: "phy-19", code: "19", title: "Capacitance", estimatedHours: 3, status: "not_started" as ProgressStatus },
  { id: "phy-20", code: "20", title: "Magnetic Fields", estimatedHours: 4, status: "not_started" as ProgressStatus },
  { id: "phy-21", code: "21", title: "Alternating Currents", estimatedHours: 3, status: "not_started" as ProgressStatus },
  {
    id: "phy-22",
    code: "22",
    title: "Quantum Physics",
    estimatedHours: 4,
    status: "not_started" as ProgressStatus,
    children: [
      { id: "phy-22-01", code: "22.1", title: "Photoelectric effect", estimatedHours: 1.5, status: "not_started" as ProgressStatus },
      { id: "phy-22-02", code: "22.2", title: "Wave-particle duality", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "phy-22-03", code: "22.3", title: "Energy levels in atoms", estimatedHours: 1, status: "not_started" as ProgressStatus },
      { id: "phy-22-04", code: "22.4", title: "Line spectra", estimatedHours: 0.5, status: "not_started" as ProgressStatus },
    ],
  },
  { id: "phy-23", code: "23", title: "Nuclear Physics", estimatedHours: 4, status: "not_started" as ProgressStatus },
  { id: "phy-24", code: "24", title: "Medical Physics", estimatedHours: 4, status: "not_started" as ProgressStatus },
  { id: "phy-25", code: "25", title: "Astronomy and Cosmology", estimatedHours: 4, status: "not_started" as ProgressStatus },
]

export default function PhysicsPage() {
  const [topics, setTopics] = useState(initialTopics)

  // Calculate stats
  const countTopics = (items: typeof topics): { total: number; completed: number } => {
    let total = 0
    let completed = 0

    for (const item of items) {
      if (item.children && item.children.length > 0) {
        const childStats = countTopics(item.children)
        total += childStats.total
        completed += childStats.completed
      } else {
        total += 1
        if (item.status === "confident" || item.status === "mastered") {
          completed += 1
        }
      }
    }

    return { total, completed }
  }

  const stats = countTopics(topics)
  const progressPercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  // Update topic status recursively
  const updateTopicStatus = (
    items: typeof topics,
    id: string,
    status: ProgressStatus
  ): typeof topics => {
    return items.map((item) => {
      if (item.id === id) {
        return { ...item, status }
      }
      if (item.children) {
        return {
          ...item,
          children: updateTopicStatus(item.children, id, status),
        }
      }
      return item
    })
  }

  const handleStatusChange = (id: string, status: ProgressStatus) => {
    setTopics((prev) => updateTopicStatus(prev, id, status))
    // TODO: Save to database
  }

  const handleNotesChange = (id: string, notes: string) => {
    // TODO: Save notes to database
    console.log("Save notes for", id, notes)
  }

  const handleConfidenceChange = (id: string, level: number) => {
    // TODO: Save confidence to database
    console.log("Save confidence for", id, level)
  }

  return (
    <>
      <Header title="Physics" />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          {/* Subject Header */}
          <Card className="mb-6 border-2 border-blue-200 bg-blue-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                  <Atom className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">Physics</h2>
                  <p className="text-muted-foreground mb-4">
                    Cambridge International (CIE) • 9702
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">25 topics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">~85 hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{stats.completed} / {stats.total} complete</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Progress value={progressPercent} className="h-3 flex-1" />
                    <span className="text-sm font-medium w-12">{progressPercent}%</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                <Badge variant="outline">Paper 1 - Multiple Choice • 3 Jun</Badge>
                <Badge variant="outline">Paper 2 - AS Structured • 20 May</Badge>
                <Badge variant="outline">Paper 3 - Practical • 28 Apr</Badge>
                <Badge variant="outline">Paper 4 - A Level Structured • 11 May</Badge>
                <Badge variant="outline">Paper 5 - Planning & Analysis • 20 May</Badge>
              </div>
            </CardContent>
          </Card>

          {/* AS Level Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Badge>AS Level</Badge>
              Topics 1-11
            </h3>
            <TopicTree
              topics={topics.filter((t) => parseInt(t.code || "0") <= 11)}
              onStatusChange={handleStatusChange}
              onNotesChange={handleNotesChange}
              onConfidenceChange={handleConfidenceChange}
            />
          </div>

          {/* A Level Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Badge variant="secondary">A Level</Badge>
              Topics 12-25
            </h3>
            <TopicTree
              topics={topics.filter((t) => parseInt(t.code || "0") > 11)}
              onStatusChange={handleStatusChange}
              onNotesChange={handleNotesChange}
              onConfidenceChange={handleConfidenceChange}
            />
          </div>
        </div>
      </main>
    </>
  )
}
