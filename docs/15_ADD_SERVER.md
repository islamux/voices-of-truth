# Feature: Adding a Dedicated API Server

Currently, our app loads data directly from local TypeScript files. While this is fine for a small project, it's not a scalable solution. To prepare for future growth, we'll add a dedicated API server using Node.js and Express. This will allow us to separate our frontend and backend, making the application more robust and easier to manage.

## Why Add a Server?

- **Scalability**: A dedicated server can handle more complex data fetching and processing.
- **Separation of Concerns**: Keeps frontend and backend logic separate, leading to cleaner code.
- **Flexibility**: Allows us to potentially use the same API for other applications (e.g., a mobile app).
- **Database Integration**: Paves the way for connecting to a real database in the future.

## Step-by-Step Guide to Adding a Server

### Step 1: Project Setup

First, let's create a new `server` directory in the root of our project.

```bash
mkdir server
cd server
npm init -y
```

This will create a `package.json` file for our server's dependencies.

### Step 2: Install Dependencies

We'll need a few packages to get our server up and running:

- `express`: A minimal and flexible Node.js web application framework.
- `cors`: To enable Cross-Origin Resource Sharing, allowing our Next.js app to communicate with the server.
- `nodemon`: A tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.

```bash
pnpm add express cors
pnpm add -D nodemon
```

### Step 3: Create the Server

Now, let's create our main server file.

**Create the file `server/index.js`:**
```javascript
const express = require('express');
const cors = require('cors');

// Import your data
const { scholars } = require('../src/data/scholars');
const { countries } = require('../src/data/countries');
const { specializations } = require('../src/data/specializations');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// API Endpoints
app.get('/api/scholars', (req, res) => {
  res.json(scholars);
});

app.get('/api/countries', (req, res) => {
  res.json(countries);
});

app.get('/api/specializations', (req, res) => {
  res.json(specializations);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

### Step 4: Add a `dev` Script

To make it easier to run our server during development, let's add a `dev` script to our server's `package.json`.

**In `server/package.json`, add the following script:**
```json
"scripts": {
  "dev": "nodemon index.js"
}
```

### Step 5: Running the Server

Now you can run your server with the following command:

```bash
cd server
pnpm dev
```

Your API is now running at `http://localhost:3001`.

### Step 6: Frontend Integration

With the server running, we can now update our frontend to fetch data from the new API endpoints. We'll use the native `fetch` API for this.

Here's an example of how you might modify a component to fetch data from the new API:

```typescript
// Example in a Next.js page or component
import { useEffect, useState } from 'react';

function ScholarsPage() {
  const [scholars, setScholars] = useState([]);

  useEffect(() => {
    async function fetchScholars() {
      const res = await fetch('http://localhost:3001/api/scholars');
      const data = await res.json();
      setScholars(data);
    }

    fetchScholars();
  }, []);

  // Render your scholars...
}
```

## Next Steps

This is a foundational step. In the future, you can expand on this by:

- **Connecting to a database**: Replace the local data imports with a database connection (e.g., MongoDB, PostgreSQL).
- **Adding more complex routes**: Implement filtering, pagination, and searching on the server-side.
- **Authentication**: Secure your API with authentication and authorization.

By setting up this dedicated server, you've created a more scalable and professional architecture for your application.
