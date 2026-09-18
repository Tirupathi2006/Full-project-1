-- RouteWise database schema (MySQL 8+)
-- Create the database first:
--   CREATE DATABASE routewise CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS users (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(120)  NOT NULL,
    email         VARCHAR(160)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rides (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT        NOT NULL,
    mode         VARCHAR(10)   NOT NULL,           -- bike | car | bus
    pickup_label VARCHAR(255)  NOT NULL,
    pickup_lat   DOUBLE        NOT NULL,
    pickup_lng   DOUBLE        NOT NULL,
    drop_label   VARCHAR(255)  NOT NULL,
    drop_lat     DOUBLE        NOT NULL,
    drop_lng     DOUBLE        NOT NULL,
    distance_km  DOUBLE        NOT NULL,
    eta_min      DOUBLE        NOT NULL,
    price        DOUBLE        NOT NULL,
    status       VARCHAR(12)   NOT NULL,           -- completed | cancelled
    driver_name  VARCHAR(120),
    created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rides_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_rides_user_created ON rides (user_id, created_at DESC);
