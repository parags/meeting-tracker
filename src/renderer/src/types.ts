export type Tab = 'today' | 'meetings' | 'team' | 'settings'

export interface ActionItem {
  id: string
  description: string
  assignee?: string
  dueDate?: string
  status: 'open' | 'done' | 'in_progress'
  meetingTitle?: string
}

export interface Decision {
  id: string
  description: string
  context?: string
  meetingTitle?: string
  date: string
}

export interface Meeting {
  id: string
  title: string
  date: string
  duration: string
  attendees: string[]
  actionItemCount: number
  hasInsights: boolean
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role?: string
}
