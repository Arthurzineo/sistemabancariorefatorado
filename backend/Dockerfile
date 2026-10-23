FROM golang:1.25-alpine AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/api ./cmd/api

FROM alpine:3.22
RUN addgroup -S app && adduser -S app -G app && mkdir /data && chown app:app /data
COPY --from=builder /out/api /app/api
USER app
WORKDIR /app
VOLUME ["/data"]
EXPOSE 8080
ENTRYPOINT ["/app/api"]
