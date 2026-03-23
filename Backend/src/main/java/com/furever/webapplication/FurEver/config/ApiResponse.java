package com.furever.webapplication.FurEver.config;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Standard API response wrapper for all endpoints
 * Ensures consistent response structure for web and mobile clients
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private int code;

    // Constructor for success responses
    public ApiResponse(boolean success, T data, String message, int code) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.code = code;
    }

    // Constructor for simple success
    public ApiResponse(T data) {
        this.success = true;
        this.data = data;
        this.code = 200;
    }

    // Constructor for success with data, message, and code
    public ApiResponse(T data, String message, int code) {
        this.success = true;
        this.data = data;
        this.message = message;
        this.code = code;
    }

    // Constructor for error
    public ApiResponse(String message, int code) {
        this.success = false;
        this.data = null;
        this.message = message;
        this.code = code;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }
}
