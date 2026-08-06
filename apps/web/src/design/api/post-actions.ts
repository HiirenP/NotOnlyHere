export async function togglePostReaction(postId: string, liked: boolean) {
  if (liked) {
    return fetch(`/api/posts/${encodeURIComponent(postId)}/reactions/SUPPORT`, { method: 'PUT' });
  }
  return fetch(`/api/posts/${encodeURIComponent(postId)}/reactions/SUPPORT`, { method: 'DELETE' });
}

export async function postComment(postId: string, body: string) {
  return fetch(`/api/posts/${encodeURIComponent(postId)}/comments`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ body }),
  });
}

export async function sendConnectionRequest(username: string) {
  return fetch('/api/connections/request', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username }),
  });
}

export async function joinCircle(circleId: string) {
  return fetch(`/api/circles/${encodeURIComponent(circleId)}/membership`, { method: 'POST' });
}

export async function leaveCircle(circleId: string) {
  return fetch(`/api/circles/${encodeURIComponent(circleId)}/membership`, { method: 'DELETE' });
}

export async function rsvpEvent(eventId: string, status: 'GOING' | 'MAYBE' | 'NOT_GOING' = 'GOING') {
  return fetch(`/api/events/${encodeURIComponent(eventId)}/rsvp`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}
