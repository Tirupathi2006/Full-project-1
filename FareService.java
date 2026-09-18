package com.routewise.service;

import com.routewise.dto.FareDtos.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Pricing lives on the server so the numbers a rider sees are the numbers
 * that get billed — the frontend only supplies the road distance/duration
 * it already resolved via OSRM.
 */
@Service
public class FareService {

    public FareQuoteResponse quote(FareQuoteRequest req) {
        double distanceKm = req.distanceKm;
        double bikeMin = Math.max(4, req.cyclingMin);
        double carMin = Math.max(5, req.drivingMin);
        double busMin = Math.max(8, req.drivingMin * 1.55 + 6);

        double bikePrice = Math.max(20, 15 + distanceKm * 6);
        double carPrice = Math.max(45, 45 + distanceKm * 13);
        double busPrice = Math.max(10, 10 + distanceKm * 2.5);

        List<FareOption> options = new ArrayList<>();
        options.add(new FareOption("bike", "Bike", "1 seat • door to door", round1(distanceKm), round1(bikeMin), round1(bikePrice), false));
        options.add(new FareOption("car", "Car", "4 seats • AC • door to door", round1(distanceKm), round1(carMin), round1(carPrice), false));
        options.add(new FareOption("bus", "Bus", "Shared • nearest stop", round1(distanceKm), round1(busMin), round1(busPrice), false));

        markRecommended(options);
        return new FareQuoteResponse(options);
    }

    private void markRecommended(List<FareOption> options) {
        FareOption best = null;
        double bestScore = Double.MAX_VALUE;
        for (FareOption o : options) {
            double score = o.price * 0.55 + o.etaMin * 3.2;
            if (score < bestScore) {
                bestScore = score;
                best = o;
            }
        }
        if (best != null) best.recommended = true;
    }

    private double round1(double v) {
        return Math.round(v * 10) / 10.0;
    }
}
