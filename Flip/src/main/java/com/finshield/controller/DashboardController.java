package com.finshield.controller;

import com.finshield.dto.ApiResponse;
import com.finshield.dto.DashboardSummaryResponse;
import com.finshield.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ApiResponse<DashboardSummaryResponse> getDashboardSummary() {
        DashboardSummaryResponse response =
                dashboardService.getDashboardSummary();
        return ApiResponse.success(
                "Dashboard summary fetched successfully",
                response
        );
    }
}