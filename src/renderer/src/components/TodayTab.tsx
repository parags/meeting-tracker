import React, { useState } from 'react'
import { PLACEHOLDER_ACTION_ITEMS, PLACEHOLDER_DECISIONS } from '../data/placeholders'
import type { ActionItem } from '../types'

function statusBadge(status: ActionItem['status']): JSX.Element {
  const styles: Record<ActionItem['status'], { bg: string; color: string; label: string }> = {
    open: { bg: '#2d3748', color: '#90cdf4', label: 'Open' },
    in_progress: { bg: '#2d3a1e', color: '#9ae6b4', label: 'In Progress' },
    done: { bg: '#1a202c', color: '#718096', label: 'Done' }
  }
  const s = styles[status]
  return (
    <span style={{ background: s.bg, color: s.color, padding: '1px 7px', borderRadius: 10, fontSize: 10, fontWeight: 600 }}>
      {s.label}
    </span>
  )
}

export function TodayTab(): JSX.Element {
  const [activeSection, setActiveSection] = useState<'actions' | 'decisions'>('actions')

  return (
    <div style={{ padding: '12px 0' }}>
      {/* Section toggle */}
      <div style={{ display: 'flex', gap: 4, padding: '0 14px', marginBottom: 12 }}>
        {(['actions', 'decisions'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            style={{
              flex: 1,
              padding: '5px 0',
              background: activeSection === s ? '#3a3a5c' : 'transparent',
              color: activeSection === s ? '#e2e8f0' : '#718096',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500
            }}
          >
            {s === 'actions' ? `Actions (${PLACEHOLDER_ACTION_ITEMS.length})` : `Decisions (${PLACEHOLDER_DECISIONS.length})`}
          </button>
        ))}
      </div>

      {activeSection === 'actions' && (
        <div>
          {PLACEHOLDER_ACTION_ITEMS.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '10px 14px',
                borderBottom: '1px solid #2d2d2d',
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.4, flex: 1 }}>
                  {item.description}
                </span>
                {statusBadge(item.status)}
              </div>
              <div style={{ display: 'flex', gap: 8, fontSize: 11, color: '#718096' }}>
                {item.assignee && <span>👤 {item.assignee}</span>}
                {item.dueDate && <span>📅 {item.dueDate}</span>}
                {item.meetingTitle && <span>🎙️ {item.meetingTitle}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'decisions' && (
        <div>
          {PLACEHOLDER_DECISIONS.map((d) => (
            <div
              key={d.id}
              style={{
                padding: '10px 14px',
                borderBottom: '1px solid #2d2d2d'
              }}
            >
              <div style={{ fontSize: 13, color: '#e2e8f0', marginBottom: 4, lineHeight: 1.4 }}>
                ✅ {d.description}
              </div>
              {d.context && (
                <div style={{ fontSize: 11, color: '#718096', marginBottom: 3, fontStyle: 'italic' }}>
                  {d.context}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, fontSize: 11, color: '#4a5568' }}>
                {d.meetingTitle && <span>🎙️ {d.meetingTitle}</span>}
                <span>📅 {d.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
