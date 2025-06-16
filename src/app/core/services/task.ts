import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TaskDto, CreateTaskDto, UpdateTaskDto, TaskFilterDto } from '../models/task.models';
import { PagedResult } from '../models/common.models';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = `${environment.apiUrl}/api/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(filter?: TaskFilterDto): Observable<PagedResult<TaskDto>> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.pageNumber) params = params.set('pageNumber', filter.pageNumber.toString());
      if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
      if (filter.status !== undefined) params = params.set('status', filter.status.toString());
      if (filter.priority !== undefined) params = params.set('priority', filter.priority.toString());
      if (filter.search) params = params.set('search', filter.search);
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
      if (filter.sortOrder) params = params.set('sortOrder', filter.sortOrder);
    }

    return this.http.get<PagedResult<TaskDto>>(this.apiUrl, { params });
  }

  getTask(id: string): Observable<TaskDto> {
    return this.http.get<TaskDto>(`${this.apiUrl}/${id}`);
  }

  createTask(createTaskDto: CreateTaskDto): Observable<TaskDto> {
    return this.http.post<TaskDto>(this.apiUrl, createTaskDto);
  }

  updateTask(id: string, updateTaskDto: UpdateTaskDto): Observable<TaskDto> {
    return this.http.put<TaskDto>(`${this.apiUrl}/${id}`, updateTaskDto);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}