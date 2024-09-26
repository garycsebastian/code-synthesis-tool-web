import {Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {TaskListComponent} from "./components/task-list/task-list.component";
import {TaskCreateComponent} from './components/task-create/task-create.component';
import {AuthGuard} from "./services/auth-guard.service";
import {RegisterComponent} from "./components/register/register.component";

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'create-task', component: TaskCreateComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent }, // Add the register route
];
