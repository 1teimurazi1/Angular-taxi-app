package com.example.et_cetera_server.services;

import com.example.et_cetera_server.entities.User;
import com.example.et_cetera_server.repos.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepo userRepo;
    private final NotifService notifService;

    public UserService(UserRepo userRepo, NotifService notifService) {
        this.userRepo = userRepo;
        this.notifService = notifService;
    }

    public List<User> getAllDrivers() {
        return userRepo.findAllByUserType("driver");
    }
    public User getUserFromId(UUID id) {
        return userRepo.findById(id);
    }
    public User getUserFromMail(String email) {
        return userRepo.findByEmail(email);
    }

    @Transactional
    public void addEditUser(User user) {
        notifService.sendProfileUpdate(user.getId().toString(), user);
        userRepo.save(user);
    }
}
