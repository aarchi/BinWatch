import { Component, OnInit } from '@angular/core';
import { BinWatchServerTsService } from '../bin-watch.server.ts.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { WorkerManagementService } from '../worker-management.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  reports: any[] = [];
  newTasks: any[] = [];
  assignedTasks: any[] = [];
  completedTasks: any[] = [];
  workers: any[]; // Array to hold workers data
  workersLoaded: boolean = false; // Flag to track if workers data is loaded

  constructor(private http: HttpClient, private apiService: BinWatchServerTsService, private authService: AuthService, private router: Router, private workerService: WorkerManagementService) { }

  ngOnInit() {
    this.loadReports();
    // Fetch workers data from the service
    this.loadWorkers();
  }

  loadWorkers() {
    this.workerService.getWorkers().subscribe((workers) => {
      this.workers = workers;
      this.workersLoaded = true; // Set flag to true when workers are loaded
    });
  }

  loadReports() {
    this.apiService.getReports().subscribe((reports) => {
      this.reports = reports;
      this.newTasks = this.reports.filter((report) => report.status === 'Pending');
      this.assignedTasks = this.reports.filter((report) => report.status === 'Assigned');
      this.completedTasks = this.reports.filter((report) => report.status === 'Completed');
    });
  
    // Subscribe to the worker service's subject to get updates when workers are changed
    this.workerService.getWorkers().subscribe((workers) => {
      this.workers = workers;
      this.workersLoaded = true; // Set flag to true when workers are loaded
    });
  }
  

  assignTask(reportId: number) {
    if (!this.workersLoaded) {
      console.log('Workers data is not loaded yet.');
      return;
    }
  
    const freeWorkers = this.workers.filter(worker => worker.status === 'free');
    if (freeWorkers.length > 0) {
      const randomIndex = Math.floor(Math.random() * freeWorkers.length);
      const selectedWorker = freeWorkers[randomIndex];
      // Update worker status to occupied
      selectedWorker.status = 'occupied';
  
      // Prepare the updated workers data
      const updatedWorkersData = { workers: this.workers };
  
      // Send an HTTP request to update the workers.json file on the server
      this.http.put<any>('http://localhost:4201/workers', updatedWorkersData).subscribe(() => {
        console.log('Workers file updated successfully.');
  
        // Proceed with assigning the task to the selectedWorker
        console.log(`Task assigned to ${selectedWorker.name}`);
        // Call your API service to update the report status and assign the task to the worker
        this.http.put<any>(`http://localhost:4201/updateReport`, { id: reportId, assignedTo: selectedWorker.name, status: 'Assigned' }).subscribe(() => {
          // Handle success, e.g., show a message to the user
          // Refresh the browser
          window.location.reload();
        });
      });
    } else {
      console.log('All workers are busy at the moment.');
      alert('All workers are busy at the moment. Please try again later.');
    }
  }
  
  completeTask(reportId: number) {
    // Find the report in the assignedTasks array
    const reportIndex = this.assignedTasks.findIndex(report => report.id === reportId);
    if (reportIndex === -1) {
      console.error('Report not found in assignedTasks');
      return;
    }
  
    const completedReport = this.assignedTasks[reportIndex];
    completedReport.status = 'Completed';
  
    // Update the report in the reports array
    this.reports = this.reports.map(report => {
      if (report.id === completedReport.id) {
        return completedReport;
      }
      return report;
    });
  
    // Update the workers.json file to free up the assigned worker
    const updatedWorkers = this.workers.map(worker => {
      if (worker.name === completedReport.assignedTo) {
        worker.status = 'free';
        worker.totalTasksCompleted++;
      }
      return worker;
    });
  
    // Update the workers.json file with the updated workers data
    this.http.put<any>('http://localhost:4201/workers', { workers: updatedWorkers }).subscribe(() => {
      console.log('Workers file updated successfully.');
    });
  
    // Update the reports.json file with the updated reports data
    this.http.put<any>('http://localhost:4201/updateReport', { id: completedReport.id, status: 'Completed' }).subscribe(() => {
      // Refresh the browser
      window.location.reload();
      console.log('Report updated successfully.');
    });
  }
  

  getFormattedLocation(location: string): string {
    try {
      const parsedLocation = JSON.parse(location);
      if (parsedLocation.latitude && parsedLocation.longitude) {
        const url = `https://www.google.com/maps/search/?api=1&query=${parsedLocation.latitude},${parsedLocation.longitude}`;
        return `<a href="${url}" target="_blank">Click here for directions</a>`;
      }
    } catch (error) {
      console.error('Error parsing location:', error);
    }
    return 'Invalid location';
  }

  openGoogleMaps(location: string): void {
    const parsedLocation = JSON.parse(location);
    const url = `https://www.google.com/maps/search/?api=1&query=${parsedLocation.latitude},${parsedLocation.longitude}`;
    window.open(url, '_blank');
  }

  colors = [
    '#FFCCCC', // Light Red
    '#CCE5FF', // Light Blue
    '#E5FFCC', // Light Green
    '#FFCC99', // Light Orange
    '#CCCCFF', // Light Purple
    '#FFE5CC', // Light Peach
  ];
  
}
