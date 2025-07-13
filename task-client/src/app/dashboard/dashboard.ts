import { Component, TemplateRef, ViewChild, Inject } from '@angular/core';
import { TaskItem } from '../task/task';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  @ViewChild('taskModal') taskModal!: TemplateRef<any>;
  modalRef?: NgbModalRef;
  showTasks = false;
  tasks: TaskItem[] = [
    {
      id: '1',
      title: 'Work-out',
      description: 'Go to the gym',
      dueDate: '2025-06-08',
      isCompleted: false,
      priority: 'High',
      category: 'Personal',
      status: 'Pending',
      userId: '2c066348-f04f-49f2-8175-27248ad463df'
    }
  ];
  editingTask: TaskItem | null = null;
  form: TaskItem = this.getEmptyTask();

  constructor(private modalService: NgbModal, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  toggleTasks() {
    this.showTasks = !this.showTasks;
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
      isCompleted: false,
      priority: 'Medium',
      category: '',
      status: 'Pending',
      userId: '2c066348-f04f-49f2-8175-27248ad463df',
    };
  }

  submitTask() {
    if (this.editingTask) {
      Object.assign(this.editingTask, this.form);
      this.editingTask = null;
    } else {
      this.tasks.push({ ...this.form, id: Math.random().toString(36).slice(2) });
    }
    this.closeModal();
  }

  editTask(task: TaskItem) {
    this.editingTask = task;
    this.form = { ...task };
    this.modalRef = this.modalService.open(this.taskModal, { centered: true });
  }

  deleteTask(task: TaskItem) {
    this.tasks = this.tasks.filter(t => t !== task);
    if (this.editingTask === task) {
      this.editingTask = null;
      this.form = this.getEmptyTask();
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

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('username');
    }
    this.router.navigate(['/login']);
  }
}
