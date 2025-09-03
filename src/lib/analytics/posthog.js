export function initPosthog(){
    if (typeof window === 'undefined') return
    if (window.__PH_LOADED__) return
    window.__PH_LOADED__ = true
    window.posthog = window.posthog || []
    const s = document.createElement('script')
    s.async = true
    s.crossOrigin = 'anonymous'
    s.src = 'https://eu-assets.i.posthog.com/static/array.js'
    s.onload = () => {
      if (window.posthog && typeof window.posthog.init === 'function') {
        window.posthog.init('phc_5nRjTUHHI0w7icywQFVzpYffTHtPMdygNqR3hgVdzuB', {
          api_host: 'https://eu.i.posthog.com',
          defaults: '2025-05-24',
          person_profiles: 'identified_only',
        })
      }
    }
    document.head.appendChild(s)
  }