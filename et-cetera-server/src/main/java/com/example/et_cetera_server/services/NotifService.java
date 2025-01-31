package com.example.et_cetera_server.services;

import com.example.et_cetera_server.dto.RideInfo;
import com.example.et_cetera_server.entities.Order;
import com.example.et_cetera_server.entities.User;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NotifService {
    private SimpMessagingTemplate messagingTemplate;
    public NotifService(@Lazy SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendOrdersUpdate(String userId, List<Order> orders) {
        messagingTemplate.convertAndSendToUser(userId, "/queue/orders", orders);
    }
    public void sendProfileUpdate(String userId, User user) {
        messagingTemplate.convertAndSendToUser(userId, "/queue/profile", user);
    }
}
