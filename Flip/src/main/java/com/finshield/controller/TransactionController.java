package com.finshield.controller;

import com.finshield.dto.ApiResponse;
import com.finshield.dto.TransactionResponse;
import com.finshield.service.TransactionService;
import com.finshield.service.WalletService;
import com.finshield.user.entity.User;
import com.finshield.user.entity.Wallet;
import com.finshield.user.repository.TransactionRepository;
import com.finshield.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final WalletService walletService;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    private User resolveUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ApiResponse<List<TransactionResponse>> getTransactions(
            @AuthenticationPrincipal UserDetails userDetails) {
        Wallet wallet = walletService.getWallet(resolveUser(userDetails));
        List<TransactionResponse> transactions = transactionService.getTransactions(wallet)
                .stream()
                .map(TransactionResponse::from)
                .toList();
        return ApiResponse.success("Transactions fetched successfully", transactions);
    }

    @GetMapping("/debug/recent")
    public ApiResponse<List<TransactionResponse>> recentTransactions(
            @AuthenticationPrincipal UserDetails userDetails) {
        Wallet wallet = walletService.getWallet(resolveUser(userDetails));
        LocalDateTime fromTime = LocalDateTime.now().minusMinutes(60);
        List<TransactionResponse> transactions = transactionRepository
                .findRecentTransactions(wallet, fromTime)
                .stream()
                .map(TransactionResponse::from)
                .toList();
        return ApiResponse.success("Recent transactions fetched (last 60 min)", transactions);
    }
}
