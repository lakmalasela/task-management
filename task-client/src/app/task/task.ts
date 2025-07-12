import { Component } from '@angular/core';

export interface TaskItem {
  id?: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  priority: string;
  category: string;
  status: string;
  userId: string;
}

@Component({
  selector: 'app-task',
  standalone: false,
  templateUrl: './task.html',
  styleUrl: './task.scss'
})
export class Task {
  tasks: TaskItem[] = [];
  editingTask: TaskItem | null = null;
  form: TaskItem = this.getEmptyTask();

  getEmptyTask(): TaskItem {
    return {
      title: '',
      description: '',
      dueDate: '',
      isCompleted: false,
      priority: 'Medium',
      category: '',
      status: 'Pending',
      userId: '2c066348-f04f-49f2-8175-27248ad463df',
    };
  }

  submitTask() {
    if (this.editingTask) {
      // Update
      Object.assign(this.editingTask, this.form);
      this.editingTask = null;
    } else {
      // Create
      this.tasks.push({ ...this.form, id: Math.random().toString(36).slice(2) });
    }
    this.form = this.getEmptyTask();
  }

  editTask(task: TaskItem) {
    this.editingTask = task;
    this.form = { ...task };
  }

  deleteTask(task: TaskItem) {
    this.tasks = this.tasks.filter(t => t !== task);
    if (this.editingTask === task) {
      this.editingTask = null;
      this.form = this.getEmptyTask();
    }
  }

  cancelEdit() {
    this.editingTask = null;
    this.form = this.getEmptyTask();
  }
}
