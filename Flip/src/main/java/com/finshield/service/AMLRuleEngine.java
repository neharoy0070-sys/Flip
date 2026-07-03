package com.finshield.service;

import com.finshield.user.entity.Transaction;

public interface AMLRuleEngine {

    void evaluateTransaction(Transaction transaction);
}
