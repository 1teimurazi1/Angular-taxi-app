package com.example.et_cetera_server.repos;

import com.example.et_cetera_server.entities.Order;
import com.example.et_cetera_server.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepo extends JpaRepository<Order, Long> {
    List<Order> findAllByDriverID(UUID id);
    List<Order> findAllByRequesterID(UUID id);
}