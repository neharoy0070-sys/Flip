package com.finshield.dto;

import com.finshield.Enum.TransactionStatus;
import com.finshield.Enum.TransactionType;
import com.finshield.user.entity.Transaction;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class TransactionResponse {

    private Long transactionId;
    private BigDecimal amount;
    private TransactionType type;
    private TransactionStatus status;
    private BigDecimal balanceAfterTransaction;
    private String description;
    private LocalDateTime createdAt;

    public static TransactionResponse from(Transaction t) {
        return TransactionResponse.builder()
                .transactionId(t.getId())
                .amount(t.getAmount())
                .type(t.getType())
                .status(t.getStatus())
                .balanceAfterTransaction(t.getBalanceAfterTransaction())
                .description(t.getDescription())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
