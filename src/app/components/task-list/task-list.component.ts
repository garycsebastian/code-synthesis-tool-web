import {Component, OnInit} from '@angular/core';
import {TaskService} from '../../services/task.service';
import {Task} from '../../models/task';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    NgForOf,
    RouterLink
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading: boolean = false; // Add a loading state
  errorMessage: string = '';

  constructor(private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.errorMessage = '';
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (error) => {
        this.errorMessage = error.message || 'An error occurred while loading tasks.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
