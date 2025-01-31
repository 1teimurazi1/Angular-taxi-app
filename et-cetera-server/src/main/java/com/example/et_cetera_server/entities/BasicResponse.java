package com.example.et_cetera_server.entities;

public class BasicResponse<T> {
    private T body;
    private String message;
    private boolean success;

    public BasicResponse(T body) {
        this.body = body;
        this.success = true;
    }
    public BasicResponse(T body, boolean success) {
        this.body = body;
        this.success = success;
    }
    public BasicResponse(T body, String message, boolean success) {
        this.body = body;
        this.success = success;
        this.message = message;
    }
    public BasicResponse(String message, boolean success) {
        this.success = success;
        this.message = message;
    }

    public T getBody() {
        return body;
    }

    public void setBody(T body) {
        this.body = body;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
