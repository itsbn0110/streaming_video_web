
FROM golang:1.24.3-alpine AS builder

WORKDIR /app

COPY . .

WORKDIR /app/cmd/streamserver

RUN go build -o streamserver main.go

FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/cmd/streamserver/streamserver .

CMD ["./streamserver"]


