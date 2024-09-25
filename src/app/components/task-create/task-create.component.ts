import { Component } from '@angular/core';

import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.css'
})
export class TaskCreateComponent {
  newTask: Task = {description: "", dueDate: "", status: "", title: ""};

  constructor(private taskService: TaskService, private router: Router) { }

  onSubmit(): void {
    this.taskService.createTask(this.newTask).subscribe({
      next: (createdTask) => {
        console.log('Task created:', createdTask);
        this.router.navigate(['/tasks']); // Navigate back to task list
      },
      error: (error) => {
        console.error('Error creating task:', error);
        // Handle error (e.g., display an error message)
      }
    });
  }
}
