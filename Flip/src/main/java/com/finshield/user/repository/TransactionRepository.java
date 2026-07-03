package com.finshield.user.repository;

import com.finshield.user.entity.Transaction;
import com.finshield.user.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByWalletOrderByCreatedAtDesc(Wallet wallet);

    @Query("""
       SELECT t
       FROM Transaction t
       WHERE t.wallet = :wallet
       AND t.createdAt >= :time
       """)
    List<Transaction> findRecentTransactions(
            @Param("wallet") Wallet wallet,
            @Param("time") LocalDateTime time
    );
    long countByCreatedAtAfter(LocalDateTime dateTime);
}
