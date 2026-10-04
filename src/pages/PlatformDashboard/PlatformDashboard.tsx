import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, Row, Col, Typography, Tag, Progress, Alert, theme } from 'antd';
import {
  ArrowUpRight,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import './PlatformDashboard.css';

const { Title, Text } = Typography;

// ---------------------------------------------------------------------------
// DATA DEFINITIONS
// ---------------------------------------------------------------------------
interface MetricItem {
  id: string;
  label: string;
  value: string;
  trend: string;
}

interface RecentlyOnboardedItem {
  id: string;
  name: string;
  country: string;
  date: string;
  plan: 'Starter' | 'Free Trial' | 'Professional';
}

interface ExpiringTrialItem {
  id: string;
  name: string;
  meta: string;
  expiryDate: string;
}

interface OverUsageItem {
  id: string;
  name: string;
  plan: string;
  percent: number;
}

interface FailedPaymentItem {
  id: string;
  name: string;
  meta: string;
  status: 'Failed' | 'Overdue';
}

interface PlatformEventItem {
  id: string;
  category: 'Platform' | 'Billing' | 'Incident' | 'Security';
  description: string;
  time: string;
}

const METRICS: MetricItem[] = [
  { id: '1', label: 'Total organisations', value: '1,284', trend: '+41' },
  { id: '2', label: 'Active organisations', value: '1,091', trend: '+33' },
  { id: '3', label: 'Trial organisations', value: '270', trend: '+12' },
  { id: '4', label: 'Paying customers', value: '1,014', trend: '+29' },
  { id: '5', label: 'Monthly recurring revenue', value: '$318.4k', trend: '+3.9%' },
  { id: '6', label: 'Annual recurring revenue', value: '$3.82M', trend: '+3.9%' },
  { id: '7', label: 'Monthly active users', value: '18,902', trend: '+1,106' },
  { id: '8', label: 'Platform utilisation', value: '67%', trend: '+1.2 pt' },
];

const RECENTLY_ONBOARDED: RecentlyOnboardedItem[] = [
  { id: '1', name: 'Bluepeak Logistics', country: 'Germany', date: 'Oct 4, 2026', plan: 'Starter' },
  { id: '2', name: 'Helio Retail', country: 'Singapore', date: 'Oct 4, 2026', plan: 'Free Trial' },
  { id: '3', name: 'Orchid Labs', country: 'India', date: 'Oct 3, 2026', plan: 'Professional' },
  { id: '4', name: 'Tidewater Energy', country: 'United States', date: 'Oct 3, 2026', plan: 'Free Trial' },
  { id: '5', name: 'Fernwood Clinics', country: 'Ireland', date: 'Sep 25, 2026', plan: 'Free Trial' },
];

const EXPIRING_TRIALS: ExpiringTrialItem[] = [
  { id: '1', name: 'Tidewater Energy', meta: '4 users · usage 112%', expiryDate: 'ends Oct 6, 2026' },
  { id: '2', name: 'Fernwood Clinics', meta: '2 users · usage 30%', expiryDate: 'ends Oct 9, 2026' },
  { id: '3', name: 'Helio Retail', meta: '3 users · usage 62%', expiryDate: 'ends Oct 18, 2026' },
];

const OVER_USAGE: OverUsageItem[] = [
  { id: '1', name: 'Tidewater Energy', plan: 'Free Trial', percent: 112 },
  { id: '2', name: 'Lumen Robotics', plan: 'Starter', percent: 124 },
];

const FAILED_PAYMENTS: FailedPaymentItem[] = [
  { id: '1', name: 'Quanta Fintech', meta: 'Professional · renewal Oct 9, 2026', status: 'Failed' },
  { id: '2', name: 'Orchid Labs', meta: 'Professional · renewal —', status: 'Overdue' },
];

const PLATFORM_EVENTS: PlatformEventItem[] = [
  { id: '1', category: 'Platform', description: 'Platform release 2026.10.2 rolled out to prod-ap-1', time: '10:02' },
  { id: '2', category: 'Billing', description: 'Professional plan limits updated by Sara Lindqvist', time: '09:47' },
  { id: '3', category: 'Incident', description: 'Co-Architect latency alert opened (EU)', time: '08:30' },
  { id: '4', category: 'Security', description: 'Signing keys rotated by Diego Alvarez', time: 'Yesterday' },
];

export const PlatformDashboard: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { token } = theme.useToken();

  // Dynamic token colors for ECharts
  const textColor = token.colorText;
  const subtextColor = token.colorTextSecondary;
  const splitLineColor = isDarkMode ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)';
  const tooltipBg = token.colorBgElevated;
  const tooltipBorder = token.colorBorderSecondary;

  // ---------------------------------------------------------------------------
  // 1. ORGANISATION GROWTH (Line Chart with gradient area)
  // ---------------------------------------------------------------------------
  const orgGrowthOption = useMemo(() => ({
    tooltip: {
      trigger: 'axis',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: { color: textColor, fontSize: 11.5 },
    },
    grid: { top: 12, right: 12, bottom: 18, left: 38 },
    xAxis: {
      type: 'category',
      data: ['Jul', 'Aug', 'Sep', 'Oct'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: subtextColor, fontSize: 10.5 },
    },
    yAxis: {
      type: 'value',
      min: 1081,
      max: 1304,
      interval: 60,
      axisLabel: { color: subtextColor, fontSize: 10.5 },
      splitLine: { lineStyle: { color: splitLineColor, type: 'solid' } },
    },
    series: [
      {
        name: 'Total tenants',
        type: 'line',
        smooth: false,
        showSymbol: false,
        lineStyle: { color: '#0284c7', width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(2, 132, 199, 0.18)' },
              { offset: 1, color: 'rgba(2, 132, 199, 0.01)' },
            ],
          },
        },
        data: [1081, 1165, 1235, 1304],
      },
    ],
  }), [tooltipBg, tooltipBorder, textColor, subtextColor, splitLineColor]);

  // ---------------------------------------------------------------------------
  // 2. MRR TREND (Line Chart)
  // ---------------------------------------------------------------------------
  const mrrTrendOption = useMemo(() => ({
    tooltip: {
      trigger: 'axis',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: { color: textColor, fontSize: 11.5 },
      formatter: (params: any) => `${params[0].name}: $${params[0].value}k`,
    },
    grid: { top: 12, right: 12, bottom: 18, left: 44 },
    xAxis: {
      type: 'category',
      data: ['Jul', 'Aug', 'Sep', 'Oct'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: subtextColor, fontSize: 10.5 },
    },
    yAxis: {
      type: 'value',
      min: 259,
      max: 323,
      interval: 20,
      axisLabel: {
        color: subtextColor,
        fontSize: 10.5,
        formatter: (val: number) => `$${val}k`,
      },
      splitLine: { lineStyle: { color: splitLineColor, type: 'solid' } },
    },
    series: [
      {
        name: 'MRR',
        type: 'line',
        smooth: false,
        showSymbol: false,
        lineStyle: { color: '#0284c7', width: 2 },
        data: [259, 281, 303, 323],
      },
    ],
  }), [tooltipBg, tooltipBorder, textColor, subtextColor, splitLineColor]);

  // ---------------------------------------------------------------------------
  // 3. SUBSCRIPTION DISTRIBUTION (Donut Chart)
  // ---------------------------------------------------------------------------
  const subscriptionDonutOption = useMemo(() => ({
    tooltip: {
      trigger: 'item',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: { color: textColor, fontSize: 11.5 },
      formatter: '{b}: {c} ({d}%)',
    },
    series: [
      {
        name: 'Plan',
        type: 'pie',
        radius: ['52%', '78%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { scale: true, scaleSize: 4 },
        itemStyle: {
          borderColor: isDarkMode ? token.colorBgContainer : '#ffffff',
          borderWidth: 2,
        },
        data: [
          { value: 64, name: 'Enterprise', itemStyle: { color: isDarkMode ? '#1e293b' : '#0f172a' } },
          { value: 412, name: 'Professional', itemStyle: { color: '#0284c7' } },
          { value: 538, name: 'Starter', itemStyle: { color: '#84cc16' } },
          { value: 270, name: 'Free Trial', itemStyle: { color: '#64748b' } },
        ],
      },
    ],
  }), [tooltipBg, tooltipBorder, textColor, isDarkMode, token.colorBgContainer]);

  // ---------------------------------------------------------------------------
  // 4. NEW CUSTOMER ACQUISITION (Bar Chart)
  // ---------------------------------------------------------------------------
  const newAcquisitionOption = useMemo(() => ({
    tooltip: {
      trigger: 'axis',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: { color: textColor, fontSize: 11.5 },
    },
    grid: { top: 12, right: 12, bottom: 18, left: 30 },
    xAxis: {
      type: 'category',
      data: ['Jul', 'Aug', 'Sep', 'Oct'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: subtextColor, fontSize: 10.5 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 60,
      interval: 15,
      axisLabel: { color: subtextColor, fontSize: 10.5 },
      splitLine: { lineStyle: { color: splitLineColor, type: 'solid' } },
    },
    series: [
      {
        name: 'New customers',
        type: 'bar',
        barWidth: '55%',
        itemStyle: {
          color: '#84cc16',
          borderRadius: [3, 3, 0, 0],
        },
        data: [48, 60, 61, 57],
      },
    ],
  }), [tooltipBg, tooltipBorder, textColor, subtextColor, splitLineColor]);

  // ---------------------------------------------------------------------------
  // 5. TRIAL-TO-PAID CONVERSION (Line Chart with Dots)
  // ---------------------------------------------------------------------------
  const conversionOption = useMemo(() => ({
    tooltip: {
      trigger: 'axis',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: { color: textColor, fontSize: 11.5 },
      formatter: (params: any) => `${params[0].name}: ${params[0].value}%`,
    },
    grid: { top: 12, right: 12, bottom: 18, left: 34 },
    xAxis: {
      type: 'category',
      data: ['Jul', 'Aug', 'Sep', 'Oct'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: subtextColor, fontSize: 10.5 },
    },
    yAxis: {
      type: 'value',
      min: 15,
      max: 32,
      interval: 5,
      axisLabel: {
        color: subtextColor,
        fontSize: 10.5,
        formatter: (val: number) => `${val}%`,
      },
      splitLine: { lineStyle: { color: splitLineColor, type: 'solid' } },
    },
    series: [
      {
        name: 'Conversion Rate',
        type: 'line',
        smooth: false,
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 5,
        itemStyle: { color: '#84cc16' },
        lineStyle: { color: '#84cc16', width: 2 },
        data: [26.5, 27.8, 28.9, 30.2],
      },
    ],
  }), [tooltipBg, tooltipBorder, textColor, subtextColor, splitLineColor]);

  // ---------------------------------------------------------------------------
  // 6. CUSTOMER CHURN (Bar Chart - Coral Red)
  // ---------------------------------------------------------------------------
  const churnOption = useMemo(() => ({
    tooltip: {
      trigger: 'axis',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: { color: textColor, fontSize: 11.5 },
      formatter: (params: any) => `${params[0].name}: ${params[0].value}%`,
    },
    grid: { top: 12, right: 12, bottom: 18, left: 36 },
    xAxis: {
      type: 'category',
      data: ['Jul', 'Aug', 'Sep', 'Oct'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: subtextColor, fontSize: 10.5 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1.6,
      interval: 0.4,
      axisLabel: {
        color: subtextColor,
        fontSize: 10.5,
        formatter: (val: number) => `${val}%`,
      },
      splitLine: { lineStyle: { color: splitLineColor, type: 'solid' } },
    },
    series: [
      {
        name: 'Churn Rate',
        type: 'bar',
        barWidth: '55%',
        itemStyle: {
          color: '#e05e5e',
          borderRadius: [3, 3, 0, 0],
        },
        data: [1.42, 1.53, 1.32, 1.21],
      },
    ],
  }), [tooltipBg, tooltipBorder, textColor, subtextColor, splitLineColor]);

  return (
    <div className="pd-root-container">
      {/* -------------------------------------------------------------------
          TOP HEADER
         ------------------------------------------------------------------- */}
      <div className="pd-page-header">
        <div>
          <Text className="pd-subheading-tag" type="secondary">
            OVERVIEW
          </Text>
          <Title level={3} className="pd-main-heading" style={{ margin: 0 }}>
            Platform Dashboard
          </Title>
        </div>
        <Text type="secondary" className="pd-snapshot-meta">
          Last 30 days · snapshot 04 Oct 2026
        </Text>
      </div>

      {/* Demonstration Banner */}
      <Alert
        message={
          <span style={{ fontSize: 12 }}>
            <strong>Demonstration data.</strong> Platform totals and trends are illustrative; the lists below reflect the sample organisations in this prototype.
          </span>
        }
        type="info"
        showIcon
        icon={<Info size={15} />}
        className="pd-demo-alert"
      />

      {/* -------------------------------------------------------------------
          8-METRICS SEPARATE KPI CARDS (2 Rows x 4 Columns)
         ------------------------------------------------------------------- */}
      <Row gutter={[16, 16]}>
        {METRICS.map((metric) => (
          <Col xs={24} sm={12} lg={6} key={metric.id}>
            <Card className="pd-individual-metric-card">
              <div className="pd-metric-card-inner">
                <Text type="secondary" className="pd-metric-card-label">
                  {metric.label}
                </Text>
                <div className="pd-metric-card-val">
                  {metric.value}
                </div>
                <div className="pd-metric-card-trend">
                  <ArrowUpRight size={13} strokeWidth={2.5} /> {metric.trend}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* -------------------------------------------------------------------
          6 CHARTS GRID (2 Rows x 3 Columns)
         ------------------------------------------------------------------- */}
      <Row gutter={[16, 16]}>
        {/* Chart 1: Organisation Growth */}
        <Col xs={24} md={12} lg={8}>
          <Card
            className="pd-standard-card"
            title={
              <div className="pd-card-heading-box">
                <span className="pd-head-title">Organisation growth</span>
                <span className="pd-head-subtitle">Total tenants</span>
              </div>
            }
          >
            <ReactECharts option={orgGrowthOption} style={{ height: 180, width: '100%' }} />
          </Card>
        </Col>

        {/* Chart 2: MRR Trend */}
        <Col xs={24} md={12} lg={8}>
          <Card
            className="pd-standard-card"
            title={
              <div className="pd-card-heading-box">
                <span className="pd-head-title">MRR trend</span>
                <span className="pd-head-subtitle">USD thousands</span>
              </div>
            }
          >
            <ReactECharts option={mrrTrendOption} style={{ height: 180, width: '100%' }} />
          </Card>
        </Col>

        {/* Chart 3: Subscription Distribution */}
        <Col xs={24} md={12} lg={8}>
          <Card
            className="pd-standard-card"
            title={
              <div className="pd-card-heading-box">
                <span className="pd-head-title">Subscription distribution</span>
                <span className="pd-head-subtitle">Organisations by plan</span>
              </div>
            }
            extra={
              <a href="#view-subscriptions" className="pd-card-extra-link">
                View all <ChevronRight size={13} />
              </a>
            }
          >
            <div className="pd-donut-flex-wrapper">
              <div className="pd-donut-canvas-area">
                <ReactECharts option={subscriptionDonutOption} style={{ height: 180, width: '100%' }} />
              </div>
              <div className="pd-donut-labels-column">
                <div className="pd-legend-entry">
                  <div className="pd-legend-name">
                    <span className="pd-dot-bullet" style={{ background: isDarkMode ? '#1e293b' : '#0f172a' }} />
                    <Text>Enterprise</Text>
                  </div>
                  <Text strong>64</Text>
                </div>
                <div className="pd-legend-entry">
                  <div className="pd-legend-name">
                    <span className="pd-dot-bullet" style={{ background: '#0284c7' }} />
                    <Text>Professional</Text>
                  </div>
                  <Text strong>412</Text>
                </div>
                <div className="pd-legend-entry">
                  <div className="pd-legend-name">
                    <span className="pd-dot-bullet" style={{ background: '#84cc16' }} />
                    <Text>Starter</Text>
                  </div>
                  <Text strong>538</Text>
                </div>
                <div className="pd-legend-entry">
                  <div className="pd-legend-name">
                    <span className="pd-dot-bullet" style={{ background: '#64748b' }} />
                    <Text>Free Trial</Text>
                  </div>
                  <Text strong>270</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Chart 4: New Customer Acquisition */}
        <Col xs={24} md={12} lg={8}>
          <Card
            className="pd-standard-card"
            title={
              <div className="pd-card-heading-box">
                <span className="pd-head-title">New customer acquisition</span>
                <span className="pd-head-subtitle">Paying customers added per month</span>
              </div>
            }
          >
            <ReactECharts option={newAcquisitionOption} style={{ height: 180, width: '100%' }} />
          </Card>
        </Col>

        {/* Chart 5: Trial-to-paid Conversion */}
        <Col xs={24} md={12} lg={8}>
          <Card
            className="pd-standard-card"
            title={
              <div className="pd-card-heading-box">
                <span className="pd-head-title">Trial-to-paid conversion</span>
                <span className="pd-head-subtitle">Share of trials converting within 30 days</span>
              </div>
            }
          >
            <ReactECharts option={conversionOption} style={{ height: 180, width: '100%' }} />
          </Card>
        </Col>

        {/* Chart 6: Customer Churn */}
        <Col xs={24} md={12} lg={8}>
          <Card
            className="pd-standard-card"
            title={
              <div className="pd-card-heading-box">
                <span className="pd-head-title">Customer churn</span>
                <span className="pd-head-subtitle">Monthly logo churn</span>
              </div>
            }
          >
            <ReactECharts option={churnOption} style={{ height: 180, width: '100%' }} />
          </Card>
        </Col>
      </Row>

      {/* -------------------------------------------------------------------
          5 LOWER OPERATIONAL CARDS
         ------------------------------------------------------------------- */}
      {/* Row 1 of Lower Section: 3 Cards */}
      <Row gutter={[16, 16]}>
        {/* Card 1: Recently Onboarded */}
        <Col xs={24} lg={8}>
          <Card
            className="pd-standard-card"
            title={<span className="pd-head-title">Recently onboarded</span>}
            extra={
              <a href="#view-onboarded" className="pd-card-extra-link">
                View all <ChevronRight size={13} />
              </a>
            }
          >
            <div className="pd-items-vertical-list">
              {RECENTLY_ONBOARDED.map((item) => (
                <div key={item.id} className="pd-list-row-item">
                  <div className="pd-list-item-texts">
                    <Text strong className="pd-list-main-title">{item.name}</Text>
                    <Text type="secondary" className="pd-list-sub-meta">
                      {item.country} · {item.date}
                    </Text>
                  </div>
                  {item.plan === 'Starter' && (
                    <Tag color="success" className="pd-rounded-tag">
                      ● Starter
                    </Tag>
                  )}
                  {item.plan === 'Free Trial' && (
                    <Tag color="processing" className="pd-rounded-tag">
                      ● Free Trial
                    </Tag>
                  )}
                  {item.plan === 'Professional' && (
                    <Tag color="success" className="pd-rounded-tag">
                      ● Professional
                    </Tag>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Card 2: Trials Expiring Soon */}
        <Col xs={24} lg={8}>
          <Card
            className="pd-standard-card"
            title={<span className="pd-head-title">Trials expiring soon</span>}
            extra={
              <a href="#view-expiring-trials" className="pd-card-extra-link">
                View all <ChevronRight size={13} />
              </a>
            }
          >
            <div className="pd-items-vertical-list">
              {EXPIRING_TRIALS.map((item) => (
                <div key={item.id} className="pd-list-row-item">
                  <div className="pd-list-item-texts">
                    <Text strong className="pd-list-main-title">{item.name}</Text>
                    <Text type="secondary" className="pd-list-sub-meta">{item.meta}</Text>
                  </div>
                  <Text type="warning" strong className="pd-mono-text">
                    {item.expiryDate}
                  </Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Card 3: Exceeding Usage Limits */}
        <Col xs={24} lg={8}>
          <Card
            className="pd-standard-card"
            title={<span className="pd-head-title">Exceeding usage limits</span>}
            extra={
              <a href="#view-over-usage" className="pd-card-extra-link">
                View all <ChevronRight size={13} />
              </a>
            }
          >
            <div className="pd-items-vertical-list">
              {OVER_USAGE.map((item) => (
                <div key={item.id} className="pd-list-row-item">
                  <div className="pd-list-item-texts">
                    <Text strong className="pd-list-main-title">{item.name}</Text>
                    <Text type="secondary" className="pd-list-sub-meta">{item.plan}</Text>
                  </div>
                  <div className="pd-progress-meter-box">
                    <Progress
                      percent={Math.min(item.percent, 100)}
                      showInfo={false}
                      status="exception"
                      strokeColor="#ef4444"
                      size="small"
                      style={{ width: 70, margin: 0 }}
                    />
                    <Text type="danger" strong className="pd-mono-text">
                      {item.percent}%
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Row 2 of Lower Section: 2 Cards (Failed payments + Recent platform events) */}
      <Row gutter={[16, 16]}>
        {/* Card 4: Failed Payments */}
        <Col xs={24} lg={8}>
          <Card
            className="pd-standard-card"
            title={<span className="pd-head-title">Failed payments</span>}
            extra={
              <a href="#view-failed-payments" className="pd-card-extra-link">
                View all <ChevronRight size={13} />
              </a>
            }
          >
            <div className="pd-items-vertical-list">
              {FAILED_PAYMENTS.map((item) => (
                <div key={item.id} className="pd-list-row-item">
                  <div className="pd-list-item-texts">
                    <Text strong className="pd-list-main-title">{item.name}</Text>
                    <Text type="secondary" className="pd-list-sub-meta">{item.meta}</Text>
                  </div>
                  {item.status === 'Failed' ? (
                    <Tag color="error" className="pd-rounded-tag">
                      ● Failed
                    </Tag>
                  ) : (
                    <Tag color="warning" className="pd-rounded-tag">
                      ● Overdue
                    </Tag>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Card 5: Recent Platform Events */}
        <Col xs={24} lg={16}>
          <Card
            className="pd-standard-card"
            title={<span className="pd-head-title">Recent platform events</span>}
            extra={
              <a href="#view-events" className="pd-card-extra-link">
                View all <ChevronRight size={13} />
              </a>
            }
          >
            <div className="pd-event-stream-list">
              {PLATFORM_EVENTS.map((event) => (
                <div key={event.id} className="pd-event-stream-row">
                  <Text type="secondary" strong className="pd-event-type-badge">
                    {event.category}
                  </Text>
                  <Text className="pd-event-summary-text" ellipsis={{ tooltip: event.description }}>
                    {event.description}
                  </Text>
                  <Text type="secondary" className="pd-mono-text pd-event-timestamp">
                    {event.time}
                  </Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlatformDashboard;
