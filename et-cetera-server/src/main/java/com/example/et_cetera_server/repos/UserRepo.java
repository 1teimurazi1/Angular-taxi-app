package com.example.et_cetera_server.repos;

import com.example.et_cetera_server.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    User findById(UUID id);
    User findByEmail(String email);
    List<User> findAllByUserType(String userType);
}
