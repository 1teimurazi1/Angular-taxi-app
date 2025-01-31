package com.example.et_cetera_server;

import com.example.et_cetera_server.entities.User;
import com.example.et_cetera_server.repos.UserRepo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@RestController
@SpringBootApplication
public class EtCeteraServerApplication {
	public static void main(String[] args) {
		SpringApplication.run(EtCeteraServerApplication.class, args);
	}
}
