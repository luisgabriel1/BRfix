import { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    }
  }

  try {
    const data = JSON.parse(event.body || '{}')
    const { name, email, phone, address, description, observations } = data

    // Validação
    if (!name || !email || !phone || !address || !description) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Missing required fields' })
      }
    }

    console.log('Quote request received:', {
      name, email, phone, address, description, observations,
      timestamp: new Date().toISOString()
    })

    // Por enquanto, simular sucesso para que o frontend funcione
    // Em produção, aqui você integraria com seu serviço de email
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Quote request received! We will contact you within 24 hours.',
        data: { name, email, phone }
      })
    }

  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    }
  }
}