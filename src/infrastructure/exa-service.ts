import type { ExaSearchResponse, SearchMode } from '@domain/exa-types'

/**
 * Exa API Service
 * Handles communication with the Exa search API
 *
 * API key is read from the EXA_API_KEY environment variable.
 * In dev mode, set it in a `.env` file at the project root:
 *   VITE_EXA_API_KEY=your-key-here
 */
const EXA_BASE_URL = 'https://api.exa.ai'

function getApiKey(): string {
  // Vite exposes env vars prefixed with VITE_ on import.meta.env
  const key =
    (import.meta as any).env?.VITE_EXA_API_KEY ??
    (typeof process !== 'undefined' ? (process.env as any).VITE_EXA_API_KEY : undefined)

  if (!key) {
    throw new Error('Exa API key not configured. Set VITE_EXA_API_KEY in your .env file.')
  }
  return key
}

/**
 * Perform a search via the Exa /search endpoint.
 *
 * - mode "search"   → type: "auto", 10 results, text contents
 * - mode "research" → type: "deep", 20 results, text + highlights + summary
 */
export async function exaSearch(query: string, mode: SearchMode): Promise<ExaSearchResponse> {
  const apiKey = getApiKey()

  const isResearch = mode === 'research'

  const body: Record<string, unknown> = {
    query,
    type: isResearch ? 'deep' : 'auto',
    numResults: isResearch ? 20 : 10,
    contents: {
      text: true,
      highlights: isResearch ? true : undefined,
      summary: isResearch ? true : undefined,
    },
  }

  const res = await fetch(`${EXA_BASE_URL}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Exa API error (${res.status}): ${errorText}`)
  }

  return res.json() as Promise<ExaSearchResponse>
}
