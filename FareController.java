package com.routewise.controller;

import com.routewise.dto.FareDtos.*;
import com.routewise.service.FareService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fare")
public class FareController {

    private final FareService fareService;

    public FareController(FareService fareService) {
        this.fareService = fareService;
    }

    @PostMapping("/quote")
    public FareQuoteResponse quote(@Valid @RequestBody FareQuoteRequest req) {
        return fareService.quote(req);
    }
}
