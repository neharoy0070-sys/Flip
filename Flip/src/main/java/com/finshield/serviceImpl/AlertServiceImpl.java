package com.finshield.serviceImpl;

import com.finshield.Enum.AlertSeverity;
import com.finshield.Enum.AlertStatus;
import com.finshield.dto.AlertResponse;
import com.finshield.exception.AlertNotFoundException;
import com.finshield.mapper.AlertMapper;
import com.finshield.service.AlertService;
import com.finshield.user.entity.Alert;
import com.finshield.user.entity.Customer;
import com.finshield.user.entity.Transaction;
import com.finshield.user.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlertServiceImpl implements AlertService {

    private final AlertRepository alertRepository;
    private final AlertMapper alertMapper;

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public AlertResponse createAlert(
            Transaction transaction,
            Customer customer,
            String ruleName,
            AlertSeverity severity,
            String description) {
        log.info("Creating AML Alert for Customer ID: {}", customer.getId());
        Alert alert = Alert.builder()
                .transaction(transaction)
                .customer(customer)
                .ruleName(ruleName)
                .severity(severity)
                .status(AlertStatus.OPEN)
                .description(description)
                .build();
        Alert savedAlert = alertRepository.saveAndFlush(alert);
        log.info("Alert saved successfully. Alert ID = {}", savedAlert.getId());
        log.info("AML Alert Created Successfully. Alert ID: {}", savedAlert.getId());
        return alertMapper.toResponse(savedAlert);
    }

    @Override
    public List<AlertResponse> getAlertsByCustomer(Customer customer) {
        return alertRepository.findByCustomerOrderByCreatedAtDesc(customer)
                .stream()
                .map(alertMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AlertResponse> getAllAlerts() {
        return alertRepository.findAll()
                .stream()
                .map(alertMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AlertResponse> getAlertsByStatus(AlertStatus status) {
        return alertRepository.findByStatus(status)
                .stream()
                .map(alertMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AlertResponse updateAlertStatus(Long alertId,
                                           AlertStatus status) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() ->
                        new AlertNotFoundException("Alert not found"));
        alert.setStatus(status);
        Alert updatedAlert = alertRepository.save(alert);
        log.info("Alert {} status changed to {}", alertId, status);
        return alertMapper.toResponse(updatedAlert);
    }

    @Override
    public Page<AlertResponse> getAllAlerts(int page, int size) {
        log.info("Fetching alerts. Page={}, Size={}", page, size);
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
        return alertRepository.findAll(pageable)
                .map(alertMapper::toResponse);
    }
}