package com.finshield.serviceImpl;

import com.finshield.dto.LoginRequest;
import com.finshield.dto.LoginResponse;
import com.finshield.dto.RegisterRequest;
import com.finshield.dto.RegisterResponse;
import com.finshield.exception.UserAlreadyExistsException;
import com.finshield.exception.UserNotFoundException;
import com.finshield.security.CustomUserDetailsService;
import com.finshield.security.JwtService;
import com.finshield.service.AuthService;
import com.finshield.service.WalletService;
import com.finshield.user.entity.User;
import com.finshield.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final WalletService walletService;

    @Override
    public RegisterResponse register(RegisterRequest request) {
        log.info("Registration request received for email={}", request.getEmail());
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            log.warn("Registration failed. Email already exists: {}", request.getEmail());
            throw new UserAlreadyExistsException("Email already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        User savedUser = userRepository.save(user);
        log.info("User registered successfully. UserId={}, Email={}",
                savedUser.getId(),
                savedUser.getEmail());
        walletService.createWallet(savedUser);
        log.info("Wallet created successfully for UserId={}", savedUser.getId());
        return RegisterResponse.builder()
                .id(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .message("User Registered Successfully")
                .build();
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        log.info("Login request received for email={}", request.getEmail());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        log.info("Authentication successful for email={}", request.getEmail());
        UserDetails userDetails =
                userDetailsService.loadUserByUsername(request.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.error("User not found after successful authentication. Email={}",
                            request.getEmail());
                    return new UserNotFoundException("User not found");
                });

        log.info("Login successful. UserId={}, Email={}",
                user.getId(),
                user.getEmail());
        return LoginResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .token(jwtToken)
                .tokenType("Bearer")
                .expiresIn(86400000L)
                .build();
    }
}