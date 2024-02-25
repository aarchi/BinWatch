import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent {
  selectedFile: File | null = null;
  reports: any[] = [];
  formData: any;
  form: FormGroup;
  userName: string = '';
  @ViewChild('reportForm') reportForm: NgForm;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {

    this.form = this.formBuilder.group({
      file: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.authService.isAuthenticated().then((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/admin-panel']);
      }
    });
    this.loadReports();
  }

  loadReports() {
    this.http.get<any[]>('assets/reports.json').subscribe(reports => {
      // Check if reports is null or empty
      if (reports && reports.length > 0) {
        this.reports = reports;
      } else {
        this.reports = [];
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile);
  }

  submitReport() {
    console.log('Submitting report with file:', this.selectedFile);
  
    if (this.selectedFile) {
      navigator.geolocation.getCurrentPosition((position) => {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('location', JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        formData.append('submittedBy', this.userName); // Update with actual submittedBy value
  
        this.http.post('http://localhost:4201/bins', formData).subscribe((response: any) => {
          if (response && response.imageUrl) {
            const newReport = {
              id: this.reports.length + 1,
              imageUrl: response.imageUrl,
              status: 'Pending',
              location: JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }),
              submittedBy: this.userName, // Update with actual submittedBy value
              assignedTo: '',
              completedImageUrl: ''
            };
  
            this.reports.push(newReport);
            this.loadReports();
  
            // Reset the form
          // Reset the form after submission
            this.reportForm.resetForm();
              // Reset the file input field
            if (this.fileInput && this.fileInput.nativeElement) {
              this.fileInput.nativeElement.value = null;
            }
          } else {
            console.error('Unexpected response from server:', response);
          }
        }, (error) => {
          console.error('Error uploading file:', error);
        });
      }, (error) => {
        console.error('Error getting location:', error);
        alert('Failed to get location.');
      });
    } else {
      console.error('No file selected');
    }
  }
  
  
  

  getStatusClass(status: string) {
    switch (status) {
      case 'Pending':
        return 'status-new';
      case 'Assigned':
        return 'status-in-progress';
      case 'Completed':
        return 'status-completed';
      default:
        return '';
    }
  }
}
