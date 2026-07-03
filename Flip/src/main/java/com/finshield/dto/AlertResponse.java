package com.finshield.dto;

import com.finshield.Enum.AlertSeverity;
import com.finshield.Enum.AlertStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertResponse {

    private Long alertId;

    private Long transactionId;

    private Long customerId;

    private String ruleName;

    private AlertSeverity severity;

    private AlertStatus status;

    private String description;

    private LocalDateTime createdAt;
}