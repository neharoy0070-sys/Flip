package com.finshield.mapper;

import com.finshield.dto.WalletResponse;
import com.finshield.user.entity.Wallet;
import org.springframework.stereotype.Component;

@Component
public class WalletMapper {

    public WalletResponse toResponse(Wallet wallet) {
        return WalletResponse.builder()
                .walletId(wallet.getId())
                .balance(wallet.getBalance())
                .ownerName(wallet.getUser().getFullName())
                .ownerEmail(wallet.getUser().getEmail())
                .build();
    }
}
