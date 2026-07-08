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
      webhooks: ['Webhooks', 'Live event monitor for signed payment and transfer events.'],
      trustEngine: ['Trust Engine', 'Inspect customer trust scores, decisions, and risk signals.'],
      audit: ['Audit Logs', 'Trace administrative and security-relevant actions.'],
      settings: ['Settings', 'Runtime integration status and endpoint map.']
    };

    const state = {
      customers: [],
      virtualAccounts: [],
      transactions: [],
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
    const customerCode = (userOrId) => {
      const id = typeof userOrId === 'string' ? userOrId : userOrId?.id;
      return id ? 'TV-' + id.replace(/-/g, '').slice(0, 8).toUpperCase() : '--';
    };
    const generatedAccountRef = (userId) => {
      const suffix = userId ? userId.replace(/-/g, '').slice(0, 6) : Math.random().toString(36).slice(2, 8);
      return 'tv-' + suffix + '-' + Date.now().toString(36);
    };
    const tone = (value) => ['SUCCESS', 'ACTIVE', 'TRUSTED', 'ALLOW', true].includes(value) ? 'good' : ['PENDING', 'REVIEW', 'STEP_UP'].includes(value) ? 'warn' : ['FAILED', 'REVERSED', 'SUSPENDED', 'REVOKED', 'BLOCK', false].includes(value) ? 'bad' : '';
    const badge = (value) => '<span class="badge ' + tone(value) + '">' + html(value) + '</span>';

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
        state.customers = await api('/users');
        page.innerHTML = [
          '<div class="split">',
          customerForm(),
          '<div class="card"><h2>Customer List</h2><div class="toolbar"><input id="customerSearch" placeholder="Search customer" /></div><div id="customerTable"></div></div>',
          '</div>',
          '<div class="card span-12" style="margin-top:14px;"><h2>Customer Profile</h2><div id="customerProfile">' + empty('Select a customer to view profile details.') + '</div></div>'
        ].join('');
        document.getElementById('createCustomerForm').addEventListener('submit', createCustomer);
        document.getElementById('customerSearch').addEventListener('input', renderCustomerTable);
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
        state.customers = await api('/users');
        renderCustomerTable();
      } catch (error) {
        result.innerHTML = errorCard(error);
      }
    }

    function renderCustomerTable() {
      const search = (document.getElementById('customerSearch')?.value || '').toLowerCase();
      const rows = state.customers.filter((customer) => JSON.stringify(customer).toLowerCase().includes(search));
      document.getElementById('customerTable').innerHTML = rows.length ? [
        '<div class="table-wrap"><table><thead><tr><th>Code</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th></th></tr></thead><tbody>',
        rows.map((customer) => [
          '<tr>',
          '<td>' + html(customerCode(customer)) + '</td>',
          '<td>' + html(person(customer)) + '</td>',
          '<td>' + html(customer.email) + '</td>',
          '<td>' + html(customer.phoneNumber || '--') + '</td>',
          '<td>' + badge(customer.status) + '</td>',
          '<td><button class="btn" onclick="loadCustomerProfile(\'' + customer.id + '\')">View</button></td>',
          '</tr>'
        ].join('')).join(''),
        '</tbody></table></div>'
      ].join('') : empty('No customers found.');
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
        const [accounts, customers] = await Promise.all([api('/virtual-accounts'), api('/users')]);
        state.virtualAccounts = accounts;
        state.customers = customers;
        page.innerHTML = [
          '<div class="card"><h2>Virtual Accounts</h2>',
          '<div class="toolbar"><input id="vaSearch" placeholder="Search account" /><button class="btn primary" onclick="openVirtualAccountCreate()">Create</button><input id="nombaLookup" placeholder="Nomba account ref or number" /><button class="btn" onclick="lookupNombaAccount()">Lookup</button></div>',
          '<div id="vaAction"></div><div id="vaTable"></div></div>'
        ].join('');
        document.getElementById('vaSearch').addEventListener('input', renderVirtualAccountTable);
        renderVirtualAccountTable();
      } catch (error) {
        page.innerHTML = errorCard(error);
      }
    }

    function renderVirtualAccountTable() {
      const search = (document.getElementById('vaSearch')?.value || '').toLowerCase();
      const rows = state.virtualAccounts.filter((account) => JSON.stringify(account).toLowerCase().includes(search));
      document.getElementById('vaTable').innerHTML = rows.length ? [
        '<div class="table-wrap"><table><thead><tr><th>Customer</th><th>Account</th><th>Number</th><th>Reference</th><th>Status</th><th>Actions</th></tr></thead><tbody>',
        rows.map((account) => [
          '<tr>',
          '<td>' + html(account.user ? customerCode(account.user) + ' ' + person(account.user) : 'Unassigned') + '</td>',
          '<td>' + html(virtualAccountName(account)) + '</td>',
          '<td>' + html(account.accountNumber || '--') + '</td>',
          '<td>' + html(account.providerReference || '--') + '</td>',
          '<td>' + badge(account.status) + '</td>',
          '<td><button class="btn" onclick="renameAccount(\'' + account.id + '\')">Rename</button> <button class="btn" onclick="suspendAccount(\'' + account.id + '\')">Suspend</button> <button class="btn danger" onclick="closeAccount(\'' + account.id + '\')">Close</button></td>',
          '</tr>'
        ].join('')).join(''),
        '</tbody></table></div>'
      ].join('') : empty('No virtual accounts found.');
    }

    function openVirtualAccountCreate() {
      const customerOptions = state.customers.map((customer) =>
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

    async function suspendAccount(id) {
      await api('/virtual-accounts/' + id + '/suspend', { method: 'PATCH' });
      await renderVirtualAccounts();
    }

    async function closeAccount(id) {
      await api('/virtual-accounts/' + id + '/close', { method: 'PATCH' });
      await renderVirtualAccounts();
    }

    async function renderTransactions() {
      const page = document.getElementById('page');
      page.innerHTML = loading('Loading transactions...');
      try {
        state.transactions = await api('/transactions');
        page.innerHTML = '<div class="card"><h2>Transactions</h2><div class="toolbar"><select id="txFilter"><option value="">All</option><option value="CREDIT">Incoming</option><option value="DEBIT">Outgoing</option><option value="SUCCESS">Successful</option><option value="FAILED">Failed</option><option value="PENDING">Pending</option></select></div><div id="txTable"></div></div>';
        document.getElementById('txFilter').addEventListener('change', renderTransactionFilter);
        renderTransactionFilter();
      } catch (error) {
        page.innerHTML = errorCard(error);
      }
    }

    function renderTransactionFilter() {
      const filter = document.getElementById('txFilter').value;
      const rows = filter ? state.transactions.filter((tx) => tx.direction === filter || tx.status === filter) : state.transactions;
      document.getElementById('txTable').innerHTML = transactionTable(rows);
    }

    function transactionTable(rows, limit) {
      const items = typeof limit === 'number' ? rows.slice(0, limit) : rows;
      return items.length ? [
        '<div class="table-wrap"><table><thead><tr><th>Reference</th><th>Amount</th><th>Status</th><th>Direction</th><th>Customer</th><th>Timestamp</th></tr></thead><tbody>',
        items.map((tx) => [
          '<tr>',
          '<td>' + html(tx.reference) + '</td>',
          '<td>' + money(tx.amount, tx.currency) + '</td>',
          '<td>' + badge(tx.status) + '</td>',
          '<td>' + badge(tx.direction) + '</td>',
          '<td>' + html(person(tx.user)) + '</td>',
          '<td>' + date(tx.createdAt || tx.occurredAt) + '</td>',
          '</tr>'
        ].join('')).join(''),
        '</tbody></table></div>'
      ].join('') : empty('No transactions found.');
    }

    async function renderWebhooks() {
      const page = document.getElementById('page');
      page.innerHTML = loading('Loading webhook events...');
      try {
        state.webhooks = await api('/webhooks/events');
        page.innerHTML = '<div class="card"><h2>Live Event Monitor</h2>' + webhookList(state.webhooks, true) + '</div>';
      } catch (error) {
        page.innerHTML = errorCard(error);
      }
    }

    function webhookList(rows, includePayload) {
      return rows.length ? rows.map((event) => [
        '<div class="card" style="margin-bottom:10px;">',
        '<div class="toolbar"><strong>' + html(event.eventType) + '</strong>' + badge(event.verified) + badge(event.processedAt ? 'PROCESSED' : 'PENDING') + '<span class="badge">' + date(event.receivedAt) + '</span></div>',
        includePayload ? '<pre>' + html(JSON.stringify(event.payload, null, 2)) + '</pre>' : '',
        '</div>'
      ].join('')).join('') : empty('No webhook events found.');
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
        target.innerHTML = '<div class="grid"><div class="card span-4"><h3>Trust Score</h3><div class="value" style="font-size:42px;font-weight:800;">' + html(data.score || data.assessment?.score) + '</div></div><div class="card span-4"><h3>Decision</h3>' + badge(data.action || data.riskLevel || data.assessment?.riskLevel) + '</div><div class="card span-4"><h3>Reason</h3><p>' + html(data.reason || data.summary || '') + '</p></div><div class="card span-12"><h3>Risk Factors</h3><pre>' + html(JSON.stringify(data.assessment?.signals || data.signals || [], null, 2)) + '</pre></div></div>';
      } catch (error) {
        target.innerHTML = errorCard(error);
      }
    }

    async function renderAudit() {
      const page = document.getElementById('page');
      page.innerHTML = loading('Loading audit logs...');
      try {
        state.audit = await api('/audit');
        page.innerHTML = '<div class="card"><h2>Audit Logs</h2>' + auditTable(state.audit) + '</div>';
      } catch (error) {
        page.innerHTML = errorCard(error);
      }
    }

    function auditTable(rows) {
      return rows.length ? [
        '<div class="table-wrap"><table><thead><tr><th>Action</th><th>Actor</th><th>Resource</th><th>Severity</th><th>Timestamp</th></tr></thead><tbody>',
        rows.map((log) => [
          '<tr>',
          '<td>' + html(log.action) + '</td>',
          '<td>' + badge(log.actorType) + '</td>',
          '<td>' + html(log.resourceType) + '<br />' + html(log.resourceId || '--') + '</td>',
          '<td>' + badge(log.severity) + '</td>',
          '<td>' + date(log.createdAt) + '</td>',
          '</tr>'
        ].join('')).join(''),
        '</tbody></table></div>'
      ].join('') : empty('No audit logs found.');
    }

    function renderSettings() {
      document.getElementById('page').innerHTML = [
        '<div class="grid">',
        '<div class="card span-6"><h2>Connected API Routes</h2><pre>GET /dashboard\nGET /users\nPOST /users\nGET /users/:id\nGET /virtual-accounts\nPOST /virtual-accounts\nGET /virtual-accounts/nomba/:identifier\nPATCH /virtual-accounts/:id\nPATCH /virtual-accounts/:id/suspend\nPATCH /virtual-accounts/:id/close\nGET /transactions\nGET /webhooks/events\nGET /trust-engine/users/:id/score\nGET /trust-engine/users/:id/decision\nGET /audit</pre></div>',
        '<div class="card span-6"><h2>Webhook Setup</h2><p>The monitor is ready for stored events. Set <code>NOMBA_WEBHOOK_SECRET</code>, expose <code>/webhooks/nomba</code> through a tunnel, then configure Nomba to send signed events.</p></div>',
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
