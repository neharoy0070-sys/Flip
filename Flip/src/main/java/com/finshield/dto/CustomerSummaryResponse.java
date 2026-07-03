package com.finshield.dto;

import com.finshield.Enum.KycStatus;
import com.finshield.Enum.RiskCategory;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerSummaryResponse {

    private Long customerId;

    private String fullName;

    private String phoneNumber;

    private KycStatus kycStatus;

    private RiskCategory riskCategory;
}