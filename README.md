# Campus Study Hub 🎓

**Course**: 4SA3 Software Architecture  
**Student**: Kyoungjae Shin (400428169)

Hi there! 👋 I'm Kyoungjae, and this is **Campus Study Hub**, a project I built for my 4SA3 Software Architecture course at McMaster University.

The goal of this project is to solve a common problem for students: finding the right people to study with. I wanted to create a platform where you can easily discover study sessions happening around campus, filter them by subject or location, and join a group that fits your schedule.

## ✨ What Can You Do Here?

I've built this platform with a few key features in mind to make study coordination smoother:

-   **Find Your Group**: You can search for sessions by subject, tags, or even check what's happening on a specific date.
-   **See What's Nearby**: There's a map view so you can literally see where study groups are gathering around you.
-   **Host a Session**: If you're planning to study, why not invite others? You can create a session and manage who joins.
-   **Smart Sorting**: The app tries to be helpful by ranking sessions based on distance, relevance to your search, or start time.

## �️ How It's Built

I chose a modern tech stack to ensure the app is fast, responsive, and maintainable.

### The Core
-   **Next.js 15**: I used the latest App Router for robust routing and server-side rendering.
-   **TypeScript**: For type safety and better developer experience.
-   **PostgreSQL**: To reliably store all user and session data.

### Design & UI
-   **Tailwind CSS 4**: For quick and flexible styling.
-   **shadcn/ui**: I used this component library (based on Radix UI) to give the app a polished, accessible look without reinventing the wheel.
-   **Lucide React**: For clean, consistent icons.

### Architecture
Since this is a software architecture course, I implemented several design patterns to keep the code clean:
-   **Repository Pattern**: To abstract away the database logic.
-   **Strategy Pattern**: For the different ranking algorithms (Distance, Relevance, Time).
-   **Factory Pattern**: To easily switch between geocoding providers or ranking strategies.
-   **Mediator Pattern**: To coordinate complex interactions like search and filtering.

## 🚀 Getting Started

If you want to run this project locally, here is how you can do it.

### Prerequisites
You'll need **Node.js 18+** and **pnpm** (or npm) installed.

### Installation Steps

1.  **Clone the repo**:
    ```bash
    git clone <repository-url>
    cd campus-study-hub
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

3.  **Configure Environment Variables**:
    > **Important**: This project requires a `.env` file to connect to the database and other services. I have provided the necessary values in the **assignment submission comment**. Please create a `.env` file in the root directory and paste that content there.

    Your `.env` file should look something like this:
    ```bash
    POSTGRES_URL=...
    DATABASE_URL=...
    # GOOGLE_MAPS_API_KEY=...
    ```

4.  **Set up the Database**:
    ```bash
    pnpm db:init
    ```

5.  **Run the App**:
    ```bash
    pnpm dev
    ```
    Then open [http://localhost:3000](http://localhost:3000) to see it in action!

## 📚 API Documentation

I've included interactive API documentation using Swagger UI. Once the server is running, you can visit `/api-docs` to test the endpoints for authentication, sessions, and participants.

## 🌐 Production Deployment

### Database SSL Configuration

If you encounter SSL connection errors in production (`"The server does not support SSL connections"`), you need to configure the SSL settings based on your database setup.

**Option 1: Disable SSL (if your database doesn't support it)**

Add this environment variable to your production deployment:
```
DATABASE_SSL=false
```

**Option 2: Enable SSL (if your database requires it)**

Add this environment variable:
```
DATABASE_SSL=true
```

** Test Credentials you can use:**
```
ID: admin@google.com
Password: Baker#1234
```

**For Vercel:**
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add `DATABASE_SSL` with value `false` or `true`
4. Redeploy your application

The application will automatically detect the SSL configuration and connect appropriately.

---

## 📄 Additional Notes

This project is part of my coursework for 4SA3 Software Architecture at McMaster University.

## 📞 Contact

**Kyoungjae Shin** (400428169)

---

Copyright © 2025 Kyoungjae Shin (400428169). All Rights Reserved.
This is an academic project submitted for the 4SA3 course. Please do not copy, distribute, or plagiarize this code without permission.

## 👨‍💻 Developer

**Kyoungjae Shin (400428169)**  
McMaster University - 4SA3 Project

---

If you have any questions or feedback, feel free to reach out. Thanks for checking out my project!
