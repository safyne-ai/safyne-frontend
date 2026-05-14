import { FormEvent, useMemo, useState } from "react";
import {
  adminCatalog,
  adminFeedback,
  adminListUsers,
  adminLogin,
  adminMe,
  adminUpdateCatalog,
  adminUpdateUserStatus,
  adminUsageModels,
  AdminUserRow
} from "@/lib/api";

type TabKey = "users" | "feedback" | "usage" | "plans";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "users", label: "Users" },
  { key: "feedback", label: "Feedback" },
  { key: "usage", label: "API Usage" },
  { key: "plans", label: "Plans" }
];

type EditableCatalog = {
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
};

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("safyne-admin-session") ?? "");
  const [actor, setActor] = useState(() => localStorage.getItem("safyne-admin-actor") ?? "");
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("users");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [userQuery, setUserQuery] = useState("");
  const [userStatus, setUserStatus] = useState<"all" | "active" | "suspended" | "banned">("all");
  const [selectedUser, setSelectedUser] = useState("");
  const [newStatus, setNewStatus] = useState<"active" | "suspended" | "banned">("active");
  const [statusReason, setStatusReason] = useState("");
  const [suspendedUntil, setSuspendedUntil] = useState("");

  const [feedbackRows, setFeedbackRows] = useState<Array<{
    id: string;
    userEmail?: string | null;
    rating: "up" | "down";
    comment?: string | null;
    prompt?: string | null;
    response?: string | null;
    createdAt: string;
  }>>([]);
  const [feedbackRating, setFeedbackRating] = useState<"all" | "up" | "down">("all");

  const [usageRows, setUsageRows] = useState<Array<{
    providerModel: string;
    mode: "fast" | "smart" | "pro";
    requests: number;
    successCount: number;
    failureCount: number;
    chargedCredits: number;
    inputTokens: number;
    outputTokens: number;
    estimatedCostUsd: number;
    actualCostUsd: number;
  }>>([]);

  const [catalog, setCatalog] = useState<EditableCatalog | null>(null);
  const [versionLabel, setVersionLabel] = useState(`admin-${Date.now()}`);

  const isLoggedIn = useMemo(() => token.trim().length > 0, [token]);
  const inputClass = "rounded-lg border bg-background px-3 py-2 text-sm";
  const buttonClass = "rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-60";

  const run = async (fn: () => Promise<void>) => {
    setError("");
    setOk("");
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      const session = await adminLogin({ adminId, password });
      localStorage.setItem("safyne-admin-session", session.token);
      localStorage.setItem("safyne-admin-actor", session.actor);
      setToken(session.token);
      setActor(session.actor);
      setPassword("");
      setOk("Admin login successful");
      await loadUsers(session.token);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("safyne-admin-session");
    localStorage.removeItem("safyne-admin-actor");
    setToken("");
    setActor("");
    setAdminId("");
    setPassword("");
    setUsers([]);
    setFeedbackRows([]);
    setUsageRows([]);
    setCatalog(null);
  };

  const validateSession = () =>
    run(async () => {
      const me = await adminMe({ token });
      setActor(me.actor);
      setOk(`Logged in as ${me.actor}`);
    });

  const loadUsers = async (sessionToken = token) => {
    const res = await adminListUsers({
      token: sessionToken,
      q: userQuery.trim() || undefined,
      status: userStatus === "all" ? undefined : userStatus
    });
    setUsers(res.items);
    setOk(`Loaded ${res.items.length} users`);
  };

  const updateStatus = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      await adminUpdateUserStatus({
        token,
        userId: selectedUser,
        status: newStatus,
        reason: statusReason.trim() || undefined,
        suspendedUntil:
          newStatus === "suspended" && suspendedUntil
            ? new Date(suspendedUntil).toISOString()
            : undefined
      });
      setOk("User status updated");
      await loadUsers();
    });
  };

  const loadFeedback = () =>
    run(async () => {
      const res = await adminFeedback({
        token,
        rating: feedbackRating === "all" ? undefined : feedbackRating
      });
      setFeedbackRows(res.items);
      setOk(`Loaded ${res.items.length} feedback entries`);
    });

  const loadUsage = () =>
    run(async () => {
      const res = await adminUsageModels({ token });
      setUsageRows(res.items);
      setOk(`Loaded ${res.items.length} model rows`);
    });

  const loadPlans = () =>
    run(async () => {
      const res = await adminCatalog({ token });
      setCatalog({ topUps: res.topUps, subscriptions: res.subscriptions });
      setOk("Loaded plans");
    });

  const savePlans = () =>
    run(async () => {
      if (!catalog) return;
      await adminUpdateCatalog({
        token,
        versionLabel: versionLabel.trim() || `admin-${Date.now()}`,
        topUps: catalog.topUps,
        subscriptions: catalog.subscriptions
      });
      setOk("Plans saved. Changes reflect on website immediately.");
    });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background p-6 text-foreground">
        <div className="mx-auto mt-16 max-w-md rounded-xl border bg-card p-5">
          <h1 className="text-2xl font-semibold">Admin Access</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter admin ID and password.</p>
          <form onSubmit={handleLogin} className="mt-4 space-y-3">
            <input className={`w-full ${inputClass}`} placeholder="Admin ID" value={adminId} onChange={(e) => setAdminId(e.target.value)} />
            <input className={`w-full ${inputClass}`} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className={`w-full ${buttonClass}`} disabled={busy || !adminId || !password}>Login</button>
          </form>
          {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex items-center justify-between rounded-xl border bg-card p-4">
          <div>
            <h1 className="text-2xl font-semibold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Signed in as {actor || "admin"}.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => void validateSession()} className={buttonClass} disabled={busy}>Check Session</button>
            <button onClick={handleLogout} className={buttonClass}>Logout</button>
          </div>
        </div>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        {ok ? <p className="text-sm text-emerald-500">{ok}</p> : null}

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg border px-3 py-2 text-sm ${activeTab === tab.key ? "bg-primary text-primary-foreground" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "users" && (
          <div className="space-y-4 rounded-xl border bg-card p-4">
            <div className="flex flex-wrap gap-2">
              <input className={inputClass} placeholder="Search by email" value={userQuery} onChange={(e) => setUserQuery(e.target.value)} />
              <select className={inputClass} value={userStatus} onChange={(e) => setUserStatus(e.target.value as typeof userStatus)}>
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
              </select>
              <button className={buttonClass} onClick={() => void run(loadUsers)} disabled={busy}>Load Users</button>
            </div>
            <div className="overflow-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Suspended Until</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="cursor-pointer border-t hover:bg-muted/40" onClick={() => setSelectedUser(u.id)}>
                      <td className="p-2">{u.id}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">{u.status}</td>
                      <td className="p-2">{(u as AdminUserRow & { suspendedUntil?: string | null }).suspendedUntil ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <form onSubmit={updateStatus} className="flex flex-wrap items-center gap-2">
              <input className={`${inputClass} min-w-80`} placeholder="Selected user id" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} />
              <select className={inputClass} value={newStatus} onChange={(e) => setNewStatus(e.target.value as typeof newStatus)}>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
              </select>
              <input className={inputClass} placeholder="Reason (optional)" value={statusReason} onChange={(e) => setStatusReason(e.target.value)} />
              {newStatus === "suspended" && (
                <input
                  className={inputClass}
                  type="datetime-local"
                  value={suspendedUntil}
                  onChange={(e) => setSuspendedUntil(e.target.value)}
                  title="Suspend until"
                />
              )}
              <button className={buttonClass} disabled={busy || !selectedUser}>Apply</button>
            </form>
          </div>
        )}

        {activeTab === "feedback" && (
          <div className="space-y-4 rounded-xl border bg-card p-4">
            <div className="flex flex-wrap gap-2">
              <select className={inputClass} value={feedbackRating} onChange={(e) => setFeedbackRating(e.target.value as typeof feedbackRating)}>
                <option value="all">All ratings</option>
                <option value="up">Thumbs Up</option>
                <option value="down">Thumbs Down</option>
              </select>
              <button className={buttonClass} onClick={() => void loadFeedback()} disabled={busy}>Load Feedback</button>
            </div>
            <div className="space-y-3">
              {feedbackRows.map((f) => (
                <div key={f.id} className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">
                    {new Date(f.createdAt).toLocaleString()} • {f.userEmail ?? f.id}
                  </div>
                  <div className="mt-1 text-sm font-semibold">{f.rating === "up" ? "Thumbs Up" : "Thumbs Down"}</div>
                  {f.comment ? <p className="mt-1 text-sm">{f.comment}</p> : null}
                  {f.prompt ? <p className="mt-2 text-xs text-muted-foreground">Prompt: {f.prompt}</p> : null}
                  {f.response ? <p className="mt-1 text-xs text-muted-foreground">Response: {f.response.slice(0, 240)}...</p> : null}
                </div>
              ))}
              {feedbackRows.length === 0 ? <p className="text-sm text-muted-foreground">No feedback loaded yet.</p> : null}
            </div>
          </div>
        )}

        {activeTab === "usage" && (
          <div className="space-y-4 rounded-xl border bg-card p-4">
            <button className={buttonClass} onClick={() => void loadUsage()} disabled={busy}>Load API Usage</button>
            <div className="overflow-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Model</th>
                    <th className="p-2 text-left">Mode</th>
                    <th className="p-2 text-left">Requests</th>
                    <th className="p-2 text-left">Success</th>
                    <th className="p-2 text-left">Failure</th>
                    <th className="p-2 text-left">Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {usageRows.map((row, idx) => (
                    <tr key={`${row.providerModel}-${idx}`} className="border-t">
                      <td className="p-2">{row.providerModel}</td>
                      <td className="p-2">{row.mode}</td>
                      <td className="p-2">{row.requests}</td>
                      <td className="p-2">{row.successCount}</td>
                      <td className="p-2">{row.failureCount}</td>
                      <td className="p-2">{row.chargedCredits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "plans" && (
          <div className="space-y-4 rounded-xl border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <button className={buttonClass} onClick={() => void loadPlans()} disabled={busy}>Load Current Plans</button>
              <input className={inputClass} value={versionLabel} onChange={(e) => setVersionLabel(e.target.value)} placeholder="Version label" />
              <button className={buttonClass} onClick={() => void savePlans()} disabled={busy || !catalog}>Save Plans</button>
            </div>
            {catalog ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <h3 className="font-semibold">Top-ups</h3>
                  <div className="mt-2 space-y-2">
                    {catalog.topUps.map((pack, index) => (
                      <div key={pack.code} className="grid grid-cols-4 gap-2">
                        <input className={inputClass} value={pack.name} onChange={(e) => setCatalog((prev) => {
                          if (!prev) return prev;
                          const next = { ...prev };
                          next.topUps = [...next.topUps];
                          next.topUps[index] = { ...next.topUps[index], name: e.target.value };
                          return next;
                        })} />
                        <input className={inputClass} type="number" value={pack.priceInr} onChange={(e) => setCatalog((prev) => {
                          if (!prev) return prev;
                          const next = { ...prev };
                          next.topUps = [...next.topUps];
                          next.topUps[index] = { ...next.topUps[index], priceInr: Number(e.target.value || 0) };
                          return next;
                        })} />
                        <input className={inputClass} type="number" value={pack.credits} onChange={(e) => setCatalog((prev) => {
                          if (!prev) return prev;
                          const next = { ...prev };
                          next.topUps = [...next.topUps];
                          next.topUps[index] = { ...next.topUps[index], credits: Number(e.target.value || 0) };
                          return next;
                        })} />
                        <input className={`${inputClass} bg-muted`} value={pack.code} readOnly />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <h3 className="font-semibold">Subscriptions</h3>
                  <div className="mt-2 space-y-2">
                    {catalog.subscriptions.map((plan, index) => (
                      <div key={plan.code} className="space-y-2 rounded border p-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input className={inputClass} value={plan.name} onChange={(e) => setCatalog((prev) => {
                            if (!prev) return prev;
                            const next = { ...prev };
                            next.subscriptions = [...next.subscriptions];
                            next.subscriptions[index] = { ...next.subscriptions[index], name: e.target.value };
                            return next;
                          })} />
                          <input className={`${inputClass} bg-muted`} value={plan.code} readOnly />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <input className={inputClass} type="number" value={plan.priceInr} onChange={(e) => setCatalog((prev) => {
                            if (!prev) return prev;
                            const next = { ...prev };
                            next.subscriptions = [...next.subscriptions];
                            next.subscriptions[index] = { ...next.subscriptions[index], priceInr: Number(e.target.value || 0) };
                            return next;
                          })} />
                          <input className={inputClass} type="number" value={plan.activationCostCredits} onChange={(e) => setCatalog((prev) => {
                            if (!prev) return prev;
                            const next = { ...prev };
                            next.subscriptions = [...next.subscriptions];
                            next.subscriptions[index] = { ...next.subscriptions[index], activationCostCredits: Number(e.target.value || 0) };
                            return next;
                          })} />
                          <input className={inputClass} type="number" value={plan.monthlyGrantCredits} onChange={(e) => setCatalog((prev) => {
                            if (!prev) return prev;
                            const next = { ...prev };
                            next.subscriptions = [...next.subscriptions];
                            next.subscriptions[index] = { ...next.subscriptions[index], monthlyGrantCredits: Number(e.target.value || 0) };
                            return next;
                          })} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Load plans to edit them.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
