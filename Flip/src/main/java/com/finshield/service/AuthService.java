package com.finshield.service;

import com.finshield.dto.LoginRequest;
import com.finshield.dto.LoginResponse;
import com.finshield.dto.RegisterRequest;
import com.finshield.dto.RegisterResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}
