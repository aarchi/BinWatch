import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BinWatchServerTsService {

  apiUrl = 'assets/reports.json'; // Path to the JSON file

  constructor(private http: HttpClient) {}

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console
      return of(result as T);
    };
  }

  submitReport(file: File): Observable<any> {
    // Simulating a delay to mimic server response
    return of(true).pipe(
      catchError(this.handleError<any>('submitReport', false))
    );
  }

  getReports(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError<any[]>('getReports', []))
      );
  }

  assignTask(reportId: number): Observable<any> {
    // Simulating a delay to mimic server response
    return of(true).pipe(
      catchError(this.handleError<any>('assignTask', false))
    );
  }
}
