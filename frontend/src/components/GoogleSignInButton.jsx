import React, { useEffect, useRef } from 'react'

const GSI_SCRIPT = 'https://accounts.google.com/gsi/client'

const loadGsiScript = () => {
  const existing = document.querySelector(`script[src="${GSI_SCRIPT}"]`)
  if (existing) return Promise.resolve()
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = GSI_SCRIPT
    script.async = true
    script.defer = true
    script.onload = resolve
    document.head.appendChild(script)
  })
}

const removeGsiScript = () => {
  const script = document.querySelector(`script[src="${GSI_SCRIPT}"]`)
  if (script) script.remove()
}

/**
 * Google Sign-In button using Google Identity Services (GIS).
 * Loads the GSI script only when needed to avoid console errors on other pages.
 */
const GoogleSignInButton = ({ onSuccess, onError, disabled = false }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) return

    let cancelled = false
    let intervalId

    const run = () => {
      if (window.google?.accounts?.id && containerRef.current && !containerRef.current.hasChildNodes()) {
        init(clientId)
      }
    }

    loadGsiScript().then(() => {
      if (cancelled) return
      if (window.google?.accounts?.id) {
        run()
      } else {
        intervalId = setInterval(() => {
          if (cancelled) return
          if (window.google?.accounts?.id) {
            clearInterval(intervalId)
            run()
          }
        }, 100)
      }
    })

    return () => {
      cancelled = true
      if (intervalId) clearInterval(intervalId)
      if (containerRef.current) containerRef.current.innerHTML = ''
      removeGsiScript()
    }
  }, [])

  const init = (clientId) => {
    if (!clientId || !containerRef.current || !window.google?.accounts?.id) return
    if (containerRef.current.hasChildNodes()) return

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response?.credential) {
            onSuccess?.(response.credential)
          } else {
            onError?.(new Error('Sign-in was cancelled'))
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      })

      window.google.accounts.id.renderButton(containerRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: 320,
        logo_alignment: 'left',
      })
    } catch (err) {
      console.error('Google Sign-In init error:', err)
      onError?.(err)
    }
  }

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className={`google-signin-wrapper min-h-[44px] flex items-center justify-center [&>div]:!flex [&>div]:!items-center [&>div]:!justify-center [&_iframe]:!min-h-[44px] [&_div]:!min-h-[44px] ${disabled ? 'pointer-events-none opacity-50' : ''}`}
      style={{ minWidth: 280 }}
    />
  )
}

export default GoogleSignInButton
