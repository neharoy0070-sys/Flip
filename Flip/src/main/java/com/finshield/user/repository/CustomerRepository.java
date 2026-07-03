package com.finshield.user.repository;

import com.finshield.user.entity.Customer;
import com.finshield.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByUser(User user);

    Optional<Customer> findByUserId(Long userId);

    Optional<Customer> findByPanNumber(String panNumber);

    Optional<Customer> findByAadhaarNumber(String aadhaarNumber);

    Optional<Customer> findByPhoneNumber(String phoneNumber);

    boolean existsByPanNumber(String panNumber);

    boolean existsByAadhaarNumber(String aadhaarNumber);

    boolean existsByPhoneNumber(String phoneNumber);
}