"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Plus, Calendar as CalendarIcon, Trash2, Atom, Calculator, Languages } from "lucide-react"
import { TodoPriority } from "@/types"

interface Todo {
  id: string
  title: string
  description?: string
  priority: TodoPriority
  dueDate?: Date
  completed: boolean
  subjectId?: string
}

const priorityColors: Record<TodoPriority, string> = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-red-100 text-red-700",
}

const subjects = [
  { id: "physics", name: "Physics", icon: Atom, color: "text-blue-500" },
  { id: "maths", name: "Mathematics", icon: Calculator, color: "text-emerald-500" },
  { id: "russian", name: "Russian", icon: Languages, color: "text-red-500" },
]

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: "1",
      title: "Review past paper - Physics Paper 4 2024",
      description: "Complete the structured questions section",
      priority: "high",
      dueDate: new Date("2026-02-15"),
      completed: false,
      subjectId: "physics",
    },
    {
      id: "2",
      title: "Practice integration by parts",
      priority: "medium",
      completed: false,
      subjectId: "maths",
    },
    {
      id: "3",
      title: "Watch Утомлённые солнцем film",
      description: "Take notes on key themes for essay",
      priority: "medium",
      dueDate: new Date("2026-02-20"),
      completed: false,
      subjectId: "russian",
    },
  ])

  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    priority: "medium" as TodoPriority,
    dueDate: undefined as Date | undefined,
    subjectId: undefined as string | undefined,
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  const handleAddTodo = () => {
    if (!newTodo.title.trim()) return

    const todo: Todo = {
      id: Date.now().toString(),
      title: newTodo.title,
      description: newTodo.description || undefined,
      priority: newTodo.priority,
      dueDate: newTodo.dueDate,
      completed: false,
      subjectId: newTodo.subjectId,
    }

    setTodos([...todos, todo])
    setNewTodo({
      title: "",
      description: "",
      priority: "medium",
      dueDate: undefined,
      subjectId: undefined,
    })
    setIsDialogOpen(false)
  }

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed
    if (filter === "completed") return todo.completed
    return true
  })

  const activeTodos = todos.filter((t) => !t.completed).length
  const completedTodos = todos.filter((t) => t.completed).length

  return (
    <>
      <Header title="Todos" />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Ad-hoc Tasks</h2>
              <p className="text-muted-foreground">
                Track tasks outside your main revision schedule
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                  <DialogDescription>
                    Create a new task to track outside your revision schedule.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="What do you need to do?"
                      value={newTodo.title}
                      onChange={(e) =>
                        setNewTodo({ ...newTodo, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Add more details..."
                      value={newTodo.description}
                      onChange={(e) =>
                        setNewTodo({ ...newTodo, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select
                        value={newTodo.priority}
                        onValueChange={(value: TodoPriority) =>
                          setNewTodo({ ...newTodo, priority: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Subject (optional)</Label>
                      <Select
                        value={newTodo.subjectId || "none"}
                        onValueChange={(value) =>
                          setNewTodo({
                            ...newTodo,
                            subjectId: value === "none" ? undefined : value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date (optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newTodo.dueDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newTodo.dueDate
                            ? format(newTodo.dueDate, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newTodo.dueDate}
                          onSelect={(date) =>
                            setNewTodo({ ...newTodo, dueDate: date })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTodo}>Add Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{todos.length}</div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">{activeTodos}</div>
                <p className="text-sm text-muted-foreground">Active</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{completedTodos}</div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("completed")}
            >
              Completed
            </Button>
          </div>

          {/* Todo List */}
          <Card>
            <CardContent className="p-0">
              {filteredTodos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No tasks found</p>
                </div>
              ) : (
                <ul className="divide-y">
                  {filteredTodos.map((todo) => {
                    const subject = subjects.find((s) => s.id === todo.subjectId)
                    const SubjectIcon = subject?.icon

                    return (
                      <li
                        key={todo.id}
                        className="flex items-start gap-4 p-4 hover:bg-muted/50"
                      >
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={cn(
                                "font-medium",
                                todo.completed && "line-through text-muted-foreground"
                              )}
                            >
                              {todo.title}
                            </span>
                            <Badge className={priorityColors[todo.priority]} variant="secondary">
                              {todo.priority}
                            </Badge>
                          </div>
                          {todo.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {todo.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {subject && SubjectIcon && (
                              <span className="flex items-center gap-1">
                                <SubjectIcon className={cn("h-3 w-3", subject.color)} />
                                {subject.name}
                              </span>
                            )}
                            {todo.dueDate && (
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3" />
                                Due {format(todo.dueDate, "MMM d")}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => deleteTodo(todo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
