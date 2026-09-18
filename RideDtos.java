package com.routewise.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public class RideDtos {

    public static class RideRequest {
        @NotBlank public String mode;

        @NotBlank public String pickupLabel;
        @NotNull public Double pickupLat;
        @NotNull public Double pickupLng;

        @NotBlank public String dropLabel;
        @NotNull public Double dropLat;
        @NotNull public Double dropLng;

        @NotNull public Double distanceKm;
        @NotNull public Double etaMin;
        @NotNull public Double price;

        @NotBlank public String status; // completed | cancelled
        public String driverName;
    }

    public static class RideResponse {
        public Long id;
        public String mode;
        public String pickupLabel;
        public Double pickupLat;
        public Double pickupLng;
        public String dropLabel;
        public Double dropLat;
        public Double dropLng;
        public Double distanceKm;
        public Double etaMin;
        public Double price;
        public String status;
        public String driverName;
        public Instant createdAt;
    }

    public static class StatsResponse {
        public long totalTrips;
        public double totalSpent;
        public String favoriteMode;

        public StatsResponse(long totalTrips, double totalSpent, String favoriteMode) {
            this.totalTrips = totalTrips;
            this.totalSpent = totalSpent;
            this.favoriteMode = favoriteMode;
        }
    }
}
