package com.finshield.service;

import com.finshield.dto.CreateCustomerRequest;
import com.finshield.dto.UpdateCustomerRequest;
import com.finshield.dto.CustomerResponse;
import com.finshield.dto.CustomerSummaryResponse;
import com.finshield.user.entity.User;

import java.util.List;

public interface CustomerService {

    CustomerResponse createCustomer(User user, CreateCustomerRequest request);

    CustomerResponse getMyProfile(User user);

    CustomerResponse updateCustomer(User user, UpdateCustomerRequest request);

    CustomerResponse getCustomerById(Long customerId);

    List<CustomerSummaryResponse> getAllCustomers();
}
