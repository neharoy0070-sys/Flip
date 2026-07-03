package com.finshield.serviceImpl;

import com.finshield.Enum.TransactionStatus;
import com.finshield.Enum.TransactionType;
import com.finshield.exception.InsufficientBalanceException;
import com.finshield.exception.WalletNotFoundException;
import com.finshield.service.TransactionService;
import com.finshield.service.WalletService;
import com.finshield.user.entity.User;
import com.finshield.user.entity.Wallet;
import com.finshield.user.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final TransactionService transactionService;

    @Override
    public Wallet getWallet(User user) {
        log.info("Searching wallet for UserId={}, Email={}", user.getId(), user.getEmail());
        return walletRepository.findByUserId(user.getId())
                .orElseThrow(() -> {
                    log.error("Wallet not found for UserId={}, Email={}",
                            user.getId(), user.getEmail());
                    return new WalletNotFoundException(
                            "Wallet not found for user: " + user.getEmail());
                });
    }

    @Override
    public Wallet createWallet(User user) {
        log.info("Creating wallet for UserId={}, Email={}",
                user.getId(), user.getEmail());
        Wallet wallet = Wallet.builder()
                .user(user)
                .balance(BigDecimal.ZERO)
                .build();
        Wallet savedWallet = walletRepository.save(wallet);
        log.info("Wallet created successfully. WalletId={}, UserId={}",
                savedWallet.getId(), user.getId());
        return savedWallet;
    }

    @Override
    public Wallet credit(User user, BigDecimal amount) {
        log.info("Credit request received. UserId={}, Amount={}",
                user.getId(), amount);
        Wallet wallet = getWallet(user);
        wallet.setBalance(wallet.getBalance().add(amount));
        Wallet updatedWallet = walletRepository.save(wallet);
        transactionService.saveTransaction(
                updatedWallet,
                amount,
                TransactionType.CREDIT,
                TransactionStatus.SUCCESS,
                "Wallet credited"
        );

        log.info("Wallet credited successfully. UserId={}, NewBalance={}",
                user.getId(), updatedWallet.getBalance());
        return updatedWallet;
    }

    @Override
    public Wallet debit(User user, BigDecimal amount) {
        log.info("Debit request received. UserId={}, Amount={}",
                user.getId(), amount);
        Wallet wallet = getWallet(user);
        if (wallet.getBalance().compareTo(amount) < 0) {
            log.warn(
                    "Insufficient balance. UserId={}, CurrentBalance={}, RequestedAmount={}",
                    user.getId(),
                    wallet.getBalance(),
                    amount
            );

            transactionService.saveTransaction(
                    wallet,
                    amount,
                    TransactionType.DEBIT,
                    TransactionStatus.FAILED,
                    "Insufficient balance"
            );
            throw new InsufficientBalanceException("Insufficient balance");
        }
        wallet.setBalance(wallet.getBalance().subtract(amount));
        Wallet updatedWallet = walletRepository.save(wallet);
        transactionService.saveTransaction(
                updatedWallet,
                amount,
                TransactionType.DEBIT,
                TransactionStatus.SUCCESS,
                "Wallet debited"
        );

        log.info("Wallet debited successfully. UserId={}, RemainingBalance={}",
                user.getId(), updatedWallet.getBalance());
        return updatedWallet;
    }
}