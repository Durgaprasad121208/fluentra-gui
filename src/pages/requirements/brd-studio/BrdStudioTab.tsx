import React, { useState } from 'react';
import { Pencil, Sparkles, CheckCircle2 } from 'lucide-react';
import { SubmitButton, CancelButton } from '../../../components/custombutton/CustomButton';
import './BrdStudioTab.css';

interface SectionItem {
  id: string;
  number: string;
  name: string;
  hasAttention?: boolean;
  contentTitle?: string;
  sectionCode?: string;
  paragraphs?: string[];
}

const BRD_SECTIONS: SectionItem[] = [
  {
    id: 'sec-01',
    number: '01',
    name: 'Executive Summary',
    sectionCode: 'BRD v1.2 · §1',
    contentTitle: 'Executive Summary',
    paragraphs: [
      'The Employee Management System (EMS) replaces three disconnected HR tools with a single platform covering onboarding, attendance, leave, performance and payroll integration for 4,200 employees across 6 offices.',
      'The programme targets a 40% reduction in HR operational effort and a single source of truth for employee records by Q2 2027.',
    ],
  },
  {
    id: 'sec-02',
    number: '02',
    name: 'Business Objectives',
    sectionCode: 'BRD v1.2 · §2',
    contentTitle: 'Business Objectives',
    paragraphs: [
      'Consolidate employee master data across EMEA, APAC, and North American entities into a centralized high-availability system.',
      'Enable automated self-service workflows for employee leaves, expenses, and document management.',
    ],
  },
  {
    id: 'sec-03',
    number: '03',
    name: 'Project Scope',
    hasAttention: true,
    sectionCode: 'BRD v1.2 · §3',
    contentTitle: 'Project Scope',
    paragraphs: [
      'Phase 1 encompasses Core HR, Leave & Attendance, and Payroll synchronization with third-party vendors.',
      'Expense reporting and advanced talent succession planning are moved to Phase 2 roadmap.',
    ],
  },
  {
    id: 'sec-04',
    number: '04',
    name: 'Stakeholders',
    sectionCode: 'BRD v1.2 · §4',
    contentTitle: 'Stakeholders & Personas',
    paragraphs: [
      'Key stakeholders include Global HR Operations, Department Managers, Payroll Administrators, and System Architects.',
    ],
  },
  {
    id: 'sec-05',
    number: '05',
    name: 'Functional Requirements',
    hasAttention: true,
    sectionCode: 'BRD v1.2 · §5',
    contentTitle: 'Functional Requirements',
    paragraphs: [
      'System must support multi-tenant role-based permissions, automated approval escalation, and audit trail retention.',
    ],
  },
  {
    id: 'sec-06',
    number: '06',
    name: 'Non-Functional Requirements',
    sectionCode: 'BRD v1.2 · §6',
    contentTitle: 'Non-Functional Requirements',
    paragraphs: [
      'API response latency must remain under 200ms at 95th percentile with 99.9% uptime SLA.',
    ],
  },
  {
    id: 'sec-07',
    number: '07',
    name: 'Business Rules',
    hasAttention: true,
    sectionCode: 'BRD v1.2 · §7',
    contentTitle: 'Business Rules',
    paragraphs: [
      'Leave carry-forward is strictly capped at 15 days annually. Unused days above threshold expire at calendar year-end.',
    ],
  },
  {
    id: 'sec-08',
    number: '08',
    name: 'Process Flows',
    sectionCode: 'BRD v1.2 · §8',
    contentTitle: 'Process Flows',
    paragraphs: [
      'Detailed BPMN 2.0 diagrams for onboarding journey, leave review chains, and termination handoffs.',
    ],
  },
  {
    id: 'sec-09',
    number: '09',
    name: 'Data Requirements',
    sectionCode: 'BRD v1.2 · §9',
    contentTitle: 'Data Requirements',
    paragraphs: [
      'PostgreSQL schema specs, retention policies, and GDPR encryption at rest via AES-256.',
    ],
  },
  {
    id: 'sec-10',
    number: '10',
    name: 'Integration Requirements',
    sectionCode: 'BRD v1.2 · §10',
    contentTitle: 'Integration Requirements',
    paragraphs: [
      'REST & webhook interfaces for Keka Payroll, Okta SSO/OIDC, and Slack notification bot.',
    ],
  },
  {
    id: 'sec-11',
    number: '11',
    name: 'Reports',
    sectionCode: 'BRD v1.2 · §11',
    contentTitle: 'Reporting & Analytics',
    paragraphs: [
      'Standard automated monthly headcount census, attrition heatmaps, and leave compliance digests.',
    ],
  },
  {
    id: 'sec-12',
    number: '12',
    name: 'Assumptions',
    sectionCode: 'BRD v1.2 · §12',
    contentTitle: 'Assumptions & Constraints',
    paragraphs: [
      'Existing legacy HRIS exports will be completed 3 weeks prior to initial user acceptance testing.',
    ],
  },
];

export const BrdStudioTab: React.FC = () => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>('sec-01');

  const selectedSection =
    BRD_SECTIONS.find((sec) => sec.id === selectedSectionId) || BRD_SECTIONS[0];

  return (
    <div className="req-tab-brd-studio">
      {/* 1. Left Sections List */}
      <div className="req-brd-sidebar">
        <div className="req-brd-sidebar-title">SECTIONS</div>
        <div className="req-brd-nav-list">
          {BRD_SECTIONS.map((sec) => {
            const isSelected = sec.id === selectedSectionId;
            return (
              <button
                key={sec.id}
                type="button"
                className={`req-brd-nav-item ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedSectionId(sec.id)}
              >
                <div className="req-brd-nav-item-left">
                  <span className="req-brd-nav-num">{sec.number}</span>
                  <span className="req-brd-nav-name">{sec.name}</span>
                </div>
                {sec.hasAttention && <span className="req-brd-attention-dot" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Center Document View */}
      <div className="req-brd-content-card">
        <div className="req-brd-content-header">
          <div className="req-brd-header-titles">
            <span className="req-brd-section-code">{selectedSection.sectionCode}</span>
            <h2 className="req-brd-section-title">{selectedSection.contentTitle}</h2>
          </div>
          <CancelButton
            className="req-brd-edit-btn"
            icon={<Pencil size={13} className="req-brd-edit-icon" />}
          >
            Edit
          </CancelButton>
        </div>

        <div className="req-brd-body">
          {selectedSection.paragraphs?.map((p, idx) => (
            <p key={idx} className="req-brd-paragraph">
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* 3. Right AI Analysis Column */}
      <div className="req-brd-ai-sidebar">
        <div className="req-brd-ai-header">
          <div className="req-brd-ai-title-wrap">
            <Sparkles size={16} className="req-brd-sparkle-icon" />
            <h3 className="req-brd-ai-title">AI analysis</h3>
          </div>
          <button type="button" className="req-brd-rerun-link">
            Re-run
          </button>
        </div>

        {/* Readiness Card */}
        <div className="req-ai-readiness-card">
          <div className="req-ai-readiness-header">
            <span className="req-ai-readiness-label">Approval readiness</span>
            <span className="req-ai-readiness-val">36%</span>
          </div>
          <div className="req-ai-progress-track">
            <div className="req-ai-progress-bar" style={{ width: '36%' }} />
          </div>
          <span className="req-ai-readiness-sub">5 of 14 requirements approved</span>
        </div>

        {/* Section info */}
        <div className="req-ai-group">
          <h4 className="req-ai-group-title">This section</h4>
          <p className="req-ai-group-text">No ambiguities detected.</p>
        </div>

        {/* Blocking items */}
        <div className="req-ai-group">
          <h4 className="req-ai-group-title">Blocking critical items (2)</h4>
          <div className="req-ai-blocking-list">
            <div className="req-ai-blocking-item">
              <span className="req-ai-blocking-code">FR-006</span>
              <span className="req-ai-blocking-name">Payroll export</span>
            </div>
            <div className="req-ai-blocking-item">
              <span className="req-ai-blocking-code">NFR-003</span>
              <span className="req-ai-blocking-name">Data protection</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="req-brd-actions-bottom">
          <SubmitButton
            className="req-btn-approve-brd"
            icon={<CheckCircle2 size={16} />}
          >
            Approve BRD
          </SubmitButton>
          <CancelButton className="req-btn-save-version">
            Save as new version
          </CancelButton>
        </div>
      </div>
    </div>
  );
};

export default BrdStudioTab;
