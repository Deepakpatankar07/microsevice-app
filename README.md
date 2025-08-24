#  Microservice Based Application


## Technologies Used

  - Node.js
  - Express.js
  - MongoDB
  - Redis
  - RabbitMQ
  - Docker
  - Github Action ( CI ) - ci.yml file used to build and push Docker images to Docker Hub

## Getting Started

Follow these steps to run Microservice Based Application locally:

1. **Clone the repo:**

    ```bash
       git clone https://github.com/Deepakpatankar07/microservice-app
    ```

2. **Set up environment variables**

   - Create a .env file in the root directory and add the following (or use .env.example) :

   ```bash
    JWT_SECRET=your_jwt_secret
    PORT=8080
    MONGODB_URI=mongodb://mongo:27017/microservice
    RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
    REDIS_URL=redis://redis:6379
   ```

   Replace `your_jwt_secret` with your own values.

3. **Build and run the application**

  - Build containers
  ```bash
    docker-compose --env-file .env build
  ```

  - Start service
  ```bash
    docker-compose --env-file .env up
  ```

4. **Stop the application**

  ```bash
    docker compose down -v
  ```
  
5. **Access the APIs**

   - Import the `Microservice_Based_Application.postman_collection.json` file into Postman.
   - It contains all available API routes and details.
