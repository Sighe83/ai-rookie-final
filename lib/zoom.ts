interface ZoomMeetingRequest {
  topic: string
  type: 2 // Scheduled meeting
  start_time: string
  duration: number
  timezone: string
  settings: {
    host_video: boolean
    participant_video: boolean
    join_before_host: boolean
    mute_upon_entry: boolean
    watermark: boolean
    use_pmi: boolean
    approval_type: number
    audio: string
    auto_recording: string
    waiting_room: boolean
  }
}

interface ZoomMeetingResponse {
  id: string
  topic: string
  start_time: string
  join_url: string
  start_url: string
}

async function getZoomAccessToken(): Promise<string> {
  const response = await fetch('https://zoom.us/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(
        `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'account_credentials',
      account_id: process.env.ZOOM_ACCOUNT_ID!,
    }),
  })

  const data = await response.json()
  return data.access_token
}

export async function createZoomMeeting({
  topic,
  startTime,
  duration = 60,
}: {
  topic: string
  startTime: Date
  duration?: number
}): Promise<ZoomMeetingResponse> {
  try {
    const accessToken = await getZoomAccessToken()
    
    const meetingRequest: ZoomMeetingRequest = {
      topic,
      type: 2,
      start_time: startTime.toISOString(),
      duration,
      timezone: 'Europe/Copenhagen',
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        watermark: false,
        use_pmi: false,
        approval_type: 0,
        audio: 'both',
        auto_recording: 'none',
        waiting_room: true,
      },
    }

    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(meetingRequest),
    })

    if (!response.ok) {
      throw new Error(`Zoom API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating Zoom meeting:', error)
    // Fallback to a generic meeting URL if Zoom fails
    return {
      id: `fallback-${Date.now()}`,
      topic,
      start_time: startTime.toISOString(),
      join_url: 'https://zoom.us/j/fallback',
      start_url: 'https://zoom.us/s/fallback',
    }
  }
}

export async function deleteZoomMeeting(meetingId: string): Promise<void> {
  try {
    const accessToken = await getZoomAccessToken()
    
    await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
  } catch (error) {
    console.error('Error deleting Zoom meeting:', error)
    // Don't throw error as this is not critical
  }
}