package com.finshield.service;

import com.finshield.Enum.AlertSeverity;
import com.finshield.Enum.AlertStatus;
import com.finshield.dto.AlertResponse;
import com.finshield.user.entity.Customer;
import com.finshield.user.entity.Transaction;
import org.springframework.data.domain.Page;

import java.util.List;

public interface AlertService {

    AlertResponse createAlert(
            Transaction transaction,
            Customer customer,
            String ruleName,
            AlertSeverity severity,
            String description
    );

    List<AlertResponse> getAlertsByCustomer(Customer customer);

    List<AlertResponse> getAllAlerts();
    Page<AlertResponse> getAllAlerts(int page, int size);

    List<AlertResponse> getAlertsByStatus(AlertStatus status);

    AlertResponse updateAlertStatus(Long alertId, AlertStatus status);
}