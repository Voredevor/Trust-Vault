import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return this.getDashboardHtml();
  }

  getDashboardHtml(): string {
    return String.raw`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>TrustVault Operator Console</title>
  <style>
    :root {
      --bg: #0b0f14;
      --surface: #111821;
      --surface-2: #151f2b;
      --line: #263443;
      --text: #edf4f8;
      --muted: #94a7b6;
      --accent: #39d98a;
      --accent-2: #4db7ff;
      --warning: #f5b84b;
      --danger: #ff5c77;
      --radius: 8px;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      background:
        linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px),
        linear-gradient(180deg, rgba(255,255,255,0.03) 1px, transparent 1px),
        var(--bg);
      background-size: 48px 48px;
      color: var(--text);
      font-family: "Segoe UI", ui-sans-serif, system-ui, sans-serif;
      letter-spacing: 0;
    }

    button, input, select, textarea { font: inherit; }

    .app {
      display: grid;
      grid-template-columns: 248px minmax(0, 1fr);
      min-height: 100vh;
    }

    .sidebar {
      border-right: 1px solid var(--line);
      background: rgba(12, 17, 24, 0.95);
      padding: 20px 14px;
      position: sticky;
      top: 0;
      height: 100vh;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px 22px;
      border-bottom: 1px solid var(--line);
      margin-bottom: 16px;
    }

    .mark {
      width: 34px;
      height: 34px;
      border: 1px solid rgba(57, 217, 138, 0.55);
      border-radius: 8px;
      display: grid;
      place-items: center;
      color: var(--accent);
      font-weight: 900;
      background: rgba(57, 217, 138, 0.08);
    }

    .brand strong { display: block; font-size: 15px; }
    .brand span { display: block; color: var(--muted); font-size: 12px; margin-top: 2px; }

    .nav {
      display: grid;
      gap: 6px;
    }

    .nav button {
      width: 100%;
      border: 1px solid transparent;
      background: transparent;
      color: var(--muted);
      border-radius: var(--radius);
      padding: 11px 12px;
      text-align: left;
      cursor: pointer;
    }

    .nav button.active {
      color: var(--text);
      background: var(--surface-2);
      border-color: var(--line);
    }

    .content {
      padding: 22px;
      min-width: 0;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 18px;
    }

    h1, h2, h3, p { margin-top: 0; }
    h1 { margin-bottom: 6px; font-size: 28px; }
    h2 { font-size: 18px; margin-bottom: 14px; }
    h3 { font-size: 14px; margin-bottom: 10px; color: var(--muted); text-transform: uppercase; }
    p { color: var(--muted); line-height: 1.5; }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 8px 12px;
      color: var(--muted);
      background: rgba(21, 31, 43, 0.86);
      white-space: nowrap;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 14px;
    }

    .card {
      background: rgba(17, 24, 33, 0.95);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 16px;
      min-width: 0;
    }

    .metric {
      grid-column: span 2;
      min-height: 116px;
    }

    .metric .label {
      color: var(--muted);
      font-size: 12px;
      text-transform: uppercase;
    }

    .metric .value {
      font-size: 32px;
      font-weight: 800;
      margin-top: 18px;
    }

    .span-4 { grid-column: span 4; }
    .span-6 { grid-column: span 6; }
    .span-8 { grid-column: span 8; }
    .span-12 { grid-column: span 12; }

    .toolbar {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 14px;
    }

    input, select, textarea {
      min-height: 40px;
      border: 1px solid var(--line);
      background: #0c121a;
      color: var(--text);
      border-radius: var(--radius);
      padding: 9px 10px;
      min-width: 0;
    }

    textarea {
      width: 100%;
      min-height: 160px;
      resize: vertical;
    }

    .btn {
      min-height: 40px;
      border: 1px solid var(--line);
      background: var(--surface-2);
      color: var(--text);
      border-radius: var(--radius);
      padding: 9px 12px;
      cursor: pointer;
    }

    .btn.primary {
      border-color: rgba(57, 217, 138, 0.4);
      background: rgba(57, 217, 138, 0.14);
      color: #baffd9;
    }

    .btn.danger {
      border-color: rgba(255, 92, 119, 0.42);
      background: rgba(255, 92, 119, 0.12);
      color: #ffc0ca;
    }

    .table-wrap {
      overflow: auto;
      border: 1px solid var(--line);
      border-radius: var(--radius);
    }

    .click-row { cursor: pointer; }
    .click-row:hover td { background: rgba(77, 183, 255, 0.06); }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 760px;
    }

    th, td {
      padding: 12px;
      border-bottom: 1px solid var(--line);
      text-align: left;
      vertical-align: top;
      font-size: 13px;
    }

    th {
      color: var(--muted);
      background: #0d141d;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0;
    }

    tr:last-child td { border-bottom: 0; }

    .badge {
      display: inline-flex;
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 4px 8px;
      font-size: 12px;
      color: var(--muted);
      white-space: nowrap;
    }

    .badge.good { color: #baffd9; border-color: rgba(57, 217, 138, 0.35); }
    .badge.warn { color: #ffe2a8; border-color: rgba(245, 184, 75, 0.42); }
    .badge.bad { color: #ffc0ca; border-color: rgba(255, 92, 119, 0.42); }

    .empty, .error, .loading {
      border: 1px dashed var(--line);
      border-radius: var(--radius);
      padding: 18px;
      color: var(--muted);
      background: rgba(12, 18, 26, 0.62);
    }

    .error { color: #ffc0ca; border-color: rgba(255, 92, 119, 0.42); }

    .split {
      display: grid;
      grid-template-columns: 330px minmax(0, 1fr);
      gap: 14px;
    }

    .form {
      display: grid;
      gap: 10px;
    }

    .detail {
      display: grid;
      gap: 10px;
    }

    .drawer {
      margin-top: 14px;
      border-left: 3px solid var(--accent-2);
    }

    .status-list {
      display: grid;
      gap: 10px;
    }

    .status-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      border-bottom: 1px solid var(--line);
      padding-bottom: 10px;
    }

    .status-row:last-child { border-bottom: 0; padding-bottom: 0; }

    pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      color: #dbe8ef;
      font-size: 12px;
    }

    .hidden { display: none; }

    @media (max-width: 980px) {
      .app { grid-template-columns: 1fr; }
      .sidebar { position: relative; height: auto; }
      .nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .metric, .span-4, .span-6, .span-8 { grid-column: span 12; }
      .split { grid-template-columns: 1fr; }
      .topbar { align-items: flex-start; flex-direction: column; }
    }
  </style>
</head>
<body>
  <div class="app">
    <aside class="sidebar">
      <div class="brand">
        <div class="mark">TV</div>
        <div>
          <strong>TrustVault</strong>
          <span>Operator Console</span>
        </div>
      </div>
      <nav class="nav" id="nav"></nav>
    </aside>
    <main class="content">
      <div class="topbar">
        <div>
          <h1 id="pageTitle">Dashboard</h1>
          <p id="pageSubtitle">Operational snapshot from the NestJS API.</p>
        </div>
        <div class="status-pill"><span class="dot"></span><span id="apiStatus">API connected</span></div>
      </div>
      <section id="page"></section>
    </main>
  </div>

  <script>
    const pages = [
      ['dashboard', 'Dashboard'],
      ['customers', 'Customers'],
      ['virtualAccounts', 'Virtual Accounts'],
      ['transactions', 'Transactions'],
      ['transferGuard', 'Transfer Guard'],
      ['securityOverview', 'Security Overview'],
      ['webhooks', 'Webhooks'],
      ['trustEngine', 'Trust Engine'],
      ['audit', 'Audit Logs'],
      ['settings', 'Settings']
    ];

    const pageCopy = {
      dashboard: ['Dashboard', 'Operational snapshot from the NestJS API.'],
      customers: ['Customers', 'Search, create, and inspect TrustVault customers.'],
      virtualAccounts: ['Virtual Accounts', 'Manage dedicated virtual accounts and Nomba-backed actions.'],
      transactions: ['Transactions', 'Review incoming, outgoing, pending, successful, and failed payments.'],
      transferGuard: ['Transfer Guard', 'Approve, review, or block outgoing transfers before they reach Nomba.'],
      securityOverview: ['Security Overview', 'Live payment security posture from existing TrustVault records.'],
      webhooks: ['Webhooks', 'Live event monitor for signed payment and transfer events.'],
      trustEngine: ['Trust Engine', 'Inspect customer trust scores, decisions, and risk signals.'],
      audit: ['Audit Logs', 'Trace administrative and security-relevant actions.'],
      settings: ['Settings', 'Runtime integration status and endpoint map.']
    };

    const state = {
      customers: [],
      virtualAccounts: [],
      transactions: [],
      transfers: [],
      webhooks: [],
      audit: [],
      selectedCustomerId: '',
      trustUserId: ''
    };

    const api = async (path, options) => {
      const response = await fetch(path, {
        headers: { 'Content-Type': 'application/json' },
        ...options
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      if (!response.ok) {
        const message = data && data.message ? data.message : response.statusText;
        throw new Error(Array.isArray(message) ? message.join(', ') : message);
      }
      return data;
    };

    const html = (value) => String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    const money = (value, currency) => new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency || 'NGN'
    }).format(Number(value || 0));

    const date = (value) => value ? new Date(value).toLocaleString() : '--';
    const person = (user) => user ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email : '--';
    const virtualAccountName = (account) => account?.metadata?.bankAccountName || account?.accountName || account?.label || '--';
    const txPayload = (tx) => tx?.metadata?.payload || {};
    const txNombaTransaction = (tx) => txPayload(tx)?.data?.transaction || {};
    const txNombaCustomer = (tx) => txPayload(tx)?.data?.customer || {};
    const txSenderName = (tx) => txNombaCustomer(tx).senderName || tx.metadata?.senderName || '--';
    const txReceiverName = (tx) => txNombaTransaction(tx).aliasAccountName || tx.virtualAccount?.accountName || tx.virtualAccount?.accountNumber || '--';
    const txType = (tx) => txNombaTransaction(tx).type || tx.metadata?.eventType || tx.direction || '--';
    const txSessionId = (tx) => txNombaTransaction(tx).sessionId || tx.metadata?.sessionId || '--';
    const txReference = (tx) => tx.reference || txNombaTransaction(tx).transactionId || tx.metadata?.reference || '--';
    const txVirtualAccountNumber = (tx) => tx.virtualAccount?.accountNumber || txNombaTransaction(tx).aliasAccountNumber || '--';
    const webhookTransaction = (event) => event?.payload?.data?.transaction || {};
    const webhookCustomer = (event) => event?.payload?.data?.customer || {};
    const webhookAmount = (event) => webhookTransaction(event).transactionAmount || event?.payload?.amount || '--';
    const webhookAmountLabel = (event) => Number.isFinite(Number(webhookAmount(event))) ? money(webhookAmount(event), 'NGN') : '--';
    const webhookSender = (event) => webhookCustomer(event).senderName || '--';
    const webhookVirtualAccount = (event) => webhookTransaction(event).aliasAccountNumber || event?.payload?.accountNumber || '--';
    const webhookTransactionId = (event) => webhookTransaction(event).transactionId || event?.payload?.reference || event?.payload?.transactionReference || '--';
    const webhookRequestId = (event) => event?.payload?.requestId || '--';
    const auditMetadata = (log) => log?.metadata || {};
    const auditLinkedTransaction = (log) => log.resourceType === 'Transaction' ? log.resourceId : auditMetadata(log).transactionId || auditMetadata(log).transactionReference || '--';
    const auditLinkedVirtualAccount = (log) => log.resourceType === 'VirtualAccount' ? log.resourceId : auditMetadata(log).virtualAccountId || auditMetadata(log).virtualAccountNumber || auditMetadata(log).recipient?.accountNumber || '--';
    const auditWebhookReference = (log) => log.resourceType === 'WebhookEvent' ? log.resourceId : auditMetadata(log).webhookEventId || auditMetadata(log).requestId || '--';
    const auditCategory = (log) => {
      const source = [log.action, log.resourceType, JSON.stringify(log.metadata || {})].join(' ').toLowerCase();
      if (source.includes('webhook') || source.includes('nomba')) return 'Webhook';
      if (source.includes('transfer')) return 'Transfer';
      if (source.includes('customer') || source.includes('user')) return 'Customer';
      if (['HIGH', 'CRITICAL'].includes(log.severity)) return 'Security';
      return 'System';
    };
    const customerCode = (userOrId) => {
      const id = typeof userOrId === 'string' ? userOrId : userOrId?.id;
      return id ? 'TV-' + id.replace(/-/g, '').slice(0, 8).toUpperCase() : '--';
    };
    const generatedAccountRef = (userId) => {
      const suffix = userId ? userId.replace(/-/g, '').slice(0, 6) : Math.random().toString(36).slice(2, 8);
      return 'tv-' + suffix + '-' + Date.now().toString(36);
    };
    const tone = (value) => ['SUCCESS', 'ACTIVE', 'TRUSTED', 'ALLOW', 'LOW', true].includes(value) ? 'good' : ['PENDING', 'REVIEW', 'STEP_UP', 'MEDIUM'].includes(value) ? 'warn' : ['FAILED', 'REVERSED', 'SUSPENDED', 'REVOKED', 'BLOCK', 'HIGH', 'CRITICAL', false].includes(value) ? 'bad' : '';
    const badge = (value) => '<span class="badge ' + tone(value) + '">' + html(value) + '</span>';
    const statusRow = (label, value, status) => '<div class="status-row"><span>' + html(label) + '</span><strong>' + html(value) + '</strong>' + badge(status || 'ACTIVE') + '</div>';
    const chartBar = (label, value, max) => '<div style="margin-bottom:10px;"><div style="display:flex;justify-content:space-between;gap:10px;"><span>' + html(label) + '</span><strong>' + html(value) + '</strong></div><div style="height:8px;border:1px solid var(--line);border-radius:999px;overflow:hidden;"><div style="width:' + (max ? Math.max(4, Math.round((Number(value) / max) * 100)) : 0) + '%;height:100%;background:var(--accent-2);"></div></div></div>';

    function setPage(id) {
      const copy = pageCopy[id] || pageCopy.dashboard;
      document.getElementById('pageTitle').textContent = copy[0];
      document.getElementById('pageSubtitle').textContent = copy[1];
      document.querySelectorAll('.nav button').forEach((button) => button.classList.toggle('active', button.dataset.page === id));
      window.location.hash = id;
      renderPage(id);
    }

    function renderNav() {
      document.getElementById('nav').innerHTML = pages.map(([id, label]) =>
        '<button type="button" data-page="' + id + '">' + label + '</button>'
      ).join('');
      document.querySelectorAll('.nav button').forEach((button) => {
        button.addEventListener('click', () => setPage(button.dataset.page));
      });
    }

    function loading(label) {
      return '<div class="loading">' + label + '</div>';
    }

    function errorCard(error) {
      document.getElementById('apiStatus').textContent = 'API needs attention';
      return '<div class="error">' + html(error.message || error) + '</div>';
    }

    function empty(label) {
      return '<div class="empty">' + label + '</div>';
    }

    async function renderPage(id) {
      const renderer = {
        dashboard: renderDashboard,
        customers: renderCustomers,
        virtualAccounts: renderVirtualAccounts,
        transactions: renderTransactions,
        transferGuard: renderTransferGuard,
        securityOverview: renderSecurityOverview,
        webhooks: renderWebhooks,
        trustEngine: renderTrustEngine,
        audit: renderAudit,
        settings: renderSettings
      }[id] || renderDashboard;

      await renderer();
    }

    async function renderDashboard() {
      const page = document.getElementById('page');
      page.innerHTML = loading('Loading dashboard...');
      try {
        const data = await api('/dashboard');
        document.getElementById('apiStatus').textContent = 'API connected';
        page.innerHTML = [
          '<div class="grid">',
          metric('Total Customers', data.customers),
          metric('Virtual Accounts', data.virtualAccounts),
          metric("Today's Transactions", data.transactionsToday),
          metric("Today's Webhooks", data.webhooksToday),
          metric('Risk Reviews', data.pendingRiskReviews),
          metric('Failed Transfers', data.failedTransfers),
          '<div class="card span-6"><h2>Recent Transactions</h2>' + transactionTable(data.recentActivity.transactions || [], 5) + '</div>',
          '<div class="card span-6"><h2>Recent Webhooks</h2>' + webhookList(data.recentActivity.webhooks || []) + '</div>',
          '<div class="card span-12"><h2>Recent Audit Logs</h2>' + auditTable(data.recentActivity.auditLogs || []) + '</div>',
          '</div>'
        ].join('');
      } catch (error) {
        page.innerHTML = errorCard(error);
      }
    }

    function metric(label, value) {
      return '<div class="card metric"><div class="label">' + label + '</div><div class="value">' + html(value) + '</div></div>';
    }

    async function renderCustomers() {
      const page = document.getElementById('page');
      page.innerHTML = loading('Loading customers...');
      try {
        state.customers = await api('/users?includeArchived=true');
        page.innerHTML = [
          '<div class="split">',
          customerForm(),
          '<div class="card"><h2>Customer List</h2><div class="toolbar"><input id="customerSearch" placeholder="Search customer" /><select id="customerArchiveFilter"><option value="active">Active</option><option value="archived">Archived</option><option value="all">All</option></select></div><div id="customerTable"></div></div>',
          '</div>',
          '<div class="card span-12" style="margin-top:14px;"><h2>Customer Profile</h2><div id="customerProfile">' + empty('Select a customer to view profile details.') + '</div></div>'
        ].join('');
        document.getElementById('createCustomerForm').addEventListener('submit', createCustomer);
        document.getElementById('customerSearch').addEventListener('input', renderCustomerTable);
        document.getElementById('customerArchiveFilter').addEventListener('change', renderCustomerTable);
        renderCustomerTable();
      } catch (error) {
        page.innerHTML = errorCard(error);
      }
    }

    function customerForm() {
      return [
        '<form class="card form" id="createCustomerForm">',
        '<h2>Create Customer</h2>',
        '<input name="firstName" placeholder="First name" required />',
        '<input name="lastName" placeholder="Last name" required />',
        '<input name="email" type="email" placeholder="Email" required />',
        '<input name="phoneNumber" placeholder="Phone number" />',
        '<button class="btn primary" type="submit">Create Customer</button>',
        '<div id="createCustomerResult"></div>',
        '</form>'
      ].join('');
    }

    async function createCustomer(event) {
      event.preventDefault();
      const form = event.currentTarget;
      const result = document.getElementById('createCustomerResult');
      const payload = Object.fromEntries(new FormData(form).entries());
      result.innerHTML = loading('Creating customer...');
      try {
        await api('/users', { method: 'POST', body: JSON.stringify(payload) });
        form.reset();
        result.innerHTML = '<div class="empty">Customer created.</div>';
        state.customers = await api('/users?includeArchived=true');
        renderCustomerTable();
      } catch (error) {
        result.innerHTML = errorCard(error);
      }
    }

    function renderCustomerTable() {
      const search = (document.getElementById('customerSearch')?.value || '').toLowerCase();
      const archiveFilter = document.getElementById('customerArchiveFilter')?.value || 'active';
      const rows = state.customers.filter((customer) => {
        const matchesSearch = JSON.stringify(customer).toLowerCase().includes(search);
        const archived = Boolean(customer.deletedAt);
        const matchesArchive = archiveFilter === 'all' || (archiveFilter === 'archived' ? archived : !archived);
        return matchesSearch && matchesArchive;
      });
      document.getElementById('customerTable').innerHTML = rows.length ? [
        '<div class="table-wrap"><table><thead><tr><th>Code</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead><tbody>',
        rows.map((customer) => [
          '<tr>',
          '<td>' + html(customerCode(customer)) + '</td>',
          '<td>' + html(person(customer)) + '</td>',
          '<td>' + html(customer.email) + '</td>',
          '<td>' + html(customer.phoneNumber || '--') + '</td>',
          '<td>' + badge(customer.deletedAt ? 'ARCHIVED' : customer.status) + '</td>',
          '<td>' + customerActions(customer) + '</td>',
          '</tr>'
        ].join('')).join(''),
        '</tbody></table></div>'
      ].join('') : empty('No customers found.');
    }

    function customerActions(customer) {
      return [
        '<button class="btn" onclick="loadCustomerProfile(\'' + customer.id + '\')">View</button>',
        customer.deletedAt ? '' : '<button class="btn" onclick="editCustomer(\'' + customer.id + '\')">Edit</button>',
        customer.deletedAt ? '<button class="btn primary" onclick="restoreCustomer(\'' + customer.id + '\')">Restore</button>' : '<button class="btn danger" onclick="archiveCustomer(\'' + customer.id + '\')">Archive</button>'
      ].filter(Boolean).join(' ');
    }

    async function editCustomer(id) {
      const customer = state.customers.find((item) => item.id === id);
      if (!customer) return;
      const firstName = prompt('First name', customer.firstName || '');
      if (firstName === null) return;
      const lastName = prompt('Last name', customer.lastName || '');
      if (lastName === null) return;
      const email = prompt('Email', customer.email || '');
      if (email === null) return;
      const phoneNumber = prompt('Phone number', customer.phoneNumber || '');
      if (phoneNumber === null) return;
      await api('/users/' + encodeURIComponent(id), {
        method: 'PATCH',
        body: JSON.stringify({ firstName, lastName, email, phoneNumber })
      });
      state.customers = await api('/users?includeArchived=true');
      renderCustomerTable();
    }

    async function archiveCustomer(id) {
      const customer = state.customers.find((item) => item.id === id);
      const activeAccounts = (customer?.virtualAccounts || []).filter((account) => account.status === 'ACTIVE');
      if (activeAccounts.length && !confirm('This customer owns active virtual accounts. Deleting will archive the customer while preserving payment history.')) {
        return;
      }
      await api('/users/' + encodeURIComponent(id), { method: 'DELETE' });
      state.customers = await api('/users?includeArchived=true');
      renderCustomerTable();
    }

    async function restoreCustomer(id) {
      await api('/users/' + encodeURIComponent(id) + '/restore', { method: 'PATCH' });
      state.customers = await api('/users?includeArchived=true');
      renderCustomerTable();
    }

    async function loadCustomerProfile(id) {
      const target = document.getElementById('customerProfile');
      target.innerHTML = loading('Loading profile...');
      try {
        const customer = await api('/users/' + encodeURIComponent(id));
        state.selectedCustomerId = id;
        state.trustUserId = id;
        target.innerHTML = [
          '<div class="grid">',
          '<div class="card span-4"><h3>Personal details</h3><p>' + html(customerCode(customer)) + '<br />' + html(person(customer)) + '<br />' + html(customer.email) + '<br />' + html(customer.phoneNumber || '--') + '</p>' + badge(customer.status) + '</div>',
          '<div class="card span-4"><h3>Dedicated Virtual Account</h3>' + smallList(customer.virtualAccounts, (item) => html(virtualAccountName(item)) + '<br />' + html(item.accountNumber || item.providerReference || '--')) + '</div>',
          '<div class="card span-4"><h3>Risk Score</h3><button class="btn primary" onclick="setPage(\'trustEngine\')">Open Trust Engine</button></div>',
          '<div class="card span-6"><h3>Trusted Devices</h3>' + smallList(customer.devices, (item) => html(item.name) + ' ' + badge(item.status)) + '</div>',
          '<div class="card span-6"><h3>Beneficiaries</h3>' + smallList(customer.beneficiaries, (item) => html(item.displayName) + ' ' + badge(item.status)) + '</div>',
          '<div class="card span-12"><h3>Recent Transactions</h3>' + transactionTable(customer.transactions || [], 10) + '</div>',
          '</div>'
        ].join('');
      } catch (error) {
        target.innerHTML = errorCard(error);
      }
    }

    function smallList(items, mapper) {
      return items && items.length ? items.map((item) => '<p>' + mapper(item) + '</p>').join('') : empty('No records yet.');
    }

    async function renderVirtualAccounts() {
      const page = document.getElementById('page');
      page.innerHTML = loading('Loading virtual accounts...');
      try {
        const [accounts, customers] = await Promise.all([api('/virtual-accounts?includeArchived=true'), api('/users')]);
        state.virtualAccounts = accounts;
        state.customers = customers;
        page.innerHTML = [
          '<div class="card"><h2>Virtual Accounts</h2>',
          '<div class="toolbar"><input id="vaSearch" placeholder="Search account" /><select id="vaStatusFilter"><option value="all">All</option><option value="ACTIVE">Active</option><option value="INACTIVE">Suspended</option><option value="CLOSED">Closed</option></select><button class="btn primary" onclick="openVirtualAccountCreate()">Create</button><input id="nombaLookup" placeholder="Nomba account ref or number" /><button class="btn" onclick="lookupNombaAccount()">Lookup</button></div>',
          '<div id="vaAction"></div><div id="vaTable"></div></div>'
        ].join('');
        document.getElementById('vaSearch').addEventListener('input', renderVirtualAccountTable);
        document.getElementById('vaStatusFilter').addEventListener('change', renderVirtualAccountTable);
        renderVirtualAccountTable();
      } catch (error) {
        page.innerHTML = errorCard(error);
      }
    }

    function renderVirtualAccountTable() {
      const search = (document.getElementById('vaSearch')?.value || '').toLowerCase();
      const statusFilter = document.getElementById('vaStatusFilter')?.value || 'all';
      const rows = state.virtualAccounts.filter((account) => {
        const matchesSearch = JSON.stringify(account).toLowerCase().includes(search);
        const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
        return matchesSearch && matchesStatus && !account.archivedAt;
      });
      document.getElementById('vaTable').innerHTML = rows.length ? [
        '<div class="table-wrap"><table><thead><tr><th>Customer</th><th>Account</th><th>Number</th><th>Reference</th><th>Status</th><th>Actions</th></tr></thead><tbody>',
        rows.map((account) => [
          '<tr>',
          '<td>' + html(account.user ? customerCode(account.user) + ' ' + person(account.user) : 'Unassigned') + '</td>',
          '<td>' + html(virtualAccountName(account)) + '</td>',
          '<td>' + html(account.accountNumber || '--') + '</td>',
          '<td>' + html(account.providerReference || '--') + '</td>',
          '<td>' + badge(account.status === 'INACTIVE' ? 'SUSPENDED' : account.status) + '</td>',
          '<td>' + virtualAccountActions(account) + '</td>',
          '</tr>'
        ].join('')).join(''),
        '</tbody></table></div>'
      ].join('') : empty('No virtual accounts found.');
    }

    function virtualAccountActions(account) {
      if (account.status === 'CLOSED' || account.archivedAt) {
        return '<button class="btn" onclick="viewVirtualAccount(\'' + account.id + '\')">View</button>';
      }

      return [
        '<button class="btn" onclick="viewVirtualAccount(\'' + account.id + '\')">View</button>',
        '<button class="btn" onclick="renameAccount(\'' + account.id + '\')">Rename</button>',
        '<button class="btn" onclick="suspendAccount(\'' + account.id + '\')">Suspend</button>',
        '<button class="btn danger" onclick="closeAccount(\'' + account.id + '\')">Close</button>',
        '<button class="btn" onclick="archiveVirtualAccount(\'' + account.id + '\')">Archive</button>'
      ].join(' ');
    }

    function openVirtualAccountCreate() {
      const customerOptions = state.customers.filter((customer) => !customer.deletedAt).map((customer) =>
        '<option value="' + html(customer.id) + '">' + html(customerCode(customer) + ' - ' + person(customer)) + '</option>'
      ).join('');
      document.getElementById('vaAction').innerHTML = [
        '<form class="form card" id="createVaForm" style="margin-bottom:14px;">',
        '<h3>Create Virtual Account</h3>',
        '<select name="userId" id="vaCustomer" required><option value="">Select customer</option>' + customerOptions + '</select>',
        '<input name="accountRef" id="vaAccountRef" placeholder="Unique account reference" required />',
        '<input name="accountName" placeholder="Account name" required />',
        '<input name="currency" value="NGN" required />',
        '<button class="btn primary" type="submit">Create via Nomba</button>',
        '</form>'
      ].join('');
      document.getElementById('vaCustomer').addEventListener('change', (event) => {
        document.getElementById('vaAccountRef').value = generatedAccountRef(event.currentTarget.value);
      });
      document.getElementById('createVaForm').addEventListener('submit', createVirtualAccount);
    }

    async function createVirtualAccount(event) {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
      try {
        await api('/virtual-accounts', { method: 'POST', body: JSON.stringify(payload) });
        await renderVirtualAccounts();
      } catch (error) {
        document.getElementById('vaAction').innerHTML = errorCard(error);
      }
    }

    async function lookupNombaAccount() {
      const value = document.getElementById('nombaLookup').value.trim();
      if (!value) return;
      const target = document.getElementById('vaAction');
      target.innerHTML = loading('Looking up Nomba account...');
      try {
        const data = await api('/virtual-accounts/nomba/' + encodeURIComponent(value));
        target.innerHTML = '<div class="card"><pre>' + html(JSON.stringify(data, null, 2)) + '</pre></div>';
      } catch (error) {
        target.innerHTML = errorCard(error);
      }
    }

    async function renameAccount(id) {
      const accountName = prompt('New account name');
      if (!accountName) return;
      await api('/virtual-accounts/' + id, { method: 'PATCH', body: JSON.stringify({ accountName }) });
      await renderVirtualAccounts();
    }

    async function viewVirtualAccount(id) {
      const account = state.virtualAccounts.find((item) => item.id === id) || await api('/virtual-accounts/' + encodeURIComponent(id));
      document.getElementById('vaAction').innerHTML = '<div class="card"><h3>Virtual Account</h3><pre>' + html(JSON.stringify(account, null, 2)) + '</pre></div>';
    }

    async function suspendAccount(id) {
      await api('/virtual-accounts/' + id + '/suspend', { method: 'PATCH' });
      await renderVirtualAccounts();
    }

    async function closeAccount(id) {
      await api('/virtual-accounts/' + id + '/close', { method: 'PATCH' });
      await renderVirtualAccounts();
    }

    async function archiveVirtualAccount(id) {
      await api('/virtual-accounts/' + id + '/archive', { method: 'PATCH' });
      await renderVirtualAccounts();
    }

    async function renderTransferGuard() {
      const page = document.getElementById('page');
      page.innerHTML = loading('Loading Transfer Guard...');
      try {
        const [customers, accounts, transfers] = await Promise.all([
          api('/users'),
          api('/virtual-accounts'),
          api('/transfers')
        ]);
        state.customers = customers;
        state.virtualAccounts = accounts;
        state.transfers = transfers;
        const customerOptions = customers.map((customer) =>
          '<option value="' + html(customer.id) + '">' + html(customerCode(customer) + ' - ' + person(customer)) + '</option>'
        ).join('');
        const accountOptions = accounts.map((account) =>
          '<option value="' + html(account.id) + '">' + html((account.accountNumber || account.providerReference || account.id) + ' - ' + virtualAccountName(account)) + '</option>'
        ).join('');
        page.innerHTML = [
          '<div class="split">',
          '<div class="card"><h2>Transfer Money</h2><form class="form" id="transferGuardForm">',
          '<select name="userId" required><option value="">Customer</option>' + customerOptions + '</select>',
          '<select name="virtualAccountId"><option value="">Virtual Account</option>' + accountOptions + '</select>',
          '<input name="recipientBank" placeholder="Recipient Bank" required />',
          '<input name="recipientBankCode" placeholder="Recipient Bank Code" required />',
          '<input name="recipientAccount" placeholder="Recipient Account" required />',
          '<input name="amount" type="number" min="1" step="0.01" placeholder="Amount" required />',
          '<input name="narration" placeholder="Narration" />',
          '<button class="btn primary" type="submit">Run Transfer Guard</button>',
          '</form><div id="transferGuardResult"></div></div>',
          '<div class="card"><h2>Recent Guarded Transfers</h2>' + transactionTable(transfers || [], 8, transfers.length) + '</div>',
          '</div>'
        ].join('');
        document.getElementById('transferGuardForm').addEventListener('submit', submitTransferGuard);
      } catch (error) {
        page.innerHTML = errorCard(error);
      }
    }

    async function submitTransferGuard(event) {
      event.preventDefault();
      const form = event.currentTarget;
      const target = document.getElementById('transferGuardResult');
      const payload = Object.fromEntries(new FormData(form).entries());
      if (!payload.virtualAccountId) {
        delete payload.virtualAccountId;
      }
      target.innerHTML = loading('Checking recipient and running Trust Engine...');
      try {
        const result = await api('/transfers', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        target.innerHTML = [
          '<div class="card" style="margin-top:14px;"><h3>Decision</h3>',
          badge(result.decision),
          '<p>' + html(result.message) + '</p>',
          '<h3>Risk Score</h3><p>' + html(result.riskScore) + '</p>',
          '<h3>Reasons</h3>' + smallList(result.reasons || [], (reason) => html(reason)),
          '<h3>Recipient Lookup</h3><pre>' + html(JSON.stringify(result.accountLookup || {}, null, 2)) + '</pre>',
          '</div>'
        ].join('');
        if (result.decision === 'ALLOW') {
          form.reset();
        }
      } catch (error) {
        target.innerHTML = errorCard(error);
      }
    }

    async function renderTransactions() {
      const page = document.getElementById('page');
      page.innerHTML = loading('Loading transactions...');
      try {
        const [transactions, customers] = await Promise.all([api('/transactions'), api('/users')]);
        state.transactions = transactions;
        state.customers = customers;
        const customerOptions = transactionCustomerOptions();
        page.innerHTML = [
          '<div class="card"><h2>Transactions</h2>',
          '<div class="toolbar">',
          '<select id="txDirectionFilter"><option value="">All Directions</option><option value="CREDIT">Incoming</option><option value="DEBIT">Outgoing</option></select>',
          '<select id="txStatusFilter"><option value="">All Statuses</option><option value="SUCCESS">Successful</option><option value="PENDING">Pending</option><option value="FAILED">Failed</option></select>',
          '<input id="txStartDate" type="date" aria-label="Start date" />',
          '<input id="txEndDate" type="date" aria-label="End date" />',
          '<select id="txCustomerFilter"><option value="">All Customers</option>' + customerOptions + '</select>',
          '</div><div id="txTable"></div><div id="txDetail"></div></div>'
        ].join('');
        ['txDirectionFilter', 'txStatusFilter', 'txStartDate', 'txEndDate', 'txCustomerFilter'].forEach((id) => {
          document.getElementById(id).addEventListener('change', renderTransactionFilter);
        });
        renderTransactionFilter();
      } catch (error) {
        page.innerHTML = errorCard(error);
      }
    }

    function renderTransactionFilter() {
      const direction = document.getElementById('txDirectionFilter')?.value || '';
      const status = document.getElementById('txStatusFilter')?.value || '';
      const startDate = document.getElementById('txStartDate')?.value || '';
      const endDate = document.getElementById('txEndDate')?.value || '';
      const customerId = document.getElementById('txCustomerFilter')?.value || '';
      const startTime = startDate ? new Date(startDate + 'T00:00:00').getTime() : null;
      const endTime = endDate ? new Date(endDate + 'T23:59:59').getTime() : null;
      const rows = state.transactions.filter((tx) => {
        const txTime = new Date(tx.createdAt || tx.occurredAt).getTime();
        const txCustomerId = tx.user?.id || tx.userId || '';
        const matchesDirection = !direction || tx.direction === direction;
        const matchesStatus = !status || tx.status === status;
        const matchesStart = !startTime || txTime >= startTime;
        const matchesEnd = !endTime || txTime <= endTime;
        const matchesCustomer = !customerId || txCustomerId === customerId;
        return matchesDirection && matchesStatus && matchesStart && matchesEnd && matchesCustomer;
      });
      document.getElementById('txTable').innerHTML = transactionTable(rows, undefined, state.transactions.length);
      const detail = document.getElementById('txDetail');
      if (detail) {
        detail.innerHTML = '';
      }
    }

    function transactionTable(rows, limit, totalCount) {
      const items = typeof limit === 'number' ? rows.slice(0, limit) : rows;
      const knownTotal = typeof totalCount === 'number' ? totalCount : rows.length;
      if (!items.length && knownTotal > 0) {
        return [
          '<div class="table-wrap"><table><thead><tr><th>Amount</th><th>Currency</th><th>Direction</th><th>Sender</th><th>Receiver</th><th>Narration</th><th>Reference</th><th>Session ID</th><th>Virtual Account</th><th>Customer</th><th>Created Time</th><th>Payment Status</th></tr></thead><tbody>',
          '<tr><td colspan="12">No matching transactions.</td></tr>',
          '</tbody></table></div>'
        ].join('');
      }
      return items.length ? [
        '<div class="table-wrap"><table><thead><tr><th>Amount</th><th>Currency</th><th>Direction</th><th>Sender</th><th>Receiver</th><th>Narration</th><th>Reference</th><th>Session ID</th><th>Virtual Account</th><th>Customer</th><th>Created Time</th><th>Payment Status</th></tr></thead><tbody>',
        items.map((tx) => [
          '<tr class="click-row" onclick="openTransactionDetail(\'' + html(tx.id) + '\')">',
          '<td>' + html(Number(tx.amount || 0).toLocaleString()) + '</td>',
          '<td>' + html(tx.currency || 'NGN') + '</td>',
          '<td>' + badge(tx.direction) + '<br /><span class="badge">' + html(txType(tx)) + '</span></td>',
          '<td>' + html(txSenderName(tx)) + '</td>',
          '<td>' + html(txReceiverName(tx)) + '</td>',
          '<td>' + html(tx.narration || txNombaTransaction(tx).narration || '--') + '</td>',
          '<td>' + html(txReference(tx)) + '</td>',
          '<td>' + html(txSessionId(tx)) + '</td>',
          '<td>' + html(txVirtualAccountNumber(tx)) + '</td>',
          '<td>' + html(person(tx.user)) + '</td>',
          '<td>' + date(tx.createdAt || tx.occurredAt) + '</td>',
          '<td>' + badge(tx.status) + '</td>',
          '</tr>'
        ].join('')).join(''),
        '</tbody></table></div>'
      ].join('') : empty('No transactions found.');
    }

    function transactionCustomerOptions() {
      const known = new Map();
      state.customers.forEach((customer) => known.set(customer.id, customer));
      state.transactions.forEach((tx) => {
        if (tx.user?.id) {
          known.set(tx.user.id, tx.user);
        }
      });
      return Array.from(known.values()).map((customer) =>
        '<option value="' + html(customer.id) + '">' + html(customerCode(customer) + ' - ' + person(customer)) + '</option>'
      ).join('');
    }

    function openTransactionDetail(id) {
      const detail = document.getElementById('txDetail');
      if (!detail) return;
      const tx = state.transactions.find((item) => item.id === id);
      if (!tx) return;
      detail.innerHTML = [
        '<div class="card drawer"><h2>Transaction Detail</h2><div class="grid">',
        '<div class="card span-4"><h3>Amount</h3><p>' + money(tx.amount, tx.currency) + '</p></div>',
        '<div class="card span-4"><h3>Payment Status</h3>' + badge(tx.status) + '</div>',
        '<div class="card span-4"><h3>Direction</h3>' + badge(tx.direction) + '</div>',
        '<div class="card span-6"><h3>Sender</h3><p>' + html(txSenderName(tx)) + '</p></div>',
        '<div class="card span-6"><h3>Receiver</h3><p>' + html(txReceiverName(tx)) + '</p></div>',
        '<div class="card span-6"><h3>Reference</h3><p>' + html(txReference(tx)) + '<br />' + html(txSessionId(tx)) + '</p></div>',
        '<div class="card span-6"><h3>Virtual Account</h3><p>' + html(txVirtualAccountNumber(tx)) + '<br />' + html(person(tx.user)) + '</p></div>',
        '<div class="card span-12"><h3>Narration</h3><p>' + html(tx.narration || txNombaTransaction(tx).narration || '--') + '</p></div>',
        '<div class="card span-12"><h3>Raw Transaction</h3><pre>' + html(JSON.stringify(tx, null, 2)) + '</pre></div>',
        '</div></div>'
      ].join('');
      detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    async function renderSecurityOverview() {
      const page = document.getElementById('page');
      page.innerHTML = loading('Loading security overview...');
      try {
        const [customers, virtualAccounts, transactions, webhooks, audit] = await Promise.all([
          api('/users'),
          api('/virtual-accounts'),
          api('/transactions'),
          api('/webhooks/events'),
          api('/audit')
        ]);
        const trustResults = await Promise.all(customers.slice(0, 20).map(async (customer) => {
          try {
            const decision = await api('/trust-engine/users/' + encodeURIComponent(customer.id) + '/decision');
            return { customer, decision };
          } catch {
            return { customer, decision: null };
          }
        }));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const incoming = transactions.filter((tx) => tx.direction === 'CREDIT');
        const outgoing = transactions.filter((tx) => tx.direction === 'DEBIT');
        const blockedAudits = audit.filter((log) => log.action === 'TRANSFER_GUARD_BLOCK');
        const transactionsToday = transactions.filter((tx) => new Date(tx.createdAt || tx.occurredAt) >= today);
        const scores = trustResults.map((item) => item.decision?.assessment?.score).filter((score) => Number.isFinite(Number(score))).map(Number);
        const averageTrustScore = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
        const highRiskCustomers = trustResults.filter((item) => ['BLOCK', 'REVIEW'].includes(item.decision?.action) || ['HIGH', 'CRITICAL'].includes(item.decision?.assessment?.riskLevel)).length;
        const securityAlerts = audit.filter((log) => ['HIGH', 'CRITICAL'].includes(log.severity)).slice(0, 6);
        const decisions = trustResults.reduce((acc, item) => {
          const key = item.decision?.action || 'UNKNOWN';
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
        page.innerHTML = [
          '<div class="grid">',
          metric('Total Customers', customers.length),
          metric('Active Virtual Accounts', virtualAccounts.filter((account) => account.status === 'ACTIVE').length),
          metric('Incoming Payments', incoming.length),
          metric('Outgoing Payments', outgoing.length),
          metric('Blocked Transfers', blockedAudits.length),
          metric('Transactions Today', transactionsToday.length),
          metric('Average Trust Score', averageTrustScore),
          metric('High Risk Customers', highRiskCustomers),
          '<div class="card span-6"><h2>Incoming Payments over time</h2>' + timeSeriesChart(incoming, 'createdAt') + '</div>',
          '<div class="card span-6"><h2>Trust Score Distribution</h2>' + scoreDistributionChart(scores) + '</div>',
          '<div class="card span-6"><h2>Risk Decisions</h2>' + decisionChart(decisions) + '</div>',
          '<div class="card span-6"><h2>Transaction Volume</h2>' + transactionVolumeChart(transactions) + '</div>',
          '<div class="card span-6"><h2>Recent Security Alerts</h2>' + auditTable(securityAlerts) + '</div>',
          '<div class="card span-6"><h2>Recent Webhook Events</h2>' + webhookList(webhooks.slice(0, 5)) + '</div>',
          '<div class="card span-6"><h2>Recent Audit Logs</h2>' + auditTable(audit.slice(0, 5)) + '</div>',
          '<div class="card span-6"><h2>Recent Transfers</h2>' + transactionTable(outgoing.slice(0, 5), 5, outgoing.length) + '</div>',
          '</div>'
        ].join('');
      } catch (error) {
        page.innerHTML = errorCard(error);
      }
    }

    function timeSeriesChart(rows, dateField) {
      const buckets = lastSevenDayBuckets();
      rows.forEach((row) => {
        const key = new Date(row[dateField] || row.occurredAt).toISOString().slice(0, 10);
        if (Object.prototype.hasOwnProperty.call(buckets, key)) buckets[key] += 1;
      });
      const max = Math.max(1, ...Object.values(buckets));
      return Object.entries(buckets).map(([day, value]) => chartBar(day.slice(5), value, max)).join('');
    }

    function scoreDistributionChart(scores) {
      const buckets = { '0-39': 0, '40-59': 0, '60-79': 0, '80-100': 0 };
      scores.forEach((score) => {
        if (score < 40) buckets['0-39'] += 1;
        else if (score < 60) buckets['40-59'] += 1;
        else if (score < 80) buckets['60-79'] += 1;
        else buckets['80-100'] += 1;
      });
      const max = Math.max(1, ...Object.values(buckets));
      return Object.entries(buckets).map(([label, value]) => chartBar(label, value, max)).join('');
    }

    function decisionChart(decisions) {
      const rows = { ALLOW: decisions.ALLOW || 0, REVIEW: decisions.REVIEW || 0, BLOCK: decisions.BLOCK || 0 };
      const max = Math.max(1, ...Object.values(rows));
      return Object.entries(rows).map(([label, value]) => chartBar(label, value, max)).join('');
    }

    function transactionVolumeChart(transactions) {
      const rows = {
        Incoming: transactions.filter((tx) => tx.direction === 'CREDIT').length,
        Outgoing: transactions.filter((tx) => tx.direction === 'DEBIT').length,
        Successful: transactions.filter((tx) => tx.status === 'SUCCESS').length,
        Failed: transactions.filter((tx) => tx.status === 'FAILED').length,
      };
      const max = Math.max(1, ...Object.values(rows));
      return Object.entries(rows).map(([label, value]) => chartBar(label, value, max)).join('');
    }

    function lastSevenDayBuckets() {
      return Array.from({ length: 7 }).reduce((acc, _, index) => {
        const day = new Date();
        day.setDate(day.getDate() - (6 - index));
        acc[day.toISOString().slice(0, 10)] = 0;
        return acc;
      }, {});
    }

    async function renderWebhooks() {
      const page = document.getElementById('page');
      page.innerHTML = loading('Loading webhook events...');
      try {
        state.webhooks = await api('/webhooks/events');
        page.innerHTML = '<div class="card"><h2>Live Event Monitor</h2><div class="toolbar"><input id="webhookSearch" placeholder="Search transaction, virtual account, sender, request ID" /></div><div id="webhookList"></div></div>';
        document.getElementById('webhookSearch').addEventListener('input', renderWebhookFilter);
        renderWebhookFilter();
      } catch (error) {
        page.innerHTML = errorCard(error);
      }
    }

    function renderWebhookFilter() {
      const search = (document.getElementById('webhookSearch')?.value || '').toLowerCase();
      const rows = state.webhooks.filter((event) => [
        webhookTransactionId(event),
        webhookVirtualAccount(event),
        webhookSender(event),
        webhookRequestId(event)
      ].join(' ').toLowerCase().includes(search));
      document.getElementById('webhookList').innerHTML = webhookList(rows);
    }

    function webhookList(rows) {
      return rows.length ? rows.map((event) => webhookCard(event)).join('') : empty('No webhook events found.');
    }

    function webhookCard(event) {
      const transactionStatus = event.processedAt ? 'PROCESSED' : event.errorMessage ? 'FAILED' : 'PENDING';
      const matchingResult = {
        virtualAccount: webhookVirtualAccount(event),
        requestId: webhookRequestId(event),
        processedAt: event.processedAt,
        errorMessage: event.errorMessage
      };
      return [
        '<details class="card" style="margin-bottom:10px;">',
        '<summary style="cursor:pointer;">',
        '<div class="toolbar" style="margin:0;">',
        '<strong>' + html(event.eventType) + '</strong>',
        '<span class="badge">' + date(event.receivedAt) + '</span>',
        '<span class="badge">' + html(webhookAmountLabel(event)) + '</span>',
        '<span class="badge">' + html(webhookSender(event)) + '</span>',
        '<span class="badge">' + html(webhookVirtualAccount(event)) + '</span>',
        badge(event.verified ? 'VERIFIED' : 'UNVERIFIED'),
        badge(transactionStatus),
        '<span class="btn">Expand</span>',
        '</div>',
        '</summary>',
        '<div style="margin-top:12px;">',
        '<h3>Webhook Payload</h3><pre>' + html(JSON.stringify(event.payload, null, 2)) + '</pre>',
        '<h3>Headers</h3><pre>' + html(JSON.stringify(event.headers || {}, null, 2)) + '</pre>',
        '<h3>Matching Result</h3><pre>' + html(JSON.stringify(matchingResult, null, 2)) + '</pre>',
        '<h3>References</h3><pre>Audit Log Resource: WebhookEvent ' + html(event.id) + '\\nTransaction Reference: ' + html(webhookTransactionId(event)) + '</pre>',
        '</div>',
        '</details>'
      ].join('');
    }

    async function renderTrustEngine() {
      const page = document.getElementById('page');
      const defaultUser = state.trustUserId || state.selectedCustomerId || '';
      if (!state.customers.length) {
        try {
          state.customers = await api('/users');
        } catch (error) {
          page.innerHTML = errorCard(error);
          return;
        }
      }
      const customerOptions = state.customers.map((customer) =>
        '<option value="' + html(customer.id) + '"' + (customer.id === defaultUser ? ' selected' : '') + '>' + html(customerCode(customer) + ' - ' + person(customer)) + '</option>'
      ).join('');
      page.innerHTML = [
        '<div class="card"><h2>Trust Engine</h2><div class="toolbar"><select id="trustUserId"><option value="">Select customer</option>' + customerOptions + '</select><button class="btn primary" onclick="loadTrustDecision()">Load Decision</button><button class="btn" onclick="loadTrustScore()">Load Score</button></div><div id="trustResult">' + empty('Select a customer to inspect risk.') + '</div></div>'
      ].join('');
    }

    async function loadTrustScore() {
      await loadTrust('/trust-engine/users/' + encodeURIComponent(document.getElementById('trustUserId').value.trim()) + '/score');
    }

    async function loadTrustDecision() {
      await loadTrust('/trust-engine/users/' + encodeURIComponent(document.getElementById('trustUserId').value.trim()) + '/decision');
    }

    async function loadTrust(path) {
      const target = document.getElementById('trustResult');
      target.innerHTML = loading('Evaluating trust...');
      try {
        const data = await api(path);
        target.innerHTML = '<div class="grid"><div class="card span-4"><h3>Trust Score</h3><div class="value" style="font-size:42px;font-weight:800;">' + html(data.score || data.assessment?.score) + '</div></div><div class="card span-4"><h3>Decision</h3>' + badge(data.action || data.riskLevel || data.assessment?.riskLevel) + '</div><div class="card span-4"><h3>Reason</h3><p>' + html(data.reason || data.summary || '') + '</p></div><div class="card span-6"><h3>Customer Metrics</h3><pre>' + html(JSON.stringify(data.assessment?.metrics || data.metrics || {}, null, 2)) + '</pre></div><div class="card span-6"><h3>Risk Factors</h3><pre>' + html(JSON.stringify(data.assessment?.signals || data.signals || [], null, 2)) + '</pre></div></div>';
      } catch (error) {
        target.innerHTML = errorCard(error);
      }
    }

    async function renderAudit() {
      const page = document.getElementById('page');
      page.innerHTML = loading('Loading audit logs...');
      try {
        state.audit = await api('/audit');
        page.innerHTML = [
          '<div class="card"><h2>Audit Logs</h2>',
          '<div class="toolbar"><select id="auditFilter"><option value="">All</option><option value="Security">Security</option><option value="Webhook">Webhook</option><option value="Customer">Customer</option><option value="Transfer">Transfer</option><option value="System">System</option></select></div>',
          '<div id="auditTable"></div></div>'
        ].join('');
        document.getElementById('auditFilter').addEventListener('change', renderAuditFilter);
        renderAuditFilter();
      } catch (error) {
        page.innerHTML = errorCard(error);
      }
    }

    function renderAuditFilter() {
      const filter = document.getElementById('auditFilter')?.value || '';
      const rows = filter ? state.audit.filter((log) => auditCategory(log) === filter) : state.audit;
      document.getElementById('auditTable').innerHTML = auditTable(rows);
    }

    function auditTable(rows) {
      return rows.length ? [
        '<div class="table-wrap"><table><thead><tr><th>Severity</th><th>Action</th><th>Actor</th><th>Time</th><th>Linked Customer</th><th>Linked Transaction</th><th>Linked Virtual Account</th><th>Webhook Reference</th></tr></thead><tbody>',
        rows.map((log) => [
          '<tr>',
          '<td>' + badge(log.severity) + '</td>',
          '<td>' + html(log.action) + '</td>',
          '<td>' + badge(log.actorType) + '</td>',
          '<td>' + date(log.createdAt) + '</td>',
          '<td>' + html(log.user ? customerCode(log.user) + ' ' + person(log.user) : log.userId || '--') + '</td>',
          '<td>' + html(auditLinkedTransaction(log)) + '</td>',
          '<td>' + html(auditLinkedVirtualAccount(log)) + '</td>',
          '<td>' + html(auditWebhookReference(log)) + '</td>',
          '</tr>'
        ].join('')).join(''),
        '</tbody></table></div>'
      ].join('') : empty('No audit logs found.');
    }

    function renderSettings() {
      const webhookEndpoint = window.location.origin + '/webhooks/nomba';
      const environment = window.location.hostname.includes('localhost') || window.location.hostname === '127.0.0.1' ? 'Local Development' : 'Production';
      const renderDeployment = window.location.hostname.includes('onrender.com') ? 'Render Live Service' : 'Local Preview';
      document.getElementById('page').innerHTML = [
        '<div class="grid">',
        '<div class="card span-6"><h2>Connection Status</h2><div class="status-list">' + statusRow('Webhook Status', 'Receiving signed notifications', 'ACTIVE') + statusRow('Signature Verification', 'HMAC-SHA256 enabled', 'ACTIVE') + statusRow('Nomba Connection', 'Configured', 'ACTIVE') + statusRow('Environment', environment, 'ACTIVE') + statusRow('Render Deployment', renderDeployment, 'ACTIVE') + statusRow('Database', 'Connected through Prisma', 'ACTIVE') + '</div></div>',
        '<div class="card span-6"><h2>Webhook Integration</h2><p>TrustVault securely receives payment notifications from Nomba using signed webhooks.</p><p>Every event is cryptographically verified before being reconciled into customer transactions.</p><p>Verified events automatically:</p><p>- Create audit records<br />- Update payment history<br />- Link virtual accounts<br />- Feed Trust Engine analysis</p><h3>Webhook Endpoint</h3><pre>' + html(webhookEndpoint) + '</pre></div>',
        '</div>'
      ].join('');
    }

    renderNav();
    setPage((window.location.hash || '#dashboard').replace('#', ''));
  </script>
</body>
</html>`;
  }
}
