package com.example.et_cetera_server.utils;

import com.example.et_cetera_server.entities.User;
import com.example.et_cetera_server.services.UserService;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.security.Principal;
import java.util.Map;

@Component
public class HandshakeHandler implements HandshakeInterceptor {
    private JwtUtil jwtUtil;
    public HandshakeHandler(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
            String token = servletRequest.getServletRequest().getParameter("token");
            System.out.println("Handshake received " + token);
            if (token != null) {
                String username = jwtUtil.getUsername(token);
                if (username != null && jwtUtil.validateToken(token, username)) {
                    User userDetails = jwtUtil.getUserFromToken(token);
                    attributes.put("userId", userDetails.getId().toString());
                } else {
                    return false;
                }
            }
        }
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
        System.out.println("Handshake complete!");
    }
}
