/**
 * Returns user-friendly toast messages instead of technical error strings.
 * Use for API errors and caught exceptions shown to end users.
 */
export const getErrorMessage = (error) => {
  const msg = error?.response?.data?.message || error?.message || ''
  const lower = String(msg).toLowerCase()

  // Network / connection issues
  if (lower.includes('network') || lower.includes('failed to fetch') || error?.code === 'ERR_NETWORK') {
    return 'Unable to connect. Please check your internet connection and try again.'
  }

  // Validation errors (e.g. Mongoose "Path X is required")
  if (lower.includes('validation failed') || lower.includes('path ') && lower.includes(' is required')) {
    return 'Please complete all required fields and try again.'
  }

  // Auth / session
  if (lower.includes('session expired') || lower.includes('log in again') || error?.response?.status === 401) {
    return 'Your session has expired. Please log in again.'
  }
  if (lower.includes('not authorized') || lower.includes('unauthorized')) {
    return 'Please log in to continue.'
  }

  // Known API messages - pass through if already user-friendly
  if (msg && !msg.includes('null') && !msg.includes('undefined') && !msg.includes('reading ') && msg.length < 120) {
    return msg
  }

  // Technical / null reference / generic JS errors
  if (lower.includes('reading ') || lower.includes('cannot read') || lower.includes('null') || lower.includes('undefined')) {
    return 'Something went wrong. Please refresh the page and try again.'
  }

  // Fallback
  return 'Something went wrong. Please try again.'
}
