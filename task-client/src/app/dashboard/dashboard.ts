import { Component, TemplateRef, ViewChild, Inject } from '@angular/core';
import { TaskItem } from '../task/task';
import { TaskCategory, TaskStatus, TaskPriority } from '../enums';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  @ViewChild('taskModal') taskModal!: TemplateRef<any>;
  modalRef?: NgbModalRef;
  showTasks = true;
  refreshTrigger: number = 0;
  tasks: TaskItem[] = [
    // {
    //   id: '1',
    //   title: 'Work-out',
    //   description: 'Go to the gym',
    //   dueDate: '2025-06-08',
    //   isCompleted: false,
    //   priority: TaskPriority.HIGH,
    //   category: TaskCategory.Personal,
    //   status: TaskStatus.Pending,
    //   userId: '2c066348-f04f-49f2-8175-27248ad463df'
    // }
  ];
  editingTask: TaskItem | null = null;
  form: TaskItem = this.getEmptyTask();
  
  // Calendar properties and methods
  calendarDate: any = null; // NgbDateStruct

  isDisabled = () => false; // No disabled days

  onCalendarNavigate(event: any) {}

  getDayClass(date: any): string {
    // date: {year, month, day}
    const dayStr = `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
    // Find tasks for this day
    const completed = this.tasks.some(t => t.dueDate === dayStr && t.status === this.TaskStatus.Completed);
    const due = this.tasks.some(t => t.dueDate === dayStr && t.status !== this.TaskStatus.Completed);
    if (completed) return 'bg-success text-white rounded-circle';
    if (due) return 'bg-danger text-white rounded-circle';
    return '';
  }

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

  constructor(
    private modalService: NgbModal, 
    private router: Router, 
    @Inject(PLATFORM_ID) private platformId: Object,
    private taskService: TaskService
  ) {}

  toggleTasks() {
    this.showTasks = !this.showTasks;
    if (this.showTasks) {
      this.loadTasks();
    }
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (response) => {
        this.tasks = response.tasks;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        alert('Failed to load tasks. Please try again.');
      }
    });
  }

  refreshTaskTable() {
    this.refreshTrigger++;
  }

  openCreateModal() {
    this.editingTask = null;
    this.form = this.getEmptyTask();
    this.modalRef = this.modalService.open(this.taskModal, { centered: true });
  }

  closeModal() {
    this.modalRef?.close();
    this.editingTask = null;
    this.form = this.getEmptyTask();
  }

  getEmptyTask(): TaskItem {
    return {
      title: '',
      description: '',
      dueDate: '',
      priority: TaskPriority.MEDIUM,
      category: TaskCategory.Personal,
      status: TaskStatus.Pending,
      userId: this.getUserId(),
    };
  }

  submitTask() {
    this.form.userId = this.getUserId(); // Ensure userId is set before submit
    if (this.editingTask && this.editingTask.id) {
      // Update existing task
      this.taskService.updateTask(this.editingTask.id, this.form).subscribe({
        next: (updatedTask) => {
          const index = this.tasks.findIndex(t => t.id === this.editingTask?.id);
          if (index !== -1) {
            this.tasks[index] = updatedTask;
          }
          this.editingTask = null;
          this.closeModal();
          this.refreshTaskTable();
        },
        error: (error) => {
          console.error('Error updating task:', error);
          alert('Failed to update task. Please try again.');
        }
      });
    } else {
      // Create new task
      this.taskService.createTask(this.form).subscribe({
        next: (newTask) => {
          this.tasks.push(newTask);
          this.closeModal();
          this.refreshTaskTable();
        },
        error: (error) => {
          console.error('Error creating task:', error);
          alert('Failed to create task. Please try again.');
        }
      });
    }
  }

  editTask(task: TaskItem) {
    this.editingTask = task;
    this.form = { ...task };
    this.modalRef = this.modalService.open(this.taskModal, { centered: true });
  }

  deleteTask(task: TaskItem) {
    if (task.id) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t !== task);
          if (this.editingTask === task) {
            this.editingTask = null;
            this.form = this.getEmptyTask();
          }
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          alert('Failed to delete task. Please try again.');
        }
      });
    }
  }

  cancelEdit() {
    this.closeModal();
  }

  onProfileClick() {
    alert('Profile clicked!');
  }
  onSettingsClick() {
    alert('Settings clicked!');
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('auth_token');
    }
    return false;
  }

  getUsername(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('username') || 'User';
    }
    return 'User';
  }

  getUserId(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userId') || '';
    }
    return '';
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
    }
    this.router.navigate(['/login']);
  }
}
