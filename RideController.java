package com.routewise.controller;

import com.routewise.dto.RideDtos.*;
import com.routewise.model.User;
import com.routewise.service.RideService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
public class RideController {

    private final RideService rideService;

    public RideController(RideService rideService) {
        this.rideService = rideService;
    }

    @PostMapping
    public RideResponse create(@AuthenticationPrincipal User user, @Valid @RequestBody RideRequest req) {
        return rideService.createRide(user, req);
    }

    @GetMapping
    public List<RideResponse> list(@AuthenticationPrincipal User user) {
        return rideService.listRides(user);
    }

    @GetMapping("/stats")
    public StatsResponse stats(@AuthenticationPrincipal User user) {
        return rideService.stats(user);
    }
}
