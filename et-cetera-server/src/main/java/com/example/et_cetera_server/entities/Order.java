package com.example.et_cetera_server.entities;

import com.example.et_cetera_server.dto.RideInfo;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @SequenceGenerator(name = "id", sequenceName = "id", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "id")
    @Column(name = "id")
    private Long id;
    @Column(name = "requesterID")
    private UUID requesterID;
    @Column(name = "driverID")
    private UUID driverID;
    @Column(name = "price")
    private double price;
    @Column(name = "originLat")
    private double originLat;
    @Column(name = "originLng")
    private double originLng;
    @Column(name = "destinationLat")
    private double destinationLat;
    @Column(name = "destinationLng")
    private double destinationLng;
    @Column(name = "status")
    private String status;

    public Order() {}
    public Order(RideInfo rideInfo, User user) {
        this.requesterID = UUID.fromString(rideInfo.getRequesterID());
        this.driverID = user.getId();
        this.price = rideInfo.getPrice();
        this.originLat = rideInfo.getLat();
        this.originLng = rideInfo.getLng();
        this.destinationLat = rideInfo.getDestinationLat();
        this.destinationLng = rideInfo.getDestinationLng();
        status = "initial";
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public UUID getRequesterID() {
        return requesterID;
    }

    public void setRequesterID(UUID requesterID) {
        this.requesterID = requesterID;
    }

    public UUID getDriverID() {
        return driverID;
    }

    public void setDriverID(UUID driverID) {
        this.driverID = driverID;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getOriginLat() {
        return originLat;
    }

    public void setOriginLat(double originLat) {
        this.originLat = originLat;
    }

    public double getOriginLng() {
        return originLng;
    }

    public void setOriginLng(double originLng) {
        this.originLng = originLng;
    }

    public double getDestinationLat() {
        return destinationLat;
    }

    public void setDestinationLat(double destinationLat) {
        this.destinationLat = destinationLat;
    }

    public double getDestinationLng() {
        return destinationLng;
    }

    public void setDestinationLng(double destinationLng) {
        this.destinationLng = destinationLng;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
