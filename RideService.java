package com.routewise.service;

import com.routewise.dto.RideDtos.*;
import com.routewise.model.Ride;
import com.routewise.model.User;
import com.routewise.repository.RideRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RideService {

    private final RideRepository rideRepository;

    public RideService(RideRepository rideRepository) {
        this.rideRepository = rideRepository;
    }

    public RideResponse createRide(User user, RideRequest req) {
        Ride ride = new Ride();
        ride.setUser(user);
        ride.setMode(req.mode);
        ride.setPickupLabel(req.pickupLabel);
        ride.setPickupLat(req.pickupLat);
        ride.setPickupLng(req.pickupLng);
        ride.setDropLabel(req.dropLabel);
        ride.setDropLat(req.dropLat);
        ride.setDropLng(req.dropLng);
        ride.setDistanceKm(req.distanceKm);
        ride.setEtaMin(req.etaMin);
        ride.setPrice(req.status.equals("cancelled") ? 0.0 : req.price);
        ride.setStatus(req.status);
        ride.setDriverName(req.driverName);
        ride = rideRepository.save(ride);
        return toResponse(ride);
    }

    public List<RideResponse> listRides(User user) {
        return rideRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public StatsResponse stats(User user) {
        List<Ride> completed = rideRepository.findByUserAndStatusOrderByCreatedAtDesc(user, "completed");
        double totalSpent = completed.stream().mapToDouble(Ride::getPrice).sum();
        Map<String, Long> counts = completed.stream()
                .collect(Collectors.groupingBy(Ride::getMode, Collectors.counting()));
        String favorite = counts.entrySet().stream()
                .max(Comparator.comparingLong(Map.Entry::getValue))
                .map(Map.Entry::getKey)
                .orElse(null);
        return new StatsResponse(completed.size(), totalSpent, favorite);
    }

    private RideResponse toResponse(Ride r) {
        RideResponse dto = new RideResponse();
        dto.id = r.getId();
        dto.mode = r.getMode();
        dto.pickupLabel = r.getPickupLabel();
        dto.pickupLat = r.getPickupLat();
        dto.pickupLng = r.getPickupLng();
        dto.dropLabel = r.getDropLabel();
        dto.dropLat = r.getDropLat();
        dto.dropLng = r.getDropLng();
        dto.distanceKm = r.getDistanceKm();
        dto.etaMin = r.getEtaMin();
        dto.price = r.getPrice();
        dto.status = r.getStatus();
        dto.driverName = r.getDriverName();
        dto.createdAt = r.getCreatedAt();
        return dto;
    }
}
