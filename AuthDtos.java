package com.routewise.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {

    public static class SignupRequest {
        @NotBlank
        public String name;
        @NotBlank @Email
        public String email;
        @NotBlank @Size(min = 4, message = "Password must be at least 4 characters")
        public String password;
    }

    public static class LoginRequest {
        @NotBlank @Email
        public String email;
        @NotBlank
        public String password;
    }

    public static class UserResponse {
        public Long id;
        public String name;
        public String email;

        public UserResponse(Long id, String name, String email) {
            this.id = id; this.name = name; this.email = email;
        }
    }

    public static class AuthResponse {
        public String token;
        public UserResponse user;

        public AuthResponse(String token, UserResponse user) {
            this.token = token; this.user = user;
        }
    }
}
