# Use Node.js LTS version
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Hugging Face Spaces uses port 7860 by default
ENV PORT=7860

# Expose the port
EXPOSE 7860

# Start the application
CMD ["npm", "start"]
