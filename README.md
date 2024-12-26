# Simple Web Forum
This website is a personal project built for the **CVWO winter assignment** 2024

## Tech Stack
The tech stack used is largely based on the specifications of the assignment, with a few personal choices made to enhance features and simplify build process.

### Frontend
The frontend of the website is built using the following
1. React with Vite
2. TypeScript
3. Tailwind CSS

I have opted for Tailwind CSS instead of component libraries such as Material UI to ensure that the app is lightweight, customizable, consistent and to speed up the development cycle.

### Backend
The backend of the website is built using the following
1. Go (Golang)
2. Gin framework (gin-gonic.com)

#### Database
I have opted to use PostgreSQL as it was a popular and widely documented flavour of SQL, with generous free services to host it.
The backend accesses the database using the GORM library, eliminating the need to write SQL queries in my code.

The frontend and backend communicates using RESTful API, where the backend code is written to have a simple interface for frequent interactions the prioritizes robustness and versatility of the code, while the code for operations that are used less frequently are written to be more modular.

Considering that the backend will be hosted on free services, I ensured that the code should be as lightweight as possible. 
It is done by:
1. Proper logic to prevent unnecessary operations
2. Controls implemented on the frontend to avoid invalid operations and excess requests to the backend
   
However, operations such as login and creating users that involves hashing password using the bcrypt library still takes significant time.

## Features
The app started with features that are outlined in the assignment requirement, and are expanded to include more features
1. Making posts with rich text editor (utilizing the tiptap library)
2. Replying to posts, and reply to replies (similar to Reddit)
3. Upvoting and downvoting posts and comments
4. Editing and deleting posts by the post author or the administrators
5. Updating user profile (password and biography with support for rich text)
6. User authentication based on JWT, passwords are hashed using the bcrypt library before storing in database to ensure security.
7. Poop count (I made it when I just started learning to practice React and Tailwind CSS)
8. Searching for posts, replies and users.

### Features to be implemented
1. tagging of posts and users
2. Ability to filter and sort posts
3. Swipe to vote (similar to Tinder)
4. Embed code editor that can execute simple codes
5. etc

## User Interface
The app is built to offer an intuitive, simple and customizable experience.
To ensure consistency and ease of changing the color theme, the app is streamlined to use 5 colors that are labelled:
1. Primary
2. Secondary
3. Light
4. Dark
5. Test
that is configurable in tailwind.config.js, with plans to allow color to be specified in the .env file or database

Currently, the greeting text (the text you first see at the homescreen) and the post prompt are customizable from the database, with plans to add more controls to the app by customizing the infos table in the database

