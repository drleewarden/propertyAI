interface BedrockRequest {
  message: string
  sessionId?: string
  userId?: string
  userEmail?: string
  userName?: string
  currentDate?: string
  currentTime?: string
}

interface BedrockResponse {
  message: string
  sessionId: string
}

interface BedrockError {
  error: string
  details?: string
}

interface UserContext {
  userId: string
  email?: string
  name?: string
}

export async function invokeBedrockAgent(
  message: string,
  sessionId?: string,
  userContext?: UserContext
): Promise<BedrockResponse> {
  const apiEndpoint = process.env.NEXT_PUBLIC_API_URL
  const apiKey = process.env.NEXT_PUBLIC_API_KEY

  if (!apiEndpoint) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured')
  }

  console.log('API Endpoint:', apiEndpoint)

  // Get current date and time to provide context to the AI
  const now = new Date()
  const currentDate = now.toISOString().split('T')[0] // YYYY-MM-DD format
  const currentTime = now.toTimeString().split(' ')[0] // HH:MM:SS format

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  // Add API key if configured
  if (apiKey) {
    headers['x-api-key'] = apiKey
  }

  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message,
      sessionId,
      userId: userContext?.userId,
      userEmail: userContext?.email,
      userName: userContext?.name,
      currentDate,
      currentTime,
    } as BedrockRequest),
  })

  console.log('Response status:', response.status)

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`
    try {
      const errorData = (await response.json()) as BedrockError
      if (errorData.error) {
        errorMessage = errorData.error
      }
      console.error('Error response:', errorData)
    } catch {
      // Response body wasn't valid JSON, use default error message
    }
    throw new Error(errorMessage)
  }

  const data = (await response.json()) as BedrockResponse
  return data
}
