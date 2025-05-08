import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { ApiService } from '../api-service.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.less'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class MainContentComponent {
  username : string = "local user";

  hoursControl = new FormControl("00");
  minutesControl = new FormControl("00");
  secondsControl = new FormControl("00");
  isRunning: boolean = false;
  isPaused : boolean = false;
  taskControl = new FormControl("");

  userTaskList: Array<string> = [];

  private intervalTimer: any;
  private hours: number = 0;
  private minutes: number = 0;
  private seconds: number = 0;
  private originalHours: number = 0;
  private originalMinutes: number = 0;
  private originalSeconds: number = 0;

  constructor(private apiService : ApiService) {}

  ngOnInit()
  {
    this.hoursControl.valueChanges.subscribe(value => this.updateHours(value ?? ""));
    this.minutesControl.valueChanges.subscribe(value => this.updateMinutes(value ?? ""));
    this.secondsControl.valueChanges.subscribe(value => this.updateSeconds(value ?? ""));
    this.apiService.getTaskNameListForUser(this.username).subscribe(data => this.userTaskList = data.value);
  }

  updateTime() {
    this.updateHours(this.hours.toString());
    this.updateMinutes(this.minutes.toString());
    this.updateSeconds(this.seconds.toString());
  }

  updateHours(value : string) {
    let sanitizedValue = this.sanitizeValue(23, value); 
    this.hours = sanitizedValue;
    this.hoursControl.setValue(sanitizedValue.toString().padStart(2, "0"), {emitEvent: false});
  }

  updateMinutes(value : string) {
    let sanitizedValue = this.sanitizeValue(59, value); 
    this.minutes = sanitizedValue;
    this.minutesControl.setValue(sanitizedValue.toString().padStart(2, "0"), {emitEvent: false});
  }

  updateSeconds(value : string) {
    let sanitizedValue = this.sanitizeValue(59, value);
    this.seconds = sanitizedValue;
    this.secondsControl.setValue(sanitizedValue.toString().padStart(2, "0"), {emitEvent: false});
  }

  sanitizeValue(max: number, value: string) : number {
    let parsedValue = parseInt(value);
    if (isNaN(parsedValue) || parsedValue < 0)
      return 0;

    if (parsedValue > max)
      return max;

    return parsedValue;
  }

  isTimerZero(): boolean {
    return this.hours === 0 && this.minutes === 0 && this.seconds === 0;
  }

  startTimer() {
    if (this.isTimerZero() || this.isPaused || this.isRunning || (this.taskControl.value?.length ?? 0) < 1) {
      return;
    }

    this.taskControl.disable();
    this.originalHours = this.hours;
    this.originalMinutes = this.minutes;
    this.originalSeconds = this.seconds;
    this.isRunning = true;
    this.intervalTimer = setInterval(() => {
      if (!this.isRunning)
        return;
      if (this.seconds > 0) {
        this.seconds--;
      } else if (this.minutes > 0) {
        this.minutes--;
        this.seconds = 59;
      } else if (this.hours > 0) {
        this.hours--;
        this.minutes = 59;
        this.seconds = 59;
      } else {
        this.stopTimer();
      }
      this.updateTime();
    }, 1000);
  }

  stopTimer() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.isRunning = false;
      this.isPaused = false;
    }

    this.taskControl.enable();
    let elapsedHours = this.originalHours - this.hours;
    let elapsedMinutes = this.originalMinutes - this.minutes;
    let elapsedSeconds = this.originalSeconds - this.seconds;

    // set to original if ran to completion
    if (elapsedHours === 0 && elapsedMinutes === 0 && elapsedSeconds === 0)
    {
      elapsedHours = this.originalHours;
      elapsedMinutes = this.originalMinutes;
      elapsedSeconds = this.originalSeconds;
    }

    this.updateHours(this.originalHours.toString());
    this.updateMinutes(this.originalMinutes.toString());
    this.updateSeconds(this.originalSeconds.toString());

    let timeTracked =
      `${elapsedHours.toString().padStart(2, "0")}:` + 
      `${elapsedMinutes.toString().padStart(2, "0")}:` + 
      `${elapsedSeconds.toString().padStart(2, "0")}`;

    this.apiService.trackTime(this.username, this.taskControl.value ?? "", timeTracked).subscribe({
      error: error => {
        console.error('Error tracking time', error);
      }
    }
    );
  }

  pauseTimer() {
    if (this.isRunning) {
      this.isRunning = false;
      this.isPaused = true;
    }
    else {
      this.isRunning = true;
      this.isPaused = false;
    }
  }

  ngOnDestroy() {
    if (this.intervalTimer)
      clearInterval(this.intervalTimer);
  }
}
