package com.finshield.dto;

import com.finshield.Enum.KycStatus;
import com.finshield.Enum.RiskCategory;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerResponse {

    private Long customerId;

    private Long userId;

    private String fullName;

    private String phoneNumber;

    private LocalDate dateOfBirth;

    private String panNumber;

    private String aadhaarNumber;

    private String address;

    private String occupation;

    private String nationality;

    private KycStatus kycStatus;

    private RiskCategory riskCategory;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}