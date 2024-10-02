'use client'

import { addDays } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { DatePicker } from './ui/date-picker'

interface Task {
  id: number
  name: string
  status: 'Open' | 'In Development' | 'Review' | 'Done'
  points: number[]
}

export function BurndownToolComponent() {
  const [date, setDate] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 14),
  })
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskName, setNewTaskName] = useState('')

  useEffect(() => {
    // Recalculate points array when dates change
    setTasks(tasks.map(task => ({
      ...task,
      points: Array(getDaysBetween(date.from, new Date(endDate))).fill(0)
    })))
  }, [date.from, endDate])

  const addTask = () => {
    if (newTaskName.trim() !== '') {
      const newTask: Task = {
        id: Date.now(),
        name: newTaskName,
        status: 'Open',
        points: Array(getDaysBetween(new Date(date.from), new Date(endDate))).fill(0)
      }
      setTasks([...tasks, newTask])
      setNewTaskName('')
    }
  }

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const getDaysBetween = (start: Date, end: Date) => {
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const updateTaskPoints = (taskId: number, day: number, points: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, points: task.points.map((p, i) => i === day ? points : p) }
        : task
    ))
  }

  const updateTaskStatus = (taskId: number, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ))
  }

  const totalDays = date?.from && date.to ? getDaysBetween(date?.from, date.to) : 0
  const idealPointsPerDay = tasks.reduce((sum, task) => sum + Math.max(...task.points), 0) / totalDays

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sprint Burndown Tool</h1>
      <div className="flex gap-4 mb-4">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium">Start Date</label>
          <DatePicker
            id="end-date"
            date={date.from}
            setDate={setDate.from}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium">End Date</label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="New task name"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <Button onClick={addTask}>Add Task</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Status</TableHead>
            {Array.from({ length: totalDays }, (_, i) => (
              <TableHead key={i}>Day {i + 1}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map(task => (
            <TableRow key={task.id}>
              <TableCell>{task.name}</TableCell>
              <TableCell>
                <Select
                  value={task.status}
                  onValueChange={(value) => updateTaskStatus(task.id, value as Task['status'])}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Development">In Development</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              {task.points.map((points, day) => (
                <TableCell key={day}>
                  <Input
                    type="number"
                    value={points}
                    onChange={(e) => updateTaskPoints(task.id, day, Number(e.target.value))}
                    className="w-16"
                  />
                </TableCell>
              ))}
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete task ${task.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={2}>Ideal Burndown</TableCell>
            {Array.from({ length: totalDays }, (_, i) => (
              <TableCell key={i}>{((totalDays - i) * idealPointsPerDay).toFixed(1)}</TableCell>
            ))}
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}