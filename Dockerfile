# Stage 1: Build the React app
FROM node:20-slim AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app (Vite expects VITE_ environment variables)
# We pass these as build-time arguments
ARG VITE_GEMINI_API_KEY
ARG VITE_MAPS_API_KEY
ARG VITE_YOUTUBE_API_KEY
ARG VITE_TTS_API_KEY
ARG VITE_TRANSLATE_API_KEY

ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
ENV VITE_MAPS_API_KEY=$VITE_MAPS_API_KEY
ENV VITE_YOUTUBE_API_KEY=$VITE_YOUTUBE_API_KEY
ENV VITE_TTS_API_KEY=$VITE_TTS_API_KEY
ENV VITE_TRANSLATE_API_KEY=$VITE_TRANSLATE_API_KEY

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy built files from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config to handle SPA routing if needed
# (Optional: for client-side routing)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
