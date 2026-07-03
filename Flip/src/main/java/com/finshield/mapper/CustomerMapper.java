package com.finshield.mapper;

import com.finshield.dto.CreateCustomerRequest;
import com.finshield.dto.UpdateCustomerRequest;
import com.finshield.dto.CustomerResponse;
import com.finshield.dto.CustomerSummaryResponse;
import com.finshield.user.entity.Customer;
import com.finshield.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public Customer toEntity(CreateCustomerRequest request, User user) {
        return Customer.builder()
                .user(user)
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .dateOfBirth(request.getDateOfBirth())
                .panNumber(request.getPanNumber())
                .aadhaarNumber(request.getAadhaarNumber())
                .address(request.getAddress())
                .occupation(request.getOccupation())
                .nationality(request.getNationality())
                .build();
    }

    public CustomerResponse toResponse(Customer customer) {
        return CustomerResponse.builder()
                .customerId(customer.getId())
                .userId(customer.getUser().getId())
                .fullName(customer.getFullName())
                .phoneNumber(customer.getPhoneNumber())
                .dateOfBirth(customer.getDateOfBirth())
                .panNumber(customer.getPanNumber())
                .aadhaarNumber(customer.getAadhaarNumber())
                .address(customer.getAddress())
                .occupation(customer.getOccupation())
                .nationality(customer.getNationality())
                .kycStatus(customer.getKycStatus())
                .riskCategory(customer.getRiskCategory())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }

    public CustomerSummaryResponse toSummary(Customer customer) {
        return CustomerSummaryResponse.builder()
                .customerId(customer.getId())
                .fullName(customer.getFullName())
                .phoneNumber(customer.getPhoneNumber())
                .kycStatus(customer.getKycStatus())
                .riskCategory(customer.getRiskCategory())
                .build();
    }

    public void updateEntity(Customer customer, UpdateCustomerRequest request) {
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setAddress(request.getAddress());
        customer.setOccupation(request.getOccupation());
        customer.setNationality(request.getNationality());
    }
}
