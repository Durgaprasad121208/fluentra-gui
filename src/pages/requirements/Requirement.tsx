import React, { useState } from 'react';
import {
  LayoutGrid,
  FileText,
  ListFilter,
  GitBranch,
  Network,
} from 'lucide-react';
import { SubmitButton } from '../../components/custombutton/CustomButton';
import { OverviewTab } from './overview/OverviewTab';
import { BrdStudioTab } from './brd-studio/BrdStudioTab';
import { RequirementExplorerTab } from './requirement-explorer/RequirementExplorerTab';
import { VersionsTab } from './versions/VersionsTab';
import './Requirement.css';

export type RequirementTabType = 'overview' | 'brd-studio' | 'explorer' | 'versions';

export const Requirement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RequirementTabType>('overview');

  return (
    <div className="req-page-root">
      {/* 1. Header & Breadcrumb Info */}
      <div className="req-header-wrap">
        <h3 className="req-project-subtitle">Employee Management System</h3>

        <div className="req-header-top-row">
          <div className="req-title-cluster">
            <h1 className="req-page-title">Requirements</h1>
            <span className="req-badge-brd">BRD v1.2</span>
            <span className="req-status-pill status-in-review">
              <span className="req-status-dot" />
              In Review
            </span>
          </div>

          <SubmitButton
            className="req-action-btn-plan"
            icon={<Network size={16} />}
          >
            Generate Development Plan
          </SubmitButton>
        </div>

        {/* 2. Top Nav Tabs */}
        <div className="req-nav-tabs">
          <button
            type="button"
            className={`req-nav-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutGrid size={14} />
            Overview
          </button>

          <button
            type="button"
            className={`req-nav-tab-btn ${activeTab === 'brd-studio' ? 'active' : ''}`}
            onClick={() => setActiveTab('brd-studio')}
          >
            <FileText size={14} />
            BRD Studio
          </button>

          <button
            type="button"
            className={`req-nav-tab-btn ${activeTab === 'explorer' ? 'active' : ''}`}
            onClick={() => setActiveTab('explorer')}
          >
            <ListFilter size={14} />
            Requirement Explorer
          </button>

          <button
            type="button"
            className={`req-nav-tab-btn ${activeTab === 'versions' ? 'active' : ''}`}
            onClick={() => setActiveTab('versions')}
          >
            <GitBranch size={14} />
            Versions
          </button>
        </div>
      </div>

      {/* 3. Tab Contents */}
      <div className="req-tab-content-area">
        {activeTab === 'overview' && (
          <OverviewTab onNavigateToExplorer={() => setActiveTab('explorer')} />
        )}
        {activeTab === 'brd-studio' && <BrdStudioTab />}
        {activeTab === 'explorer' && <RequirementExplorerTab />}
        {activeTab === 'versions' && <VersionsTab />}
      </div>
    </div>
  );
};

export default Requirement;
