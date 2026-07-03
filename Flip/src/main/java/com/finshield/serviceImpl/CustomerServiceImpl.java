package com.finshield.serviceImpl;

import com.finshield.dto.CreateCustomerRequest;
import com.finshield.dto.UpdateCustomerRequest;
import com.finshield.dto.CustomerResponse;
import com.finshield.dto.CustomerSummaryResponse;
import com.finshield.exception.UserAlreadyExistsException;
import com.finshield.exception.UserNotFoundException;
import com.finshield.mapper.CustomerMapper;
import com.finshield.service.CustomerService;
import com.finshield.user.entity.Customer;
import com.finshield.user.entity.User;
import com.finshield.user.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    @Override
    public CustomerResponse createCustomer(User user, CreateCustomerRequest request) {
        log.info("Creating customer profile for user: {}", user.getEmail());

        if (customerRepository.findByUser(user).isPresent()) {
            throw new UserAlreadyExistsException("Customer profile already exists.");
        }
        if (customerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new UserAlreadyExistsException("Phone number already exists.");
        }
        if (customerRepository.existsByPanNumber(request.getPanNumber())) {
            throw new UserAlreadyExistsException("PAN number already exists.");
        }
        if (customerRepository.existsByAadhaarNumber(request.getAadhaarNumber())) {
            throw new UserAlreadyExistsException("Aadhaar number already exists.");
        }

        Customer customer = customerMapper.toEntity(request, user);
        Customer savedCustomer = customerRepository.save(customer);
        log.info("Customer profile created successfully. Customer ID: {}", savedCustomer.getId());
        return customerMapper.toResponse(savedCustomer);
    }

    @Override
    public CustomerResponse getMyProfile(User user) {
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new UserNotFoundException("Customer profile not found."));
        return customerMapper.toResponse(customer);
    }

    @Override
    public CustomerResponse updateCustomer(User user, UpdateCustomerRequest request) {
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new UserNotFoundException("Customer profile not found."));
        customerMapper.updateEntity(customer, request);
        Customer updatedCustomer = customerRepository.save(customer);
        log.info("Customer profile updated successfully. Customer ID: {}", updatedCustomer.getId());
        return customerMapper.toResponse(updatedCustomer);
    }

    @Override
    public CustomerResponse getCustomerById(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new UserNotFoundException("Customer not found."));
        return customerMapper.toResponse(customer);
    }

    @Override
    public List<CustomerSummaryResponse> getAllCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(customerMapper::toSummary)
                .collect(Collectors.toList());
    }
}
