package com.finshield.mapper;

import com.finshield.dto.AlertResponse;
import com.finshield.user.entity.Alert;
import org.springframework.stereotype.Component;

@Component
public class AlertMapper {

    public AlertResponse toResponse(Alert alert) {

        if (alert == null) {
            return null;
        }

        return AlertResponse.builder()
                .alertId(alert.getId())
                .transactionId(alert.getTransaction().getId())
                .customerId(alert.getCustomer().getId())
                .ruleName(alert.getRuleName())
                .severity(alert.getSeverity())
                .status(alert.getStatus())
                .description(alert.getDescription())
                .createdAt(alert.getCreatedAt())
                .build();
    }
}