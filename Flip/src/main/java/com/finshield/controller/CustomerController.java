package com.finshield.controller;

import com.finshield.dto.ApiResponse;
import com.finshield.dto.CreateCustomerRequest;
import com.finshield.dto.CustomerResponse;
import com.finshield.dto.CustomerSummaryResponse;
import com.finshield.dto.UpdateCustomerRequest;
import com.finshield.service.CustomerService;
import com.finshield.user.entity.User;
import com.finshield.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;
    private final UserRepository userRepository;

    private User resolveUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public ApiResponse<CustomerResponse> createCustomer(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateCustomerRequest request) {
        CustomerResponse response =
                customerService.createCustomer(resolveUser(userDetails), request);
        return ApiResponse.success("Customer profile created successfully", response);
    }

    @GetMapping("/me")
    public ApiResponse<CustomerResponse> getMyProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        CustomerResponse response =
                customerService.getMyProfile(resolveUser(userDetails));
        return ApiResponse.success("Customer profile fetched successfully", response);
    }

    @PutMapping("/me")
    public ApiResponse<CustomerResponse> updateCustomer(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateCustomerRequest request) {
        CustomerResponse response =
                customerService.updateCustomer(resolveUser(userDetails), request);
        return ApiResponse.success("Customer profile updated successfully", response);
    }

    @GetMapping("/{customerId}")
    public ApiResponse<CustomerResponse> getCustomerById(
            @PathVariable Long customerId) {
        CustomerResponse response =
                customerService.getCustomerById(customerId);
        return ApiResponse.success("Customer fetched successfully", response);
    }

    @GetMapping
    public ApiResponse<List<CustomerSummaryResponse>> getAllCustomers() {
        List<CustomerSummaryResponse> response =
                customerService.getAllCustomers();
        return ApiResponse.success("Customers fetched successfully", response);
    }
}