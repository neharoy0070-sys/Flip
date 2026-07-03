package com.finshield.controller;

import com.finshield.dto.ApiResponse;
import com.finshield.dto.WalletResponse;
import com.finshield.exception.UserNotFoundException;
import com.finshield.service.WalletService;
import com.finshield.user.entity.User;
import com.finshield.user.entity.Wallet;
import com.finshield.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;
    private final UserRepository userRepository;

    private User resolveUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    private WalletResponse toResponse(Wallet wallet) {
        return WalletResponse.builder()
                .walletId(wallet.getId())
                .balance(wallet.getBalance())
                .ownerName(wallet.getUser().getFullName())
                .ownerEmail(wallet.getUser().getEmail())
                .build();
    }

    @GetMapping
    public ApiResponse<WalletResponse> getWallet(@AuthenticationPrincipal UserDetails userDetails) {
        Wallet wallet = walletService.getWallet(resolveUser(userDetails));
        return ApiResponse.success("Wallet fetched successfully", toResponse(wallet));
    }

    @PostMapping("/credit")
    public ApiResponse<WalletResponse> credit(@AuthenticationPrincipal UserDetails userDetails,
                                              @RequestParam BigDecimal amount) {
        Wallet wallet = walletService.credit(resolveUser(userDetails), amount);
        return ApiResponse.success("Wallet credited successfully", toResponse(wallet));
    }

    @PostMapping("/debit")
    public ApiResponse<WalletResponse> debit(@AuthenticationPrincipal UserDetails userDetails,
                                             @RequestParam BigDecimal amount) {
        Wallet wallet = walletService.debit(resolveUser(userDetails), amount);
        return ApiResponse.success("Wallet debited successfully", toResponse(wallet));
    }
}
