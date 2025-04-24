FROM golang:alpine AS builder

WORKDIR /builder

COPY . .

RUN go mod download

RUN go build -o streaming.com ./back-end/cmd/movieserver

FROM scratch


