package com.finshield.serviceImpl;

import com.finshield.Enum.AlertSeverity;
import com.finshield.Enum.AlertStatus;
import com.finshield.dto.DashboardSummaryResponse;
import com.finshield.service.DashboardService;
import com.finshield.user.repository.AlertRepository;
import com.finshield.user.repository.CustomerRepository;
import com.finshield.user.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final CustomerRepository customerRepository;
    private final TransactionRepository transactionRepository;
    private final AlertRepository alertRepository;

    @Override
    public DashboardSummaryResponse getDashboardSummary() {
        log.info("Fetching AML dashboard summary");
        LocalDateTime todayStart = LocalDateTime.now().toLocalDate().atStartOfDay();
        DashboardSummaryResponse response = DashboardSummaryResponse.builder()
                .totalCustomers(customerRepository.count())
                .totalTransactions(transactionRepository.count())
                .totalAlerts(alertRepository.count())
                .openAlerts(alertRepository.countByStatus(AlertStatus.OPEN))
                .closedAlerts(alertRepository.countByStatus(AlertStatus.CLOSED))
                .highSeverityAlerts(alertRepository.countBySeverity(AlertSeverity.HIGH))
                .mediumSeverityAlerts(alertRepository.countBySeverity(AlertSeverity.MEDIUM))
                .todayTransactions(transactionRepository.countByCreatedAtAfter(todayStart))
                .todayAlerts(alertRepository.countByCreatedAtAfter(todayStart))
                .build();

        log.info("Dashboard summary fetched successfully");

        return response;
    }
}