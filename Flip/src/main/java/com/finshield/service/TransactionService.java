package com.finshield.service;

import com.finshield.Enum.TransactionStatus;
import com.finshield.Enum.TransactionType;
import com.finshield.user.entity.Transaction;
import com.finshield.user.entity.Wallet;

import java.math.BigDecimal;
import java.util.List;

public interface TransactionService {

    Transaction saveTransaction(Wallet wallet, BigDecimal amount, TransactionType type,
                                TransactionStatus status, String description);

    List<Transaction> getTransactions(Wallet wallet);
}
