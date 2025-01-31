package com.example.et_cetera_server.utils;

import com.example.et_cetera_server.services.UserService;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private final CustomHandshakeHandler customHandshakeHandler;
    private final JwtUtil jwtUtil;
    public WebSocketConfig(CustomHandshakeHandler customHandshakeHandler, JwtUtil jwtUtil, UserService userService) {
        this.customHandshakeHandler = customHandshakeHandler;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:4200")
                .addInterceptors(
                        new HandshakeHandler(jwtUtil)
                )
                .setHandshakeHandler(customHandshakeHandler);
    }
}
