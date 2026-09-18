package com.routewise.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public class FareDtos {

    /** Sent by the frontend after it resolves a real road route via OSRM. */
    public static class FareQuoteRequest {
        @NotNull public Double pickupLat;
        @NotNull public Double pickupLng;
        public String pickupLabel;

        @NotNull public Double dropLat;
        @NotNull public Double dropLng;
        public String dropLabel;

        /** Road distance in km (from OSRM driving profile), used for all modes. */
        @NotNull public Double distanceKm;
        /** Estimated driving duration in minutes. */
        @NotNull public Double drivingMin;
        /** Estimated cycling duration in minutes. */
        @NotNull public Double cyclingMin;
    }

    public static class FareOption {
        public String mode;      // bike | car | bus
        public String name;
        public String description;
        public double distanceKm;
        public double etaMin;
        public double price;
        public boolean recommended;

        public FareOption(String mode, String name, String description, double distanceKm,
                           double etaMin, double price, boolean recommended) {
            this.mode = mode; this.name = name; this.description = description;
            this.distanceKm = distanceKm; this.etaMin = etaMin; this.price = price;
            this.recommended = recommended;
        }
    }

    public static class FareQuoteResponse {
        public List<FareOption> options;
        public FareQuoteResponse(List<FareOption> options) { this.options = options; }
    }
}
