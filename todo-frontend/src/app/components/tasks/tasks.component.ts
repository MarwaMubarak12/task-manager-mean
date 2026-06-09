import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [];
  newTaskTitle: string = '';
  editingTask: Task | null = null;
  editTitle: string = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => { this.tasks = data; },
      error: (err) => { console.error('Error loading tasks:', err); }
    });
  }

  addTask(): void {
    if (!this.newTaskTitle.trim()) return;
    const task: Task = { title: this.newTaskTitle.trim(), completed: false };
    this.taskService.createTask(task).subscribe({
      next: () => { this.newTaskTitle = ''; this.loadTasks(); },
      error: (err) => { console.error('Error adding task:', err); }
    });
  }

  startEdit(task: Task): void {
    this.editingTask = task;
    this.editTitle = task.title;
  }

  saveEdit(): void {
    if (!this.editingTask || !this.editTitle.trim()) return;
    const updatedTask: Task = {
      title: this.editTitle.trim(),
      completed: this.editingTask.completed
    };
    this.taskService.updateTask(this.editingTask._id!, updatedTask).subscribe({
      next: () => { this.editingTask = null; this.editTitle = ''; this.loadTasks(); },
      error: (err) => { console.error('Error updating task:', err); }
    });
  }

  cancelEdit(): void {
    this.editingTask = null;
    this.editTitle = '';
  }

  toggleComplete(task: Task): void {
    const updatedTask: Task = { title: task.title, completed: !task.completed };
    this.taskService.updateTask(task._id!, updatedTask).subscribe({
      next: () => { this.loadTasks(); },
      error: (err) => { console.error('Error toggling task:', err); }
    });
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => { this.loadTasks(); },
      error: (err) => { console.error('Error deleting task:', err); }
    });
  }
}