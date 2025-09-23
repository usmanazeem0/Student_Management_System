Student Management System

A full-stack Student Management System built with React (Frontend) and Node.js/Express (Backend), featuring JWT-based authentication, 
CRUD operations for students, email notifications, and toast notifications for success and error events.


Project Overview


This project allows teachers to manage students efficiently. Teachers can register/login, add students, update student details, and delete students. 
Each teacher can only see and manage students they have added. When a student is added, a random password is generated and sent to their email.
Both teacher emails and student emails are unique in the system. Attempts to register with an already used email will return an error.
The project uses React-Toastify to display success and error notifications for actions such as login, signup, adding/updating/deleting students, and email sending status.
The project is structured in frontend and backend folders, enabling clear separation of concerns and scalability.



Features



Frontend



Teacher signup and login with JWT authentication.                    // jwt token is created while login and stored in localStorage of browser, when teacher logout token will be removed
Dashboard is protected: teachers cannot access it without logging in.        // used React_router to protect the Student DashBoard 
Add, update, and delete students.                                            // teacher can Add Read Update and Delete Students.
Students are linked to the teacher who added them.                           // extracted the teacher's Id from database and linked ID with students.
Prevents duplicate emails for both teachers and students.                    
Form validation using Formik and Yup.                                        // strong validations for inputs like(Fname, lName, email, password and confirmPassword) 
Show students list with editable and deletable options.
React-Toastify notifications for success and error events.
Password toggle for login form.
Responsive UI design.



Backend


RESTful API built with Express.js.
JWT-based authentication for protected routes.
Password hashing using bcryptjs.
Email notifications to students using Nodemailer.
CRUD operations for students (Create, Read, Update, Delete).
Ensure students are only visible to the teacher who added them.
Prevents duplicate email registration for both teachers and students.



Technologies Used


Frontend: React, React Router DOM, Axios, Formik, Yup, React-Toastify, React Icons
Backend: Node.js, Express.js, MongoDB, Mongoose, bcryptjs, jsonwebtoken, Nodemailer
Others: Vite (React project setup), dotenv for environment variables
