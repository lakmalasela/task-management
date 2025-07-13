import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { TaskItem } from '../task/task';
import { TaskCategory, TaskStatus, TaskPriority } from '../enums';
import { TaskService, TaskResponse } from '../task.service';

@Component({
  selector: 'app-task-table',
  standalone: false,
  templateUrl: './task-table.html',
  styleUrl: './task-table.scss'
})
export class TaskTable implements OnInit, OnChanges {
  @Input() refreshTrigger: number = 0;
  @Output() editTask = new EventEmitter<TaskItem>();
  
  tasks: TaskItem[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;
  loading: boolean = false;
  error: string = '';

  // Make enums available in template
  TaskCategory = TaskCategory;
  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;
  
  // Make Math available in template
  Math = Math;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
      this.loadTasks();
    }
  }

  loadTasks() {
    this.loading = true;
    this.error = '';
    
    this.taskService.getTasks({
      page: this.currentPage,
      limit: this.pageSize
    }).subscribe({
      next: (response: TaskResponse) => {
        this.tasks = response.tasks;
        this.totalItems = response.total;
        this.totalPages = response.totalPages;
        this.currentPage = response.page;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading tasks:', error);
        this.error = 'Failed to load tasks. Please try again.';
        this.loading = false;
      }
    });
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadTasks();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getPriorityClass(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'text-danger fw-bold';
      case TaskPriority.MEDIUM:
        return 'text-warning fw-semibold';
      case TaskPriority.LOW:
        return 'text-success';
      default:
        return '';
    }
  }

  getStatusClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.Pending:
        return 'badge bg-warning';
      case TaskStatus.InProgress:
        return 'badge bg-info';
      case TaskStatus.Completed:
        return 'badge bg-success';
      case TaskStatus.Deleted:
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  onEditTask(task: TaskItem) {
    this.editTask.emit(task);
  }

  onDeleteTask(task: TaskItem) {
    if (!task.id) {
      console.error('Task ID is missing');
      return;
    }
    
    if (confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
      this.loading = true;
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          console.log('Task deleted successfully');
          // Update the task status to Deleted instead of removing it
          task.status = TaskStatus.Deleted;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error deleting task:', error);
          this.error = 'Failed to delete task. Please try again.';
          this.loading = false;
        }
      });
    }
  }
} 