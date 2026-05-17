function resolveApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  const fallbackProd = "https://safyne-backend.onrender.com/v1";
  const fallbackDev = "http://localhost:4000/v1";

  if (!configured) {
    return import.meta.env.DEV ? fallbackDev : fallbackProd;
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocalHost = host === "localhost" || host === "127.0.0.1";
    const configuredIsLocal =
      configured.includes("localhost") ||
      configured.includes("127.0.0.1") ||
      configured.includes("10.") ||
      configured.includes("192.168.") ||
      configured.includes("172.16.");

    if (!isLocalHost && configuredIsLocal) {
      return fallbackProd;
    }
  }

  return configured;
}

const API_BASE_URL = resolveApiBaseUrl();

async function parseResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? `Request failed with ${response.status}`);
  }
  return data;
}

export async function getWalletBalance(token: string) {
  const response = await fetch(`${API_BASE_URL}/wallet/balance`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return parseResponse(response);
}

export async function getUserInvoices(token: string, cursor?: string, limit = 20) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", cursor);
  const response = await fetch(`${API_BASE_URL}/wallet/invoices?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return parseResponse(response);
}

export async function chatWithSafyne(input: { token: string; prompt: string }) {
  const response = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${input.token}`
    },
    body: JSON.stringify({
      prompt: input.prompt
    })
  });
  return parseResponse(response);
}

export type ChatContextMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function chatWithSafyneWithContext(input: {
  token: string;
  prompt: string;
  context: ChatContextMessage[];
}) {
  const response = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${input.token}`
    },
    body: JSON.stringify({
      prompt: input.prompt,
      context: input.context
    })
  });
  return parseResponse(response);
}

export async function submitAiFeedback(input: {
  token: string;
  requestId?: string;
  rating: "up" | "down";
  comment?: string;
  prompt?: string;
  response?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/ai/feedback`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${input.token}`
    },
    body: JSON.stringify({
      requestId: input.requestId,
      rating: input.rating,
      comment: input.comment,
      prompt: input.prompt,
      response: input.response
    })
  });
  return parseResponse(response);
}

export async function getPlanCatalog(token?: string) {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}/plans/catalog`, { headers });
  return parseResponse(response);
}

export async function getCurrentPlan(token: string) {
  const response = await fetch(`${API_BASE_URL}/plans/current`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return parseResponse(response);
}

export async function subscribeFreePlan(token: string) {
  const response = await fetch(`${API_BASE_URL}/plans/subscribe-free`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? `Request failed with ${response.status}`);
  }
  return data;
}

export async function createTopupOrder(
  token: string,
  packCode: "spark" | "catalyst" | "accelerator"
) {
  const response = await fetch(`${API_BASE_URL}/payments/create-topup-order`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ packCode })
  });
  return parseResponse(response);
}

export async function verifyTopupPayment(
  token: string,
  input: {
    packCode: "spark" | "catalyst" | "accelerator";
    orderId: string;
    paymentId: string;
    signature: string;
  }
) {
  const response = await fetch(`${API_BASE_URL}/payments/verify-topup-payment`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(input)
  });
  return parseResponse(response);
}

export async function subscribePlan(token: string, subscriptionCode: "starter" | "pro" | "power") {
  const idempotencyKey =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;
  const response = await fetch(`${API_BASE_URL}/plans/subscribe`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-idempotency-key": `sub-${subscriptionCode}-${idempotencyKey}`
    },
    body: JSON.stringify({ subscriptionCode })
  });
  return parseResponse(response);
}

export async function createSubscriptionOrder(
  token: string,
  subscriptionCode: "starter" | "pro" | "power"
) {
  const response = await fetch(`${API_BASE_URL}/payments/create-subscription-order`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ subscriptionCode })
  });
  return parseResponse(response);
}

export async function createRecurringSubscription(
  token: string,
  subscriptionCode: "starter" | "pro" | "power"
) {
  const response = await fetch(`${API_BASE_URL}/payments/create-subscription`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ subscriptionCode })
  });
  return parseResponse(response);
}

export async function verifySubscriptionPayment(
  token: string,
  input: {
    subscriptionCode: "starter" | "pro" | "power";
    orderId: string;
    paymentId: string;
    signature: string;
  }
) {
  const response = await fetch(`${API_BASE_URL}/payments/verify-subscription-payment`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(input)
  });
  return parseResponse(response);
}

export async function uploadAttachment(token: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE_URL}/uploads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });
  return parseResponse(response);
}

type AdminRequestInput = {
  token: string;
  method?: "GET" | "POST" | "PUT";
  path: string;
  body?: unknown;
};

async function adminRequest<T>(input: AdminRequestInput): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${input.path}`, {
    method: input.method ?? "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${input.token}`
    },
    body: input.body ? JSON.stringify(input.body) : undefined
  });
  return parseResponse(response) as Promise<T>;
}

export async function adminLogin(input: { adminId: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input)
  });
  return parseResponse(response) as Promise<{ ok: true; token: string; actor: string; expiresInSec: number }>;
}

export async function adminMe(input: { token: string }) {
  return adminRequest<{ ok: true; actor: string }>({
    token: input.token,
    path: "/admin/auth/me"
  });
}

export type AdminUserRow = {
  id: string;
  email: string;
  status: "active" | "suspended" | "banned";
  suspendedUntil?: string | null;
  statusReason?: string | null;
  balanceCredits?: number | null;
  reservedCredits?: number | null;
};

export async function adminListUsers(input: {
  token: string;
  q?: string;
  status?: "active" | "suspended" | "banned";
  cursor?: string;
  limit?: number;
}) {
  const params = new URLSearchParams();
  if (input.q) params.set("q", input.q);
  if (input.status) params.set("status", input.status);
  if (input.cursor) params.set("cursor", input.cursor);
  params.set("limit", String(input.limit ?? 20));
  const query = params.toString();
  return adminRequest<{ items: AdminUserRow[]; nextCursor: string | null }>({
    token: input.token,
    path: `/admin/users${query ? `?${query}` : ""}`
  });
}

export async function adminUpdateUserStatus(input: {
  token: string;
  userId: string;
  status: "active" | "suspended" | "banned";
  reason?: string;
  suspendedUntil?: string;
}) {
  return adminRequest<{ ok: boolean }>({
    token: input.token,
    method: "POST",
    path: `/admin/users/${input.userId}/status`,
    body: { status: input.status, reason: input.reason, suspendedUntil: input.suspendedUntil }
  });
}

export async function adminCatalog(input: { token: string }) {
  return adminRequest<{
    topUps: Array<{ code: "spark" | "catalyst" | "accelerator"; name: string; priceInr: number; credits: number }>;
    subscriptions: Array<{
      code: "starter" | "pro" | "power";
      name: string;
      priceInr: number;
      activationCostCredits: number;
      monthlyGrantCredits: number;
      policy: {
        code: string;
        smartCapPercent: number;
        proCapPercent: number;
        maxOutputTokens: number;
        maxCreditsPerRequest: number;
        proEnabled: boolean;
      };
    }>;
  }>({
    token: input.token,
    path: "/admin/catalog"
  });
}

export async function adminUpdateCatalog(input: {
  token: string;
  versionLabel: string;
  topUps: Array<{ code: "spark" | "catalyst" | "accelerator"; name: string; priceInr: number; credits: number }>;
  subscriptions: Array<{
    code: "starter" | "pro" | "power";
    name: string;
    priceInr: number;
    activationCostCredits: number;
    monthlyGrantCredits: number;
    policy: {
      code: string;
      smartCapPercent: number;
      proCapPercent: number;
      maxOutputTokens: number;
      maxCreditsPerRequest: number;
      proEnabled: boolean;
    };
  }>;
}) {
  return adminRequest<{ ok: boolean }>({
    token: input.token,
    method: "PUT",
    path: "/admin/catalog",
    body: {
      versionLabel: input.versionLabel,
      topUps: input.topUps,
      subscriptions: input.subscriptions
    }
  });
}

export async function adminFeedback(input: {
  token: string;
  rating?: "up" | "down";
  userId?: string;
  cursor?: string;
  limit?: number;
}) {
  const params = new URLSearchParams();
  if (input.rating) params.set("rating", input.rating);
  if (input.userId) params.set("userId", input.userId);
  if (input.cursor) params.set("cursor", input.cursor);
  params.set("limit", String(input.limit ?? 25));
  return adminRequest<{
    items: Array<{
      id: string;
      userId: string;
      userEmail?: string | null;
      requestId?: string | null;
      rating: "up" | "down";
      comment?: string | null;
      prompt?: string | null;
      response?: string | null;
      createdAt: string;
    }>;
    nextCursor: string | null;
  }>({
    token: input.token,
    path: `/admin/feedback?${params.toString()}`
  });
}

export async function adminUsageModels(input: { token: string; from?: string; to?: string }) {
  const params = new URLSearchParams();
  if (input.from) params.set("from", input.from);
  if (input.to) params.set("to", input.to);
  return adminRequest<{
    from: string;
    to: string;
    items: Array<{
      providerModel: string;
      mode: "fast" | "smart" | "pro";
      requests: number;
      successCount: number;
      failureCount: number;
      inputTokens: number;
      outputTokens: number;
      chargedCredits: number;
      estimatedCostUsd: number;
      actualCostUsd: number;
    }>;
  }>({
    token: input.token,
    path: `/admin/usage/models?${params.toString()}`
  });
}

export async function adminFeatureFlags(input: { token: string }) {
  return adminRequest<{ items: Array<{ key: string; enabled: boolean; description?: string | null }> }>({
    token: input.token,
    path: "/admin/feature-flags"
  });
}

export async function adminUpsertFeatureFlag(input: {
  token: string;
  key: string;
  enabled: boolean;
  description?: string;
}) {
  return adminRequest<{ ok: boolean }>({
    token: input.token,
    method: "PUT",
    path: "/admin/feature-flags",
    body: {
      key: input.key,
      enabled: input.enabled,
      description: input.description
    }
  });
}

export async function adminAnnouncements(input: { token: string }) {
  return adminRequest<{
    items: Array<{
      id: string;
      title: string;
      message: string;
      active: boolean;
      startsAt?: string | null;
      endsAt?: string | null;
    }>;
  }>({
    token: input.token,
    path: "/admin/announcements"
  });
}

export async function adminCreateAnnouncement(input: {
  token: string;
  title: string;
  message: string;
  active?: boolean;
  startsAt?: string;
  endsAt?: string;
}) {
  return adminRequest<{ ok: boolean }>({
    token: input.token,
    method: "POST",
    path: "/admin/announcements",
    body: {
      title: input.title,
      message: input.message,
      active: input.active ?? true,
      startsAt: input.startsAt,
      endsAt: input.endsAt
    }
  });
}

export async function adminActions(input: { token: string; cursor?: string; limit?: number }) {
  const params = new URLSearchParams();
  if (input.cursor) params.set("cursor", input.cursor);
  params.set("limit", String(input.limit ?? 20));
  return adminRequest<{ items: Array<{ id: string; actor: string; action: string; targetType: string; targetId: string; createdAt: string }> }>({
    token: input.token,
    path: `/admin/actions?${params.toString()}`
  });
}

export async function adminExport(input: {
  token: string;
  kind: "users" | "usage" | "ledger" | "actions";
  format?: "json" | "csv";
}) {
  const response = await fetch(`${API_BASE_URL}/admin/export/${input.kind}?format=${input.format ?? "json"}`, {
    headers: {
      Authorization: `Bearer ${input.token}`
    }
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? `Request failed with ${response.status}`);
  }
  if ((input.format ?? "json") === "csv") {
    return response.text();
  }
  return response.json();
}
