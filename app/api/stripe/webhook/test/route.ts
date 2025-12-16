import { NextResponse } from 'next/server'

// Simple test endpoint to verify webhook URL is accessible
export async function GET() {
  return NextResponse.json({
    message: 'Webhook endpoint is accessible',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: Request) {
  const body = await request.text()
  console.log('[Webhook Test] Received POST request')
  console.log('[Webhook Test] Body length:', body.length)
  console.log('[Webhook Test] Headers:', Object.fromEntries(request.headers.entries()))

  return NextResponse.json({
    message: 'Webhook test endpoint received POST',
    bodyLength: body.length
  })
}
