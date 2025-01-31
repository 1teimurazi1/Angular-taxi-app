package com.example.et_cetera_server.controllers;

import ch.qos.logback.classic.encoder.JsonEncoder;
import com.example.et_cetera_server.dto.LoginRequest;
import com.example.et_cetera_server.dto.UserInfo;
import com.example.et_cetera_server.entities.BasicResponse;
import com.example.et_cetera_server.entities.User;
import com.example.et_cetera_server.repos.UserRepo;
import com.example.et_cetera_server.services.NotifService;
import com.example.et_cetera_server.services.UserService;
import com.example.et_cetera_server.utils.JwtUtil;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api")
public class UserController {
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final SimpUserRegistry simpUserRegistry;
    public UserController(SimpUserRegistry simpUserRegistry, UserService userService, JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.simpUserRegistry = simpUserRegistry;
    }

    @RequestMapping(value = "/test", method = RequestMethod.GET, produces = {"application/json"})
    public String test() {
        return simpUserRegistry.getUsers().toString();
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST, produces = {"application/json"})
    public BasicResponse<User> registerUser(@RequestBody UserInfo userInfo) {
        // Make sure email isn't already in use!
        if (userInfo.getEmail() == null)
            return new BasicResponse<User>("Email is required!", false);
        if (userService.getUserFromMail(userInfo.getEmail()) != null)
            return new BasicResponse<User>("Email already in use!", false);

        // Check variables
        if (userInfo.getType().equals("passenger")) {
            userInfo.setCarModel(null);
            userInfo.setPlateNumber(null);
        } else if (userInfo.getType().equals("driver")) {
            if (User.CarModel.getCarModelByDisplayName(userInfo.getCarModel()) == null)
                return new BasicResponse<User>("Invalid car model!", false);
            if (userInfo.getPlateNumber() == null)
                return new BasicResponse<User>("Plate number is required!", false);
        } else {
            return new BasicResponse<User>("Invalid registration type!", false);
        }

        userInfo.setId(UUID.randomUUID());
        User newUser = new User(userInfo);
        userService.addEditUser(newUser);
        return new BasicResponse<User>("Successfully registered!", true);
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST, produces = {"application/json"})
    public BasicResponse<User> loginUser(@RequestBody LoginRequest loginRequest) {
        // TODO: Check for validity

        User possibleUser = userService.getUserFromMail(loginRequest.getEmail());
        if (possibleUser == null || !possibleUser.checkPassword(loginRequest.getPassword()))
            return new BasicResponse<User>("Invalid credentials!", false);

        String token = jwtUtil.generateToken(possibleUser.getEmail());
        return new BasicResponse<User>(possibleUser, token, true);
    }

    @RequestMapping(value = "/getProfile", method = RequestMethod.GET, produces = {"application/json"})
    public BasicResponse<User> getProfile(@RequestParam String id) {
        User profile = userService.getUserFromId(UUID.fromString(id));
        if (profile != null) {
            return new BasicResponse<User>(profile, "Success!", true);
        } else {
            return new BasicResponse<User>("Invalid ID!", false);
        }
    }
}
