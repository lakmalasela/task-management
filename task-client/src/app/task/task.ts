import { Component } from '@angular/core';
import { TaskCategory, TaskStatus, TaskPriority } from '../enums';

export interface TaskItem {
  id?: string;
  title: string;
  description: string;
  dueDate: string;
  // isCompleted: boolean;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
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
  
  // Make enums available in template
  TaskCategory = TaskCategory;
  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;

  // Get enum values as arrays for use in templates
  getTaskCategories(): { value: TaskCategory, label: string }[] {
    return Object.values(TaskCategory).map(category => ({
      value: category,
      label: category
    }));
  }

  getTaskStatuses(): { value: TaskStatus, label: string }[] {
    return Object.values(TaskStatus).map(status => ({
      value: status,
      label: status
    }));
  }

  getTaskPriorities(): { value: TaskPriority, label: string }[] {
    return Object.values(TaskPriority).map(priority => ({
      value: priority,
      label: priority
    }));
  }

  getEmptyTask(): TaskItem {
    return {
      title: '',
      description: '',
      dueDate: '',
      // isCompleted: false,
      priority: TaskPriority.MEDIUM,
      category: TaskCategory.Personal,
      status: TaskStatus.Pending,
      userId: '',
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
