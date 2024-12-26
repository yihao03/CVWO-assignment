# Simple Web Forum

This website is a personal project built for the **CVWO Winter Assignment** 2024.

## Table of Contents

- [Tech Stack](#tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database](#database)
- [Features](#features)
  - [Implemented Features](#implemented-features)
  - [Upcoming Features](#upcoming-features)
- [User Interface](#user-interface)
- [Navigating the Repository](#navigating-the-repository)
- [Deploying the App](#deploying-the-app)
  - [Frontend Deployment](#frontend-deployment)
  - [Backend Deployment](#backend-deployment)

---

## Tech Stack

The tech stack used is largely based on the specifications of the assignment, with a few personal choices made to enhance features and simplify the build process.

### Frontend

The frontend of the website is built using:

- **React with Vite**
- **TypeScript**
- **Tailwind CSS**

I opted for Tailwind CSS instead of component libraries like Material UI to ensure the app remains lightweight, customizable, and consistent, while speeding up the development cycle.

### Backend

The backend of the website is built using:

- **Go (Golang)**
- **Gin Framework** ( [gin-gonic.com](https://gin-gonic.com) )

### Database

- **PostgreSQL**

I chose PostgreSQL for its popularity, comprehensive documentation, and generous free hosting options. The backend interacts with the database using the **GORM** library, which simplifies the codebase.

### Communication Between Frontend and Backend

- The frontend and backend communicate using a **RESTful API**.
- High-frequency operations (such as fetching posts) are written to prioritize simplicity and interface versatility.
- Less frequently used operations are modularized for easier maintenance.
- The codebase is optimized to be lightweight for hosting on free services by:
  1. Preventing unnecessary operations.
  2. Implementing frontend controls to avoid invalid operations and excess backend requests.

### Performance Considerations

Even though operations like user login and password creation (using **bcrypt** for password hashing) may take some time, they are still optimized for efficiency.

---

## Features

The app started with features outlined in the assignment requirements and has since been expanded to include additional functionality.

### Implemented Features

1. **Post Creation**: Make posts with a rich text editor (utilizing the **tiptap** library).
2. **Replies**: Reply to posts and reply to replies (similar to Reddit).
3. **Upvoting & Downvoting**: Vote on posts and comments.
4. **Post Management**: Edit and delete posts by the author or administrators.
5. **User Profile**: Update user profile, including password and biography (with rich text support).
6. **User Authentication**: JWT-based authentication with bcrypt password hashing.
7. **Poop Count**: A fun feature I implemented while learning React and Tailwind CSS.
8. **Search**: Search for posts, replies, and users.

### Upcoming Features

1. **Tagging**: Add tags to posts and users.
2. **Filtering & Sorting**: Ability to filter and sort posts.
3. **Swipe to Vote**: Similar to Tinder swipe for voting.
4. **Embed Code Editor**: Implement a code editor that can execute simple code snippets.
5. **More Features**: Additional features will be added over time.

---

## User Interface

The app is designed to provide an intuitive, simple, and customizable experience. To maintain consistency and ease of color theme adjustments, the app is configured to use 5 colors, which are labeled as:

1. **Primary**
2. **Secondary**
3. **Light**
4. **Dark**
5. **Text**

These colors are configurable in `tailwind.config.js` with future plans to allow for color customization via the `.env` file or database.

Currently, the greeting text (which appears on the home screen) and the post prompt are customizable via the database. There are plans to add more controls by customizing the `infos` table in the database.

---

## Navigating the Repository

Both the frontend and backend are included in the same repository for simplicity. They are located in the following directories:

- `./front-end`: Contains the frontend code.
- `./back-end`: Contains the backend code.
  
The bulk of the code can be found within the `src` folder in both sections.

---

## Deploying the App

### Frontend Deployment

1. **Set the root directory** to `./front-end`.
2. **Set relevant environment variables**: Refer to the existing `.env` file for necessary variables.
3. **Build the app**: Run `npm run build`.
4. **Start the app**: Run `./app`.

### Backend Deployment

1. **Set the root directory** to `./back-end`.
2. **Set relevant environment variables**: Refer to the existing `.env` file for necessary variables.
3. **Build the app**: Run `go build`.
4. **Start the app**: Run `main.go`.

---
