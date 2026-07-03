package com.finshield.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletResponse {

    private Long walletId;

    private BigDecimal balance;

    private String ownerName;

    private String ownerEmail;
}