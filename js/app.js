// =============================================
// GRINDPOINT — Shared Utilities
// =============================================
import { supabase } from './supabase.js'

// ── Toast notifications ───────────────────────
export function toast(message, type = 'info') {
  let container = document.getElementById('toast-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'toast-container'
    document.body.appendChild(container)
  }
  const icons = { success: '✅', error: '❌', info: '🔔' }
  const el = document.createElement('div')
  el.className = `toast ${type}`
  el.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`
  container.appendChild(el)
  setTimeout(() => el.remove(), 4000)
}

// ── Format numbers ────────────────────────────
export function formatPoints(n) {
  return Number(n || 0).toLocaleString()
}

export function pointsToNaira(points) {
  return (points * 0.2).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })
}

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

// ── Auth guard — redirect if not logged in ────
export async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    window.location.href = '/login.html'
    return null
  }
  return session
}

// ── Redirect logged in users away from auth pages
export async function redirectIfLoggedIn(to = '/dashboard.html') {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) window.location.href = to
}

// ── Get current user profile from DB ─────────
export async function getUserProfile(userId) {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  return data
}

// ── Daily streak check & award ────────────────
export async function checkStreak(userId) {
  const { data: user } = await supabase
    .from('users')
    .select('last_login, streak_days')
    .eq('id', userId)
    .single()

  const now = new Date()
  const last = user.last_login ? new Date(user.last_login) : null
  const diffDays = last ? Math.floor((now - last) / 86400000) : null

  let streak = user.streak_days || 0

  if (!last || diffDays >= 2) {
    streak = 1
  } else if (diffDays === 1) {
    streak += 1
  } else {
    return null // already claimed today
  }

  const points = Math.min(10 + streak * 10, 100)

  await supabase.from('users').update({
    last_login: now.toISOString(),
    streak_days: streak,
    points: supabase.rpc('increment_points', { user_id: userId, amount: points })
  }).eq('id', userId)

  await supabase.rpc('increment_points', { user_id: userId, amount: points })

  await supabase.from('transactions').insert({
    user_id: userId,
    type: 'earn',
    source: 'daily_streak',
    points,
    description: `Day ${streak} streak bonus`
  })

  return { streak, points }
}

// ── Sidebar active link ───────────────────────
export function setActiveNav(linkId) {
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'))
  const el = document.getElementById(linkId)
  if (el) el.classList.add('active')
}

// ── Mobile sidebar toggle ─────────────────────
export function initSidebar() {
  const toggle = document.getElementById('sidebar-toggle')
  const sidebar = document.getElementById('sidebar')
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'))
  }
}

// ── Hide page loader ──────────────────────────
export function hideLoader() {
  const loader = document.getElementById('page-loader')
  if (loader) loader.classList.add('hidden')
}
