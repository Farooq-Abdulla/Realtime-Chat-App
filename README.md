
# Scalable Realtime Chat Application

This project is a scalable realtime chat application that utilizes Redis for in-memory caching and its Pub-Sub service. The application is designed with scalability in mind, featuring a load balancer and auto-scaling capabilities based on the number of users. This scalability is achieved through Kubernetes implementation (developed in collaboration).

The application is divided into two main components:

- **chat-frontend**: A Next.js application that manages authentication, UI, and CRUD operations.

- **chat-backend**: An Express.js application that manages WebSocket logic using Socket.IO.

Redis plays a crucial role in enhancing the performance and scalability of our application by providing fast in-memory caching and efficient real-time message broadcasting through its Pub-Sub feature.

## Key Features: 
- Load balancing for efficient traffic distribution
 - Auto-scaling based on user load, powered by Kubernetes
  - Redis-based caching and real-time communication 
  - Microservices architecture for improved modularity and scalability




## Running the Application Locally

### Option 1: Using Docker

1. **Build Docker images**:

From the **root directory**:

- **Frontend**:

```bash

cd chat-frontend

docker build -t chat-app-front:v1.0 .

```

- **Backend**:

```bash

cd chat-backend

docker build -t chat-app-back:v1.0 .

```

2. **Create a Docker network**:

```bash

docker network create chat-app-network-1
```

3. **Prepare your environment variables:**

Ensure you have the following values ready:

- `DATABASE_URL`

- `REDIS_URL`

- `AUTH_SECRET`

- `AUTH_GOOGLE_ID`

- `AUTH_GOOGLE_SECRET`



4. **Run the Docker containers:**

- **Frontend**

```bash

docker run -d -p 3000:3000 --network chat-app-network-1 

-e DATABASE_URL="<your-database-url>" 

-e REDIS_URL="<your-redis-url>" 

-e AUTH_SECRET="<your-auth-secret>" 

-e AUTH_GOOGLE_ID="<your-google-client-id>" 

-e AUTH_GOOGLE_SECRET="<your-google-client-secret>" 

-e NEXT_PUBLIC_DEV_Backend_URL="http://localhost:3001" 

-e NEXTAUTH_URL="http://localhost:3000" 

chat-app-front:v1.0

```

- **Backend (default port: 3001):**

```bash

docker run -d -p 3001:3001 --network chat-app-network-1 

-e REDIS_URL="<your-redis-url>" 

chat-app-back:v1.0

```

> **Note**: If you need to change the backend port, pass it as an environment variable (`PORT`) and update the port mapping in the Docker command and the `NEXT_PUBLIC_DEV_Backend_URL`.

---

### Option 2: Running Locally with npm

1. **Install Dependencies**

From the **root directory**:

- **Frontend**:

```bash

cd chat-frontend

npm install

npm run dev

```

- **Backend**:

```bash

cd chat-backend

npm install

npm run dev

```

2. **Add environment variables:**

Create the following files in the respective directories:

- **Frontend** (`chat-frontend/.env`):

```

DATABASE_URL=""

REDIS_URL=""

```

- **Frontend** (`chat-frontend/.env.local`):

```

AUTH_SECRET=""

AUTH_GOOGLE_ID=""

AUTH_GOOGLE_SECRET=""

NEXT_PUBLIC_DEV_Backend_URL="http://localhost:3001"

NEXT_PUBLIC_PROD_Backend_URL="<your-production-backend-url>"

```

- **Backend** (`chat-backend/.env`):

```

PORT=3001

REDIS_URL=""

```

## Notes

- Ensure both frontend and backend are running on the **same Docker network** for proper communication.

- Update `NEXT_PUBLIC_DEV_Backend_URL` and port mappings if you change the backend port.

- Make sure the environment variables are correctly configured in both **frontend** and **backend**.

- Redis configuration is crucial for the application's performance. Ensure your Redis instance is properly set up and accessible.

## Redis Usage

In this application, Redis serves two primary purposes:

1. **In-Memory Caching**: We use Redis to cache frequently accessed data, reducing the load on our primary database and improving response times.

2. **Pub-Sub Service**: Redis's Pub-Sub feature is utilized for real-time message broadcasting, enabling efficient communication between multiple server instances and clients.

For optimal performance, ensure your Redis instance is properly configured and has sufficient resources allocated.

## Contributions

Contributions are welcome! If you'd like to improve the project, feel free to open an issue or submit a pull request. We appreciate any efforts to enhance the application's functionality, performance, or documentation.