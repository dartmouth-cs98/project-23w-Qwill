# Use Ubuntu 20.04 LTS (Focal Fossa) as the base image
FROM ubuntu:20.04

# Set working directory in the container
WORKDIR /app

# Set environment variables to prevent tzdata interactive installation
ENV DEBIAN_FRONTEND=noninteractive

# APT dependencies
RUN apt-get update && \
    apt-get install -y curl python3 python3-pip fontforge python3-fontforge imagemagick potrace

# Node.js installation
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the Node.js server files
COPY . .

# Go to the handwriting directory
WORKDIR /app/handwriting

# Copy the requirements.txt file
COPY handwriting/requirements.txt .

# Install Python 3 dependencies
RUN pip3 install -r requirements.txt

# Go back to the root directory
WORKDIR /app

# The command to run the application
CMD [ "npm", "run", "deploy:start" ]
