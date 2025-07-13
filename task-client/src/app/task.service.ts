import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { TaskItem } from './task/task';

export interface TaskResponse {
  tasks: TaskItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TaskFilters {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get tasks with pagination and filters
   * @param filters - Optional filters for tasks
   * @returns Observable with paginated task response
   */
  getTasks(filters: TaskFilters = {}): Observable<TaskResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);

    const url = `${this.apiUrl}/tasks?${params.toString()}`;
    
    return this.http.get<TaskResponse>(url).pipe(
      catchError((err: any) => {
        console.error('Get tasks error:', err);
        return throwError(() => new Error('Failed to load tasks. Please try again.'));
      })
    );
  }

  /**
   * Get a single task by ID
   * @param taskId - Task ID
   * @returns Observable with task data
   */
  getTaskById(taskId: string): Observable<TaskItem> {
    return this.http.get<TaskItem>(`${this.apiUrl}/tasks/${taskId}`).pipe(
      catchError((err: any) => {
        console.error('Get task error:', err);
        return throwError(() => new Error('Failed to fetch task data'));
      })
    );
  }

  /**
   * Create a new task
   * @param taskData - Task data to create
   * @returns Observable with created task data
   */
  createTask(taskData: Omit<TaskItem, 'id'>): Observable<TaskItem> {
    return this.http.post<TaskItem>(`${this.apiUrl}/tasks`, taskData).pipe(
      catchError((err: any) => {
        console.error('Create task error:', err);
        return throwError(() => new Error('Failed to create task'));
      })
    );
  }

  /**
   * Update an existing task
   * @param taskId - Task ID
   * @param taskData - Updated task data
   * @returns Observable with updated task data
   */
  updateTask(taskId: string, taskData: Partial<TaskItem>): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.apiUrl}/tasks/${taskId}`, taskData).pipe(
      catchError((err: any) => {
        console.error('Update task error:', err);
        return throwError(() => new Error('Failed to update task'));
      })
    );
  }

  /**
   * Delete a task
   * @param taskId - Task ID
   * @returns Observable with deletion confirmation
   */
  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tasks/${taskId}`).pipe(
      catchError((err: any) => {
        console.error('Delete task error:', err);
        return throwError(() => new Error('Failed to delete task'));
      })
    );
  }
} 