FROM golang:1.23.3-bookworm

WORKDIR /usr/src/app

COPY go.mod go.sum ./
RUN go mod tidy

COPY . .
RUN go build -v main.go

EXPOSE 8080

CMD ["./"]