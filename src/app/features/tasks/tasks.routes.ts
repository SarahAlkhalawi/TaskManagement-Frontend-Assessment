import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';

export const taskRoutes: Routes = [
  { path: '', component: TaskListComponent },
  { path: ':id', component: TaskDetailComponent }
];