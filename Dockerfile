# Use official Node.js base image
FROM node:20

# Install ffmpeg and yt-dlp
RUN apt-get update && apt-get install -y ffmpeg curl && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Ensure temp directory exists
RUN mkdir -p temp

# Expose port (Render uses PORT env)
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]

# Copy cookies.txt
COPY cookies.txt /app/cookies.txt
