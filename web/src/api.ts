import { API_URL } from './config'
import { CustomerProfile, FeedbackItem, InternalNote, Metrics, User } from './types'

let onUnauthorized: (() => void) | null = null

export function setOnUnauthorized(cb: () => void) {
  onUnauthorized = cb
}

export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    throw new Error('Login failed')
  }
  return res.json()
}

async function fetchOrThrow<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  if (res.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    onUnauthorized?.()
    throw new Error('Session expired')
  }
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API error ${res.status}: ${body}`)
  }
  return res.json()
}

export async function fetchInbox(
  page: number,
  status: string,
  priority: string,
  search: string,
  token: string
): Promise<{ items: FeedbackItem[]; total: number; page: number }> {
  const qs = new URLSearchParams({ page: String(page), status, q: search })
  if (priority !== 'all') qs.set('priority', priority)
  return fetchOrThrow(`${API_URL}/feedback?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function fetchItem(id: number, token: string): Promise<FeedbackItem> {
  return fetchOrThrow(`${API_URL}/feedback/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function toggleResolve(id: number, token: string): Promise<FeedbackItem> {
  return fetchOrThrow(`${API_URL}/feedback/${id}/resolve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function fetchUsers(token: string): Promise<{ users: User[] }> {
  return fetchOrThrow(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function fetchMetrics(token: string): Promise<Metrics> {
  return fetchOrThrow(`${API_URL}/metrics`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function downloadCsv(status: string, search: string, token: string) {
  const qs = new URLSearchParams({ status, q: search })
  const res = await fetch(`${API_URL}/export.csv?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Export failed')
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'pulse-feedback-export.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export async function fetchCustomer(id: number, token: string): Promise<CustomerProfile> {
  return fetchOrThrow(`${API_URL}/customers/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function updateAssignment(
  id: number,
  data: { assignee_id: number | null; priority: string; due_at: string },
  token: string
): Promise<FeedbackItem> {
  return fetchOrThrow(`${API_URL}/feedback/${id}/assignment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
}

export async function fetchNotes(id: number, token: string): Promise<{ notes: InternalNote[] }> {
  return fetchOrThrow(`${API_URL}/feedback/${id}/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function addNote(
  id: number,
  data: { body: string; is_private: boolean },
  token: string
): Promise<InternalNote> {
  return fetchOrThrow(`${API_URL}/feedback/${id}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
}

export async function summarize(id: number, token: string): Promise<{ summary: string }> {
  return fetchOrThrow(`${API_URL}/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  })
}
