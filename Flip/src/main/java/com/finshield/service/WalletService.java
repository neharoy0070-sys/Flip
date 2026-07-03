package com.finshield.service;

import com.finshield.user.entity.User;
import com.finshield.user.entity.Wallet;

import java.math.BigDecimal;

public interface WalletService {

    Wallet getWallet(User user);

    Wallet createWallet(User user);

    Wallet credit(User user, BigDecimal amount);

    Wallet debit(User user, BigDecimal amount);
}
