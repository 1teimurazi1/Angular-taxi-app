package com.example.et_cetera_server.controllers;

import com.example.et_cetera_server.dto.RideInfo;
import com.example.et_cetera_server.dto.RideRequest;
import com.example.et_cetera_server.dto.UserInfo;
import com.example.et_cetera_server.entities.BasicResponse;
import com.example.et_cetera_server.entities.Order;
import com.example.et_cetera_server.entities.User;
import com.example.et_cetera_server.repos.OrderRepo;
import com.example.et_cetera_server.repos.UserRepo;
import com.example.et_cetera_server.services.NotifService;
import com.example.et_cetera_server.services.OrderService;
import com.example.et_cetera_server.services.UserService;
import com.example.et_cetera_server.utils.JwtUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api")
public class RideController {
    private static final double DRIVER_DISTANCE_LIMIT = 2.0D;
    private static final double R = 6371;
    private final ArrayList<RideInfo> potentialRides = new ArrayList<>();

    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final OrderService orderService;
    private final UserRepo userRepo;
    private final OrderRepo orderRepo;
    private final NotifService notifService;

    public RideController(UserService userService, JwtUtil jwtUtil, OrderService orderService, UserRepo userRepo, OrderRepo orderRepo, NotifService notifService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.orderService = orderService;
        this.userRepo = userRepo;
        this.orderRepo = orderRepo;
        this.notifService = notifService;
    }

    public static double degToRad(double degrees) {
        return degrees * Math.PI / 180.0;
    }
    public static double calculateDistance(double lat1, double lng1, double lat2, double lng2) {
        double lat1Rad = degToRad(lat1);
        double lon1Rad = degToRad(lng1);
        double lat2Rad = degToRad(lat2);
        double lon2Rad = degToRad(lng2);

        double dLat = lat2Rad - lat1Rad;
        double dLon = lon2Rad - lon1Rad;

        // Haversine formula
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Distance in kilometers
        return R * c;
    }

    public BasicResponse<List<Order>> userOrderGetMethod(User user) {
        String userType = user.getUserType();
        if (userType.equals("passenger")) {
            return new BasicResponse<List<Order>>(orderService.getAllPassengerOrders(user.getId()), "Success!", true);
        } else if (userType.equals("driver")) {
            return new BasicResponse<List<Order>>(orderService.getAllDriverOrders(user.getId()), "Success!", true);
        } else {
            return new BasicResponse<List<Order>>(orderService.getAllOrders(), "Success!", true);
        }
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @RequestMapping(value = "/completeRide", method = RequestMethod.GET, produces = {"application/json"})
    public BasicResponse<List<Order>> completeRide() {
        Authentication userAuth = SecurityContextHolder.getContext().getAuthentication();
        if (userAuth == null) {
            return new BasicResponse<List<Order>>("Cannot request ride while not logged in!", false);
        }
        User user = (User) userAuth.getPrincipal();
        if (user == null) {
            return new BasicResponse<List<Order>>( "Invalid state, try logging in again!", false);
        }
        Order currentOrder = orderService.getOrderFromId(user.getCurrOrderID());
        if (currentOrder == null) {
            return new BasicResponse<List<Order>>( "Could not find current order!", false);
        }
        currentOrder.setStatus("completed");
        user.setCurrOrderID(-1L);

        orderService.addEditOrder(currentOrder);
        userService.addEditUser(user);
        return userOrderGetMethod(user);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @RequestMapping(value = "/getUserRides", method = RequestMethod.GET, produces = {"application/json"})
    public BasicResponse<List<Order>> getUserRides() {
        // Validate
        Authentication userAuth = SecurityContextHolder.getContext().getAuthentication();
        if (userAuth == null) {
            return new BasicResponse<List<Order>>("Cannot request ride while not logged in!", false);
        }
        User user = (User) userAuth.getPrincipal();
        if (user == null) {
            return new BasicResponse<List<Order>>( "Invalid state, try logging in again!", false);
        }
        return userOrderGetMethod(user);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @RequestMapping(value = "/rideRequest", method = RequestMethod.POST, produces = {"application/json"})
    public BasicResponse<List<Order>> rideRequest(@RequestBody RideRequest rideRequest) {
        // Validate
        Authentication userAuth = SecurityContextHolder.getContext().getAuthentication();
        if (userAuth == null) {
            return new BasicResponse<List<Order>>("Cannot request ride while not logged in!", false);
        }
        User user = (User) userAuth.getPrincipal();
        if (user == null) {
            return new BasicResponse<List<Order>>("Invalid state, try logging in again!", false);
        }
        if (rideRequest.getLat() == 0 && rideRequest.getLng() == 0) {
            return new BasicResponse<List<Order>>("Invalid coordinates!", false);
        }

        System.out.println(rideRequest);

        RideInfo rideInfo = new RideInfo();
        rideInfo.setRequesterID(user.getId().toString());
        rideInfo.setId(UUID.randomUUID());
        rideInfo.setDistance(rideRequest.getDistance());
        rideInfo.setLat(rideRequest.getLat());
        rideInfo.setLng(rideRequest.getLng());
        rideInfo.setDestinationLat(rideRequest.getDestinationLat());
        rideInfo.setDestinationLng(rideRequest.getDestinationLng());
        rideInfo.setPrice(rideRequest.getPrice());
        potentialRides.add(rideInfo);
        System.out.println(potentialRides.toString());

        return userOrderGetMethod(user);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @RequestMapping(value = "/acceptRide", method = RequestMethod.GET, produces = {"application/json"})
    public BasicResponse<Order> acceptRide(@RequestParam String orderId) {
        // Validate
        Authentication userAuth = SecurityContextHolder.getContext().getAuthentication();
        if (userAuth == null) {
            return new BasicResponse<Order>("Cannot request ride while not logged in!", false);
        }
        User user = (User) userAuth.getPrincipal();
        if (user == null) {
            return new BasicResponse<Order>("Invalid state, try logging in again!", false);
        }
        if (user.getCurrOrderID() != null && user.getCurrOrderID() != -1) {
            return new BasicResponse<Order>("Already has a ride!", false);
        }
        // TODO: Add check to make sure only driver types can do this

        for (RideInfo rideInfo : potentialRides) {
            if (rideInfo.getId().toString().equals(orderId)) {
                // Order save
                potentialRides.remove(rideInfo);
                Order newOrder = new Order(rideInfo, user);
                Order order = orderService.addEditOrder(newOrder);

                // Driver accepting order
                user.setCurrOrderID(order.getId());
                userService.addEditUser(user);

                // User accepting order
                User requester = userService.getUserFromId(order.getRequesterID());
                requester.setCurrOrderID(order.getId());
                userService.addEditUser(requester);

                notifService.sendOrdersUpdate(user.getId().toString(), userOrderGetMethod(user).getBody());
                notifService.sendOrdersUpdate(requester.getId().toString(), userOrderGetMethod(requester).getBody());
                System.out.println("Order got accepted: " + rideInfo);
                return new BasicResponse<Order>(order,"Success!", true);
            }
        }

        return new BasicResponse<Order>("Could not find requested order!", false);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @RequestMapping(value = "/getAvailableRides", method = RequestMethod.GET, produces = {"application/json"})
    public List<RideInfo> getAvailableRides(@RequestParam double lat, @RequestParam double lng) {
        // TODO: Only net Driver type users get orders

        List<RideInfo> filteredRides = potentialRides.stream()
                .filter(rideInfo -> {
                    double distance = calculateDistance(lat, lng, rideInfo.getLat(), rideInfo.getLng());
                    return distance <= DRIVER_DISTANCE_LIMIT;
                })
                .collect(Collectors.toList());
        System.out.println("Number of potential rides: " + potentialRides.size() + " and filtered rides: " + filteredRides.size());
        return filteredRides;
    }
}
