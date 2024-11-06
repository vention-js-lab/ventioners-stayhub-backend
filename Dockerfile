# Use Node.js 20 as the base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the app's internal port
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "run", "start:dev"]
