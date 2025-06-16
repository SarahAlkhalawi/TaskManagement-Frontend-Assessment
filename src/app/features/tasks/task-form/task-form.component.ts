import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

import { TaskService } from '../../../core/services/task';
import { TaskDto, CreateTaskDto, UpdateTaskDto, TaskPriority, TaskStatus } from '../../../core/models/task.models';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDialogModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isLoading = false;
  isEditMode = false;
  
  TaskPriority = TaskPriority;
  TaskStatus = TaskStatus;
  
  priorities = [
    { value: TaskPriority.Low, label: 'Low' },
    { value: TaskPriority.Medium, label: 'Medium' },
    { value: TaskPriority.High, label: 'High' },
    { value: TaskPriority.Critical, label: 'Critical' }
  ];
  
  statuses = [
    { value: TaskStatus.Pending, label: 'Pending' },
    { value: TaskStatus.InProgress, label: 'In Progress' },
    { value: TaskStatus.Completed, label: 'Completed' },
    { value: TaskStatus.Cancelled, label: 'Cancelled' }
  ];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDto
  ) {
    this.isEditMode = !!data;
    this.initializeForm();
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data) {
      this.taskForm.patchValue({
        title: this.data.title,
        description: this.data.description,
        priority: this.data.priority,
        status: this.data.status
      });
    }
  }

  private initializeForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: [TaskPriority.Medium, [Validators.required]],
      status: [TaskStatus.Pending, [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isLoading = true;

      if (this.isEditMode) {
        this.updateTask();
      } else {
        this.createTask();
      }
    }
  }

  private createTask(): void {
    const createTaskDto: CreateTaskDto = {
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      priority: this.taskForm.value.priority
    };

    this.taskService.createTask(createTaskDto).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private updateTask(): void {
    const updateTaskDto: UpdateTaskDto = {
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      priority: this.taskForm.value.priority,
      status: this.taskForm.value.status
    };

    this.taskService.updateTask(this.data.id, updateTaskDto).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  get title() { return this.taskForm.get('title'); }
  get description() { return this.taskForm.get('description'); }
  get priority() { return this.taskForm.get('priority'); }
  get status() { return this.taskForm.get('status'); }
}