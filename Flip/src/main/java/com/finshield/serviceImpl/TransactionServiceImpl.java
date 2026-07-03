package com.finshield.serviceImpl;

import com.finshield.Enum.TransactionStatus;
import com.finshield.Enum.TransactionType;
import com.finshield.service.AMLRuleEngine;
import com.finshield.service.TransactionService;
import com.finshield.user.entity.Transaction;
import com.finshield.user.entity.Wallet;
import com.finshield.user.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final AMLRuleEngine amlRuleEngine;

    @Override
    public Transaction saveTransaction(Wallet wallet,
                                       BigDecimal amount,
                                       TransactionType type,
                                       TransactionStatus status,
                                       String description) {
        log.info("Saving transaction. WalletId={}, Amount={}, Type={}, Status={}",
                wallet.getId(), amount, type, status);

        Transaction transaction = Transaction.builder()
                .wallet(wallet)
                .amount(amount)
                .type(type)
                .status(status)
                .balanceAfterTransaction(wallet.getBalance())
                .description(description)
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        log.info("Transaction saved. TransactionId={}, WalletId={}, Amount={}, Status={}",
                savedTransaction.getId(), wallet.getId(), amount, status);

        amlRuleEngine.evaluateTransaction(savedTransaction);
        return savedTransaction;
    }

    @Override
    public List<Transaction> getTransactions(Wallet wallet) {
        log.info("Fetching transactions for WalletId={}", wallet.getId());
        List<Transaction> transactions =
                transactionRepository.findByWalletOrderByCreatedAtDesc(wallet);
        log.info("Fetched {} transaction(s) for WalletId={}", transactions.size(), wallet.getId());
        return transactions;
    }
}
