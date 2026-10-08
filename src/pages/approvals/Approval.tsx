import React, { useState, useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { SubmitButton, CancelButton } from '../../components/custombutton/CustomButton';
import { useAppNotification } from '../../common/NotificationProvider';
import './Approval.css';

export type ApprovalCategory = 'BRD' | 'Plan' | 'Architecture';

export interface ApprovalRecord {
    id: string;
    code: string;
    title: string;
    author: string;
    dueText: string;
    isOverdue?: boolean;
    category: ApprovalCategory;
    isStudioReview?: boolean;
}

const INITIAL_APPROVAL_DATA: ApprovalRecord[] = [
    {
        id: 'app-1',
        code: 'BRD-v1.2',
        title: 'BRD v1.2 · Review comments incorporated',
        author: 'Pavan Kumar',
        dueText: 'due Today',
        category: 'BRD',
        isStudioReview: true,
    },
    {
        id: 'app-2',
        code: 'CAP-101',
        title: 'Employee management backend',
        author: 'Co-Architect',
        dueText: 'due Today',
        category: 'Architecture',
    },
    {
        id: 'app-3',
        code: 'US-002',
        title: 'Story · Update Employee',
        author: 'Co-Architect',
        dueText: 'due This week',
        category: 'Plan',
    },
    {
        id: 'app-4',
        code: 'FT-02',
        title: 'Feature · Leave Management',
        author: 'Co-Architect',
        dueText: 'due This week',
        category: 'Plan',
    },
    {
        id: 'app-5',
        code: 'US-004',
        title: 'Story · Submit Leave Request',
        author: 'Co-Architect',
        dueText: 'due This week',
        category: 'Plan',
    },
    {
        id: 'app-6',
        code: 'EP-02',
        title: 'Epic · Payroll & Attendance',
        author: 'Co-Architect',
        dueText: 'due This week',
        category: 'Plan',
    },
    {
        id: 'app-7',
        code: 'APR-311',
        title: 'BRD v2 · Leave & attendance',
        author: 'Co-Architect',
        dueText: 'due Today',
        category: 'BRD',
    },
    {
        id: 'app-8',
        code: 'APR-312',
        title: 'Payroll sync service design',
        author: 'Marcus Lee',
        dueText: 'due Tomorrow',
        category: 'Architecture',
    },
    {
        id: 'app-9',
        code: 'APR-305',
        title: 'Sensor ingestion pipeline',
        author: 'Aanya Rao',
        dueText: 'due Overdue',
        isOverdue: true,
        category: 'Architecture',
    },
];

type TabFilter = 'All' | ApprovalCategory;

export const Approval: React.FC = () => {
    const notify = useAppNotification();
    const [items, setItems] = useState<ApprovalRecord[]>(INITIAL_APPROVAL_DATA);
    const [activeTab, setActiveTab] = useState<TabFilter>('All');

    // Dynamic counts for tabs
    const counts = useMemo(() => {
        const brdCount = items.filter((i) => i.category === 'BRD').length;
        const planCount = items.filter((i) => i.category === 'Plan').length;
        const archCount = items.filter((i) => i.category === 'Architecture').length;
        return {
            All: items.length,
            BRD: brdCount,
            Plan: planCount,
            Architecture: archCount,
        };
    }, [items]);

    // Filtered item list
    const filteredItems = useMemo(() => {
        if (activeTab === 'All') return items;
        return items.filter((item) => item.category === activeTab);
    }, [items, activeTab]);

    // Action handlers
    const handleApprove = (item: ApprovalRecord) => {
        setItems((prev) => prev.filter((i) => i.id !== item.id));
        notify.success('Approved', `"${item.title}" has been approved.`);
    };

    const handleReject = (item: ApprovalRecord) => {
        setItems((prev) => prev.filter((i) => i.id !== item.id));
        notify.info('Rejected', `"${item.title}" has been rejected.`);
    };

    const handleReviewInStudio = (item: ApprovalRecord) => {
        notify.info('Review In Studio', `Opening Studio review for "${item.title}".`);
    };

    return (
        <div className="approvals-root">
            {/* Page Header */}
            <div className="approvals-header">
                <h1 className="approvals-heading">Approvals</h1>
                <p className="approvals-subheading">
                    Everything waiting on a human decision. AI output stays a draft until approved here or in its module.
                </p>
            </div>

            {/* Filter Tabs Bar */}
            <div className="approvals-tabs-toolbar">
                {(['All', 'BRD', 'Plan', 'Architecture'] as TabFilter[]).map((tab) => (
                    <button
                        key={tab}
                        className={`approvals-tab-pill ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        <span>{tab}</span>
                        <span className="approvals-tab-count">{counts[tab]}</span>
                    </button>
                ))}
            </div>

            {/* Approvals List Card */}
            <div className="approvals-card">
                <div className="approvals-list-container">
                    {filteredItems.length === 0 ? (
                        <div className="approvals-empty-state">
                            No pending approvals found in this category.
                        </div>
                    ) : (
                        filteredItems.map((item) => (
                            <div key={item.id} className="approval-row">
                                {/* Left info */}
                                <div className="approval-row-left">
                                    <div className="approval-title-line">
                                        <span className="approval-code">{item.code}</span>
                                        <span className="approval-name">{item.title}</span>
                                    </div>
                                    <div className="approval-meta-line">
                                        <span>
                                            {item.author} ·{' '}
                                            <span className={item.isOverdue ? 'due-overdue' : ''}>
                                                {item.dueText}
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                {/* Right controls */}
                                <div className="approval-row-right">
                                    {/* Category Pill */}
                                    <span
                                        className={`approval-category-pill cat-pill-${item.category.toLowerCase()} ${item.isOverdue ? 'is-overdue-tag' : ''
                                            }`}
                                    >
                                        ● {item.category}
                                    </span>

                                    {/* Actions */}
                                    {item.isStudioReview ? (
                                        <CancelButton onClick={() => handleReviewInStudio(item)}>
                                            Review in studio
                                        </CancelButton>
                                    ) : (
                                        <>
                                            <CancelButton size="small" onClick={() => handleReject(item)}>
                                                <X size={14} style={{ marginRight: 4 }} />
                                                <span>Reject</span>
                                            </CancelButton>

                                            <SubmitButton size="small" onClick={() => handleApprove(item)}>
                                                <Check size={14} style={{ marginRight: 4 }} />
                                                <span>Approve</span>
                                            </SubmitButton>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Approval;
