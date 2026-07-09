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
      --bg: #090d12;
      --surface: #101721;
      --surface-2: #141d29;
      --surface-3: #192331;
      --line: #223041;
      --line-soft: rgba(148, 163, 184, 0.16);
      --text: #eef5f8;
      --muted: #93a4b4;
      --muted-2: #6f8191;
      --accent: #39d98a;
      --accent-2: #5bbcff;
      --warning: #f5b84b;
      --danger: #ff5c77;
      --radius: 7px;
      --shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
      --shadow-soft: 0 10px 28px rgba(0, 0, 0, 0.2);
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      overflow-x: hidden;
      background:
        radial-gradient(circle at 18% 0%, rgba(57, 217, 138, 0.08), transparent 30%),
        radial-gradient(circle at 92% 12%, rgba(91, 188, 255, 0.08), transparent 28%),
        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px),
        linear-gradient(180deg, rgba(255,255,255,0.02) 1px, transparent 1px),
        var(--bg);
      background-size: auto, auto, 48px 48px, 48px 48px, auto;
      color: var(--text);
      font-family: Inter, "Segoe UI", ui-sans-serif, system-ui, sans-serif;
      letter-spacing: 0;
    }

    button, input, select, textarea { font: inherit; }

    .app {
      display: grid;
      grid-template-columns: 204px minmax(0, 1fr);
      min-height: 100vh;
      min-width: 0;
    }

    .sidebar {
      border-right: 1px solid var(--line-soft);
      background: rgba(10, 15, 22, 0.88);
      backdrop-filter: blur(18px);
      padding: 14px 10px;
      position: sticky;
      top: 0;
      height: 100vh;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 5px 7px 14px;
      border-bottom: 1px solid var(--line-soft);
      margin-bottom: 14px;
    }

    .mark {
      width: 29px;
      height: 29px;
      border: 1px solid rgba(57, 217, 138, 0.45);
      border-radius: 8px;
      display: grid;
      place-items: center;
      color: var(--accent);
      font-size: 12px;
      font-weight: 900;
      background: rgba(57, 217, 138, 0.08);
      box-shadow: inset 0 0 24px rgba(57, 217, 138, 0.08);
    }

    .brand strong { display: block; font-size: 14px; }
    .brand span { display: block; color: var(--muted); font-size: 11px; margin-top: 2px; }

    .nav { display: grid; gap: 4px; }

    .nav button {
      width: 100%;
      border: 1px solid transparent;
      background: transparent;
      color: var(--muted);
      border-radius: var(--radius);
      padding: 8px 9px;
      text-align: left;
      cursor: pointer;
      font-size: 12px;
      transition: transform 140ms ease, background 140ms ease, color 140ms ease, border-color 140ms ease;
    }

    .nav button:hover {
      color: var(--text);
      background: rgba(255, 255, 255, 0.035);
      transform: translateX(2px);
    }

    .nav button.active {
      color: var(--text);
      background: linear-gradient(180deg, rgba(91, 188, 255, 0.12), rgba(57, 217, 138, 0.08));
      border-color: rgba(91, 188, 255, 0.22);
      box-shadow: inset 3px 0 0 var(--accent);
    }

    .content {
      padding: 15px;
      min-width: 0;
      max-width: 1600px;
      width: 100%;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 13px;
    }

    h1, h2, h3, p { margin-top: 0; }
    h1 { margin-bottom: 3px; font-size: 20px; line-height: 1.2; }
    h2 { font-size: 14px; margin-bottom: 9px; line-height: 1.25; }
    h3 {
      font-size: 11px;
      margin-bottom: 7px;
      color: var(--muted);
      text-transform: uppercase;
      font-weight: 700;
    }
    p { color: var(--muted); line-height: 1.42; font-size: 12px; margin-bottom: 8px; overflow-wrap: anywhere; }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: 1px solid var(--line-soft);
      border-radius: 999px;
      padding: 6px 9px;
      color: var(--muted);
      background: rgba(20, 29, 41, 0.78);
      white-space: nowrap;
      font-size: 11px;
      box-shadow: var(--shadow-soft);
    }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 0 5px rgba(57, 217, 138, 0.08), 0 0 18px rgba(57, 217, 138, 0.65);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 9px;
    }

    .card {
      background: linear-gradient(180deg, rgba(20, 29, 41, 0.92), rgba(13, 19, 27, 0.96));
      border: 1px solid var(--line-soft);
      border-radius: var(--radius);
      padding: 10px;
      min-width: 0;
      box-shadow: var(--shadow-soft);
    }

    .hover-card, .card {
      transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    }

    .card:hover {
      border-color: rgba(91, 188, 255, 0.22);
      box-shadow: var(--shadow);
    }

    .metric {
      grid-column: span 2;
      min-height: 80px;
      position: relative;
      overflow: hidden;
    }

    .metric::after {
      content: "";
      position: absolute;
      inset: auto 12px 10px 12px;
      height: 2px;
      background: linear-gradient(90deg, var(--accent), transparent);
      opacity: 0.45;
    }

    .metric .label {
      color: var(--muted);
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
    }

    .metric .value {
      font-size: 21px;
      line-height: 1;
      font-weight: 800;
      margin-top: 9px;
    }

    .metric .meta {
      color: var(--muted-2);
      font-size: 11px;
      margin-top: 6px;
    }

    .metric.good::after { background: linear-gradient(90deg, var(--accent), transparent); }
    .metric.warn::after { background: linear-gradient(90deg, var(--warning), transparent); }
    .metric.bad::after { background: linear-gradient(90deg, var(--danger), transparent); }
    .metric.info::after { background: linear-gradient(90deg, var(--accent-2), transparent); }

    .span-3 { grid-column: span 3; }
    .span-4 { grid-column: span 4; }
    .span-5 { grid-column: span 5; }
    .span-6 { grid-column: span 6; }
    .span-7 { grid-column: span 7; }
    .span-8 { grid-column: span 8; }
    .span-12 { grid-column: span 12; }

    .toolbar {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 10px;
      align-items: center;
    }

    .toolbar > input,
    .toolbar > select {
      flex: 1 1 180px;
    }

    input, select, textarea {
      min-height: 32px;
      border: 1px solid var(--line-soft);
      background: rgba(7, 12, 18, 0.88);
      color: var(--text);
      border-radius: var(--radius);
      padding: 7px 9px;
      min-width: 0;
      font-size: 12px;
      outline: none;
      transition: border-color 140ms ease, box-shadow 140ms ease, background 140ms ease;
    }

    input:focus, select:focus, textarea:focus {
      border-color: rgba(91, 188, 255, 0.48);
      box-shadow: 0 0 0 3px rgba(91, 188, 255, 0.08);
      background: rgba(9, 15, 22, 0.96);
    }

    textarea {
      width: 100%;
      min-height: 120px;
      resize: vertical;
    }

    .btn {
      min-height: 32px;
      border: 1px solid var(--line-soft);
      background: rgba(25, 35, 49, 0.9);
      color: var(--text);
      border-radius: var(--radius);
      padding: 7px 10px;
      cursor: pointer;
      font-size: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: transform 140ms ease, border-color 140ms ease, background 140ms ease, box-shadow 140ms ease;
    }

    .btn:hover {
      transform: translateY(-1px);
      border-color: rgba(91, 188, 255, 0.28);
      box-shadow: 0 10px 22px rgba(0, 0, 0, 0.18);
    }

    .btn.primary {
      border-color: rgba(57, 217, 138, 0.32);
      background: linear-gradient(180deg, rgba(57, 217, 138, 0.2), rgba(57, 217, 138, 0.1));
      color: #c9ffe1;
    }

    .btn.danger {
      border-color: rgba(255, 92, 119, 0.34);
      background: rgba(255, 92, 119, 0.11);
      color: #ffc0ca;
    }

    .table-wrap {
      overflow: auto;
      max-width: 100%;
      border: 1px solid var(--line-soft);
      border-radius: var(--radius);
      background: rgba(7, 12, 18, 0.36);
    }

    .click-row { cursor: pointer; }
    .click-row:hover td { background: rgba(91, 188, 255, 0.055); }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 620px;
    }

    th, td {
      padding: 8px 9px;
      border-bottom: 1px solid var(--line-soft);
      text-align: left;
      vertical-align: middle;
      font-size: 12px;
    }

    th {
      color: var(--muted-2);
      background: rgba(9, 15, 22, 0.9);
      text-transform: uppercase;
      font-size: 10px;
      font-weight: 800;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    tr:last-child td { border-bottom: 0; }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      border: 1px solid var(--line-soft);
      border-radius: 999px;
      padding: 3px 7px;
      font-size: 11px;
      color: var(--muted);
      white-space: nowrap;
      background: rgba(255, 255, 255, 0.025);
      font-weight: 700;
    }

    .badge::before {
      content: "";
      width: 5px;
      height: 5px;
      border-radius: 999px;
      background: currentColor;
      opacity: 0.75;
    }

    .badge.good { color: #baffd9; border-color: rgba(57, 217, 138, 0.28); background: rgba(57, 217, 138, 0.07); }
    .badge.warn { color: #ffe2a8; border-color: rgba(245, 184, 75, 0.34); background: rgba(245, 184, 75, 0.07); }
    .badge.bad { color: #ffc0ca; border-color: rgba(255, 92, 119, 0.34); background: rgba(255, 92, 119, 0.07); }

    .empty, .error, .loading {
      border: 1px dashed var(--line-soft);
      border-radius: var(--radius);
      padding: 13px;
      color: var(--muted);
      background: rgba(12, 18, 26, 0.62);
      font-size: 12px;
    }

    .empty {
      display: grid;
      grid-template-columns: 42px minmax(0, 1fr);
      gap: 12px;
      align-items: center;
    }

    .empty-illustration {
      width: 42px;
      height: 42px;
      border-radius: 8px;
      border: 1px solid rgba(91, 188, 255, 0.22);
      background:
        linear-gradient(135deg, rgba(91, 188, 255, 0.12), rgba(57, 217, 138, 0.08)),
        rgba(7, 12, 18, 0.72);
      display: grid;
      place-items: center;
      color: var(--accent-2);
      font-weight: 900;
      font-size: 13px;
      box-shadow: inset 0 0 22px rgba(91, 188, 255, 0.08);
    }

    .empty strong {
      display: block;
      color: var(--text);
      font-size: 13px;
      margin-bottom: 3px;
    }

    .empty span {
      display: block;
      color: var(--muted);
      line-height: 1.4;
    }

    .loading {
      position: relative;
      overflow: hidden;
    }

    .loading::after {
      content: "";
      display: block;
      height: 8px;
      margin-top: 12px;
      border-radius: 999px;
      background: linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.16), rgba(255,255,255,0.04));
      animation: shimmer 1.1s linear infinite;
    }

    .error { color: #ffc0ca; border-color: rgba(255, 92, 119, 0.42); }

    .split {
      display: grid;
      grid-template-columns: 280px minmax(0, 1fr);
      gap: 10px;
      align-items: start;
    }

    .form { display: grid; gap: 8px; }
    .detail { display: grid; gap: 10px; }

    .drawer {
      margin-top: 12px;
      border-left: 3px solid var(--accent-2);
      animation: panelIn 180ms ease both;
    }

    .status-list { display: grid; gap: 8px; }

    .status-row {
      display: grid;
      grid-template-columns: minmax(96px, 0.72fr) minmax(0, 1fr) auto;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid var(--line-soft);
      padding-bottom: 7px;
      font-size: 12px;
    }

    .status-row > span,
    .status-row > strong {
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .status-row > strong { font-size: 12px; }

    .status-row:last-child { border-bottom: 0; padding-bottom: 0; }

    pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      color: #dbe8ef;
      font-size: 11px;
      line-height: 1.55;
      background: rgba(5, 9, 14, 0.72);
      border: 1px solid var(--line-soft);
      border-radius: var(--radius);
      padding: 10px;
      max-height: 360px;
      overflow: auto;
    }

    .section-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 10px;
      min-width: 0;
    }

    .section-head p { margin-bottom: 0; }
    .section-head > div { min-width: 0; }

    .ops-strip {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 9px;
    }

    .activity-list, .timeline, .compact-list {
      display: grid;
      gap: 8px;
    }

    .activity-list.compact { gap: 6px; }

    .activity-item, .timeline-item, .entity-card, .risk-card {
      border: 1px solid var(--line-soft);
      border-radius: var(--radius);
      background: rgba(7, 12, 18, 0.48);
      padding: 8px;
      min-width: 0;
    }

    .activity-item {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 9px;
      align-items: center;
    }

    .activity-item > :first-child { min-width: 0; }

    .activity-item.compact {
      min-height: 44px;
      padding: 7px 8px;
    }

    .activity-item.compact .item-title,
    .activity-item.compact .item-meta {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .activity-main {
      display: grid;
      min-width: 0;
      gap: 2px;
    }

    .activity-side {
      display: grid;
      justify-items: end;
      align-content: center;
      gap: 4px;
      min-width: max-content;
    }

    .item-title {
      color: var(--text);
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 3px;
      overflow-wrap: anywhere;
    }

    .item-meta {
      color: var(--muted);
      font-size: 11px;
      overflow-wrap: anywhere;
    }

    .truncate {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .wrap-anywhere { overflow-wrap: anywhere; }

    .timeline {
      position: relative;
    }

    .timeline-item {
      position: relative;
      padding-left: 28px;
    }

    .timeline-item::before {
      content: "";
      position: absolute;
      left: 10px;
      top: 14px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-2);
      box-shadow: 0 0 0 4px rgba(91, 188, 255, 0.09);
    }

    .entity-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 9px;
    }

    .entity-card {
      display: grid;
      gap: 8px;
      grid-template-rows: auto minmax(0, 1fr) auto;
      min-height: 188px;
    }

    .entity-card .section-head {
      align-items: flex-start;
      margin-bottom: 0;
    }

    .entity-card .section-head .badge {
      margin-left: auto;
      flex: 0 0 auto;
    }

    .entity-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
      margin-top: auto;
    }

    .score-ring {
      width: 100px;
      aspect-ratio: 1;
      border-radius: 50%;
      display: grid;
      place-items: center;
      margin: 0 auto 10px;
      background:
        radial-gradient(circle at center, var(--surface) 57%, transparent 58%),
        conic-gradient(var(--accent) calc(var(--score, 0) * 1%), rgba(255,255,255,0.08) 0);
      border: 1px solid var(--line-soft);
    }

    .score-ring strong {
      font-size: 24px;
      line-height: 1;
    }

    .workflow {
      display: grid;
      gap: 8px;
      margin-bottom: 10px;
    }

    .transfer-guard-split {
      grid-template-columns: minmax(270px, 320px) minmax(0, 1fr);
    }

    .transfer-panel {
      position: sticky;
      top: 15px;
    }

    .transfer-output {
      min-height: 520px;
    }

    .transfer-output .workflow {
      position: sticky;
      top: 15px;
      z-index: 1;
      padding-bottom: 8px;
      background: linear-gradient(180deg, rgba(20, 29, 41, 0.96), rgba(20, 29, 41, 0.88));
    }

    .progress-indicator {
      display: grid;
      gap: 9px;
      margin-top: 10px;
      padding: 10px;
      border: 1px solid var(--line-soft);
      border-radius: var(--radius);
      background: rgba(7, 12, 18, 0.46);
    }

    .progress-track {
      height: 7px;
      overflow: hidden;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.06);
    }

    .progress-fill {
      height: 100%;
      width: 46%;
      border-radius: inherit;
      background: linear-gradient(90deg, var(--accent-2), var(--accent));
      animation: progressLoop 1.25s ease-in-out infinite;
    }

    .progress-status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      color: var(--muted);
      font-size: 11px;
    }

    .webhook-row {
      margin-bottom: 6px;
      padding: 0;
    }

    .webhook-row > summary {
      cursor: pointer;
      list-style: none;
    }

    .webhook-row > summary::-webkit-details-marker { display: none; }

    .webhook-summary {
      display: grid;
      grid-template-columns: 22px minmax(90px, 0.8fr) minmax(0, 1.2fr) minmax(90px, 0.9fr) minmax(116px, 1fr) auto;
      gap: 9px;
      align-items: center;
      min-height: 44px;
      padding: 8px 9px;
    }

    .webhook-arrow {
      color: var(--muted-2);
      font-size: 14px;
      transition: transform 140ms ease;
    }

    details[open] .webhook-arrow { transform: rotate(90deg); }

    .webhook-expanded {
      border-top: 1px solid var(--line-soft);
      padding: 10px;
    }

    .settings-card {
      min-height: 290px;
      display: flex;
      flex-direction: column;
    }

    .settings-card .status-list { flex: 1; }

    .step-card {
      display: grid;
      grid-template-columns: 30px minmax(0, 1fr) auto;
      gap: 8px;
      align-items: center;
      border: 1px solid var(--line-soft);
      border-radius: var(--radius);
      background: rgba(7, 12, 18, 0.42);
      padding: 8px;
    }

    .step-index {
      width: 25px;
      height: 25px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(91, 188, 255, 0.28);
      color: var(--accent-2);
      font-size: 12px;
      font-weight: 800;
      background: rgba(91, 188, 255, 0.07);
    }

    .step-card.active {
      border-color: rgba(91, 188, 255, 0.34);
      box-shadow: inset 0 0 0 1px rgba(91, 188, 255, 0.06), var(--shadow-soft);
    }

    .step-card.complete .step-index {
      color: #baffd9;
      border-color: rgba(57, 217, 138, 0.34);
      background: rgba(57, 217, 138, 0.08);
    }

    .step-card.blocked .step-index {
      color: #ffc0ca;
      border-color: rgba(255, 92, 119, 0.34);
      background: rgba(255, 92, 119, 0.08);
    }

    .analysis-pulse {
      position: relative;
      overflow: hidden;
    }

    .analysis-pulse::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(91, 188, 255, 0.08), transparent);
      animation: sweep 1.2s ease-in-out infinite;
    }

    .confidence-bar {
      height: 8px;
      border: 1px solid var(--line-soft);
      border-radius: 999px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.03);
      margin-top: 8px;
    }

    .confidence-fill {
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, var(--accent-2), var(--accent));
      animation: fillIn 420ms ease both;
    }

    .recommendation-card {
      border-color: rgba(57, 217, 138, 0.24);
      background: linear-gradient(180deg, rgba(57, 217, 138, 0.09), rgba(7, 12, 18, 0.52));
    }

    .json .key { color: #8bd5ff; }
    .json .string { color: #baffd9; }
    .json .number { color: #ffd28a; }
    .json .boolean { color: #ffc0ca; }
    .json .null { color: #94a7b6; }

    .chart-row { margin-bottom: 9px; }
    .chart-row:last-child { margin-bottom: 0; }
    .chart-head {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      font-size: 12px;
      margin-bottom: 5px;
    }
    .chart-track {
      height: 7px;
      border: 1px solid var(--line-soft);
      border-radius: 999px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.03);
    }
    .chart-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-2), var(--accent));
      border-radius: inherit;
      animation: fillIn 420ms ease both;
    }

    .toast {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 20;
      border: 1px solid rgba(57, 217, 138, 0.28);
      background: rgba(12, 18, 26, 0.96);
      color: var(--text);
      padding: 10px 12px;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      animation: toastIn 220ms ease both;
      font-size: 13px;
    }

    #page { animation: pageIn 180ms ease both; }
    .card, .activity-item, .timeline-item, .entity-card { animation: panelIn 180ms ease both; }
    .hidden { display: none; }

    @keyframes pageIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes panelIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes shimmer {
      from { transform: translateX(-20%); }
      to { transform: translateX(20%); }
    }

    @keyframes fillIn {
      from { width: 0; }
    }

    @keyframes sweep {
      from { transform: translateX(-100%); }
      to { transform: translateX(100%); }
    }

    @keyframes progressLoop {
      0% { transform: translateX(-70%); }
      50% { transform: translateX(85%); }
      100% { transform: translateX(220%); }
    }

    @keyframes toastIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 1ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: 1ms !important;
      }
    }

    @media (max-width: 1180px) {
      .metric { grid-column: span 4; }
      .span-3, .span-4, .span-5, .span-6, .span-7, .span-8 { grid-column: span 12; }
      .ops-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .split, .transfer-guard-split { grid-template-columns: 280px minmax(0, 1fr); }
      .webhook-summary { grid-template-columns: 22px minmax(86px, 0.8fr) minmax(0, 1fr) minmax(86px, 0.8fr) auto; }
      .webhook-summary .webhook-time { display: none; }
    }

    @media (max-width: 980px) {
      .app { grid-template-columns: 1fr; }
      .sidebar { position: relative; height: auto; }
      .nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .content { padding: 14px; }
      .metric { grid-column: span 6; }
      .split, .transfer-guard-split { grid-template-columns: 1fr; }
      .transfer-panel { position: static; }
      .topbar { align-items: flex-start; flex-direction: column; }
      .activity-item { grid-template-columns: 1fr; }
      .activity-item > div:last-child { text-align: left !important; }
      .activity-side { justify-items: start; }
      .webhook-summary { grid-template-columns: 22px minmax(0, 1fr) auto; }
      .webhook-summary .webhook-status,
      .webhook-summary .webhook-customer,
      .webhook-summary .webhook-time { display: none; }
    }

    @media (max-width: 640px) {
      .metric { grid-column: span 12; }
      .ops-strip { grid-template-columns: 1fr; }
      .toolbar > input, .toolbar > select, .toolbar > button { width: 100%; }
      .nav { grid-template-columns: 1fr; }
      h1 { font-size: 20px; }
      .section-head { flex-direction: column; }
      .step-card { grid-template-columns: 28px minmax(0, 1fr); }
      .step-card > :last-child { grid-column: 2; justify-self: start; }
      .empty { grid-template-columns: 1fr; text-align: center; }
      .empty-illustration { margin: 0 auto; }
      table, thead, tbody, th, td, tr { display: block; }
      table { min-width: 0; }
      thead { display: none; }
      tr {
        border-bottom: 1px solid var(--line-soft);
        padding: 8px;
      }
      td {
        display: grid;
        grid-template-columns: 132px minmax(0, 1fr);
        gap: 8px;
        border-bottom: 0;
        padding: 7px 0;
      }
      td::before {
        content: attr(data-label);
        color: var(--muted-2);
        font-size: 10px;
        text-transform: uppercase;
        font-weight: 800;
      }
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
    const tone = (value) => ['SUCCESS', 'ACTIVE', 'TRUSTED', 'ALLOW', 'LOW', 'VERIFIED', 'PROCESSED', true].includes(value) ? 'good' : ['PENDING', 'REVIEW', 'STEP_UP', 'MEDIUM', 'SUSPENDED'].includes(value) ? 'warn' : ['FAILED', 'REVERSED', 'REVOKED', 'BLOCK', 'HIGH', 'CRITICAL', 'UNVERIFIED', 'ARCHIVED', false].includes(value) ? 'bad' : '';
    const badge = (value) => '<span class="badge ' + tone(value) + '">' + html(value) + '</span>';
    const statusRow = (label, value, status) => '<div class="status-row"><span>' + html(label) + '</span><strong>' + html(value) + '</strong>' + badge(status || 'ACTIVE') + '</div>';
    const chartBar = (label, value, max) => '<div class="chart-row"><div class="chart-head"><span>' + html(label) + '</span><strong>' + html(value) + '</strong></div><div class="chart-track"><div class="chart-fill" style="width:' + (max ? Math.max(4, Math.round((Number(value) / max) * 100)) : 0) + '%;"></div></div></div>';
    const jsonBlock = (value) => '<pre class="json"><code>' + syntaxJson(value) + '</code></pre>';
    const syntaxJson = (value) => html(JSON.stringify(value ?? {}, null, 2)).replace(/(&quot;(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\&])*&quot;(\\s*:)?|\\b(true|false|null)\\b|-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?)/g, (match) => {
      let className = 'number';
      if (match.startsWith('&quot;')) {
        className = match.endsWith(':') ? 'key' : 'string';
      } else if (match === 'true' || match === 'false') {
        className = 'boolean';
      } else if (match === 'null') {
        className = 'null';
      }
      return '<span class="' + className + '">' + match + '</span>';
    });
    const compactValue = (value) => Number(value || 0).toLocaleString();
    const metric = (label, value, meta, toneName) => '<div class="card metric ' + html(toneName || '') + '"><div class="label">' + html(label) + '</div><div class="value" data-count="' + html(Number(value || 0)) + '">' + html(compactValue(value)) + '</div>' + (meta ? '<div class="meta">' + html(meta) + '</div>' : '') + '</div>';
    const sectionHead = (title, subtitle, aside) => '<div class="section-head"><div><h2>' + html(title) + '</h2>' + (subtitle ? '<p>' + html(subtitle) + '</p>' : '') + '</div>' + (aside || '') + '</div>';
    const notify = (message) => {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2600);
    };
    const animateCounters = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      document.querySelectorAll('[data-count]').forEach((node) => {
        const end = Number(node.dataset.count || 0);
        if (!Number.isFinite(end) || end <= 0) return;
        const start = performance.now();
        const duration = 420;
        const tick = (time) => {
          const progress = Math.min(1, (time - start) / duration);
          node.textContent = Math.round(end * progress).toLocaleString();
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    };
    const enhancePage = () => {
      animateCounters();
    };

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

    function empty(label, detail, icon) {
      const presets = {
        'No recent payment activity.': ['No payment activity yet', 'Incoming payments and reconciled transactions will appear here as they arrive.', '₦'],
        'Select a customer to view profile details.': ['Select a customer', 'Choose a customer card to inspect identity, accounts, devices, beneficiaries, and payment history.', 'ID'],
        'No customers found.': ['No customers yet', 'Create your first customer to begin issuing protected virtual accounts.', 'CU'],
        'No records yet.': ['No linked records yet', 'Related records will appear here after this customer starts using TrustVault.', 'TV'],
        'No virtual accounts found for this filter.': ['No virtual accounts found', 'Generate a dedicated account or adjust your filters.', 'VA'],
        'No additional reasons returned.': ['No extra risk reasons', 'Transfer Guard did not return additional reason cards for this decision.', 'RG'],
        'No matching transactions.': ['No matching transactions', 'Adjust the filters to widen the payment search.', 'TX'],
        'No transactions found.': ['No transactions yet', 'Incoming payments and protected transfers will appear here after reconciliation.', 'TX'],
        'No webhook events found.': ['No webhooks yet', 'Waiting for signed Nomba events to arrive at the webhook endpoint.', 'WH'],
        'Select a customer to inspect risk.': ['Select a customer', 'Load a Trust Engine score or decision for the selected customer.', 'TE'],
        'No risk factors returned.': ['No risk factors returned', 'The Trust Engine response did not include risk factor cards for this request.', 'RF'],
        'No audit events found.': ['No audit activity yet', 'Security-relevant actions and system events will appear in this timeline.', 'AU'],
        'No audit logs found.': ['No audit logs yet', 'Audit records will appear after customer, webhook, transfer, or trust events.', 'AU']
      };
      const preset = presets[label] || [label, detail || 'There is nothing to show here yet.', icon || 'TV'];
      return '<div class="empty"><div class="empty-illustration">' + html(preset[2] || icon || 'TV') + '</div><div><strong>' + html(preset[0]) + '</strong><span>' + html(detail || preset[1]) + '</span></div></div>';
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
      enhancePage();
    }

    async function renderDashboard() {
      const page = document.getElementById('page');
      page.innerHTML = loading('Loading security operations...');
      try {
        const data = await api('/dashboard');
        document.getElementById('apiStatus').textContent = 'API connected';
        const transactions = data.recentActivity.transactions || [];
        const webhooks = data.recentActivity.webhooks || [];
        const auditLogs = data.recentActivity.auditLogs || [];
        state.transactions = transactions;
        state.webhooks = webhooks;
        state.audit = auditLogs;
        const verifiedWebhooks = webhooks.filter((event) => event.verified).length;
        const highSeverity = auditLogs.filter((log) => ['HIGH', 'CRITICAL'].includes(log.severity)).length;
        const transferGuardLogs = auditLogs.filter((log) => String(log.action || '').includes('TRANSFER_GUARD')).length;
        const incomingRecent = transactions.filter((tx) => tx.direction === 'CREDIT').length;
        page.innerHTML = [
          '<div class="grid">',
          metric('Incoming Payments', incomingRecent || data.transactionsToday, 'recent payment signal', 'good'),
          metric('Transactions Today', data.transactionsToday, 'settlement activity', 'info'),
          metric('Webhook Events', data.webhooksToday, verifiedWebhooks + ' verified in recent feed', verifiedWebhooks === webhooks.length ? 'good' : 'warn'),
          metric('Trust Reviews', data.pendingRiskReviews, 'pending or suspended customers', data.pendingRiskReviews ? 'warn' : 'good'),
          metric('Transfer Risk', data.failedTransfers, 'failed or reversed debits', data.failedTransfers ? 'bad' : 'good'),
          metric('Audit Signals', auditLogs.length, highSeverity + ' high severity', highSeverity ? 'bad' : 'info'),
          '<div class="card span-8">' + sectionHead('Live Payment Activity', 'Incoming payment and transaction movement from existing records.', badge('MONITORING')) + transactionActivity(transactions) + '</div>',
          '<div class="card span-4">' + sectionHead('System Health', 'Operational indicators from current data.', badge('LIVE')) + '<div class="status-list">' + statusRow('API', 'Connected', 'ACTIVE') + statusRow('Webhook Verification', verifiedWebhooks + '/' + webhooks.length + ' recent verified', verifiedWebhooks === webhooks.length ? 'VERIFIED' : 'REVIEW') + statusRow('Trust Engine', data.pendingRiskReviews + ' review queue', data.pendingRiskReviews ? 'REVIEW' : 'ALLOW') + statusRow('Transfer Guard', transferGuardLogs + ' recent decision(s)', transferGuardLogs ? 'ACTIVE' : 'PENDING') + '</div></div>',
          '<div class="card span-6">' + sectionHead('Recent Transactions', 'Compact payment feed with expandable details.') + transactionTable(transactions, 5) + '</div>',
          '<div class="card span-6">' + sectionHead('Recent Webhook Events', 'Signed Nomba event monitor.') + webhookList(webhooks) + '</div>',
          '<div class="card span-7">' + sectionHead('Audit Timeline', 'Latest administrative and security-relevant events.') + auditTimeline(auditLogs) + '</div>',
          '<div class="card span-5">' + sectionHead('Risk Intelligence', 'Security alerts, trust activity, and transfer guard posture.') + '<div class="compact-list">' + riskIntelCard('Security Alerts', highSeverity, highSeverity ? 'HIGH' : 'LOW') + riskIntelCard('Trust Engine Activity', data.pendingRiskReviews, data.pendingRiskReviews ? 'REVIEW' : 'ALLOW') + riskIntelCard('Transfer Guard Activity', transferGuardLogs || data.failedTransfers, data.failedTransfers ? 'BLOCK' : 'ACTIVE') + riskIntelCard('Audit Activity', auditLogs.length, auditLogs.length ? 'ACTIVE' : 'PENDING') + '</div></div>',
          '</div>'
        ].join('');
      } catch (error) {
        page.innerHTML = errorCard(error);
      }
    }

    function transactionActivity(rows) {
      return rows.length ? '<div class="activity-list">' + rows.slice(0, 6).map((tx) => [
        '<div class="activity-item compact click-row" onclick="openTransactionDetail(\'' + html(tx.id) + '\')">',
        '<div><div class="item-title">' + html(txSenderName(tx)) + ' to ' + html(txReceiverName(tx)) + '</div><div class="item-meta">' + html(txReference(tx)) + ' · ' + date(tx.createdAt || tx.occurredAt) + '</div></div>',
        '<div class="activity-side"><strong>' + money(tx.amount, tx.currency) + '</strong>' + badge(tx.status) + '</div>',
        '</div>'
      ].join('')).join('') + '</div>' : empty('No recent payment activity.');
    }

    function riskIntelCard(label, value, status) {
      return '<div class="activity-item compact"><div class="activity-main"><div class="item-title">' + html(label) + '</div><div class="item-meta">Current signal from existing records</div></div><div class="activity-side"><strong data-count="' + html(Number(value || 0)) + '">' + html(compactValue(value)) + '</strong>' + badge(status) + '</div></div>';
    }

    async function renderCustomers() {
      const page = document.getElementById('page');
      page.innerHTML = loading('Loading customers...');
      try {
        state.customers = await api('/users?includeArchived=true');
        page.innerHTML = [
          '<div class="split">',
          customerForm(),
          '<div class="card">' + sectionHead('Customer Directory', 'Stripe-style customer cards with status, account, and profile actions.') + '<div class="toolbar"><input id="customerSearch" placeholder="Search name, email, phone, status" /><select id="customerArchiveFilter"><option value="active">Active</option><option value="archived">Archived</option><option value="all">All</option></select></div><div id="customerTable"></div></div>',
          '</div>',
          '<div class="card span-12" style="margin-top:12px;">' + sectionHead('Customer Profile', 'Identity, devices, beneficiaries, virtual accounts, and payment history.') + '<div id="customerProfile">' + empty('Select a customer to view profile details.') + '</div></div>'
        ].join('');
        document.getElementById('createCustomerForm').addEventListener('submit', createCustomer);
        document.getElementById('customerSearch').addEventListener('input', renderCustomerTable);
        document.getElementById('customerArchiveFilter').addEventListener('change', renderCustomerTable);
        renderCustomerTable();
        const initialCustomer = state.customers.find((customer) => !customer.deletedAt) || state.customers[0];
        if (initialCustomer) {
          loadCustomerProfile(initialCustomer.id);
        }
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
        notify('Customer created.');
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
      document.getElementById('customerTable').innerHTML = rows.length ? '<div class="entity-grid">' + rows.map((customer) => [
        '<div class="entity-card">',
        '<div class="section-head"><div><div class="item-title">' + html(person(customer)) + '</div><div class="item-meta">' + html(customerCode(customer)) + ' · ' + html(customer.email) + '</div></div>' + badge(customer.deletedAt ? 'ARCHIVED' : customer.status) + '</div>',
        '<div class="item-meta">Phone: ' + html(customer.phoneNumber || '--') + '</div>',
        '<div class="item-meta">Virtual accounts: ' + html((customer.virtualAccounts || []).length) + '</div>',
        '<div class="entity-actions">' + customerActions(customer) + '</div>',
        '</div>'
      ].join('')).join('') + '</div>' : empty('No customers found.');
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
      notify('Customer updated.');
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
      notify('Customer archived.');
      state.customers = await api('/users?includeArchived=true');
      renderCustomerTable();
    }

    async function restoreCustomer(id) {
      await api('/users/' + encodeURIComponent(id) + '/restore', { method: 'PATCH' });
      notify('Customer restored.');
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
          '<div class="card span-4"><h3>Identity</h3><div class="item-title">' + html(person(customer)) + '</div><p>' + html(customerCode(customer)) + '<br />' + html(customer.email) + '<br />' + html(customer.phoneNumber || '--') + '</p>' + badge(customer.status) + '</div>',
          '<div class="card span-4"><h3>Dedicated Virtual Account</h3>' + smallList(customer.virtualAccounts, (item) => html(virtualAccountName(item)) + '<br />' + html(item.accountNumber || item.providerReference || '--')) + '</div>',
          '<div class="card span-4"><h3>Risk Intelligence</h3><p>Open this customer directly in Trust Engine for live score and decisioning.</p><button class="btn primary" onclick="setPage(\'trustEngine\')">Open Trust Engine</button></div>',
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
          '<div class="card">' + sectionHead('Virtual Accounts', 'Dedicated Nomba-backed accounts with lifecycle controls and lookup.'),
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
      document.getElementById('vaTable').innerHTML = rows.length ? '<div class="entity-grid">' + rows.map((account) => [
        '<div class="entity-card">',
        '<div class="section-head"><div><div class="item-title">' + html(virtualAccountName(account)) + '</div><div class="item-meta">' + html(account.user ? customerCode(account.user) + ' · ' + person(account.user) : 'Unassigned customer') + '</div></div>' + badge(account.status === 'INACTIVE' ? 'SUSPENDED' : account.status) + '</div>',
        '<div class="status-list">',
        statusRow('Account number', account.accountNumber || '--', account.accountNumber ? 'ACTIVE' : 'PENDING'),
        statusRow('Provider ref', account.providerReference || '--', account.providerReference ? 'ACTIVE' : 'PENDING'),
        '</div>',
        '<div class="entity-actions">' + virtualAccountActions(account) + '</div>',
        '</div>'
      ].join('')).join('') + '</div>' : empty('No virtual accounts found for this filter.');
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
        notify('Virtual account created.');
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
      notify('Virtual account suspended.');
      await renderVirtualAccounts();
    }

    async function closeAccount(id) {
      await api('/virtual-accounts/' + id + '/close', { method: 'PATCH' });
      notify('Virtual account closed.');
      await renderVirtualAccounts();
    }

    async function archiveVirtualAccount(id) {
      await api('/virtual-accounts/' + id + '/archive', { method: 'PATCH' });
      notify('Virtual account archived.');
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
          '<div class="split transfer-guard-split">',
          '<div class="card transfer-panel">' + sectionHead('Transfer Guard Workflow', 'Five-step security review before money moves.', badge('INTELLIGENT WORKFLOW')) + '<form class="form" id="transferGuardForm">',
          '<select name="userId" required><option value="">Customer</option>' + customerOptions + '</select>',
          '<select name="virtualAccountId"><option value="">Virtual Account</option>' + accountOptions + '</select>',
          '<input name="recipientBank" placeholder="Recipient Bank" required />',
          '<input name="recipientBankCode" placeholder="Recipient Bank Code" required />',
          '<input name="recipientAccount" placeholder="Recipient Account" required />',
          '<input name="amount" type="number" min="1" step="0.01" placeholder="Amount" required />',
          '<input name="narration" placeholder="Narration" />',
          '<button class="btn primary" type="submit">Run Transfer Guard</button>',
          '</form></div>',
          '<div class="card transfer-output">' + sectionHead('Analysis & Recommendations', 'Results stay in this panel while the form remains fixed.') + '<div id="transferGuardResult">' + transferWorkflow('input') + ((transfers || []).length ? '<div class="drawer">' + sectionHead('Recent Guarded Transfers', 'Outgoing transfers evaluated by policy and trust signals.') + transactionTable(transfers || [], 8, transfers.length) + '</div>' : empty('No transfers yet', 'Create your first protected transfer to see Transfer Guard decisions here.', 'TG')) + '</div></div>',
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
      target.innerHTML = transferWorkflow('analysis') + transferLoading();
      try {
        const result = await api('/transfers', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        target.innerHTML = transferResult(result);
        enhancePage();
        notify('Transfer Guard decision: ' + result.decision);
        if (result.decision === 'ALLOW') {
          form.reset();
        }
      } catch (error) {
        target.innerHTML = errorCard(error);
      }
    }

    function transferWorkflow(stage, result) {
      const decision = result?.decision;
      const executed = Boolean(result?.transaction);
      const blocked = decision && decision !== 'ALLOW';
      const steps = [
        ['Transfer Details', 'Customer, recipient, amount, and narration captured.', 'input'],
        ['Risk Analysis', 'Recipient lookup and policy checks run by the backend.', 'analysis'],
        ['Trust Engine Review', 'Customer trust signals are evaluated by existing logic.', 'review'],
        ['Recommendation', decision ? 'Recommendation returned: ' + decision + '.' : 'Awaiting backend recommendation.', 'recommendation'],
        ['Execute Transfer', executed ? 'Backend returned a created transfer transaction.' : blocked ? 'Stopped after recommendation. No successful transfer is shown.' : 'Executes only if the backend allows and returns a transaction.', 'execute']
      ];
      const activeIndex = stage === 'input' ? 0 : stage === 'analysis' ? 1 : stage === 'review' ? 2 : stage === 'recommendation' ? 3 : stage === 'execute' ? 4 : 0;
      return '<div class="workflow">' + steps.map(([title, description], index) => {
        const complete = result ? (index < 3 || (index === 3 && decision) || (index === 4 && executed)) : index < activeIndex;
        const isActive = index === activeIndex;
        const isBlocked = result && index === 4 && !executed;
        return [
          '<div class="step-card ' + (complete ? 'complete ' : '') + (isActive ? 'active analysis-pulse ' : '') + (isBlocked ? 'blocked ' : '') + '">',
          '<div class="step-index">' + html(index + 1) + '</div>',
          '<div><div class="item-title">' + html(title) + '</div><div class="item-meta">' + html(description) + '</div></div>',
          index === 3 && decision ? badge(decision) : index === 4 && executed ? badge('EXECUTED') : isBlocked ? badge('STOPPED') : '',
          '</div>'
        ].join('');
      }).join('') + '</div>';
    }

    function transferLoading() {
      return [
        '<div class="progress-indicator">',
        '<div class="progress-status"><strong>Risk Analysis in progress</strong><span>Checking recipient and velocity signals</span></div>',
        '<div class="progress-track"><div class="progress-fill"></div></div>',
        '<div class="item-meta">Trust Engine score, transfer policy, account lookup, and backend rules are being evaluated.</div>',
        '</div>'
      ].join('');
    }

    function transferResult(result) {
      const riskScore = Number(result.riskScore || 0);
      const confidence = Math.max(0, Math.min(100, 100 - riskScore));
      const executed = Boolean(result.transaction);
      return [
        transferWorkflow(executed ? 'execute' : 'recommendation', result),
        '<div class="card recommendation-card" style="margin-top:12px;">',
        sectionHead('Recommendation', result.message || 'Transfer Guard returned a recommendation.', badge(result.decision || 'REVIEW')),
        '<div class="grid">',
        '<div class="card span-4"><h3>Decision</h3><div style="margin-bottom:10px;">' + badge(result.decision || 'REVIEW') + '</div><p>' + html(executed ? 'Backend returned a transaction for this transfer.' : 'Flow stopped after recommendation. No successful transfer is displayed unless the backend returns one.') + '</p></div>',
        '<div class="card span-4"><h3>Risk Score</h3><div class="value" data-count="' + html(riskScore) + '" style="font-size:30px;font-weight:800;">' + html(riskScore) + '</div><div class="confidence-bar"><div class="confidence-fill" style="width:' + html(confidence) + '%;"></div></div><p>Confidence score: ' + html(confidence) + '%</p></div>',
        '<div class="card span-4"><h3>Execution</h3>' + badge(executed ? 'EXECUTED' : 'NOT EXECUTED') + '<p style="margin-top:8px;">' + html(executed ? 'Transaction reference: ' + txReference(result.transaction) : 'Awaiting an ALLOW response with a transaction before execution is shown.') + '</p></div>',
        '<div class="card span-6"><h3>Reasoning Cards</h3>' + reasoningCards(result.reasons || []) + '</div>',
        '<div class="card span-6"><h3>Recipient Lookup</h3>' + jsonBlock(result.accountLookup || {}) + '</div>',
        '</div></div>'
      ].join('');
    }

    function reasoningCards(reasons) {
      return reasons.length ? '<div class="compact-list">' + reasons.map((reason) =>
        '<div class="risk-card"><div class="section-head"><div><div class="item-title">' + html(reason) + '</div><div class="item-meta">Backend Transfer Guard reason</div></div>' + badge('RISK') + '</div></div>'
      ).join('') + '</div>' : empty('No additional reasons returned.');
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
          '<div class="card">' + sectionHead('Transactions', 'Compact payment intelligence with filters and expandable records.'),
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
        return empty('No matching transactions.');
      }
      return items.length ? '<div class="activity-list compact">' + items.map((tx) => [
        '<div class="activity-item compact click-row" onclick="openTransactionDetail(\'' + html(tx.id) + '\')">',
        '<div><div class="item-title">' + money(tx.amount, tx.currency) + ' · ' + html(txSenderName(tx)) + '</div><div class="item-meta">' + html(txReceiverName(tx)) + ' · ' + html(txReference(tx)) + '</div><div style="margin-top:7px;">' + badge(tx.direction) + ' ' + badge(txType(tx)) + ' ' + badge(tx.status) + '</div></div>',
        '<div class="activity-side"><div class="item-meta">' + date(tx.createdAt || tx.occurredAt) + '</div><div class="item-meta truncate" title="' + html(txVirtualAccountNumber(tx)) + '">VA ' + html(txVirtualAccountNumber(tx)) + '</div></div>',
        '</div>'
      ].join('')).join('') + '</div>' : empty('No transactions found.');
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
      const tx = state.transactions.find((item) => item.id === id) || state.transfers.find((item) => item.id === id);
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
          metric('Total Customers', customers.length, 'active customer base', 'info'),
          metric('Active Accounts', virtualAccounts.filter((account) => account.status === 'ACTIVE').length, 'receiving accounts', 'good'),
          metric('Incoming Payments', incoming.length, 'credit transactions', 'good'),
          metric('Outgoing Payments', outgoing.length, 'guarded debit activity', 'info'),
          metric('Blocked Transfers', blockedAudits.length, 'guard decisions', blockedAudits.length ? 'bad' : 'good'),
          metric('Transactions Today', transactionsToday.length, 'latest activity', 'info'),
          metric('Average Trust Score', averageTrustScore, 'sampled customers', averageTrustScore >= 70 ? 'good' : 'warn'),
          metric('High Risk Customers', highRiskCustomers, 'review or block decisions', highRiskCustomers ? 'bad' : 'good'),
          '<div class="card span-6">' + sectionHead('Incoming Payments Over Time', 'Seven-day view from transaction records.') + timeSeriesChart(incoming, 'createdAt') + '</div>',
          '<div class="card span-6">' + sectionHead('Trust Score Distribution', 'Risk bands from existing Trust Engine decisions.') + scoreDistributionChart(scores) + '</div>',
          '<div class="card span-6">' + sectionHead('Risk Decisions', 'Allow, review, and block posture.') + decisionChart(decisions) + '</div>',
          '<div class="card span-6">' + sectionHead('Transaction Volume', 'Payment mix and status density.') + transactionVolumeChart(transactions) + '</div>',
          '<div class="card span-6">' + sectionHead('Recent Security Alerts', 'High and critical audit events.') + auditTimeline(securityAlerts) + '</div>',
          '<div class="card span-6">' + sectionHead('Recent Webhook Events', 'Signed payment event flow.') + webhookList(webhooks.slice(0, 5)) + '</div>',
          '<div class="card span-6">' + sectionHead('Recent Audit Logs', 'Operational trail.') + auditTimeline(audit.slice(0, 5)) + '</div>',
          '<div class="card span-6">' + sectionHead('Recent Transfers', 'Outgoing guarded payments.') + transactionTable(outgoing.slice(0, 5), 5, outgoing.length) + '</div>',
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
        page.innerHTML = '<div class="card">' + sectionHead('Live Event Monitor', 'Expandable signed Nomba webhook events with reconciliation context.', badge('REAL TIME')) + '<div class="toolbar"><input id="webhookSearch" placeholder="Search transaction, virtual account, sender, request ID" /></div><div id="webhookList"></div></div>';
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
      return rows.length ? rows.map((event) => webhookActivityCard(event)).join('') : empty('No webhook events found.');
    }

    function webhookActivityCard(event) {
      const transactionStatus = event.processedAt ? 'PROCESSED' : event.errorMessage ? 'FAILED' : 'PENDING';
      const matchedCustomer = webhookSender(event);
      const matchedVirtualAccount = webhookVirtualAccount(event);
      const createdTransaction = webhookTransactionId(event);
      const matchingResult = {
        virtualAccount: matchedVirtualAccount,
        requestId: webhookRequestId(event),
        processedAt: event.processedAt,
        errorMessage: event.errorMessage
      };
      return [
        '<details class="card webhook-row">',
        '<summary>',
        '<div class="webhook-summary">',
        '<span class="webhook-arrow">&rsaquo;</span>',
        '<strong class="truncate" title="' + html(webhookAmountLabel(event)) + '">' + html(webhookAmountLabel(event)) + '</strong>',
        '<span class="truncate webhook-customer" title="' + html(matchedCustomer) + '">' + html(matchedCustomer) + '</span>',
        '<span class="truncate" title="' + html(event.eventType) + '">' + html(event.eventType) + '</span>',
        '<span class="webhook-time item-meta">' + date(event.receivedAt) + '</span>',
        '<span class="webhook-status" style="display:inline-flex;gap:6px;align-items:center;justify-content:flex-end;">' + badge(event.verified ? 'VERIFIED' : 'UNVERIFIED') + badge(transactionStatus) + '</span>',
        '</div>',
        '</summary>',
        '<div class="grid webhook-expanded">',
        '<div class="card span-6"><h3>Payload</h3>' + jsonBlock(event.payload) + '</div>',
        '<div class="card span-6"><h3>Headers</h3>' + jsonBlock(event.headers || {}) + '</div>',
        '<div class="card span-4"><h3>Matched Customer</h3><div class="item-title">' + html(matchedCustomer) + '</div><p>Customer value from webhook payload.</p></div>',
        '<div class="card span-4"><h3>Matched Virtual Account</h3><div class="item-title">' + html(matchedVirtualAccount) + '</div><p>Virtual account value from webhook payload.</p></div>',
        '<div class="card span-4"><h3>Created Transaction</h3><div class="item-title">' + html(createdTransaction) + '</div><p>Transaction reference exposed by this event.</p></div>',
        '<div class="card span-6"><h3>Audit Log</h3><p>Audit resource reference: WebhookEvent ' + html(event.id) + '</p>' + badge(event.processedAt ? 'PROCESSED' : 'PENDING') + '</div>',
        '<div class="card span-6"><h3>Trust Update</h3><p>Trust Engine update is not returned on this webhook event. Use reconciled transactions and audit records for Trust Engine review.</p>' + badge(event.processedAt ? 'AVAILABLE AFTER RECONCILIATION' : 'PENDING') + '</div>',
        '<div class="card span-12"><h3>Matching Result</h3>' + jsonBlock(matchingResult) + '</div>',
        '</div>',
        '</details>'
      ].join('');
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
        '<details class="card" style="margin-bottom:8px;">',
        '<summary style="cursor:pointer;list-style:none;">',
        '<div class="activity-item" style="margin:-4px;">',
        '<div><div class="item-title">' + html(event.eventType) + ' · ' + html(webhookAmountLabel(event)) + '</div><div class="item-meta">' + html(webhookSender(event)) + ' · VA ' + html(webhookVirtualAccount(event)) + ' · ' + date(event.receivedAt) + '</div></div>',
        '<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;">',
        badge(event.verified ? 'VERIFIED' : 'UNVERIFIED'),
        badge(transactionStatus),
        '<span class="btn">Expand</span>',
        '</div>',
        '</div>',
        '</summary>',
        '<div class="grid" style="margin-top:12px;">',
        '<div class="card span-6"><h3>Webhook Payload</h3><pre>' + html(JSON.stringify(event.payload, null, 2)) + '</pre></div>',
        '<div class="card span-6"><h3>Headers</h3><pre>' + html(JSON.stringify(event.headers || {}, null, 2)) + '</pre></div>',
        '<div class="card span-6"><h3>Matching Result</h3><pre>' + html(JSON.stringify(matchingResult, null, 2)) + '</pre></div>',
        '<div class="card span-6"><h3>References</h3><pre>Audit Log Resource: WebhookEvent ' + html(event.id) + '\\nTransaction Reference: ' + html(webhookTransactionId(event)) + '</pre></div>',
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
        '<div class="card">' + sectionHead('Trust Engine', 'Live customer score, policy decision, and risk factor inspection.', badge('RISK INTELLIGENCE')) + '<div class="toolbar"><select id="trustUserId"><option value="">Select customer</option>' + customerOptions + '</select><button class="btn primary" onclick="loadTrustDecision()">Load Decision</button><button class="btn" onclick="loadTrustScore()">Load Score</button></div><div id="trustResult">' + empty('Select a customer to inspect risk.') + '</div></div>'
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
        const score = Number(data.score || data.assessment?.score || 0);
        const signals = data.assessment?.signals || data.signals || [];
        const metrics = data.assessment?.metrics || data.metrics || {};
        const decision = data.action || data.riskLevel || data.assessment?.riskLevel || 'UNKNOWN';
        const confidence = Math.max(0, Math.min(100, score));
        target.innerHTML = [
          '<div class="grid">',
          '<div class="card span-4"><h3>Large Trust Score</h3><div class="score-ring" style="--score:' + html(score) + ';"><strong data-count="' + html(score) + '">' + html(score) + '</strong></div><div style="text-align:center;">' + badge(data.assessment?.riskLevel || data.riskLevel || 'UNKNOWN') + '</div><div class="confidence-bar"><div class="confidence-fill" style="width:' + html(confidence) + '%;"></div></div><p style="text-align:center;">Confidence level: ' + html(confidence) + '%</p></div>',
          '<div class="card span-4"><h3>Decision Badge</h3><div style="margin-bottom:10px;">' + badge(decision) + '</div><p>' + html(data.reason || data.summary || '') + '</p><h3>Recommendation</h3><p>' + html(trustRecommendation(decision, score)) + '</p></div>',
          '<div class="card span-4"><h3>Customer Metrics</h3><div class="status-list">' + Object.entries(metrics).map(([key, value]) => statusRow(key, value, 'ACTIVE')).join('') + '</div></div>',
          '<div class="card span-6"><h3>Recent Payment Summary</h3><div class="status-list">' + statusRow('Successful payments', metrics.successfulPayments ?? 0, 'SUCCESS') + statusRow('Failed payments', metrics.failedPayments ?? 0, Number(metrics.failedPayments || 0) ? 'FAILED' : 'LOW') + statusRow('Pending payments', metrics.pendingPayments ?? 0, Number(metrics.pendingPayments || 0) ? 'PENDING' : 'LOW') + statusRow('Recent activity', metrics.recentActivityCount ?? 0, Number(metrics.recentActivityCount || 0) ? 'ACTIVE' : 'PENDING') + '</div></div>',
          '<div class="card span-6"><h3>Virtual Account Summary</h3><div class="status-list">' + statusRow('Active virtual accounts', metrics.activeVirtualAccounts ?? 0, Number(metrics.activeVirtualAccounts || 0) ? 'ACTIVE' : 'PENDING') + statusRow('Closed virtual accounts', metrics.closedVirtualAccounts ?? 0, Number(metrics.closedVirtualAccounts || 0) ? 'REVIEW' : 'LOW') + statusRow('Account age days', metrics.accountAgeDays ?? 0, 'ACTIVE') + statusRow('Customer status', metrics.customerStatus || '--', metrics.customerStatus || 'PENDING') + '</div></div>',
          '<div class="card span-12"><h3>Risk Factors</h3>' + riskFactorCards(signals) + '</div>',
          '</div>'
        ].join('');
        enhancePage();
      } catch (error) {
        target.innerHTML = errorCard(error);
      }
    }

    function trustRecommendation(decision, score) {
      if (decision === 'ALLOW' || score >= 85) {
        return 'Customer is eligible for low-friction processing based on the returned Trust Engine result.';
      }
      if (decision === 'BLOCK' || score < 55) {
        return 'Hold or block high-risk activity until an operator reviews the returned risk factors.';
      }
      return 'Route this customer through review or step-up controls before sensitive actions.';
    }

    function riskFactorCards(signals) {
      return signals && signals.length ? '<div class="entity-grid">' + signals.map((signal) => [
        '<div class="risk-card">',
        '<div class="section-head"><div><div class="item-title">' + html(signal.key || 'risk.signal') + '</div><div class="item-meta">' + html(signal.description || '--') + '</div></div>' + badge(Number(signal.impact || 0) >= 0 ? 'LOW' : 'REVIEW') + '</div>',
        '<strong>' + html(Number(signal.impact || 0) >= 0 ? '+' : '') + html(signal.impact || 0) + '</strong>',
        '</div>'
      ].join('')).join('') + '</div>' : empty('No risk factors returned.');
    }

    async function renderAudit() {
      const page = document.getElementById('page');
      page.innerHTML = loading('Loading audit logs...');
      try {
        state.audit = await api('/audit');
        page.innerHTML = [
          '<div class="card">' + sectionHead('Audit Logs', 'Filtered administrative and security-relevant events.'),
          '<div class="toolbar"><select id="auditFilter"><option value="">All</option><option value="Security">Security</option><option value="Webhook">Webhook</option><option value="Customer">Customer</option><option value="Transfer">Transfer</option><option value="System">System</option></select></div>',
          '<div id="auditTimeline"></div></div>'
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
      const timeline = document.getElementById('auditTimeline');
      if (timeline) {
        timeline.innerHTML = auditTimeline(rows);
      }
    }

    function auditTimeline(rows) {
      return rows.length ? '<div class="timeline">' + rows.map((log) => [
        '<div class="timeline-item">',
        '<div class="section-head"><div><div class="item-title">' + html(log.action) + '</div><div class="item-meta">' + html(auditCategory(log)) + ' · ' + date(log.createdAt) + '</div></div>' + badge(log.severity) + '</div>',
        '<div class="item-meta">Actor: ' + html(log.actorType || '--') + ' · Customer: ' + html(log.user ? customerCode(log.user) + ' ' + person(log.user) : log.userId || '--') + '</div>',
        '</div>'
      ].join('')).join('') + '</div>' : empty('No audit events found.');
    }

    function auditTable(rows) {
      return rows.length ? [
        '<div class="table-wrap"><table><thead><tr><th>Severity</th><th>Action</th><th>Actor</th><th>Time</th><th>Linked Customer</th><th>Linked Transaction</th><th>Linked Virtual Account</th><th>Webhook Reference</th></tr></thead><tbody>',
        rows.map((log) => [
          '<tr>',
          '<td data-label="Severity">' + badge(log.severity) + '</td>',
          '<td data-label="Action">' + html(log.action) + '</td>',
          '<td data-label="Actor">' + badge(log.actorType) + '</td>',
          '<td data-label="Time">' + date(log.createdAt) + '</td>',
          '<td data-label="Linked Customer">' + html(log.user ? customerCode(log.user) + ' ' + person(log.user) : log.userId || '--') + '</td>',
          '<td data-label="Linked Transaction">' + html(auditLinkedTransaction(log)) + '</td>',
          '<td data-label="Linked Virtual Account">' + html(auditLinkedVirtualAccount(log)) + '</td>',
          '<td data-label="Webhook Reference">' + html(auditWebhookReference(log)) + '</td>',
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
        '<div class="card span-6 settings-card"><h2>Connection Status</h2><div class="status-list">' + statusRow('Webhook Status', 'Receiving signed notifications', 'ACTIVE') + statusRow('Signature Verification', 'HMAC-SHA256 enabled', 'ACTIVE') + statusRow('Nomba Connection', 'Configured', 'ACTIVE') + statusRow('Environment', environment, 'ACTIVE') + statusRow('Render Deployment', renderDeployment, 'ACTIVE') + statusRow('Database', 'Connected through Prisma', 'ACTIVE') + '</div></div>',
        '<div class="card span-6 settings-card"><h2>Webhook Integration</h2><p>TrustVault securely receives payment notifications from Nomba using signed webhooks.</p><p>Every event is cryptographically verified before being reconciled into customer transactions.</p><p>Verified events automatically:</p><p>- Create audit records<br />- Update payment history<br />- Link virtual accounts<br />- Feed Trust Engine analysis</p><h3>Webhook Endpoint</h3><pre>' + html(webhookEndpoint) + '</pre></div>',
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
