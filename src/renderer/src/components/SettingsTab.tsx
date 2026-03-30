import React, { useState } from 'react'
import { buildZoomAuthUrl } from '../services/zoom'

interface ZoomConfig {
  clientId: string
  redirectUri: string
}

export function SettingsTab({ config }: { config: ZoomConfig }) {
  const [connected, setConnected] = useState(false)
  const [authStatus, setAuthStatus] = useState<'idle' | 'opening' | 'success' | 'error'>('idle')

  const handleConnect = async () => {
    setAuthStatus('opening')
    try {
      // This will open the browser to start OAuth
      // The actual token exchange happens in the preload script via Electron
      if (window.relay?.openExternal) {
        await window.relay.openExternal(buildZoomAuthUrl(config.clientId, config.redirectUri))
        setAuthStatus('success')
      } else {
        window.open(buildZoomAuthUrl(config.clientId, config.redirectUri), '_blank')
        setAuthStatus('success')
      }
    } catch (err) {
      console.error('OAuth open failed', err)
      setAuthStatus('error')
    }
  }

  return (
    <div style={{ padding: '12px 0' }}>
      <h3>Zoom Integration</h3>
      
      {connected ? (
        <div style={{ color: '#38a169', marginBottom: 8 }}>
          Connected as {window.relay?.userName || 'Unknown User'}
        </div>
      ) : (
        <div>
          <p style={{ color: '#e2e8f0' }}>
            You're currently disconnected. Connect to Zoom to enable automatic
            transcript ingestion after meetings.
          </p>
          
          <button
            onClick={handleConnect}
            disabled={authStatus === 'opening'}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: '#3a3a5c',
              color: '#e2e8f0',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            {authStatus === 'opening' ? 'Connecting...' : 'Connect to Zoom'}
          </button>
        </div>
      )}
    </div>
  )
}