package com.routewise.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "rides")
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 10)
    private String mode; // bike | car | bus

    @Column(name = "pickup_label", nullable = false, length = 255)
    private String pickupLabel;

    @Column(name = "pickup_lat", nullable = false)
    private Double pickupLat;

    @Column(name = "pickup_lng", nullable = false)
    private Double pickupLng;

    @Column(name = "drop_label", nullable = false, length = 255)
    private String dropLabel;

    @Column(name = "drop_lat", nullable = false)
    private Double dropLat;

    @Column(name = "drop_lng", nullable = false)
    private Double dropLng;

    @Column(name = "distance_km", nullable = false)
    private Double distanceKm;

    @Column(name = "eta_min", nullable = false)
    private Double etaMin;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false, length = 12)
    private String status; // completed | cancelled

    @Column(name = "driver_name", length = 120)
    private String driverName;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Ride() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getPickupLabel() { return pickupLabel; }
    public void setPickupLabel(String pickupLabel) { this.pickupLabel = pickupLabel; }

    public Double getPickupLat() { return pickupLat; }
    public void setPickupLat(Double pickupLat) { this.pickupLat = pickupLat; }

    public Double getPickupLng() { return pickupLng; }
    public void setPickupLng(Double pickupLng) { this.pickupLng = pickupLng; }

    public String getDropLabel() { return dropLabel; }
    public void setDropLabel(String dropLabel) { this.dropLabel = dropLabel; }

    public Double getDropLat() { return dropLat; }
    public void setDropLat(Double dropLat) { this.dropLat = dropLat; }

    public Double getDropLng() { return dropLng; }
    public void setDropLng(Double dropLng) { this.dropLng = dropLng; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public Double getEtaMin() { return etaMin; }
    public void setEtaMin(Double etaMin) { this.etaMin = etaMin; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
