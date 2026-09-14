/*
  FINSHIELD Enterprise AML Platform
  Main UI Application Controller & Module Engine
*/

document.addEventListener('DOMContentLoaded', () => {
  FinShieldApp.init();
});

const FinShieldApp = (function() {
  let currentModule = 'dashboard';
  let isSidebarCollapsed = false;
  let activeCaseId = 'CASE-1784086842884';
  let activeAlertId = 'ALR-10283';
  let activeCustomerId = 'CUST-99201';

  function init() {
    setupEventListeners();
    setupKeyboardShortcuts();
    renderModule(currentModule);
    updateNotificationBadge();
  }

  function setupEventListeners() {
    // Sidebar Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const mod = item.getAttribute('data-module');
        if (mod) {
          switchModule(mod);
        }
      });
    });

    // Sidebar Toggle Button
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        isSidebarCollapsed = !isSidebarCollapsed;
        document.querySelector('.app-sidebar').classList.toggle('collapsed', isSidebarCollapsed);
      });
    }

    // Global Search Trigger
    const searchBtn = document.getElementById('global-search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', openSearchModal);
    }

    // Copilot Drawer Shortcut Button
    const copilotBtn = document.getElementById('copilot-shortcut-btn');
    if (copilotBtn) {
      copilotBtn.addEventListener('click', toggleCopilotDrawer);
    }
  }

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl + K or Cmd + K -> Search Modal
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearchModal();
      }
      // Esc -> Close Modals / Drawers
      if (e.key === 'Escape') {
        closeModals();
      }
    });
  }

  function switchModule(moduleName) {
    currentModule = moduleName;
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-module') === moduleName);
    });

    const pageTitleEl = document.getElementById('header-page-title');
    if (pageTitleEl) {
      pageTitleEl.innerHTML = formatModuleTitle(moduleName);
    }

    renderModule(moduleName);
  }

  function formatModuleTitle(name) {
    const titles = {
      dashboard: '<i class="fas fa-chart-line"></i> AML Operations Dashboard',
      alerts: '<i class="fas fa-bell"></i> Alert Management',
      alert_investigation: '<i class="fas fa-search-dollar"></i> Alert Investigation',
      cases: '<i class="fas fa-briefcase"></i> Case Management',
      case_workspace: '<i class="fas fa-microscope"></i> Case Investigation Workspace',
      customers: '<i class="fas fa-user-shield"></i> Customer 360 Risk Profiles',
      customer_risk: '<i class="fas fa-shield-alt"></i> Stored Customer Risk Assessment',
      transactions: '<i class="fas fa-exchange-alt"></i> Transaction Analytics',
      ai_pattern: '<i class="fas fa-brain"></i> AI Transaction Pattern Analysis',
      ai_investigator: '<i class="fas fa-robot"></i> FinShield AI Investigator',
      rag: '<i class="fas fa-book"></i> RAG Regulatory Knowledge Base',
      sar: '<i class="fas fa-file-invoice"></i> Suspicious Activity Reports (SAR)',
      network: '<i class="fas fa-project-diagram"></i> Network & Entity Investigation Graph',
      audit: '<i class="fas fa-history"></i> Immutable Audit Trail',
      rules: '<i class="fas fa-sliders-h"></i> Configurable AML Rules',
      admin: '<i class="fas fa-cogs"></i> System Administration'
    };
    return titles[name] || name.toUpperCase();
  }

  async function renderModule(mod) {
    const container = document.getElementById('page-container');
    container.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--text-muted);"><i class="fas fa-spinner fa-spin fa-2x"></i><p style="margin-top:10px;">Loading module data...</p></div>';

    switch (mod) {
      case 'dashboard':
        container.innerHTML = await buildDashboardView();
        setupDashboardEvents();
        break;

      case 'alerts':
        container.innerHTML = await buildAlertsView();
        setupAlertsEvents();
        break;

      case 'alert_investigation':
        container.innerHTML = await buildAlertInvestigationView(activeAlertId);
        break;

      case 'cases':
        container.innerHTML = await buildCasesView();
        setupCasesEvents();
        break;

      case 'case_workspace':
      case 'investigations':
        container.innerHTML = await buildCaseWorkspaceView(activeCaseId);
        setupCaseWorkspaceEvents();
        break;

      case 'customers':
      case 'customer_risk':
        container.innerHTML = await buildCustomer360View(activeCustomerId);
        setupCustomer360Events();
        break;

      case 'transactions':
      case 'ai_pattern':
        container.innerHTML = await buildTransactionsView();
        break;

      case 'ai_investigator':
        container.innerHTML = buildStandaloneAIInvestigatorView();
        setupAIInvestigatorEvents();
        break;

      case 'rag':
        container.innerHTML = await buildRAGKnowledgeView();
        setupRAGEvents();
        break;

      case 'sar':
        container.innerHTML = await buildSARView();
        setupSAREvents();
        break;

      case 'network':
        container.innerHTML = buildNetworkGraphView();
        initNetworkGraphCanvas();
        break;

      case 'audit':
        container.innerHTML = await buildAuditTrailView();
        break;

      case 'rules':
      case 'admin':
        container.innerHTML = await buildAMLRulesAdminView();
        break;

      default:
        container.innerHTML = await buildDashboardView();
    }
  }

  // 1. DASHBOARD VIEW
  async function buildDashboardView() {
    const kpis = await FinShieldAPI.getKPIs();
    const alerts = await FinShieldAPI.getAlerts();
    const rules = await FinShieldAPI.getAMLRules();

    return `
      <!-- KPI Row -->
      <div class="kpi-grid">
        <div class="kpi-card" onclick="FinShieldApp.filterDashboardAlerts('ALL')">
          <div class="kpi-title">Total Alerts <i class="fas fa-bell"></i></div>
          <div class="kpi-value">${kpis.totalAlerts.toLocaleString()}</div>
          <div class="kpi-trend trend-up"><i class="fas fa-arrow-up"></i> +8.4% vs last period</div>
        </div>
        <div class="kpi-card active" onclick="FinShieldApp.filterDashboardAlerts('OPEN')">
          <div class="kpi-title">Open Alerts <i class="fas fa-folder-open"></i></div>
          <div class="kpi-value">${kpis.openAlerts.toLocaleString()}</div>
          <div class="kpi-trend trend-up"><i class="fas fa-arrow-up"></i> 142 unassigned</div>
        </div>
        <div class="kpi-card" onclick="FinShieldApp.filterDashboardAlerts('HIGH')">
          <div class="kpi-title">High Risk Alerts <i class="fas fa-exclamation-triangle"></i></div>
          <div class="kpi-value" style="color:var(--severity-high-fg);">${kpis.highRiskAlerts}</div>
          <div class="kpi-trend trend-up"><i class="fas fa-arrow-up"></i> +12% this week</div>
        </div>
        <div class="kpi-card" onclick="FinShieldApp.filterDashboardAlerts('CRITICAL')">
          <div class="kpi-title">Critical Alerts <i class="fas fa-fire"></i></div>
          <div class="kpi-value" style="color:var(--severity-critical-fg);">${kpis.criticalAlerts}</div>
          <div class="kpi-trend trend-up"><i class="fas fa-arrow-up"></i> Immediate SLA focus</div>
        </div>
        <div class="kpi-card" onclick="FinShieldApp.switchModule('cases')">
          <div class="kpi-title">Open Cases <i class="fas fa-briefcase"></i></div>
          <div class="kpi-value">${kpis.openCases}</div>
          <div class="kpi-trend"><i class="fas fa-clock"></i> Avg resolution 4.2h</div>
        </div>
        <div class="kpi-card" onclick="FinShieldApp.switchModule('customers')">
          <div class="kpi-title">Pending KYC <i class="fas fa-user-clock"></i></div>
          <div class="kpi-value">${kpis.pendingKYC}</div>
          <div class="kpi-trend"><i class="fas fa-user-check"></i> Tier 1 & 2 queue</div>
        </div>
        <div class="kpi-card" onclick="FinShieldApp.switchModule('sar')">
          <div class="kpi-title">SARs Pending <i class="fas fa-file-export"></i></div>
          <div class="kpi-value" style="color:var(--severity-medium-fg);">${kpis.sarsPending}</div>
          <div class="kpi-trend"><i class="fas fa-gavel"></i> Regulatory review</div>
        </div>
        <div class="kpi-card" onclick="FinShieldApp.switchModule('customers')">
          <div class="kpi-title">Under Investigation <i class="fas fa-user-shield"></i></div>
          <div class="kpi-value">${kpis.customersUnderInvestigation}</div>
          <div class="kpi-trend trend-down"><i class="fas fa-arrow-down"></i> -4% resolved</div>
        </div>
      </div>

      <!-- Overview Charts & Pipelines -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;">
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-chart-area" style="color:var(--color-primary);"></i> Alert Trend Velocity (Last 30 Days)</div>
            <div class="filter-group">
              <select class="form-select" style="padding:3px 8px; font-size:11px;">
                <option>Today</option>
                <option>7 Days</option>
                <option selected>30 Days</option>
                <option>90 Days</option>
              </select>
            </div>
          </div>
          <div style="height: 180px; display: flex; align-items: flex-end; gap: 8px; padding-top: 20px; border-bottom: 1px dashed var(--border-muted);">
            ${generateSVGBarChart()}
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:11px; color:var(--text-muted);">
            <span>Aug 01</span><span>Aug 05</span><span>Aug 10</span><span>Aug 15</span><span>Aug 17 (Today)</span>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-stream" style="color:var(--ai-purple-fg);"></i> AML Case Pipeline</div>
          </div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${buildPipelineStage('New Unassigned', 34, 'badge-low')}
            ${buildPipelineStage('Under Investigation', 28, 'badge-medium')}
            ${buildPipelineStage('Escalated to Lead', 14, 'badge-high')}
            ${buildPipelineStage('SAR Drafting Review', 18, 'badge-critical')}
            ${buildPipelineStage('Closed / Resolved', 142, 'badge-fact')}
          </div>
        </div>
      </div>

      <!-- AML Rule Performance Table -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fas fa-sliders-h" style="color:var(--severity-low-fg);"></i> Active AML Behavioral Rule Performance</div>
          <button class="btn btn-outline btn-sm" onclick="FinShieldApp.switchModule('rules')">Manage Rules</button>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Rule Name</th>
              <th>Trigger Condition</th>
              <th>Severity</th>
              <th>Total Alerts Triggered</th>
              <th>Confirmed Suspicious</th>
              <th>False Positive Rate</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rules.map(r => `
              <tr onclick="FinShieldApp.switchModule('alerts')">
                <td style="font-weight:600; color:var(--text-primary);">${r.name}</td>
                <td class="font-mono" style="font-size:11px;">${r.threshold}</td>
                <td><span class="badge badge-${r.severity.toLowerCase()}">${r.severity}</span></td>
                <td class="font-mono">${r.triggered.toLocaleString()}</td>
                <td class="font-mono" style="color:var(--severity-low-fg); font-weight:700;">${r.confirmed}</td>
                <td class="font-mono">${r.falsePositiveRate}</td>
                <td><span class="badge badge-low">${r.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function buildPipelineStage(label, count, badgeClass) {
    return `
      <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-surface-elevated); padding:8px 12px; border-radius:6px; border:1px solid var(--border-subtle);">
        <span style="font-size:12px; font-weight:500;">${label}</span>
        <span class="badge ${badgeClass} font-mono">${count}</span>
      </div>
    `;
  }

  function generateSVGBarChart() {
    const heights = [40, 55, 30, 70, 85, 60, 45, 90, 110, 80, 65, 95, 120, 140, 130];
    return heights.map((h, idx) => `
      <div style="flex:1; background:linear-gradient(to top, var(--color-primary), var(--ai-purple-fg)); height:${h}px; border-radius:3px 3px 0 0; opacity:0.85;" title="Day ${idx+1}: ${h*12} alerts"></div>
    `).join('');
  }

  function setupDashboardEvents() {}

  // 2. ALERTS VIEW
  async function buildAlertsView() {
    const alerts = await FinShieldAPI.getAlerts();

    return `
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Alert Management Console</h1>
          <p class="page-subtitle">Real-time detection events & investigator assignment queue</p>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-secondary btn-sm"><i class="fas fa-file-export"></i> Export CSV</button>
          <button class="btn btn-primary btn-sm"><i class="fas fa-user-plus"></i> Bulk Assign</button>
        </div>
      </div>

      <div class="table-container">
        <div class="table-toolbar">
          <div class="filter-group">
            <input type="text" class="form-input" placeholder="Search Alert ID, Customer..." style="width:220px;">
            <select class="form-select">
              <option value="">All Severities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
            <select class="form-select">
              <option value="">All Statuses</option>
              <option value="OPEN">OPEN</option>
              <option value="INVESTIGATING">INVESTIGATING</option>
              <option value="ESCALATED">ESCALATED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
          <span style="font-size:11px; color:var(--text-muted);">Showing 1 - ${alerts.length} of ${alerts.length} alerts</span>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th><input type="checkbox"></th>
              <th>Alert ID</th>
              <th>Customer</th>
              <th>Customer Risk</th>
              <th>Rule Name</th>
              <th>Transaction Amount</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Created</th>
              <th>Assigned Investigator</th>
              <th>SLA</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${alerts.map(a => `
              <tr onclick="FinShieldApp.openAlertInvestigation('${a.alertId}')">
                <td onclick="event.stopPropagation()"><input type="checkbox"></td>
                <td class="font-mono" style="font-weight:700; color:var(--color-primary);">${a.alertId}</td>
                <td style="font-weight:600; color:var(--text-primary);">${a.customerName}</td>
                <td><span class="badge badge-${a.customerRisk.toLowerCase()}">${a.customerRisk}</span></td>
                <td>${a.ruleName}</td>
                <td class="font-mono" style="font-weight:700; color:var(--text-primary);">${a.amount}</td>
                <td><span class="badge badge-${a.severity.toLowerCase()}">${a.severity}</span></td>
                <td><span class="badge badge-low">${a.status}</span></td>
                <td class="font-mono" style="font-size:11px;">${a.created}</td>
                <td style="color:var(--text-secondary);">${a.assignedInvestigator}</td>
                <td class="font-mono" style="color:var(--severity-high-fg);"><i class="fas fa-clock"></i> ${a.sla}</td>
                <td onclick="event.stopPropagation()">
                  <button class="btn btn-secondary btn-sm" onclick="FinShieldApp.openAlertInvestigation('${a.alertId}')">Investigate</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function setupAlertsEvents() {}

  // 3. ALERT INVESTIGATION VIEW
  async function buildAlertInvestigationView(alertId) {
    const alert = FinShieldAPI.getAlertById(alertId);
    const customer = FinShieldAPI.getCustomerById(alert.customerId);

    return `
      <div class="page-header-row">
        <div>
          <div style="display:flex; align-items:center; gap:10px;">
            <button class="btn btn-outline btn-sm" onclick="FinShieldApp.switchModule('alerts')"><i class="fas fa-arrow-left"></i> Back to Alerts</button>
            <h1 class="page-title" style="margin:0;">Alert Investigation: ${alert.alertId}</h1>
            <span class="badge badge-${alert.severity.toLowerCase()}">${alert.severity}</span>
            <span class="badge badge-low">${alert.status}</span>
          </div>
          <p class="page-subtitle">Detection event details & background context</p>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-secondary btn-sm" onclick="FinShieldApp.openCaseWorkspace('CASE-1784086842884')"><i class="fas fa-briefcase"></i> View Associated Case</button>
          <button class="btn btn-primary btn-sm" onclick="FinShieldApp.openCaseWorkspace('CASE-1784086842884')"><i class="fas fa-play"></i> Start Full Case Investigation</button>
        </div>
      </div>

      <!-- CRITICAL AML DISTINCTION CALLOUT -->
      <div class="distinction-callout">
        <i class="fas fa-info-circle" style="color:var(--color-primary); font-size:14px; margin-right:6px;"></i>
        <strong>IMPORTANT AML DATA DISTINCTION:</strong> This alert was triggered by an automated behavioral detection rule based on real-time transaction activity. It is distinct from the customer's stored system risk classification.
      </div>

      <!-- 2-Column Grid -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <!-- Why Was This Alert Triggered Panel -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-exclamation-circle" style="color:var(--severity-critical-fg);"></i> Why Was This Alert Triggered?</div>
            <span class="badge badge-fact">Detection Event</span>
          </div>
          <div class="kv-grid">
            <div class="kv-item">
              <div class="kv-label">Triggered Rule</div>
              <div class="kv-value">${alert.ruleDetails.ruleName}</div>
            </div>
            <div class="kv-item">
              <div class="kv-label">Rule Threshold</div>
              <div class="kv-value font-mono">${alert.ruleDetails.threshold}</div>
            </div>
            <div class="kv-item" style="grid-column:1 / -1; background:var(--bg-darkest); border:1px solid var(--border-muted);">
              <div class="kv-label" style="color:var(--severity-high-fg);">Observed Behavior</div>
              <div class="kv-value font-mono" style="color:var(--text-primary); font-size:12px; margin-top:4px;">${alert.ruleDetails.observed}</div>
            </div>
            <div class="kv-item">
              <div class="kv-label">Rule Result</div>
              <div class="kv-value"><span class="badge badge-critical">${alert.ruleDetails.result}</span></div>
            </div>
            <div class="kv-item">
              <div class="kv-label">Transaction Amount</div>
              <div class="kv-value font-mono" style="color:var(--color-primary);">${alert.amount}</div>
            </div>
          </div>
        </div>

        <!-- Customer Snapshot Panel -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-id-card" style="color:var(--color-primary);"></i> Customer Profile Snapshot</div>
            <button class="btn btn-outline btn-sm" onclick="FinShieldApp.openCustomer360('${customer.customerId}')">Full Customer 360</button>
          </div>
          <div class="kv-grid">
            <div class="kv-item">
              <div class="kv-label">Customer Name</div>
              <div class="kv-value">${customer.name}</div>
            </div>
            <div class="kv-item">
              <div class="kv-label">Customer ID</div>
              <div class="kv-value font-mono">${customer.customerId}</div>
            </div>
            <div class="kv-item">
              <div class="kv-label">Stored System Risk</div>
              <div class="kv-value"><span class="badge badge-low">${customer.storedSystemClassification}</span></div>
            </div>
            <div class="kv-item">
              <div class="kv-label">KYC Status</div>
              <div class="kv-value" style="font-size:11px;">${customer.kycStatus}</div>
            </div>
            <div class="kv-item">
              <div class="kv-label">Occupation</div>
              <div class="kv-value">${customer.occupation}</div>
            </div>
            <div class="kv-item">
              <div class="kv-label">Account Monitoring</div>
              <div class="kv-value" style="color:var(--severity-high-fg);">${customer.accountStatus}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 4. CASES VIEW
  async function buildCasesView() {
    const cases = await FinShieldAPI.getCases();

    return `
      <div class="page-header-row">
        <div>
          <h1 class="page-title">AML Case Management Queue</h1>
          <p class="page-subtitle">Multi-alert consolidated case management & escalation center</p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="FinShieldApp.openCaseWorkspace('CASE-1784086842884')"><i class="fas fa-plus"></i> Create New Case</button>
      </div>

      <div class="table-container">
        <div class="table-toolbar">
          <div class="filter-group">
            <input type="text" class="form-input" placeholder="Search Case ID, Customer..." style="width:240px;">
            <select class="form-select">
              <option value="">All Priorities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
            </select>
            <select class="form-select">
              <option value="">All Statuses</option>
              <option value="OPEN">OPEN</option>
              <option value="INVESTIGATING">INVESTIGATING</option>
              <option value="ESCALATED">ESCALATED</option>
              <option value="SAR_REVIEW">SAR_REVIEW</option>
            </select>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Case Number</th>
              <th>Customer</th>
              <th>Stored Risk</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Associated Alerts</th>
              <th>Assigned Investigator</th>
              <th>Created Date</th>
              <th>SLA Remaining</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${cases.map(c => `
              <tr onclick="FinShieldApp.openCaseWorkspace('${c.caseId}')">
                <td class="font-mono" style="font-weight:700; color:var(--color-primary);">${c.caseId}</td>
                <td style="font-weight:600; color:var(--text-primary);">${c.customerName}</td>
                <td><span class="badge badge-${c.customerRisk.toLowerCase()}">${c.customerRisk}</span></td>
                <td><span class="badge badge-${c.priority.toLowerCase()}">${c.priority}</span></td>
                <td><span class="badge badge-low">${c.status}</span></td>
                <td class="font-mono" style="text-align:center;">${c.alertsCount}</td>
                <td>${c.assignedInvestigator}</td>
                <td class="font-mono" style="font-size:11px;">${c.created}</td>
                <td class="font-mono" style="color:var(--severity-high-fg);"><i class="fas fa-clock"></i> ${c.sla}</td>
                <td onclick="event.stopPropagation()">
                  <button class="btn btn-primary btn-sm" onclick="FinShieldApp.openCaseWorkspace('${c.caseId}')">Workspace</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function setupCasesEvents() {}

  // 5. FLAGSHIP CASE INVESTIGATION WORKSPACE
  async function buildCaseWorkspaceView(caseId) {
    const cases = await FinShieldAPI.getCases();
    const caseData = cases.find(c => c.caseId === caseId) || cases[0];
    const customer = FinShieldAPI.getCustomerById(caseData.customerId);
    const pattern = await FinShieldAPI.getAIPattern();
    const nextActions = await FinShieldAPI.getNextBestActions();
    const txns = await FinShieldAPI.getTransactions();

    return `
      <!-- Workspace 3-Column Command Center Layout -->
      <div class="workspace-layout">
        <!-- Top Workspace Bar -->
        <div class="workspace-header-bar">
          <div style="display:flex; align-items:center; gap:14px;">
            <span class="font-mono" style="font-size:15px; font-weight:800; color:var(--color-primary);">${caseData.caseId}</span>
            <span style="font-size:14px; font-weight:700; color:var(--text-primary);">${caseData.customerName}</span>
            <span class="badge badge-${caseData.customerRisk.toLowerCase()}">Stored Risk: ${caseData.customerRisk}</span>
            <span class="badge badge-low">${caseData.status}</span>
            <span class="font-mono" style="font-size:11px; color:var(--severity-high-fg);"><i class="fas fa-clock"></i> SLA: ${caseData.sla}</span>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" onclick="FinShieldApp.openSARGenerator()"><i class="fas fa-file-invoice"></i> Draft SAR</button>
            <button class="btn btn-danger btn-sm" onclick="alert('Case escalated to Head of Financial Crime Operations.')"><i class="fas fa-exclamation-triangle"></i> Escalate Case</button>
            <button class="btn btn-primary btn-sm" onclick="alert('Case marked as resolved and closed.')"><i class="fas fa-check-circle"></i> Close Case</button>
          </div>
        </div>

        <!-- Left Nav Panel -->
        <div class="workspace-nav-panel">
          <div class="workspace-nav-item active" onclick="FinShieldApp.switchWorkspaceTab(this, 'ws-summary')"><i class="fas fa-align-left"></i> Summary</div>
          <div class="workspace-nav-item" onclick="FinShieldApp.switchWorkspaceTab(this, 'ws-alerts')"><i class="fas fa-bell"></i> Alerts (2)</div>
          <div class="workspace-nav-item" onclick="FinShieldApp.switchWorkspaceTab(this, 'ws-customer')"><i class="fas fa-user-shield"></i> Customer Risk</div>
          <div class="workspace-nav-item" onclick="FinShieldApp.switchWorkspaceTab(this, 'ws-txns')"><i class="fas fa-exchange-alt"></i> Transactions</div>
          <div class="workspace-nav-item" onclick="FinShieldApp.switchWorkspaceTab(this, 'ws-pattern')"><i class="fas fa-brain"></i> AI Pattern</div>
          <div class="workspace-nav-item" onclick="FinShieldApp.switchWorkspaceTab(this, 'ws-graph')"><i class="fas fa-project-diagram"></i> Network Graph</div>
          <div class="workspace-nav-item" onclick="FinShieldApp.switchWorkspaceTab(this, 'ws-evidence')"><i class="fas fa-folder-open"></i> Evidence Deck</div>
          <div class="workspace-nav-item" onclick="FinShieldApp.switchWorkspaceTab(this, 'ws-notes')"><i class="fas fa-sticky-note"></i> Case Notes</div>
        </div>

        <!-- Center Content Pane -->
        <div class="workspace-main-content" id="workspace-content-pane">
          <!-- Summary Subview default -->
          <div class="distinction-callout">
            <strong>System Fact vs AI Observation:</strong> Stored Customer Risk = LOW. Observed Transaction Pattern = Rapid Pass-through (HIGH). The AI observations do not overwrite system records without formal review.
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title"><i class="fas fa-brain" style="color:var(--ai-purple-fg);"></i> AI Transaction Pattern Analysis</div>
              <span class="badge badge-ai">${pattern.metadata.indicator} (${pattern.metadata.confidence})</span>
            </div>
            <div style="font-size:13px; color:var(--text-primary); font-weight:600;">Detected Pattern: ${pattern.detectedPattern}</div>
            <p style="font-size:12px; color:var(--text-secondary); margin-top:4px;">${pattern.explanation}</p>
            
            <div style="margin-top:12px; display:flex; flex-direction:column; gap:8px;">
              ${pattern.suspiciousBehaviors.map(b => `
                <div style="background:var(--bg-darkest); padding:8px 12px; border-radius:6px; border-left:3px solid var(--severity-high-border);">
                  <strong style="color:var(--text-primary);">${b.title}:</strong> <span style="color:var(--text-secondary);">${b.desc}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title"><i class="fas fa-list-ol" style="color:var(--color-primary);"></i> Transaction Ledger Evidence</div>
            </div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Wallet Endpoint</th>
                  <th>Counterparty</th>
                </tr>
              </thead>
              <tbody>
                ${txns.map(t => `
                  <tr>
                    <td class="font-mono" style="color:var(--color-primary);">${t.txnId}</td>
                    <td class="font-mono" style="font-size:11px;">${t.date}</td>
                    <td><span class="badge ${t.type==='CREDIT'?'badge-low':'badge-high'}">${t.type}</span></td>
                    <td class="font-mono" style="font-weight:700;">${t.amount}</td>
                    <td>${t.wallet}</td>
                    <td style="color:var(--text-primary);">${t.counterparty}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right AI Investigator & Next Best Action Panel -->
        <div class="workspace-ai-panel">
          <div class="ai-copilot-header">
            <span style="font-size:13px; font-weight:700; color:var(--text-primary);"><i class="fas fa-robot" style="color:var(--ai-purple-fg);"></i> AI Investigator Copilot</span>
            <span class="badge badge-ai">Active</span>
          </div>

          <div class="ai-messages-area" id="workspace-chat-messages">
            <div class="chat-bubble ai">
              <strong>FINSHIELD AI:</strong> Case context for ${caseData.caseId} loaded. System facts and transaction pattern evidence prepared.
              <div class="ai-finding-box">
                <span class="badge badge-high">AI OBSERVATION</span>
                <p style="margin-top:4px; font-size:11px;">Rapid movement of ₹1,780,100 detected. Recommend obtaining proof of source of funds.</p>
              </div>
            </div>
          </div>

          <!-- Next Best Action Card -->
          <div style="padding:10px 12px; background:var(--bg-darkest); border-top:1px solid var(--border-subtle); border-bottom:1px solid var(--border-subtle);">
            <div style="font-size:10px; font-weight:700; text-transform:uppercase; color:var(--text-muted); display:flex; justify-content:space-between;">
              <span>NEXT BEST ACTION</span>
              <span style="color:var(--ai-purple-fg);">${nextActions.confidence} CONFIDENCE</span>
            </div>
            <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-top:4px;">${nextActions.primary}</div>
            <div style="display:flex; flex-direction:column; gap:4px; margin-top:6px;">
              ${nextActions.actions.map(act => `
                <button class="btn btn-outline btn-sm" style="justify-content:flex-start; font-size:11px;" onclick="FinShieldApp.executeNextAction('${act.actionKey}')">
                  <i class="fas fa-chevron-right" style="color:var(--color-primary);"></i> ${act.title}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- AI Chat Input Box -->
          <div class="ai-input-box">
            <input type="text" id="workspace-ai-input" class="form-input" placeholder="Ask AI Copilot..." style="flex:1;">
            <button class="btn btn-primary btn-sm" onclick="FinShieldApp.sendWorkspaceAIChat()"><i class="fas fa-paper-plane"></i></button>
          </div>
        </div>

        <!-- Bottom Audit Timeline -->
        <div class="workspace-timeline-bar">
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:8px;"><i class="fas fa-history"></i> Investigation Activity Timeline</div>
          <div style="display:flex; gap:20px; align-items:center;">
            <div style="display:flex; align-items:center; gap:8px; font-size:11px; font-weight:500;">
              <span class="font-mono" style="color:var(--text-muted);">09:42</span>
              <span class="badge badge-critical">Alert Created</span>
            </div>
            <i class="fas fa-chevron-right" style="color:var(--border-muted); font-size:10px;"></i>
            <div style="display:flex; align-items:center; gap:8px; font-size:11px; font-weight:500;">
              <span class="font-mono" style="color:var(--text-muted);">09:44</span>
              <span class="badge badge-medium">Assigned to Sarah</span>
            </div>
            <i class="fas fa-chevron-right" style="color:var(--border-muted); font-size:10px;"></i>
            <div style="display:flex; align-items:center; gap:8px; font-size:11px; font-weight:500;">
              <span class="font-mono" style="color:var(--text-muted);">09:51</span>
              <span class="badge badge-ai">AI Pattern Generated</span>
            </div>
            <i class="fas fa-chevron-right" style="color:var(--border-muted); font-size:10px;"></i>
            <div style="display:flex; align-items:center; gap:8px; font-size:11px; font-weight:500;">
              <span class="font-mono" style="color:var(--text-muted);">10:02</span>
              <span class="badge badge-low">Investigating</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function setupCaseWorkspaceEvents() {}

  function switchWorkspaceTab(element, tabId) {
    document.querySelectorAll('.workspace-nav-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');

    const pane = document.getElementById('workspace-content-pane');
    if (tabId === 'ws-customer') {
      pane.innerHTML = buildCustomerRiskSubpane();
    } else if (tabId === 'ws-graph') {
      pane.innerHTML = buildNetworkGraphView();
      initNetworkGraphCanvas();
    } else {
      renderModule('case_workspace');
    }
  }

  function buildCustomerRiskSubpane() {
    const cust = FinShieldAPI.getCustomerById('CUST-99201');
    return `
      <div class="distinction-callout">
        <i class="fas fa-shield-alt" style="color:var(--color-primary); font-size:14px; margin-right:6px;"></i>
        <strong>STORED SYSTEM CLASSIFICATION:</strong> ${cust.storedSystemClassification}
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Original Risk Classification Rationale</div>
          <span class="badge badge-fact">Authoritative DB</span>
        </div>
        <p style="font-size:12px; color:var(--text-secondary); line-height:1.6;">${cust.storedRiskRationale}</p>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div class="card">
          <div class="card-header">
            <div class="card-title" style="color:var(--severity-low-fg);"><i class="fas fa-check-circle"></i> Positive / Neutral Observations</div>
          </div>
          <ul style="padding-left:18px; font-size:12px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
            ${cust.positiveObservations.map(o => `<li>${o}</li>`).join('')}
          </ul>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title" style="color:var(--severity-high-fg);"><i class="fas fa-exclamation-triangle"></i> Negative / Investigation Observations</div>
          </div>
          <ul style="padding-left:18px; font-size:12px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
            ${cust.negativeObservations.map(o => `<li>${o}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  async function sendWorkspaceAIChat() {
    const input = document.getElementById('workspace-ai-input');
    const msg = input.value.trim();
    if (!msg) return;

    const area = document.getElementById('workspace-chat-messages');
    area.innerHTML += `<div class="chat-bubble user"><strong>Investigator:</strong> ${msg}</div>`;
    input.value = '';
    area.scrollTop = area.scrollHeight;

    const response = await FinShieldAPI.askAICopilot(msg);
    area.innerHTML += `
      <div class="chat-bubble ai">
        <strong>FINSHIELD AI:</strong>
        <div class="ai-finding-box">
          <span class="badge badge-ai">FINDING: ${response.aiFinding}</span>
          <p style="margin-top:6px; font-size:11px; white-space:pre-line;">${response.reasoning}</p>
          <div style="margin-top:8px; font-size:10px; color:var(--text-muted);">
            <strong>Recommended:</strong> ${response.recommendedAction}
          </div>
        </div>
      </div>
    `;
    area.scrollTop = area.scrollHeight;
  }

  // 6. CUSTOMER 360 VIEW
  async function buildCustomer360View(customerId) {
    const cust = FinShieldAPI.getCustomerById(customerId);

    return `
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Customer 360 Risk Profile: ${cust.name}</h1>
          <p class="page-subtitle">ID: ${cust.customerId} • ${cust.occupation} • ${cust.nationality}</p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="FinShieldApp.openCaseWorkspace('CASE-1784086842884')"><i class="fas fa-search"></i> Open Active Case</button>
      </div>

      <div class="tabs-header">
        <div class="tab-item active">Overview</div>
        <div class="tab-item" onclick="FinShieldApp.switchModule('customer_risk')">Risk Screen</div>
        <div class="tab-item" onclick="FinShieldApp.switchModule('transactions')">Transactions</div>
        <div class="tab-item" onclick="FinShieldApp.switchModule('alerts')">Alerts (${cust.totalAlerts})</div>
        <div class="tab-item" onclick="FinShieldApp.switchModule('cases')">Cases (${cust.totalCases})</div>
      </div>

      ${buildCustomerRiskSubpane()}
    `;
  }

  function setupCustomer360Events() {}

  // 7. TRANSACTIONS VIEW
  async function buildTransactionsView() {
    const txns = await FinShieldAPI.getTransactions();
    const pattern = await FinShieldAPI.getAIPattern();

    return `
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Transaction Analytics & Pattern Engine</h1>
          <p class="page-subtitle">Structured ledger analysis & AI-assisted behavioral anomaly detection</p>
        </div>
      </div>

      <!-- AI Pattern Box -->
      <div class="card" style="border:1px solid var(--ai-purple-border); background:linear-gradient(135deg, var(--bg-surface), var(--bg-darkest));">
        <div class="card-header">
          <div class="card-title"><i class="fas fa-brain" style="color:var(--ai-purple-fg);"></i> AI Transaction Pattern Analysis</div>
          <span class="badge badge-ai">${pattern.metadata.indicator} (${pattern.metadata.confidence})</span>
        </div>
        <div style="font-size:14px; font-weight:700; color:var(--text-primary);">${pattern.detectedPattern}</div>
        <p style="font-size:12px; color:var(--text-secondary); margin-top:4px;">${pattern.explanation}</p>
        <div style="margin-top:10px; display:flex; gap:10px; font-size:11px; color:var(--text-muted);">
          <span><i class="fas fa-clock"></i> Generated: ${pattern.metadata.timestamp}</span>
          <span><i class="fas fa-microchip"></i> Engine: ${pattern.metadata.source}</span>
        </div>
      </div>

      <div class="table-container">
        <div class="table-toolbar">
          <div class="filter-group">
            <input type="text" class="form-input" placeholder="Filter transactions..." style="width:200px;">
            <select class="form-select">
              <option>All Types</option>
              <option>CREDIT</option>
              <option>DEBIT</option>
            </select>
          </div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Timestamp</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Wallet</th>
              <th>Counterparty</th>
            </tr>
          </thead>
          <tbody>
            ${txns.map(t => `
              <tr>
                <td class="font-mono" style="color:var(--color-primary);">${t.txnId}</td>
                <td class="font-mono" style="font-size:11px;">${t.date}</td>
                <td><span class="badge ${t.type==='CREDIT'?'badge-low':'badge-high'}">${t.type}</span></td>
                <td class="font-mono" style="font-weight:700;">${t.amount}</td>
                <td><span class="badge badge-low">${t.status}</span></td>
                <td>${t.wallet}</td>
                <td style="color:var(--text-primary);">${t.counterparty}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // 8. RAG KNOWLEDGE VIEW
  async function buildRAGKnowledgeView() {
    const docs = await FinShieldAPI.getRAGDocs();

    return `
      <div class="page-header-row">
        <div>
          <h1 class="page-title">RAG Regulatory Knowledge Base</h1>
          <p class="page-subtitle">Semantic search across FATF guidelines, regulatory notices & internal AML policy documents</p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="alert('Upload document modal opened.')"><i class="fas fa-upload"></i> Upload Regulatory PDF</button>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fas fa-search" style="color:var(--color-primary);"></i> Semantic Vector Query Engine</div>
        </div>
        <div style="display:flex; gap:10px;">
          <input type="text" id="rag-query-input" class="form-input" placeholder="e.g. rapid fund movement structuring thresholds..." style="flex:1;">
          <button class="btn btn-primary btn-sm" onclick="FinShieldApp.executeRAGSearch()"><i class="fas fa-microchip"></i> Semantic Query</button>
        </div>
        <div id="rag-results-area" style="margin-top:14px;"></div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fas fa-file-pdf" style="color:var(--severity-critical-fg);"></i> Ingested Regulatory Documents</div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Document ID</th>
              <th>Document Title</th>
              <th>Vector Chunks</th>
              <th>Embedding Status</th>
              <th>Ingestion Date</th>
            </tr>
          </thead>
          <tbody>
            ${docs.map(d => `
              <tr>
                <td class="font-mono">${d.id}</td>
                <td style="font-weight:600; color:var(--text-primary);">${d.title}</td>
                <td class="font-mono">${d.chunks} chunks</td>
                <td><span class="badge badge-low">${d.status}</span></td>
                <td class="font-mono">${d.uploaded}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function setupRAGEvents() {}

  function executeRAGSearch() {
    const query = document.getElementById('rag-query-input').value.trim();
    const area = document.getElementById('rag-results-area');
    if (!query) return;

    area.innerHTML = `
      <div style="background:var(--bg-darkest); padding:12px; border-radius:6px; border:1px solid var(--ai-purple-border);">
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:var(--text-muted);">
          <span>Source: <strong>Internal_AML_Investigation_Policy_v4.2.pdf</strong> (Page 14)</span>
          <span class="badge badge-ai">Similarity: 0.88</span>
        </div>
        <p style="margin-top:8px; font-size:12px; color:var(--text-primary); font-family:var(--font-mono); line-height:1.5;">
          "Funds transferred out exceeding 90% of inbound deposits within a 1-hour window trigger mandatory structuring and rapid movement investigation procedures."
        </p>
      </div>
    `;
  }

  // 9. SAR VIEW
  async function buildSARView() {
    return `
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Suspicious Activity Reports (SAR)</h1>
          <p class="page-subtitle">Regulatory filing dashboard & AI-assisted SAR generation engine</p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="FinShieldApp.openSARGenerator()"><i class="fas fa-plus"></i> Generate New SAR Draft</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-title">Draft SARs</div>
          <div class="kpi-value">4</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Pending Review</div>
          <div class="kpi-value" style="color:var(--severity-medium-fg);">2</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Submitted</div>
          <div class="kpi-value" style="color:var(--severity-low-fg);">48</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Rejected</div>
          <div class="kpi-value">1</div>
        </div>
      </div>

      <div class="card" style="margin-top:16px;">
        <div class="card-header">
          <div class="card-title"><i class="fas fa-gavel" style="color:var(--severity-high-fg);"></i> Pending SAR Reviews</div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>SAR Ref</th>
              <th>Subject Customer</th>
              <th>Filing Reason</th>
              <th>AI Draft Status</th>
              <th>Investigator Approval</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-mono" style="color:var(--color-primary);">SAR-2026-089</td>
              <td style="font-weight:600;">Vikramaditya Rao (CUST-99201)</td>
              <td>Rapid Fund Pass-through to Unverified Crypto Wallet</td>
              <td><span class="badge badge-ai">Generated</span></td>
              <td><span class="badge badge-medium">Pending Sign-off</span></td>
              <td>
                <button class="btn btn-primary btn-sm" onclick="FinShieldApp.openSARGenerator()">Review Draft</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  function setupSAREvents() {}

  // 10. NETWORK GRAPH VIEW
  function buildNetworkGraphView() {
    return `
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Network & Entity Investigation Graph</h1>
          <p class="page-subtitle">Interactive relationship map for counterparty analysis, shared wallets & transaction clusters</p>
        </div>
      </div>

      <div class="graph-canvas-container">
        <canvas id="entity-graph-canvas" style="width:100%; height:100%; display:block;"></canvas>
        <div style="position:absolute; top:12px; left:12px; background:rgba(17,24,39,0.85); padding:8px 12px; border-radius:6px; border:1px solid var(--border-subtle); font-size:11px; color:var(--text-secondary);">
          <i class="fas fa-mouse"></i> Click nodes to inspect relationship context
        </div>
      </div>
    `;
  }

  function initNetworkGraphCanvas() {
    setTimeout(() => {
      const canvas = document.getElementById('entity-graph-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const width = canvas.width = canvas.parentElement.clientWidth;
      const height = canvas.height = canvas.parentElement.clientHeight;

      const nodes = [
        { id: 1, label: 'Vikramaditya Rao', type: 'CUSTOMER', x: width * 0.5, y: height * 0.5, color: '#3b82f6' },
        { id: 2, label: 'HDFC Bank Wallet', type: 'WALLET', x: width * 0.3, y: height * 0.3, color: '#10b981' },
        { id: 3, label: 'Nexus Crypto Wallet', type: 'WALLET', x: width * 0.7, y: height * 0.3, color: '#ef4444' },
        { id: 4, label: 'Alpha Trading Corp', type: 'COUNTERPARTY', x: width * 0.2, y: height * 0.7, color: '#f59e0b' },
        { id: 5, label: 'Wallet #0x82a1', type: 'UNVERIFIED', x: width * 0.8, y: height * 0.7, color: '#8b5cf6' }
      ];

      const edges = [
        { from: 1, to: 2, label: 'Primary Account' },
        { from: 1, to: 3, label: 'Pass-through' },
        { from: 2, to: 4, label: '₹500,000 Inbound' },
        { from: 3, to: 5, label: '₹490,000 Outbound' }
      ];

      function draw() {
        ctx.clearRect(0, 0, width, height);

        // Draw edges
        edges.forEach(e => {
          const source = nodes.find(n => n.id === e.from);
          const target = nodes.find(n => n.id === e.to);
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = '#374151';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Edge Label
          const midX = (source.x + target.x) / 2;
          const midY = (source.y + target.y) / 2;
          ctx.fillStyle = '#9ca3af';
          ctx.font = '10px monospace';
          ctx.fillText(e.label, midX - 20, midY);
        });

        // Draw nodes
        nodes.forEach(n => {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 22, 0, Math.PI * 2);
          ctx.fillStyle = n.color;
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(n.label, n.x, n.y + 36);
        });
      }

      draw();
    }, 100);
  }

  // 11. AUDIT TRAIL VIEW
  async function buildAuditTrailView() {
    const logs = await FinShieldAPI.getAuditLogs();

    return `
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Immutable Audit Trail</h1>
          <p class="page-subtitle">Regulatory-compliant event logging & system state changes</p>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User / System</th>
              <th>Action Event</th>
              <th>Object ID</th>
              <th>Audit Details</th>
            </tr>
          </thead>
          <tbody>
            ${logs.map(l => `
              <tr>
                <td class="font-mono" style="font-size:11px;">${l.timestamp}</td>
                <td style="font-weight:600; color:var(--text-primary);">${l.user}</td>
                <td><span class="badge badge-low">${l.action}</span></td>
                <td class="font-mono" style="color:var(--color-primary);">${l.objectId}</td>
                <td style="color:var(--text-secondary);">${l.details}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // 12. AML RULES ADMIN VIEW
  async function buildAMLRulesAdminView() {
    const rules = await FinShieldAPI.getAMLRules();

    return `
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Configurable AML Rule Engine</h1>
          <p class="page-subtitle">Behavioral detection rules, thresholds & severity mapping</p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="alert('Create rule dialog opened.')"><i class="fas fa-plus"></i> Add New Rule</button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Rule ID</th>
              <th>Rule Name</th>
              <th>Trigger Condition</th>
              <th>Severity</th>
              <th>Total Alerts</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rules.map(r => `
              <tr>
                <td class="font-mono">RULE-00${r.id}</td>
                <td style="font-weight:600; color:var(--text-primary);">${r.name}</td>
                <td class="font-mono" style="font-size:11px;">${r.threshold}</td>
                <td><span class="badge badge-${r.severity.toLowerCase()}">${r.severity}</span></td>
                <td class="font-mono">${r.triggered}</td>
                <td><span class="badge badge-low">${r.status}</span></td>
                <td>
                  <button class="btn btn-secondary btn-sm" onclick="alert('Edit rule')">Configure</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // 13. STANDALONE AI INVESTIGATOR VIEW
  function buildStandaloneAIInvestigatorView() {
    return `
      <div class="page-header-row">
        <div>
          <h1 class="page-title">FINSHIELD AI INVESTIGATOR</h1>
          <p class="page-subtitle">Autonomous financial crime investigation assistant & explainable AI copilot</p>
        </div>
      </div>

      <div class="card" style="max-width:800px; margin:0 auto; width:100%;">
        <div class="card-header">
          <div class="card-title"><i class="fas fa-robot" style="color:var(--ai-purple-fg);"></i> Investigation Copilot Session</div>
          <span class="badge badge-ai">Model: FinShield-Ollama</span>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
          <button class="btn btn-outline btn-sm" onclick="FinShieldApp.sendPresetQuestion('Why was this customer considered low risk?')">Why low risk?</button>
          <button class="btn btn-outline btn-sm" onclick="FinShieldApp.sendPresetQuestion('Why was this alert triggered?')">Why alert triggered?</button>
          <button class="btn btn-outline btn-sm" onclick="FinShieldApp.sendPresetQuestion('Summarize this case.')">Summarize Case</button>
        </div>

        <div class="ai-messages-area" id="standalone-ai-messages" style="height:320px; border:1px solid var(--border-subtle); border-radius:6px;">
          <div class="chat-bubble ai">
            <strong>FINSHIELD AI:</strong> Hello. I am ready to assist with your investigation. Ask a question regarding customer risk, transaction patterns, or SAR generation.
          </div>
        </div>

        <div class="ai-input-box" style="margin-top:12px;">
          <input type="text" id="standalone-ai-input" class="form-input" placeholder="Type your investigation query..." style="flex:1;">
          <button class="btn btn-primary btn-sm" onclick="FinShieldApp.sendStandaloneAIChat()"><i class="fas fa-paper-plane"></i> Ask AI</button>
        </div>
      </div>
    `;
  }

  function setupAIInvestigatorEvents() {}

  async function sendPresetQuestion(q) {
    const input = document.getElementById('standalone-ai-input');
    if (input) {
      input.value = q;
      sendStandaloneAIChat();
    }
  }

  async function sendStandaloneAIChat() {
    const input = document.getElementById('standalone-ai-input');
    const msg = input.value.trim();
    if (!msg) return;

    const area = document.getElementById('standalone-ai-messages');
    area.innerHTML += `<div class="chat-bubble user"><strong>Investigator:</strong> ${msg}</div>`;
    input.value = '';
    area.scrollTop = area.scrollHeight;

    const response = await FinShieldAPI.askAICopilot(msg);
    area.innerHTML += `
      <div class="chat-bubble ai">
        <strong>FINSHIELD AI:</strong>
        <div class="ai-finding-box">
          <span class="badge badge-ai">FINDING: ${response.aiFinding}</span>
          <p style="margin-top:6px; font-size:11px; white-space:pre-line;">${response.reasoning}</p>
          <div style="margin-top:8px; font-size:10px; color:var(--text-muted);">
            <strong>Recommended Action:</strong> ${response.recommendedAction}
          </div>
        </div>
      </div>
    `;
    area.scrollTop = area.scrollHeight;
  }

  // Modals & Drawers
  function openSearchModal() {
    document.getElementById('search-modal-backdrop').classList.add('active');
    document.getElementById('search-modal-input').focus();
  }

  function closeModals() {
    document.querySelectorAll('.modal-backdrop').forEach(el => el.classList.remove('active'));
  }

  function toggleCopilotDrawer() {
    switchModule('ai_investigator');
  }

  function openAlertInvestigation(alertId) {
    activeAlertId = alertId;
    switchModule('alert_investigation');
  }

  function openCaseWorkspace(caseId) {
    activeCaseId = caseId;
    switchModule('case_workspace');
  }

  function openCustomer360(customerId) {
    activeCustomerId = customerId;
    switchModule('customers');
  }

  function filterDashboardAlerts(filter) {
    switchModule('alerts');
  }

  function openSARGenerator() {
    document.getElementById('sar-modal-backdrop').classList.add('active');
  }

  function executeNextAction(actionKey) {
    if (actionKey === 'GEN_SAR') {
      openSARGenerator();
    } else {
      alert(`Action executed: ${actionKey}`);
    }
  }

  function updateNotificationBadge() {}

  return {
    init,
    switchModule,
    openSearchModal,
    closeModals,
    toggleCopilotDrawer,
    openAlertInvestigation,
    openCaseWorkspace,
    openCustomer360,
    filterDashboardAlerts,
    switchWorkspaceTab,
    sendWorkspaceAIChat,
    executeRAGSearch,
    openSARGenerator,
    executeNextAction,
    sendPresetQuestion,
    sendStandaloneAIChat
  };
})();
