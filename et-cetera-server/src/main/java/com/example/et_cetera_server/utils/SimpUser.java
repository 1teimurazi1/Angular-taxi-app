package com.example.et_cetera_server.utils;

import java.security.Principal;

public class SimpUser implements Principal {
    private String username;
    public SimpUser(String username) {
        this.username = username;
    }
    @Override
    public String getName() {
        return username;
    }

    @Override
    public int hashCode() {
        return username.hashCode();
    }
}
