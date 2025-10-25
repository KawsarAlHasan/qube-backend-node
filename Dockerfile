# Use Node.js 18 Alpine image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose port 8099
EXPOSE 8099


# Run app
CMD ["npm", "run", "dev"]