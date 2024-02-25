import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>('http://localhost:4200/upload', formData)
      .toPromise()
      .then(response => response.imageUrl)
      .catch(error => {
        console.error('Error uploading file:', error);
        throw error;
      });
  }
}
