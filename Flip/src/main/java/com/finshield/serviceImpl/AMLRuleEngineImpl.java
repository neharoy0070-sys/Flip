package com.finshield.serviceImpl;

import com.finshield.Enum.AlertSeverity;
import com.finshield.service.AMLRuleEngine;
import com.finshield.service.AlertService;
import com.finshield.user.entity.Customer;
import com.finshield.user.entity.Transaction;
import com.finshield.user.repository.CustomerRepository;
import com.finshield.user.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AMLRuleEngineImpl implements AMLRuleEngine {

    private static final BigDecimal LARGE_TRANSACTION_LIMIT = BigDecimal.valueOf(50000);
    private static final int HIGH_FREQUENCY_LIMIT = 5;
    private static final long HIGH_FREQUENCY_MINUTES = 120;

    private final AlertService alertService;
    private final CustomerRepository customerRepository;
    private final TransactionRepository transactionRepository;

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void evaluateTransaction(Transaction transaction) {
        log.info("========== AML EVALUATION START ==========");
        log.info("Transaction ID: {}", transaction.getId());
        log.info("Amount: {}", transaction.getAmount());
        log.info("Wallet ID: {}", transaction.getWallet().getId());
        log.info("User ID: {}", transaction.getWallet().getUser().getId());
        Long userId = transaction.getWallet().getUser().getId();
        Customer customer = customerRepository.findByUserId(userId).orElse(null);
        if (customer == null) {
            log.warn("NO CUSTOMER FOUND for UserId={} — AML skipped", userId);
            return;
        }
        log.info("Customer found: ID={}, Name={}", customer.getId(), customer.getFullName());
        evaluateLargeTransactionRule(transaction, customer);
        evaluateHighFrequencyRule(transaction, customer);
        log.info("========== AML EVALUATION END ==========");
    }

    private void evaluateLargeTransactionRule(Transaction transaction, Customer customer) {
        log.info("--- Large Transaction Rule ---");
        log.info("Amount={}, Limit={}", transaction.getAmount(), LARGE_TRANSACTION_LIMIT);
        int result = transaction.getAmount().compareTo(LARGE_TRANSACTION_LIMIT);
        log.info("compareTo result={}", result);

        if (result > 0) {
            log.warn("RULE TRIGGERED — creating alert");
            alertService.createAlert(
                    transaction,
                    customer,
                    "Large Transaction Rule",
                    AlertSeverity.HIGH,
                    "Transaction amount exceeded ₹50,000"
            );
            log.warn("ALERT CREATED");
        } else {
            log.info("Rule NOT triggered");
        }
    }

    private void evaluateHighFrequencyRule(Transaction transaction, Customer customer) {
        LocalDateTime fromTime = LocalDateTime.now().minusMinutes(HIGH_FREQUENCY_MINUTES);
        log.info("--- High Frequency Rule ---");
        log.info("From Time: {}", fromTime);

        List<Transaction> recentTransactions = transactionRepository.findRecentTransactions(
                transaction.getWallet(), fromTime);

        log.info("Recent transaction count={}, Limit={}", recentTransactions.size(), HIGH_FREQUENCY_LIMIT);

        if (recentTransactions.size() >= HIGH_FREQUENCY_LIMIT) {
            log.warn("HIGH FREQUENCY RULE TRIGGERED — creating alert");
            alertService.createAlert(
                    transaction,
                    customer,
                    "High Frequency Transaction Rule",
                    AlertSeverity.MEDIUM,
                    "Customer performed " + recentTransactions.size()
                            + " transactions within " + HIGH_FREQUENCY_MINUTES + " minutes."
            );
            log.warn("ALERT CREATED");
        } else {
            log.info("Rule NOT triggered");
        }
    }
}
