import { Component } from '@angular/core';
import { ApiService } from '../api-service.service';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-statistics',
  imports: [CommonModule, FormsModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.less'
})
export class StatisticsComponent {
  username : string = "local user";
  private apiService = inject(ApiService);

  userStats: {
    entryCount: number;
    taskCount: number;
    totalTime: string;
    totalDays: number;
    lastTrackedDay: string;
  } | null = null;

  taskStats: {
    entryCount: number;
    totalTime: string;
    totalDays: number;
    lastTrackedDay: string;
  } | null = null;

  taskList: Array<{ taskId: number; taskName: string }> = [];
  userTaskList: Array<string> = [];
  selectedTaskName: string | null = null;

  ngOnInit() {
    this.apiService.getAvgForUser(this.username).subscribe(data => this.userStats = data.value);
    this.apiService.getEntriesForUser(this.username).subscribe(data => this.taskList = data.value);
    this.apiService.getTaskNameListForUser(this.username).subscribe(data => this.userTaskList = data.value);
  }

  onTaskSelected() {
    if (this.selectedTaskName !== "null") {
      this.apiService.getAvgForUserAndTask(this.username, this.selectedTaskName ?? "").subscribe(data => {
        this.taskStats = data.value;
      });
    } else {
      this.taskStats = null;
    }
  }
}
