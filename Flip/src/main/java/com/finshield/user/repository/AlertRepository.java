package com.finshield.user.repository;

import com.finshield.Enum.AlertSeverity;
import com.finshield.Enum.AlertStatus;
import com.finshield.user.entity.Alert;
import com.finshield.user.entity.Customer;
import com.finshield.user.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByCustomerOrderByCreatedAtDesc(Customer customer);

    List<Alert> findByStatus(AlertStatus status);

    List<Alert> findByTransaction(Transaction transaction);

    long countByStatus(AlertStatus status);

    long countBySeverity(AlertSeverity severity);

    long countByCreatedAtAfter(LocalDateTime dateTime);
}