import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';
import { Check, X } from 'lucide-react';
import { useAppNotification } from '../../common/NotificationProvider';
import './Overview.css';

// Project item interface
interface ProjectItem {
    id: string;
    code: string;
    title: string;
    description: string;
    authorInitials: string;
    authorName: string;
    lastUpdated: string;
    stage: string;
    progress: number;
    status: 'on-track' | 'at-risk' | 'planning' | 'completed';
    statusLabel: string;
}

// Approval item interface
interface ApprovalItem {
    id: string;
    type: string;
    typeClass: 'pill-brd' | 'pill-architecture' | 'pill-frontend';
    dueDate: string;
    isOverdue?: boolean;
    title: string;
    projectName: string;
    submitter: string;
}

// Activity item interface
interface ActivityItem {
    id: string;
    avatar: string;
    actor: string;
    action: string;
    target: string;
    projectName: string;
    timeAgo: string;
}

// Lifecycle stage interface
interface LifecycleStage {
    name: string;
    percent: number;
    status: string;
}

// Initial Mock Data matching uploaded mockups
const INITIAL_PROJECTS: ProjectItem[] = [
    {
        id: '1',
        code: 'EMS',
        title: 'Employee Management System',
        description: 'Unified HR platform for onboarding, leave,...',
        authorInitials: 'PK',
        authorName: 'Pavan Kumar',
        lastUpdated: '2d ago',
        stage: 'Architecture',
        progress: 55,
        status: 'on-track',
        statusLabel: 'On track',
    },
    {
        id: '2',
        code: 'THA',
        title: 'ThermalAI',
        description: 'Predictive thermal anomaly detection for...',
        authorInitials: 'AR',
        authorName: 'Aanya Rao',
        lastUpdated: '2d ago',
        stage: 'Planning',
        progress: 34,
        status: 'at-risk',
        statusLabel: 'At risk',
    },
    {
        id: '3',
        code: 'CUP',
        title: 'Customer Portal',
        description: 'Self-service portal for account managem...',
        authorInitials: 'ML',
        authorName: 'Marcus Lee',
        lastUpdated: '3d ago',
        stage: 'Validate',
        progress: 88,
        status: 'on-track',
        statusLabel: 'On track',
    },
    {
        id: '4',
        code: 'VEN',
        title: 'Vendor Onboarding',
        description: 'Supplier KYC, contract intake and compli...',
        authorInitials: 'PN',
        authorName: 'Priya Nair',
        lastUpdated: '5d ago',
        stage: 'Requirements',
        progress: 7,
        status: 'planning',
        statusLabel: 'Planning',
    },
    {
        id: '5',
        code: 'FIN',
        title: 'Financial Ledger Service',
        description: 'Double-entry accounting and ledger sync...',
        authorInitials: 'PK',
        authorName: 'Pavan Kumar',
        lastUpdated: '6d ago',
        stage: 'Build',
        progress: 42,
        status: 'on-track',
        statusLabel: 'On track',
    },
    {
        id: '6',
        code: 'SEC',
        title: 'IAM Access Control',
        description: 'Zero-trust enterprise authorization engine...',
        authorInitials: 'AR',
        authorName: 'Aanya Rao',
        lastUpdated: '1w ago',
        stage: 'Validate',
        progress: 91,
        status: 'on-track',
        statusLabel: 'On track',
    },
];

const INITIAL_APPROVALS: ApprovalItem[] = [
    {
        id: 'app-1',
        type: 'BRD',
        typeClass: 'pill-brd',
        dueDate: 'Today',
        title: 'BRD v2 · Leave & attendance',
        projectName: 'Employee Management System',
        submitter: 'Co-Architect',
    },
    {
        id: 'app-2',
        type: 'Architecture',
        typeClass: 'pill-architecture',
        dueDate: 'Tomorrow',
        title: 'Payroll sync service design',
        projectName: 'Employee Management System',
        submitter: 'Marcus Lee',
    },
    {
        id: 'app-3',
        type: 'Frontend',
        typeClass: 'pill-frontend',
        dueDate: 'Oct 6',
        title: 'Employee profile page proposal',
        projectName: 'Employee Management System',
        submitter: 'Priya Nair',
    },
    {
        id: 'app-4',
        type: 'Architecture',
        typeClass: 'pill-architecture',
        dueDate: 'Overdue',
        isOverdue: true,
        title: 'Sensor ingestion pipeline',
        projectName: 'ThermalAI',
        submitter: 'Aanya Rao',
    },
    {
        id: 'app-5',
        type: 'BRD',
        typeClass: 'pill-brd',
        dueDate: 'Oct 12',
        title: 'Single Sign-on SAML Spec',
        projectName: 'Customer Portal',
        submitter: 'Marcus Lee',
    },
];

const LIFECYCLE_STAGES: LifecycleStage[] = [
    { name: 'Requirements', percent: 85, status: '1 in progress' },
    { name: 'Planning', percent: 68, status: '1 in progress' },
    { name: 'Architecture', percent: 54, status: '1 in progress' },
    { name: 'Build', percent: 37, status: '1 in progress' },
    { name: 'Validate', percent: 22, status: '1 in progress' },
    { name: 'Release', percent: 10, status: '1 in progress' },
];

const INITIAL_ACTIVITY: ActivityItem[] = [
    {
        id: 'act-1',
        avatar: 'C',
        actor: 'Co-Architect',
        action: 'generated BRD',
        target: 'Leave & attendance v2',
        projectName: 'Employee Management System',
        timeAgo: '8m ago',
    },
    {
        id: 'act-2',
        avatar: 'PK',
        actor: 'Pavan Kumar',
        action: 'approved requirement',
        target: 'REQ-118 Role-based access',
        projectName: 'Employee Management System',
        timeAgo: '34m ago',
    },
    {
        id: 'act-3',
        avatar: 'ML',
        actor: 'Marcus Lee',
        action: 'updated API definition',
        target: 'POST /employees/{id}/leave',
        projectName: 'Employee Management System',
        timeAgo: '1h ago',
    },
    {
        id: 'act-4',
        avatar: 'PN',
        actor: 'Priya Nair',
        action: 'created new page',
        target: 'Org chart explorer',
        projectName: 'Employee Management System',
        timeAgo: '2h ago',
    },
    {
        id: 'act-5',
        avatar: 'AR',
        actor: 'Aanya Rao',
        action: 'flagged risk on',
        target: 'Sensor ingestion pipeline',
        projectName: 'ThermalAI',
        timeAgo: '3h ago',
    },
    {
        id: 'act-6',
        avatar: 'Rb',
        actor: 'Release bot',
        action: 'prepared release',
        target: 'Customer Portal v1.3.0',
        projectName: 'Customer Portal',
        timeAgo: '5h ago',
    },
    {
        id: 'act-7',
        avatar: 'PK',
        actor: 'Pavan Kumar',
        action: 'merged pull request',
        target: 'PR #204 Gateway Routing',
        projectName: 'Employee Management System',
        timeAgo: '6h ago',
    },
];

export const Overview: React.FC = () => {
    const navigate = useNavigate();
    const notify = useAppNotification();

    const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
    const [approvals, setApprovals] = useState<ApprovalItem[]>(INITIAL_APPROVALS);
    const [activity, setActivity] = useState<ActivityItem[]>(INITIAL_ACTIVITY);

    // Dynamic Greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    // Handle Approve
    const handleApprove = (item: ApprovalItem) => {
        setApprovals((prev) => prev.filter((a) => a.id !== item.id));
        notify.success(
            'Approval Approved',
            `"${item.title}" has been successfully approved.`
        );
        // Add to activity
        setActivity((prev) => [
            {
                id: `act-${Date.now()}`,
                avatar: 'PK',
                actor: 'Pavan Kumar',
                action: 'approved',
                target: item.title,
                projectName: item.projectName,
                timeAgo: 'Just now',
            },
            ...prev,
        ]);
    };

    // Handle Reject
    const handleReject = (item: ApprovalItem) => {
        setApprovals((prev) => prev.filter((a) => a.id !== item.id));
        notify.info(
            'Approval Declined',
            `"${item.title}" has been declined.`
        );
    };

    return (
        <div className="overview-root">
            {/* Top Header Bar */}
            <div className="overview-header-row">
                <div className="overview-title-group">
                    <span className="overview-eyebrow">Workspace overview</span>
                    <h1 className="overview-main-heading">{getGreeting()}, Pavan</h1>
                </div>
            </div>

            {/* Main Grid: Top Row */}
            <div className="overview-grid">
                {/* Top Left: Recent Projects */}
                <div className="overview-card">
                    <div className="overview-card-header">
                        <h2 className="overview-card-title">Recent projects</h2>
                        <span
                            className="overview-card-link"
                            onClick={() => navigate('/workspace/projects')}
                        >
                            All projects
                        </span>
                    </div>

                    <div className="overview-scroll-container recent-projects-list">
                        {projects.length === 0 ? (
                            <div className="overview-empty-state">No recent projects found.</div>
                        ) : (
                            projects.map((project) => (
                                <div key={project.id} className="project-item-row">
                                    {/* Left: Badge + Details */}
                                    <div className="project-main-info">
                                        <div className="project-code-badge">{project.code}</div>
                                        <div className="project-details">
                                            <div className="project-title" title={project.title}>
                                                {project.title}
                                            </div>
                                            <div className="project-desc" title={project.description}>
                                                {project.description}
                                            </div>
                                            <div className="project-meta-row">
                                                <span className="project-author-avatar">
                                                    {project.authorInitials}
                                                </span>
                                                <span>
                                                    {project.authorName} · {project.lastUpdated}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stage */}
                                    <div className="project-stage-col">
                                        <span className="project-stage-label">Stage</span>
                                        <span className="project-stage-val">{project.stage}</span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="project-progress-col">
                                        <div className="project-progress-header">
                                            <span>Progress</span>
                                            <span>{project.progress}%</span>
                                        </div>
                                        <div className="project-progress-bar-track">
                                            <div
                                                className="project-progress-bar-fill"
                                                style={{ width: `${project.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Status Pill */}
                                    <div className={`project-status-pill status-${project.status}`}>
                                        <span className="status-dot" />
                                        <span>{project.statusLabel}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Top Right: My Pending Approvals */}
                <div className="overview-card">
                    <div className="overview-card-header">
                        <h2 className="overview-card-title">My pending approvals</h2>
                        <span className="overview-badge-count">{approvals.length}</span>
                    </div>

                    <div className="overview-scroll-container pending-approvals-list">
                        {approvals.length === 0 ? (
                            <div className="overview-empty-state">
                                No pending approvals at this time.
                            </div>
                        ) : (
                            approvals.map((item) => (
                                <div key={item.id} className="approval-item-row">
                                    <div className="approval-top-bar">
                                        <div className="approval-tag-group">
                                            <span className={`approval-type-pill ${item.typeClass}`}>
                                                ● {item.type}
                                            </span>
                                            <span
                                                className={`approval-due-text ${item.isOverdue ? 'is-overdue' : ''
                                                    }`}
                                            >
                                                {item.dueDate}
                                            </span>
                                        </div>

                                        <div className="approval-actions">
                                            <Tooltip title="Reject">
                                                <button
                                                    className="approval-btn btn-reject"
                                                    onClick={() => handleReject(item)}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </Tooltip>
                                            <Tooltip title="Approve">
                                                <button
                                                    className="approval-btn btn-approve"
                                                    onClick={() => handleApprove(item)}
                                                >
                                                    <Check size={14} />
                                                </button>
                                            </Tooltip>
                                        </div>
                                    </div>

                                    <h3 className="approval-title">{item.title}</h3>
                                    <div className="approval-meta">
                                        {item.projectName} · {item.submitter}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Main Grid: Bottom Row */}
            <div className="overview-grid">
                {/* Bottom Left: Lifecycle Summary */}
                <div className="overview-card">
                    <div className="overview-card-header">
                        <h2 className="overview-card-title">Lifecycle summary</h2>
                        <span className="overview-card-sublabel">Avg. across 4 projects</span>
                    </div>

                    <div className="lifecycle-stages-grid">
                        {LIFECYCLE_STAGES.map((stage) => (
                            <div key={stage.name} className="lifecycle-stage-card">
                                <span className="lifecycle-stage-name">{stage.name}</span>
                                <span className="lifecycle-stage-val">{stage.percent}%</span>
                                <div className="lifecycle-progress-track">
                                    <div
                                        className="lifecycle-progress-fill"
                                        style={{ width: `${stage.percent}%` }}
                                    />
                                </div>
                                <span className="lifecycle-stage-status">{stage.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Right: Recent Activity */}
                <div className="overview-card">
                    <div className="overview-card-header">
                        <h2 className="overview-card-title">Recent activity</h2>
                    </div>

                    <div className="overview-scroll-container recent-activity-list">
                        {activity.length === 0 ? (
                            <div className="overview-empty-state">No recent activity.</div>
                        ) : (
                            activity.map((act) => (
                                <div key={act.id} className="activity-item-row">
                                    <div className="activity-avatar">{act.avatar}</div>
                                    <div className="activity-content">
                                        <div className="activity-text">
                                            <strong>{act.actor}</strong> {act.action}{' '}
                                            <strong>{act.target}</strong>
                                        </div>
                                        <div className="activity-meta-line">
                                            {act.projectName} · {act.timeAgo}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
