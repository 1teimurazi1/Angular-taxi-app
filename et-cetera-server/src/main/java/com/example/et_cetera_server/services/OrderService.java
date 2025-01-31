package com.example.et_cetera_server.services;

import com.example.et_cetera_server.entities.Order;
import com.example.et_cetera_server.repos.OrderRepo;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class OrderService {
    private final OrderRepo orderRepo;

    public OrderService(OrderRepo orderRepo) {
        this.orderRepo = orderRepo;
    }

    public Order getOrderFromId(Long id) {
        return orderRepo.getReferenceById(id);
    }
    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }
    public List<Order> getAllDriverOrders(UUID id) {
        return orderRepo.findAllByDriverID(id);
    }
    public List<Order> getAllPassengerOrders(UUID id) {
        return orderRepo.findAllByRequesterID(id);
    }

    @Transactional
    public Order addEditOrder(Order order) {
        return orderRepo.save(order);
    }
}
