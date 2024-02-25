
# BinWatch

BinWatch is a web application built using Angular and Flask that facilitates the management of city bins that are overflowing. Users can click pictures of overflowing bins, and municipal corporations can use the admin panel to assign tasks to workers for cleaning them.

## Landing Page
![Application Screenshot](/images/index.PNG)

## user Panel
![Application Screenshot](/images/userView.PNG)

## Admin Login (username: admin  password: password)
![Application Screenshot](/images/adminLogin.PNG)

## Admin Panel
![Application Screenshot](/images/adminView.PNG)

## Workers
![Application Screenshot](/images/workerView.PNG)

## Table of Contents
1. [Features](#features)
2. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
3. [Usage](#usage)
4. [Configuration](#configuration)

## 1. Features

- **Upload Pictures:** Users can click pictures of overflowing bins and upload them to the application.
- **Admin Pane:** Municipal corporations can use the admin panel to view the uploaded pictures and assign tasks to workers
- **Task Assignment:** Workers can be assigned tasks to clean the overflowing bins.
- **Response Formatting:** Users can track the status of their uploaded pictures and see when the bins are cleaned.

## 2. Getting Started

Follow these instructions to get the project up and running on your local machine.

### 2.1 Prerequisites

To run this project, you need to have the following software installed:

- **Node.js:** Ensure you have Node.js installed. You can download it from the [official website](https://nodejs.org/).
- **Angular CLI:** Install the Angular CLI globally using npm:

```bash
npm install -g @angular/cli
```

- **Python:** Ensure you have python installed. You can download it from the [official website](https://www.python.org/ftp/python/3.12.1/python-3.12.1-amd64.exe).

### 2.2 Installation

1. clone the project on your local machine.
2. Navigate to the project directory:

```bash
cd your-repo
```

3. Install the project dependencies:

```bash
npm install
```

4. Install the Python dependencies:
```bash
pip install Flask
pip install flask_cors

To run python server go to bin-watch\src\app
python app.py
it will start on http://localhost:4201/
```

## 3. Usage

1. Start the Angular development server:

```bash
ng serve
```

2. The app will be accessible at http://localhost:4200/ by default.
3. Open the app in your web browser.
