import React, { useState } from 'react';
import './VersionsTab.css';

interface VersionHistoryItem {
  id: string;
  version: string;
  title: string;
  author: string;
  date: string;
  status: 'In Review' | 'Superseded';
}

interface DiffChangeItem {
  id: string;
  type: 'added' | 'modified' | 'deleted';
  text: string;
  subtext: string;
  targetVersion: string;
}

const VERSION_HISTORY: VersionHistoryItem[] = [
  {
    id: 'ver-1.2',
    version: 'v1.2',
    title: 'Review comments incorporated',
    author: 'Pavan Kumar',
    date: 'Oct 2, 2026',
    status: 'In Review',
  },
  {
    id: 'ver-1.1',
    version: 'v1.1',
    title: 'Business rules updated',
    author: 'Pavan Kumar',
    date: 'Sep 26, 2026',
    status: 'Superseded',
  },
  {
    id: 'ver-1.0',
    version: 'v1.0',
    title: 'Initial draft',
    author: 'Co-Architect',
    date: 'Sep 18, 2026',
    status: 'Superseded',
  },
];

const DIFF_CHANGES: DiffChangeItem[] = [
  {
    id: 'diff-1',
    type: 'added',
    text: '+ BR-001 Leave carry-forward capped at 15 days.',
    subtext: 'Added · Business Rules',
    targetVersion: 'v1.1',
  },
  {
    id: 'diff-2',
    type: 'added',
    text: '+ BR-002 Probation employees limited to 3 consecutive paid leave days.',
    subtext: 'Added · Business Rules',
    targetVersion: 'v1.1',
  },
  {
    id: 'diff-3',
    type: 'modified',
    text: '✎ FR-002 now deducts leave balance automatically on approval.',
    subtext: 'Modified · Functional Requirements',
    targetVersion: 'v1.1',
  },
  {
    id: 'diff-4',
    type: 'deleted',
    text: '- Expense management moved out of scope.',
    subtext: 'Removed · Project Scope',
    targetVersion: 'v1.1',
  },
  {
    id: 'diff-5',
    type: 'added',
    text: '+ FR-006 Payroll export to Keka at period end.',
    subtext: 'Added · Functional Requirements',
    targetVersion: 'v1.2',
  },
];

export const VersionsTab: React.FC = () => {
  const [selectedVersionFrom, setSelectedVersionFrom] = useState('v1.0');
  const [selectedVersionTo, setSelectedVersionTo] = useState('v1.2');

  return (
    <div className="req-tab-versions">
      {/* 1. Left Sidebar: Version History */}
      <div className="req-versions-sidebar">
        <h3 className="req-versions-sidebar-title">Version history</h3>
        <div className="req-versions-list">
          {VERSION_HISTORY.map((item) => {
            const isCurrent = item.status === 'In Review';
            return (
              <div
                key={item.id}
                className={`req-version-card ${isCurrent ? 'active' : ''}`}
              >
                <div className="req-version-card-top">
                  <h4 className="req-version-heading">
                    {item.version} — {item.title}
                  </h4>
                </div>
                <div className="req-version-card-meta">
                  <span className="req-version-author">
                    {item.author} · {item.date}
                  </span>
                  <span
                    className={`req-status-pill ${
                      item.status === 'In Review'
                        ? 'status-in-review'
                        : 'status-draft'
                    }`}
                  >
                    <span className="req-status-dot" />
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Right Main: Compare versions */}
      <div className="req-compare-panel">
        <div className="req-compare-header">
          <h3 className="req-compare-title">Compare versions</h3>
          <div className="req-compare-selectors">
            <select
              className="req-version-select"
              value={selectedVersionFrom}
              onChange={(e) => setSelectedVersionFrom(e.target.value)}
            >
              <option value="v1.0">v1.0</option>
              <option value="v1.1">v1.1</option>
            </select>
            <span className="req-compare-arrow">→</span>
            <select
              className="req-version-select"
              value={selectedVersionTo}
              onChange={(e) => setSelectedVersionTo(e.target.value)}
            >
              <option value="v1.2">v1.2</option>
              <option value="v1.1">v1.1</option>
            </select>
          </div>
        </div>

        {/* Diff statistics summary */}
        <div className="req-diff-summary-row">
          <span className="diff-stat-item stat-add">+4 additions</span>
          <span className="diff-stat-item stat-mod">~3 modifications</span>
          <span className="diff-stat-item stat-del">-2 deletions</span>
        </div>

        {/* Diff cards list */}
        <div className="req-diff-cards-list">
          {DIFF_CHANGES.map((diff) => {
            const diffClass =
              diff.type === 'added'
                ? 'diff-card-added'
                : diff.type === 'modified'
                ? 'diff-card-modified'
                : 'diff-card-deleted';

            return (
              <div key={diff.id} className={`req-diff-card ${diffClass}`}>
                <div className="req-diff-card-content">
                  <span className="req-diff-text">{diff.text}</span>
                  {diff.subtext && (
                    <span className="req-diff-sub">{diff.subtext}</span>
                  )}
                </div>
                <span className="req-diff-target-ver">{diff.targetVersion}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VersionsTab;
