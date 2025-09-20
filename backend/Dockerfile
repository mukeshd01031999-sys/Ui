# === Ui/backend/Dockerfile ===
FROM node:20-alpine

# Create app dir
WORKDIR /app

# Copy package.json first for caching
COPY package*.json ./

# Install deps
RUN npm install --production

# Copy rest of code
COPY . .

# Expose port
EXPOSE 4000

# Start backend
CMD ["npm", "start"]
