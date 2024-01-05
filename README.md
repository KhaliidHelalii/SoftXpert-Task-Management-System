# Task Management System API

## Overview

This project involves the development of a RESTful API for a Task Management System. The goal is to create a robust and scalable API adhering to industry best practices. The system will include authentication, task creation, retrieval, and update functionalities, along with task dependencies and role-based access control.

## Requirements
### ERD Design
![ERD](https://github.com/KhaliidHelalii/SoftXpert-Task-Management-System/assets/102702578/ddffff61-7dc1-4706-9f0e-7653835e3db3)

### Main Business Requirements

#### Main Endpoints

1. **Authentication**
   - Endpoint: `/auth`
   - Description: Authenticates system actors "user/manager".

2. **Login**
   - Endpoint: `/auth/login`
   - Description: Authenticates the user and let him start using the server.

3. **Create a New Task**
   - Endpoint: `/tasks`
   - Description: Creates a new task for the user.

4. **Retrieve List of Tasks**
   - Endpoint: `/tasks`
   - Description: Retrieves a list of all tasks with optional filtering based on status, due date range, or assigned user.

5. **Add Task Dependencies**
   - Endpoint: `/tasks/dependencies/:taskId`
   - Description: Adds task dependencies to a specific task. A task cannot be completed until all its dependencies are completed.

6. **Retrieve Task Details with Dependencies**
   - Endpoint: `/tasks/:taskId`
   - Description: Retrieves details of a specific task, including its dependencies.

7. **Update Task Details**
   - Endpoint: `/tasks/:taskId`
   - Description: Updates task title, description, assignee, due date, and status.
   
### Api Documentation 
- you can see the Api documentation using postman on [Postman](https://documenter.getpostman.com/view/21180724/2s9YsGjZF5).
- also you can find the Json file attached to the repository.    

#### Endpoints Authorizations

- Managers can create/update a task.
- Managers can assign tasks to a user.
- Users can retrieve only tasks assigned to them.
- Users can update only the status of the task assigned to them.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/KhaliidHelalii/SoftXpert-Task-Management-System.git
   cd src
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**

   - Create a `.env` file based on `.env.example` and configure necessary variables.
   ```bash
   #add your database URL
   MONGODB_URI = 
   #add your JWT token
   JWT_SECRET  =  
   ```

4. **Run the Application**

   ```bash
   node server.js 
   ```

   The API will be available at `http://localhost:3000`.

## Conclusion

You have now successfully installed and configured the Task Management System API. For any questions or issues, please refer to the API documentation or contact the development team
