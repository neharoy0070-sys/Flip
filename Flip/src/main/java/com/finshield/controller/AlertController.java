package com.finshield.controller;

import com.finshield.Enum.AlertStatus;
import com.finshield.dto.AlertResponse;
import com.finshield.dto.ApiResponse;
import com.finshield.exception.UserNotFoundException;
import com.finshield.service.AlertService;
import com.finshield.user.entity.Customer;
import com.finshield.user.entity.User;
import com.finshield.user.repository.CustomerRepository;
import com.finshield.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    private User resolveUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    private Customer resolveCustomer(UserDetails userDetails) {
        User user = resolveUser(userDetails);
        return customerRepository.findByUser(user)
                .orElseThrow(() ->
                        new UserNotFoundException("Customer profile not found"));
    }

    @GetMapping("/my-alerts")
    public ApiResponse<List<AlertResponse>> getMyAlerts(
            @AuthenticationPrincipal UserDetails userDetails) {
        Customer customer = resolveCustomer(userDetails);
        return ApiResponse.success(
                "Alerts fetched successfully",
                alertService.getAlertsByCustomer(customer)
        );
    }

    @GetMapping
    public ApiResponse<List<AlertResponse>> getAllAlerts() {
        return ApiResponse.success(
                "All alerts fetched successfully",
                alertService.getAllAlerts()
        );
    }

    @GetMapping("/status/{status}")
    public ApiResponse<List<AlertResponse>> getAlertsByStatus(
            @PathVariable AlertStatus status) {
        return ApiResponse.success(
                "Alerts fetched successfully",
                alertService.getAlertsByStatus(status)
        );
    }

    @PutMapping("/{alertId}/status")
    public ApiResponse<AlertResponse> updateAlertStatus(
            @PathVariable Long alertId,
            @RequestParam AlertStatus status) {
        return ApiResponse.success(
                "Alert status updated successfully",
                alertService.updateAlertStatus(alertId, status)
        );
    }

    @GetMapping("/paged")
    public ApiResponse<Page<AlertResponse>> getAlerts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<AlertResponse> response =
                alertService.getAllAlerts(page, size);
        return ApiResponse.success(
                "Alerts fetched successfully",
                response
        );
    }
}