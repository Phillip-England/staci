# Use the official Golang image as the base image
FROM golang:1.23.3-bookworm

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the Go module files and download dependencies
COPY go.mod go.sum ./
RUN go mod tidy

# Copy the rest of the application source code
COPY . .

# Build the Go application
RUN go build -o app main.go

# Expose the port your app listens on
EXPOSE 8080

# Command to run the executable
CMD ["./app"]
