import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  trackTime(username: string, taskName: string, timeTracked: string): Observable<any> {
    const data = {
      username: username,
      taskName: taskName,
      timeTracked: timeTracked
    };

    return this.http.post(this.apiUrl + "Tracker/track", data);
  }

  getEntriesForUser(username: string): Observable<any> {
    return this.http.get(this.apiUrl + `Statistics/${username}`);
  }

  getTaskNameListForUser(username: string): Observable<any> {
    return this.http.get(this.apiUrl + `Statistics/listtasks/${username}`);
  }

  getEntriesForUserAndTask(username: string, taskname: string): Observable<any> {
    return this.http.get(this.apiUrl + `Statistics/${username}/${taskname}`);
  }

  getAvgForUser(username: string): Observable<any> {
    return this.http.get(this.apiUrl + `Statistics/avg/${username}`);
  }

  getAvgForUserAndTask(username: string, taskname: string): Observable<any> {
    return this.http.get(this.apiUrl + `Statistics/avg/${username}/${taskname}`);
  }
}
