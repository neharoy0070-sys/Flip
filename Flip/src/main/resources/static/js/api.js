/*
  FINSHIELD Enterprise API Client & Mock Data Service
*/

const FinShieldAPI = (function() {
  const API_BASE_URL = '/api';

  // Mock Database State
  const mockDB = {
    kpis: {
      totalAlerts: 4829,
      openAlerts: 1240,
      highRiskAlerts: 127,
      criticalAlerts: 42,
      openCases: 89,
      pendingKYC: 312,
      sarsPending: 18,
      customersUnderInvestigation: 64
    },

    alerts: [
      {
        alertId: "ALR-10283",
        customerId: "CUST-99201",
        customerName: "Vikramaditya Rao",
        customerRisk: "HIGH",
        ruleName: "Rapid Movement of Funds",
        amount: "₹1,780,100",
        rawAmount: 1780100,
        severity: "CRITICAL",
        status: "OPEN",
        created: "2026-08-17 09:42",
        assignedInvestigator: "Sarah Jenkins",
        sla: "18h",
        ruleDetails: {
          ruleName: "Rapid Movement of Funds Rule",
          threshold: "Inbound transfers exceeding ₹500,000 passed through within 1 hour",
          observed: "₹1,780,100 received across 4 transfers and 98.2% outbound within 12 minutes",
          result: "TRIGGERED"
        }
      },
      {
        alertId: "ALR-10284",
        customerId: "CUST-99104",
        customerName: "Neha Sharma",
        customerRisk: "HIGH",
        ruleName: "Large Transaction Threshold",
        amount: "₹100,000",
        rawAmount: 100000,
        severity: "HIGH",
        status: "OPEN",
        created: "2026-08-17 09:15",
        assignedInvestigator: "Unassigned",
        sla: "22h",
        ruleDetails: {
          ruleName: "Large Single Transaction Rule",
          threshold: "₹50,000 single debit/credit",
          observed: "₹100,000 single transfer to unverified wallet",
          result: "TRIGGERED"
        }
      },
      {
        alertId: "ALR-10285",
        customerId: "CUST-88392",
        customerName: "Global Tech Solutions Ltd",
        customerRisk: "HIGH",
        ruleName: "PEP & Sanction Screening Match",
        amount: "₹12,400,000",
        rawAmount: 12400000,
        severity: "CRITICAL",
        status: "ESCALATED",
        created: "2026-08-17 08:30",
        assignedInvestigator: "Marcus Vance",
        sla: "4h",
        ruleDetails: {
          ruleName: "PEP / Sanctions Direct Match",
          threshold: "Fuzzy Match > 85% against OFAC/UN lists",
          observed: "Direct match (92% similarity) on Director Beneficial Owner",
          result: "TRIGGERED"
        }
      },
      {
        alertId: "ALR-10286",
        customerId: "CUST-77401",
        customerName: "Ananya Gupta",
        customerRisk: "LOW",
        ruleName: "Low KYC Limit Exceeded",
        amount: "₹450,000",
        rawAmount: 450000,
        severity: "MEDIUM",
        status: "OPEN",
        created: "2026-08-17 07:50",
        assignedInvestigator: "Unassigned",
        sla: "24h",
        ruleDetails: {
          ruleName: "Low KYC Volume Threshold",
          threshold: "Monthly transactions > ₹100,000 for KYC Level 1",
          observed: "₹450,000 accumulated monthly volume",
          result: "TRIGGERED"
        }
      },
      {
        alertId: "ALR-10287",
        customerId: "CUST-66291",
        customerName: "Rajesh Verma",
        customerRisk: "MEDIUM",
        ruleName: "High Frequency Structuring",
        amount: "₹95,000",
        rawAmount: 95000,
        severity: "HIGH",
        status: "INVESTIGATING",
        created: "2026-08-17 06:10",
        assignedInvestigator: "Sarah Jenkins",
        sla: "14h",
        ruleDetails: {
          ruleName: "Structuring Below Mandatory CTR Threshold",
          threshold: "> 5 transactions under ₹100,000 within 24h",
          observed: "8 transactions between ₹45,000 and ₹49,900 in 6h",
          result: "TRIGGERED"
        }
      },
      {
        alertId: "ALR-10288",
        customerId: "CUST-55102",
        customerName: "Aarav Patel",
        customerRisk: "LOW",
        ruleName: "High Risk Jurisdiction Transfer",
        amount: "₹350,000",
        rawAmount: 350000,
        severity: "MEDIUM",
        status: "OPEN",
        created: "2026-08-17 05:20",
        assignedInvestigator: "Unassigned",
        sla: "20h",
        ruleDetails: {
          ruleName: "FATF High-Risk Jurisdiction Rule",
          threshold: "Direct wire transfer to FATF grey/black listed territory",
          observed: "Wire transfer to offshore account in jurisdiction #104",
          result: "TRIGGERED"
        }
      }
    ],

    customers: {
      "CUST-99201": {
        customerId: "CUST-99201",
        name: "Vikramaditya Rao",
        storedSystemClassification: "LOW",
        riskScore: "Not Available (Stored Classification)",
        kycStatus: "TIER 1 (PENDING VERIFICATION)",
        accountStatus: "ACTIVE (UNDER MONITORING)",
        occupation: "Independent Software Consultant",
        nationality: "Indian",
        address: "402 Bayview Towers, Bandra West, Mumbai",
        totalTransactions: "₹1,780,100",
        totalAlerts: 2,
        totalCases: 1,
        storedRiskRationale: "Original rationale for the stored risk classification is not available in the provided investigation data.",
        positiveObservations: [
          "Regular monthly consultant fee credits from registered IT firms since May 2021",
          "Consistent utility and tax payments via net banking",
          "No prior adverse media or law enforcement inquiries registered"
        ],
        negativeObservations: [
          "Unusual 400% surge in transaction velocity over the past 48 hours",
          "Rapid pass-through of ₹1,780,100 to unverified cryptocurrency exchange wallets",
          "KYC Level 1 documentation expired on July 31, 2026"
        ]
      }
    },

    transactions: [
      { txnId: "TXN-88401", date: "2026-08-17 09:15:22", type: "CREDIT", amount: "₹500,000", currency: "INR", status: "COMPLETED", wallet: "HDFC Primary Bank", counterparty: "Alpha Trading Corp" },
      { txnId: "TXN-88402", date: "2026-08-17 09:18:04", type: "DEBIT", amount: "₹490,000", currency: "INR", status: "COMPLETED", wallet: "Nexus Crypto Wallet", counterparty: "Nexus Crypto Ltd" },
      { txnId: "TXN-88403", date: "2026-08-17 09:22:11", type: "CREDIT", amount: "₹400,000", currency: "INR", status: "COMPLETED", wallet: "HDFC Primary Bank", counterparty: "Overseas Remittance LLC" },
      { txnId: "TXN-88404", date: "2026-08-17 09:25:40", type: "DEBIT", amount: "₹390,000", currency: "INR", status: "COMPLETED", wallet: "P2P Digital Wallet", counterparty: "Unknown Wallet #0x82a1" },
      { txnId: "TXN-88405", date: "2026-08-17 09:30:00", type: "CREDIT", amount: "₹880,100", currency: "INR", status: "COMPLETED", wallet: "HDFC Primary Bank", counterparty: "Horizon Tech Consultancy" }
    ],

    aiPatternAnalysis: {
      overallRisk: "HIGH",
      detectedPattern: "Rapid Movement of Funds & High-Velocity Structuring",
      explanation: "Customer received ₹1,780,100 across 3 rapid inbound credits and immediately transferred 98.2% of total funds to 2 external unverified wallets within 12 minutes of deposit.",
      suspiciousBehaviors: [
        { title: "High-Velocity Pass-Through", desc: "98.2% fund liquidation within 12 minutes of receipt." },
        { title: "Unverified Endpoint Destination", desc: "Outbound transfers directed to non-KYC crypto wallet address #0x82a1." },
        { title: "KYC Tier Mismatch", desc: "Volume (₹1.78M) exceeds Tier 1 threshold (₹100k) by 1,780%." }
      ],
      recommendation: "Review recent transactions, request formal proof of source of funds, and elevate customer to High-Risk KYC Tier 3 pending SAR determination.",
      metadata: {
        indicator: "AI GENERATED",
        timestamp: "2026-08-17 09:44:12",
        confidence: "88%",
        source: "AI Transaction Pattern Engine v3.4"
      }
    },

    cases: [
      {
        caseId: "CASE-1784086842884",
        customerId: "CUST-99201",
        customerName: "Vikramaditya Rao",
        customerRisk: "HIGH",
        priority: "CRITICAL",
        status: "INVESTIGATING",
        alertsCount: 2,
        assignedInvestigator: "Sarah Jenkins",
        created: "2026-08-17 09:30",
        sla: "18h remaining"
      },
      {
        caseId: "CASE-1784086842885",
        customerId: "CUST-88392",
        customerName: "Global Tech Solutions Ltd",
        customerRisk: "CRITICAL",
        priority: "CRITICAL",
        status: "ESCALATED",
        alertsCount: 4,
        assignedInvestigator: "Marcus Vance",
        created: "2026-08-17 08:15",
        sla: "4h remaining"
      },
      {
        caseId: "CASE-1784086842886",
        customerId: "CUST-99104",
        customerName: "Neha Sharma",
        customerRisk: "HIGH",
        priority: "HIGH",
        status: "OPEN",
        alertsCount: 1,
        assignedInvestigator: "Unassigned",
        created: "2026-08-17 09:42",
        sla: "22h remaining"
      },
      {
        caseId: "CASE-1784086842887",
        customerId: "CUST-66291",
        customerName: "Rajesh Verma",
        customerRisk: "MEDIUM",
        priority: "MEDIUM",
        status: "SAR_REVIEW",
        alertsCount: 3,
        assignedInvestigator: "Sarah Jenkins",
        created: "2026-08-16 14:20",
        sla: "6h remaining"
      }
    ],

    nextBestActions: {
      primary: "Review Recent Transactions & Obtain Source of Funds Documentation",
      confidence: "88%",
      actions: [
        { id: 1, title: "Complete Pending KYC Level 2 Verification", urgency: "HIGH", actionKey: "KYC_REQ" },
        { id: 2, title: "Request Proof of Source of Funds for TXN-88401", urgency: "MEDIUM", actionKey: "SOF_REQ" },
        { id: 3, title: "Generate SAR Draft for Compliance Committee Review", urgency: "MEDIUM", actionKey: "GEN_SAR" }
      ]
    },

    ragDocs: [
      { id: "DOC-101", title: "FATF_Guidance_Virtual_Assets_2023.pdf", chunks: 148, status: "INDEXED", uploaded: "2026-08-01" },
      { id: "DOC-102", title: "FinCEN_SAR_Filing_Instructions_2024.pdf", chunks: 92, status: "INDEXED", uploaded: "2026-08-05" },
      { id: "DOC-103", title: "Internal_AML_Investigation_Policy_v4.2.pdf", chunks: 45, status: "INDEXED", uploaded: "2026-08-10" }
    ],

    auditLogs: [
      { timestamp: "09:42:10", user: "System Engine", action: "ALERT_GENERATED", objectId: "ALR-10283", details: "Rapid Movement of Funds Rule triggered" },
      { timestamp: "09:44:05", user: "System Router", action: "CASE_CREATED", objectId: "CASE-1784086842884", details: "Assigned to Senior Investigator Sarah Jenkins" },
      { timestamp: "09:51:22", user: "AI Engine", action: "AI_PATTERN_ANALYSIS", objectId: "CUST-99201", details: "Generated pattern analysis (88% confidence)" },
      { timestamp: "09:54:15", user: "Sarah Jenkins", action: "COPILOT_QUERY", objectId: "CUST-99201", details: "Asked copilot rationale for stored LOW risk classification" },
      { timestamp: "10:02:40", user: "Sarah Jenkins", action: "STATUS_UPDATE", objectId: "CASE-1784086842884", details: "Status updated from OPEN to INVESTIGATING" }
    ],

    amlRules: [
      { id: 1, name: "Large Single Transaction", threshold: "₹50,000", severity: "HIGH", triggered: 1284, confirmed: 231, falsePositiveRate: "82%", status: "ACTIVE" },
      { id: 2, name: "Rapid Movement of Funds", threshold: "3 transfers / 1 hour", severity: "CRITICAL", triggered: 842, confirmed: 261, falsePositiveRate: "69%", status: "ACTIVE" },
      { id: 3, name: "Low KYC Limit Exceeded", threshold: "₹100,000 monthly", severity: "MEDIUM", triggered: 513, confirmed: 62, falsePositiveRate: "88%", status: "ACTIVE" },
      { id: 4, name: "Structuring / Smurfing", threshold: "5 txns < CTR limit", severity: "HIGH", triggered: 619, confirmed: 198, falsePositiveRate: "68%", status: "ACTIVE" },
      { id: 5, name: "PEP Direct Match", threshold: "Fuzzy > 85%", severity: "CRITICAL", triggered: 94, confirmed: 41, falsePositiveRate: "56%", status: "ACTIVE" }
    ]
  };

  // Generic REST Helper with fallback
  async function fetchAPI(endpoint, options = {}) {
    try {
      const response = await fetch(API_BASE_URL + endpoint, {
        headers: { 'Content-Type': 'application/json' },
        ...options
      });
      if (response.ok) {
        const json = await response.json();
        return json.data || json;
      }
    } catch (err) {
      console.warn(`[FinShield API] Backend endpoint ${endpoint} unavailable, using enterprise mock provider.`, err);
    }
    return getMockFallback(endpoint, options);
  }

  function getMockFallback(endpoint, options) {
    if (endpoint.startsWith('/dashboard')) return mockDB.kpis;
    if (endpoint.startsWith('/alerts')) return mockDB.alerts;
    if (endpoint.startsWith('/customers')) return mockDB.customers["CUST-99201"];
    if (endpoint.startsWith('/transactions')) return mockDB.transactions;
    if (endpoint.startsWith('/cases')) return mockDB.cases;
    if (endpoint.startsWith('/ai/pattern')) return mockDB.aiPatternAnalysis;
    if (endpoint.startsWith('/ai/next-action')) return mockDB.nextBestActions;
    if (endpoint.startsWith('/rag')) return mockDB.ragDocs;
    if (endpoint.startsWith('/audit')) return mockDB.auditLogs;
    if (endpoint.startsWith('/rules')) return mockDB.amlRules;
    return { success: true, message: "Mock response" };
  }

  return {
    getKPIs: () => fetchAPI('/dashboard/kpis'),
    getAlerts: () => fetchAPI('/alerts'),
    getAlertById: (id) => mockDB.alerts.find(a => a.alertId === id) || mockDB.alerts[0],
    getCustomerById: (id) => mockDB.customers[id] || mockDB.customers["CUST-99201"],
    getTransactions: () => fetchAPI('/transactions'),
    getCases: () => fetchAPI('/cases'),
    getAIPattern: () => fetchAPI('/ai/pattern'),
    getNextBestActions: () => fetchAPI('/ai/next-action'),
    getRAGDocs: () => fetchAPI('/rag'),
    getAuditLogs: () => fetchAPI('/audit'),
    getAMLRules: () => fetchAPI('/rules'),
    
    // AI Copilot Query Handler
    askAICopilot: async function(question) {
      await new Promise(r => setTimeout(r, 600)); // simulate AI response latency
      const qLower = question.toLowerCase();

      if (qLower.includes('low risk') || qLower.includes('why was this customer')) {
        return {
          aiFinding: "LOW (Stored System Classification)",
          reasoning: `The customer has a stored system risk classification of LOW. 

The original rationale for that classification is NOT available in the provided database.

Observed investigation information includes:
• 2 Alerts triggered (Rapid Movement of Funds, Low KYC Limit Exceeded)
• 1 Open Case (CASE-1784086842884)
• ₹1,780,100 total transaction volume over 48h
• Rapid pass-through of funds to unverified crypto wallet #0x82a1

[CRITICAL AML PRINCIPLE]: These recent observations should NOT be interpreted as the cause for the stored LOW classification unless the backend risk engine explicitly re-calculates and updates the stored classification.`,
          evidence: [
            "Alert ALR-10283 (Rapid Movement of Funds)",
            "Transaction TXN-88402 (₹490,000 to Nexus Crypto)",
            "KYC Tier 1 Exceeded"
          ],
          recommendedAction: "Request proof of source of funds and elevate customer to High-Risk Tier 3.",
          confidence: "88%"
        };
      }

      if (qLower.includes('trigger') || qLower.includes('why was this alert')) {
        return {
          aiFinding: "CRITICAL (Rule Triggered)",
          reasoning: "Alert ALR-10283 was triggered by the Rapid Movement of Funds Rule. Threshold required inbound deposits > ₹500,000 to be held for at least 1 hour. Observed behavior showed ₹1,780,100 deposited and 98.2% liquidated within 12 minutes.",
          evidence: [
            "Rule: Rapid Movement of Funds Rule",
            "Observed: 98.2% fund pass-through in 12 mins",
            "Threshold: > 1 hour holding period"
          ],
          recommendedAction: "Freeze unverified wallet transfers pending SAR decision.",
          confidence: "94%"
        };
      }

      return {
        aiFinding: "MEDIUM (General Observation)",
        reasoning: `Analysis of case CASE-1784086842884 indicates high velocity transfers inconsistent with customer's registered profile as an Independent Software Consultant.`,
        evidence: ["TXN-88401 through TXN-88405", "Customer Profile CUST-99201"],
        recommendedAction: "Proceed with SAR drafting and formal investigator escalation.",
        confidence: "82%"
      };
    }
  };
})();
