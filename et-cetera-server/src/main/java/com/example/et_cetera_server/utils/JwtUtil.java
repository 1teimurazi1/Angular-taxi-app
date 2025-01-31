package com.example.et_cetera_server.utils;


import com.example.et_cetera_server.entities.User;
import com.example.et_cetera_server.repos.UserRepo;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {
    private static final Integer EXPIRATION_TIME = 86_400_000;// 1 Day
    private static final SecretKey secretKey = Keys.hmacShaKeyFor(("{75b73efe-4a4d-49bd-a022-fa078a7b45b6}").getBytes());
    private final UserRepo userRepo;
    public JwtUtil(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + EXPIRATION_TIME))
                .signWith(secretKey)
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String getUsername(String token) {
        return parseToken(token).getSubject();
    }

    public boolean isTokenExpired(String token) {
        return parseToken(token).getExpiration().before(new Date());
    }

    public boolean validateToken(String token, String username) {
        return getUsername(token).equals(username) && !isTokenExpired(token);
    }

    public User getUserFromToken(String token) {
        String username = getUsername(token);
        if (username != null && validateToken(token, username)) {
            return userRepo.findByEmail(username);
        }
        return null;
    }
}
