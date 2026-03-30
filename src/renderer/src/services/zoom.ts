const ZOOM_OAUTH_URL = 'https://zoom.us/oauth/authorize'

// ── Types ──────────────────────────────────────────────────────────────────

export interface ZoomConfig {
  clientId: string
  redirectUri: string
}

export interface ZoomTokenResponse {
  access_token: string
  token_type: string
  refresh_token: string
  expires_in: number
  scope: string
}

export interface ZoomAuthState {
  connected: boolean
  userId?: string
  email?: string
  displayName?: string
}

// ── OAuth helpers ──────────────────────────────────────────────────────────

/**
 * Builds the Zoom OAuth authorization URL.
 * Opens in the user's default browser via Electron shell.openExternal.
 */
export function buildZoomAuthUrl(clientId: string, redirectUri: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri
  })

  return `${ZOOM_OAUTH_URL}?${params.toString()}`
}

/**
 * Initiates the Zoom OAuth flow by opening the browser.
 * Uses the Electron preload bridge to call shell.openExternal.
 */
export async function startZoomOAuth(clientId: string, redirectUri: string): Promise<void> {
  const authUrl = buildZoomAuthUrl(clientId, redirectUri)
  
  if (window.relay?.openExternal) {
    await window.relay.openExternal(authUrl)
  } else {
    // Fallback for dev/non-Electron context
    window.open(authUrl, '_blank')
  }
}

/**
 * Loads Zoom auth state from localStorage (placeholder).
 */
export function loadZoomAuthState(): ZoomAuthState {
  try {
    const stored = localStorage.getItem('relay:zoom:auth')
    if (stored) {
      return JSON.parse(stored) as ZoomAuthState
    }
  } catch {
    // ignore
  }
  return { connected: false }
}

/**
 * Saves Zoom auth state to localStorage.
 */
export function saveZoomAuthState(state: ZoomAuthState): void {
  localStorage.setItem('relay:zoom:auth', JSON.stringify(state))
}

/**
 * Clears Zoom auth state (disconnect).
 */
export function clearZoomAuth(): void {
  localStorage.removeItem('relay:zoom:auth')
}
