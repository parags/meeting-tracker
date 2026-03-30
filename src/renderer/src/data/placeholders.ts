import type { ActionItem, Decision, Meeting, TeamMember } from '../types'

export const PLACEHOLDER_ACTION_ITEMS: ActionItem[] = [
  {
    id: '1',
    description: 'Draft API integration spec for the new webhook endpoint',
    assignee: 'Alex Chen',
    dueDate: '2026-04-04',
    status: 'open',
    meetingTitle: 'Platform Sync'
  },
  {
    id: '2',
    description: 'Review and merge PR #247 — auth flow refactor',
    assignee: 'You',
    dueDate: '2026-04-01',
    status: 'in_progress',
    meetingTitle: 'Engineering Standup'
  },
  {
    id: '3',
    description: 'Schedule user research sessions for Q2 feature priorities',
    assignee: 'Maya Patel',
    dueDate: '2026-04-07',
    status: 'open',
    meetingTitle: 'Product Weekly'
  },
  {
    id: '4',
    description: 'Update onboarding docs to reflect new SSO flow',
    assignee: 'You',
    status: 'open',
    meetingTitle: 'Customer Success Sync'
  }
]

export const PLACEHOLDER_DECISIONS: Decision[] = [
  {
    id: 'd1',
    description: 'Adopt React Query for all new data fetching — remove SWR',
    context: 'Better devtools, more predictable caching behavior',
    meetingTitle: 'Engineering Sync',
    date: '2026-03-28'
  },
  {
    id: 'd2',
    description: 'Push v2.1 launch to April 14 to allow time for load testing',
    context: 'Load tests surfaced a bottleneck in the notification queue',
    meetingTitle: 'Product Weekly',
    date: '2026-03-26'
  },
  {
    id: 'd3',
    description: 'Use Stripe as primary payment processor, Paddle as backup',
    context: 'Better global support coverage and developer experience',
    meetingTitle: 'Finance & Payments Review',
    date: '2026-03-24'
  }
]

export const PLACEHOLDER_MEETINGS: Meeting[] = [
  {
    id: 'm1',
    title: 'Engineering Sync',
    date: '2026-03-29',
    duration: '45 min',
    attendees: ['Alex Chen', 'Maya Patel', 'Jordan Lee', 'You'],
    actionItemCount: 3,
    hasInsights: true
  },
  {
    id: 'm2',
    title: 'Product Weekly',
    date: '2026-03-26',
    duration: '60 min',
    attendees: ['Maya Patel', 'Sam Torres', 'You'],
    actionItemCount: 2,
    hasInsights: true
  },
  {
    id: 'm3',
    title: 'Customer Success Sync',
    date: '2026-03-25',
    duration: '30 min',
    attendees: ['Jordan Lee', 'You'],
    actionItemCount: 1,
    hasInsights: false
  },
  {
    id: 'm4',
    title: 'Finance & Payments Review',
    date: '2026-03-24',
    duration: '90 min',
    attendees: ['Sam Torres', 'Riley Kim', 'You'],
    actionItemCount: 4,
    hasInsights: true
  },
  {
    id: 'm5',
    title: 'Design Review — v2.1 Flows',
    date: '2026-03-22',
    duration: '45 min',
    attendees: ['Riley Kim', 'Alex Chen', 'You'],
    actionItemCount: 2,
    hasInsights: true
  }
]

export const PLACEHOLDER_TEAM: TeamMember[] = [
  { id: 't1', name: 'Alex Chen', email: 'alex@example.com', role: 'Engineering Lead' },
  { id: 't2', name: 'Maya Patel', email: 'maya@example.com', role: 'Product Manager' },
  { id: 't3', name: 'Jordan Lee', email: 'jordan@example.com', role: 'Customer Success' },
  { id: 't4', name: 'Sam Torres', email: 'sam@example.com', role: 'Finance' },
  { id: 't5', name: 'Riley Kim', email: 'riley@example.com', role: 'Design' }
]
