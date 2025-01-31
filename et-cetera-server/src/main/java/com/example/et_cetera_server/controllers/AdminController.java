package com.example.et_cetera_server.controllers;

import com.example.et_cetera_server.entities.BasicResponse;
import com.example.et_cetera_server.entities.Order;
import com.example.et_cetera_server.entities.User;
import com.example.et_cetera_server.services.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.sql.Driver;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/admin")
public class AdminController {
    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    private String isAdminUser() {
        Authentication userAuth = SecurityContextHolder.getContext().getAuthentication();
        if (userAuth == null) {
            return "Cannot request drivers while not logged in!";
        }
        User user = (User) userAuth.getPrincipal();
        if (user == null) {
            return "Invalid state, try logging in again!";
        }
        if (!user.getUserType().equals("admin")) {
            //return "Must be admin!";
        }
        return null;
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @RequestMapping(value = "/getDrivers", method = RequestMethod.GET, produces = {"application/json"})
    public BasicResponse<List<User>> getDrivers() {
        String error = isAdminUser();
        if (error != null) return new BasicResponse<List<User>>(error, false);
        return new BasicResponse<List<User>>(userService.getAllDrivers(), "Success!", true);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @RequestMapping(value = "/toggleDriver", method = RequestMethod.GET, produces = {"application/json"})
    public BasicResponse<List<User>> toggleDriver(@RequestParam String id, @RequestParam boolean val) {
        String error = isAdminUser();
        if (error != null) return new BasicResponse<List<User>>(error, false);

        User driver = userService.getUserFromId(UUID.fromString(id));
        if (driver == null) {
            return new BasicResponse<List<User>>("Couldn't find driver with that id!", false);
        }
        driver.setStatus(val ? "active" : "inactive");
        userService.addEditUser(driver);

        return new BasicResponse<List<User>>(userService.getAllDrivers(), "Success!", true);
    }
}
