import React, { useState, useMemo } from 'react';
import { Input } from 'antd';
import { Search } from 'lucide-react';
import './Version.css';

export type VersionCategory = 'Plan' | 'Requirements' | 'Architecture' | 'Release';

export interface VersionChangeRecord {
  id: string;
  code: string;
  title: string;
  category: VersionCategory;
  transition: string;
  timestamp: string;
}

const INITIAL_VERSION_CHANGES: VersionChangeRecord[] = [
  {
    id: 'chg-106',
    code: 'CHG-106',
    title: 'EP-02 approved',
    category: 'Plan',
    transition: 'In Review → Approved',
    timestamp: 'Just now',
  },
  {
    id: 'chg-105',
    code: 'CHG-105',
    title: 'Release record v1.3.2 prepared for Staging',
    category: 'Release',
    transition: 'v1.3.1 → v1.3.2',
    timestamp: 'Just now',
  },
  {
    id: 'chg-104',
    code: 'CHG-104',
    title: 'BRD v1.2 · review comments incorporated',
    category: 'Requirements',
    transition: 'v1.1 → v1.2',
    timestamp: 'Oct 2, 2026',
  },
  {
    id: 'chg-103',
    code: 'CHG-103',
    title: 'Employee entity draft 1.1',
    category: 'Architecture',
    transition: '1.0 → 1.1 (draft)',
    timestamp: 'Sep 30, 2026',
  },
  {
    id: 'chg-102',
    code: 'CHG-102',
    title: 'v1.4.0 deployed to Development',
    category: 'Release',
    transition: 'v1.3.2 → v1.4.0',
    timestamp: 'Oct 4, 2026',
  },
  {
    id: 'chg-101',
    code: 'CHG-101',
    title: 'BRD v1.1 · business rules updated',
    category: 'Requirements',
    transition: 'v1.0 → v1.1',
    timestamp: 'Sep 26, 2026',
  },
];

type VersionTab = 'All' | 'Requirements' | 'Architecture' | 'Release';

export const Version: React.FC = () => {
  const [items] = useState<VersionChangeRecord[]>(INITIAL_VERSION_CHANGES);
  const [activeTab, setActiveTab] = useState<VersionTab>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered items based on tab selection and search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Tab filter
      const matchesTab = activeTab === 'All' ? true : item.category === activeTab;
      if (!matchesTab) return false;

      // Search filter
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      return (
        item.code.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.transition.toLowerCase().includes(query)
      );
    });
  }, [items, activeTab, searchQuery]);

  return (
    <div className="versions-root">
      {/* Header */}
      <div className="versions-header">
        <h1 className="versions-heading">Versions & Changes</h1>
        <p className="versions-subheading">
          Every approved or published change across the lifecycle, newest first.
        </p>
      </div>

      {/* Toolbar: Tabs on Left, Search Filter on Right */}
      <div className="versions-toolbar">
        <div className="versions-tabs-group">
          {(['All', 'Requirements', 'Architecture', 'Release'] as VersionTab[]).map((tab) => (
            <button
              key={tab}
              className={`versions-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search input with icon */}
        <div className="versions-search-wrapper">
          <Input
            prefix={<Search size={14} className="versions-search-icon" />}
            placeholder="Filter changes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            className="versions-search-input"
          />
        </div>
      </div>

      {/* Main Card Container */}
      <div className="versions-card">
        <div className="versions-list-container">
          {filteredItems.length === 0 ? (
            <div className="versions-empty-state">
              No matching version changes found.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="version-row">
                {/* Left: Code + Title */}
                <div className="version-row-left">
                  <span className="version-code">{item.code}</span>
                  <span className="version-title" title={item.title}>
                    {item.title}
                  </span>
                </div>

                {/* Right: Category Pill + Transition + Timestamp */}
                <div className="version-row-right">
                  <span className={`version-category-pill ver-pill-${item.category.toLowerCase()}`}>
                    ● {item.category}
                  </span>

                  <span className="version-transition">{item.transition}</span>

                  <span className="version-date">{item.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Version;
