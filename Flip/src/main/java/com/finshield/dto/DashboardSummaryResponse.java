package com.finshield.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {

    private long totalCustomers;

    private long totalTransactions;

    private long totalAlerts;

    private long openAlerts;

    private long closedAlerts;

    private long highSeverityAlerts;

    private long mediumSeverityAlerts;

    private long todayTransactions;

    private long todayAlerts;
}