# 1. Use an official Node.js runtime as the base image
FROM node:20-alpine

# 2. Set working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package files first (for better layer caching)
COPY package*.json ./

# 4. Install only production dependencies
RUN npm ci --omit=dev

# 5. Copy the rest of your app’s source code
COPY . .

# 6. Expose the port your app runs on (commonly 3000)
EXPOSE 8080

# 7. Define the command to run your app
CMD ["node", "index.js"]
