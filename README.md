📝 Notes App Assignment
A full-stack Notes Management System with user authentication, note sharing, analytics dashboard, and more — built using Express.js, Node.js, MongoDB, React.js, HTML, CSS, and JavaScript.

🚀 Features
🔐 User Authentication
Register and login functionality

Secure password storage with bcrypt

JWT-based authentication to protect routes

🗂️ Notes CRUD
Create, Read, Update, and Delete notes

Each note includes:

title

content (supports rich text)

tags (array of strings)

isArchived flag

createdAt, updatedAt

🤝 Note Sharing & Permissions
Share notes with other users

Assign read-only or read-write permissions

Only owner can manage sharing

Users can see only their own or shared notes

📊 Analytics Dashboard
Most active users (based on login count)

Most used tags

Notes created per day (last 7 days) shown via chart (Chart.js or Recharts)

🔍 Pagination & Search
Notes listing with:

Pagination

Search by title, content, or tags

🧱 Tech Stack
Backend
Node.js, Express.js

MongoDB with Mongoose

JWT Authentication

Bcrypt for password hashing

RESTful API design

Postman collection included

Frontend
React.js

Fully responsive UI using custom CSS

Environment variables for API base URL

Recharts or Chart.js for analytics charts


📦 Installation & Setup
Backend
bash
Copy
Edit
cd backend
npm install
npm run start
Make sure to create a .env file for:

env
Copy
Edit
PORT=5000
MONGO_URI=your_mongo_connection
JWT_SECRET=your_jwt_secret
Frontend
bash
Copy
Edit
cd frontend
npm install
npm run start
Create a .env file for:

env
Copy
Edit


🙋‍♂️ Author  debojit Mahapatra
This project was completed as part of an internship assignment using:

Node.js • Express.js • MongoDB • React • HTML • CSS • JavaScript