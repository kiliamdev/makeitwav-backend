# Dockerfile
FROM node:20

# Install ffmpeg and yt-dlp
RUN apt-get update && apt-get install -y ffmpeg curl && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

# Create app directory
WORKDIR /app

# Copy app files
COPY . .

# Install dependencies
RUN npm install

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "server.js"]
