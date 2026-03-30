const NEMOTRON_BASE_URL = 'http://10.0.0.18:52415'
const NEMOTRON_MODEL = 'mlx-community/NVIDIA-Nemotron-3-Nano-30B-A3B-MLX-BF16'

// ── Types ──────────────────────────────────────────────────────────────────

export interface ActionItem {
  description: string
  assignee?: string
  dueDate?: string
}

export interface Decision {
  description: string
  context?: string
  decidedBy?: string
}

export interface OpenQuestion {
  question: string
  context?: string
  askedBy?: string
}

export interface MeetingInsights {
  actionItems: ActionItem[]
  decisions: Decision[]
  openQuestions: OpenQuestion[]
  summary?: string
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatCompletionRequest {
  model: string
  messages: ChatMessage[]
  temperature?: number
  max_tokens?: number
}

interface ChatCompletionResponse {
  id: string
  object: string
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// ── Main extraction function ───────────────────────────────────────────────

/**
 * Extracts structured meeting insights from a transcript using the local
 * Nemotron model running on the LAN.
 */
export async function extractMeetingInsights(transcript: string): Promise<MeetingInsights> {
  const systemPrompt = `You are an expert meeting analyst. Your job is to extract key information from meeting transcripts.

Extract the following from the transcript and return a JSON object with this exact structure:
{
  "actionItems": [
    {
      "description": "Clear description of what needs to be done",
      "assignee": "Person responsible (if mentioned)",
      "dueDate": "Due date (if mentioned, in YYYY-MM-DD format)"
    }
  ],
  "decisions": [
    {
      "description": "What was decided",
      "context": "Why this decision was made",
      "decidedBy": "Who made the decision (if clear)"
    }
  ],
  "openQuestions": [
    {
      "question": "A question that was raised but not resolved",
      "context": "Context around why this question matters",
      "askedBy": "Who asked (if mentioned)"
    }
  ],
  "summary": "2-3 sentence high-level summary of the meeting"
}

Be precise and only include items explicitly present in the transcript. Return valid JSON only, no other text.`

  const request: ChatCompletionRequest = {
    model: NEMOTRON_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Please analyze this meeting transcript:\n\n${transcript}`
      }
    ],
    temperature: 0.1,
    max_tokens: 2048
  }

  const response = await fetch(`${NEMOTRON_BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    throw new Error(`Nemotron API error: ${response.status} ${response.statusText}`)
  }

  const data: ChatCompletionResponse = await response.json()

  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('Empty response from Nemotron')
  }

  // Parse the JSON response
  try {
    const insights: MeetingInsights = JSON.parse(content)
    return insights
  } catch {
    // Try to extract JSON from response if there's surrounding text
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as MeetingInsights
    }
    throw new Error('Failed to parse Nemotron response as JSON')
  }
}
