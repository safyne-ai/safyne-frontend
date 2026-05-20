import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  MessageSquare,
  Zap,
  Paperclip,
  Send,
  Check,
  X,
  ChevronDown,
  Menu,
  Sparkles,
  CreditCard,
  Activity as ActivityIcon,
  Settings as SettingsIcon,
  Loader2,
  User,
  Trash2,
  FileText,
  Sun,
  Moon,
  HelpCircle,
  Mail,
  ThumbsUp,
  ThumbsDown,
  Pencil,
  Image as ImageIcon,
  Upload,
  LogOut,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import safyneLogo from "@/assets/safyne-logo.png";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  chatWithSafyneWithContext,
  createRecurringSubscription,
  createTopupOrder,
  getCurrentPlan,
  getPlanCatalog,
  getUserInvoices,
  getWalletBalance,
  subscribeFreePlan,
  submitAiFeedback,
  uploadAttachment,
  verifyTopupPayment,
  verifySubscriptionPayment
} from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
  feedback?: "up" | "down" | null;
  attachments?: Array<{
    filename: string;
    mimetype: string;
    sizeBytes: number;
    chargedCredits: number;
  }>;
}

interface ChatSession {
  id: string;
  title: string;
}

interface ComposerProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onUpload: (file: File) => Promise<void>;
  pendingAttachments: Array<{
    filename: string;
    chargedCredits: number;
  }>;
  onRemoveAttachment: (filename: string) => void;
  isSending?: boolean;
  placeholder?: string;
  large?: boolean;
}

const Composer = ({
  value,
  onChange,
  onSend,
  onUpload,
  pendingAttachments,
  onRemoveAttachment,
  isSending = false,
  placeholder,
  large
}: ComposerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file).catch((error: unknown) => {
        toast.error(error instanceof Error ? error.message : "Upload failed");
      });
    }
    e.target.value = "";
  };

  return (
    <div className="inteliq-composer-ring w-full max-w-full min-w-0">
      <div
        className={`inteliq-composer-inner flex items-end gap-2 ${large ? "p-3" : "p-2"}`}
      >
      <input ref={fileInputRef} type="file" className="hidden" onChange={handlePicked} />
      <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePicked} />
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Attach file"
            type="button"
          >
            <Paperclip className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" side="top" className="w-56 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-md">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-muted"
          >
            <Upload className="h-4 w-4 text-muted-foreground" />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-muted"
          >
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            Photos
          </button>
        </PopoverContent>
      </Popover>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        rows={large ? 2 : 1}
        placeholder={placeholder ?? "Type your request..."}
        className={`flex-1 resize-none bg-transparent px-2 placeholder:text-muted-foreground/70 focus:outline-none ${
          large ? "py-3 text-base" : "py-2.5 text-sm"
        }`}
      />
      {pendingAttachments.length > 0 && (
        <div className="flex max-w-[40%] flex-wrap gap-1 pb-2">
          {pendingAttachments.map((file) => (
            <button
              key={file.filename}
              type="button"
              onClick={() => onRemoveAttachment(file.filename)}
              className="rounded-md border border-border bg-muted/60 px-2 py-1 text-[11px] text-foreground"
              title="Remove attachment"
            >
              {file.filename} (-{file.chargedCredits})
            </button>
          ))}
        </div>
      )}
      <button
        onClick={onSend}
        disabled={isSending || (!value.trim() && pendingAttachments.length === 0)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-40"
        aria-label={isSending ? "Waiting for response" : "Send"}
        type="button"
      >
        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      </button>
      </div>
    </div>
  );
};

interface FeedbackBoxProps {
  type: "up" | "down";
  onSubmit: (text: string) => void;
  onCancel: () => void;
}

const FeedbackBox = ({ type, onSubmit, onCancel }: FeedbackBoxProps) => {
  const [text, setText] = useState("");
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-3 overflow-hidden"
    >
      <div className="rounded-xl border border-border bg-card p-3">
        <p className="mb-2 text-xs text-muted-foreground">
          {type === "up" ? "What did you like?" : "What went wrong?"}
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="Provide additional feedback..."
          className="w-full resize-none rounded-lg border border-border bg-transparent p-2 text-sm focus:border-primary focus:outline-none"
        />
        <div className="mt-2 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(text)}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:bg-[hsl(var(--primary-glow))]"
          >
            Submit
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const models = ["Auto-Route", "Deepseek", "OpenAi", "Gemini 3"];

const initialSessions: ChatSession[] = [];

const sampleMessages: Message[] = [];

type TopUpPack = { code: "spark" | "catalyst" | "accelerator"; name: string; priceInr: number; credits: number };
type SubscriptionPlanCode = "free" | "starter" | "pro" | "power";

type SubscriptionPack = {
  code: SubscriptionPlanCode;
  name: string;
  priceInr: number;
  priceUsd: number;
  activationCostCredits: number;
  monthlyGrantCredits: number;
  provider?: "openrouter" | "light_llm";
  marketing?: {
    textBurnCreditsPer1kTokens: number;
    dailyCreditLimitCr: number;
    dailyImageGenerationLimit: number;
    maxUploadBytes: number;
    dailyDocumentUploadLimit: number;
    includedTextModels: string[];
    imageModelName: string;
    imageCreditsPerImage: number;
  };
  policy: {
    smartCapPercent: number;
    proCapPercent: number;
    maxOutputTokens: number;
    maxCreditsPerRequest?: number;
    proEnabled?: boolean;
  };
};

const activityRows: { date: string; task: string; action: string; credits: number }[] = [];

const settingsTabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "help", label: "Help", icon: HelpCircle },
  { id: "danger", label: "Danger Zone", icon: Trash2 },
] as const;

type SettingsTab = (typeof settingsTabs)[number]["id"];
type InvoiceRow = {
  id: string;
  purchasedAt: string;
  packCode: string;
  purchaseType: "topup" | "subscription";
  amountCredits: number;
  note: string;
};

const faqItems = [
  {
    q: "How does Auto-Routing work?",
    a: "Safyne analyzes each prompt — its complexity, length, code/image content, and required reasoning — then dispatches it to the best-fit underlying model so you always get the highest-quality answer for the lowest credit cost.",
  },
  {
    q: "How are credits calculated?",
    a: `Our credit system is designed to give you the best AI engine for your specific task while keeping costs fair.

10 Credits = ₹1.00.

Usage is based on "Tokens": AI doesn't count words; it counts tokens (chunks of text). On average, 1,000 tokens ≈ 750 words.

Dynamic Rates: Credits are deducted based on the complexity of the model used:

Basic Mode (Nano): 1.0 Credit per 1k tokens.

Standard Mode (Kimi-k2.5): 4.0 Credits per 1k tokens.

Expert Mode (Kimi-k2.6): 12.0 Credits per 1k tokens.

Visual Check: You can always see your remaining daily and monthly credits on your dashboard.`,
  },
  {
    q: "Why do file attachments use credits in two ways?",
    a: `Analyzing documents is a two-step process that involves both file processing and deep-reading.

Step 1: The Processing Fee (Flat): When you upload a file, a flat 5-credit fee is deducted to cover the server cost of extracting text and preparing the file for the AI.

Step 2: The Reading Burn (Token-based): The AI then "reads" the entire document to understand it. Credits are burned based on the document's length (e.g., a 20-page PDF uses more credits than a 1-page essay).

The Benefit for You: Once a document is "read," it stays in the AI's short-term memory (cache). Subsequent questions about the same file in that chat are significantly cheaper because the AI doesn't have to re-read the whole file from scratch.`,
  },
  {
    q: "How do I upgrade my workspace?",
    a: "Open Subscriptions from your profile menu and pick a top-up pack. Credits are added instantly and never expire.",
  },
];

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [messagesBySession, setMessagesBySession] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState("");
  const [model] = useState(models[0]);
  const [feedbackOpenFor, setFeedbackOpenFor] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState<string | null>(null);
  const [subscriptionStage, setSubscriptionStage] = useState<"idle" | "creating" | "awaiting_payment" | "verifying">("idle");
  const [pendingVerification, setPendingVerification] = useState<{
    subscriptionCode: "starter" | "pro" | "power";
    orderId: string;
    paymentId: string;
    signature: string;
  } | null>(null);
  const [invoiceRows, setInvoiceRows] = useState<InvoiceRow[]>([]);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>("profile");
  const [balanceCredits, setBalanceCredits] = useState(0);
  const [topUpPlans, setTopUpPlans] = useState<TopUpPack[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPack[]>([]);
  const [activeSubscriptionCode, setActiveSubscriptionCode] = useState<SubscriptionPlanCode | null>(null);
  const [pendingAttachments, setPendingAttachments] = useState<Message["attachments"]>([]);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme, setTheme } = useTheme();
  const { email, getAccessToken, logout } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const subscriptionStageRef = useRef<"idle" | "creating" | "awaiting_payment" | "verifying">("idle");
  const storageKey = `safyne-chat:${email}`;
  const currentMessages = activeSessionId ? (messagesBySession[activeSessionId] ?? []) : sampleMessages;
  const safeId = () =>
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;

  const loadRazorpayScript = async () =>
    new Promise<boolean>((resolve) => {
      if ((window as Window & { Razorpay?: unknown }).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [currentMessages]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        chatSessions: ChatSession[];
        messagesBySession: Record<string, Message[]>;
        activeSessionId: string | null;
      };
      setChatSessions(parsed.chatSessions ?? []);
      setMessagesBySession(parsed.messagesBySession ?? {});
      setActiveSessionId(parsed.activeSessionId ?? null);
    } catch {
      // Ignore invalid local state.
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        chatSessions,
        messagesBySession,
        activeSessionId
      })
    );
  }, [storageKey, chatSessions, messagesBySession, activeSessionId]);

  useEffect(() => {
    subscriptionStageRef.current = subscriptionStage;
  }, [subscriptionStage]);

  useEffect(() => {
    if (!profileOpen) return;
    const onClick = () => setProfileOpen(false);
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [profileOpen]);

  useEffect(() => {
    getAccessToken().then((token) => {
      if (!token) return;
      return getWalletBalance(token)
        .then((wallet) => setBalanceCredits(wallet.balanceCredits ?? 0))
        .catch(() => setBalanceCredits(0));
    }).catch(() => setBalanceCredits(0));
  }, [getAccessToken]);

  const loadPlanCatalog = useCallback(async () => {
    const RETRY_DELAYS = [0, 3000, 8000, 15000, 25000];
    for (let attempt = 0; attempt < RETRY_DELAYS.length; attempt++) {
      if (RETRY_DELAYS[attempt] > 0) {
        await new Promise((res) => window.setTimeout(res, RETRY_DELAYS[attempt]));
      }
      try {
        const catalog = await getPlanCatalog();
        setTopUpPlans(catalog.topUps ?? []);
        setSubscriptionPlans(catalog.subscriptions ?? []);
        return;
      } catch (error) {
        if (attempt === RETRY_DELAYS.length - 1) {
          setTopUpPlans([]);
          setSubscriptionPlans([]);
          const reason = error instanceof Error ? error.message : "Unknown error";
          toast.error(`Could not load plans: ${reason}`);
        }
      }
    }
  }, []);

  useEffect(() => {
    void loadPlanCatalog();
  }, [loadPlanCatalog]);

  const sendMessage = async (text: string) => {
    if (isSending) return;
    if (!text.trim() && !pendingAttachments?.length) return;
    let sessionId = activeSessionId;
    const previousMessages = sessionId ? (messagesBySession[sessionId] ?? []) : [];
    if (!sessionId) {
      const autoId = safeId();
      sessionId = autoId;
      setChatSessions((prev) => [{ id: autoId, title: text.slice(0, 32) || "New Thread" }, ...prev]);
      setActiveSessionId(autoId);
      setMessagesBySession((prev) => ({ ...prev, [autoId]: [] }));
    }

    const userMsg: Message = {
      id: safeId(),
      role: "user",
      content: text.trim() ? text : "Uploaded attachment",
      attachments: pendingAttachments ?? []
    };
    const pendingAiId = safeId();
    const pendingAiMsg: Message = {
      id: pendingAiId,
      role: "assistant",
      content: "",
      isLoading: true
    };

    setMessagesBySession((prev) => ({
      ...prev,
      [sessionId]: [...(prev[sessionId] ?? []), userMsg, pendingAiMsg]
    }));
    setInput("");
    setPendingAttachments([]);
    setIsSending(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Please sign in again.");
      const attachmentHint = userMsg.attachments?.length
        ? `\n\nAttachments:\n${userMsg.attachments.map((a) => `- ${a.filename} (${a.mimetype}, ${a.sizeBytes} bytes)`).join("\n")}`
        : "";
      const contextWindow = previousMessages
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content }));
      const response = await chatWithSafyneWithContext({
        token,
        prompt: `${userMsg.content}${attachmentHint}`,
        context: contextWindow
      });
      if (response.lowCreditWarning) {
        toast.warning(response.lowCreditWarning.message ?? "Your credits are about to finish. Add a top-up to keep using Safyne.");
      }
      const aiMsg: Message = {
        id: response.requestId ?? safeId(),
        role: "assistant",
        content: response.output ?? "No response received.",
        feedback: null
      };
      setMessagesBySession((prev) => ({
        ...prev,
        [sessionId]: (prev[sessionId] ?? []).map((m) => (m.id === pendingAiId ? aiMsg : m))
      }));
      await refreshBalance();
    } catch (error) {
      setMessagesBySession((prev) => ({
        ...prev,
        [sessionId]: (prev[sessionId] ?? []).filter((m) => m.id !== pendingAiId)
      }));
      const message = error instanceof Error ? error.message : "Failed to get AI response";
      if (message.toLowerCase().includes("attachment") || message.toLowerCase().includes("upgrade")) {
        toast.error(message, { description: "Upgrade to a paid plan for document uploads and premium models." });
      } else {
        toast.error(message);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleNewThread = () => {
    const id = safeId();
    setChatSessions((prev) => [{ id, title: "New Thread" }, ...prev]);
    setActiveSessionId(id);
    setMessagesBySession((prev) => ({ ...prev, [id]: [] }));
    setPendingAttachments([]);
    setInput("");
  };

  const handleRename = (id: string) => {
    const session = chatSessions.find((s) => s.id === id);
    if (!session) return;
    setRenamingId(id);
    setRenameValue(session.title);
  };

  const commitRename = () => {
    if (!renamingId) return;
    const value = renameValue.trim() || "Untitled";
    setChatSessions((prev) => prev.map((s) => (s.id === renamingId ? { ...s, title: value } : s)));
    setRenamingId(null);
    toast.success("Thread renamed");
  };

  const handleDelete = (id: string) => {
    setChatSessions((prev) => prev.filter((s) => s.id !== id));
    setMessagesBySession((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (activeSessionId === id) setActiveSessionId(null);
    toast.success("Thread deleted");
  };

  const handleFeedback = (messageId: string, type: "up" | "down") => {
    if (!activeSessionId) return;
    setMessagesBySession((prev) => ({
      ...prev,
      [activeSessionId]: (prev[activeSessionId] ?? []).map((m) =>
        m.id === messageId ? { ...m, feedback: type } : m
      )
    }));
    setFeedbackOpenFor(messageId);
  };

  const submitFeedback = async (messageId: string, text: string) => {
    if (!activeSessionId) return;
    const messages = messagesBySession[activeSessionId] ?? [];
    const current = messages.find((m) => m.id === messageId && m.role === "assistant");
    if (!current?.feedback) return;
    const previousUserPrompt = [...messages]
      .reverse()
      .find((m) => m.role === "user")?.content;
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Please sign in again.");
      await submitAiFeedback({
        token,
        requestId: current.id,
        rating: current.feedback,
        comment: text.trim() || undefined,
        prompt: previousUserPrompt,
        response: current.content
      });
      toast.success("Feedback recorded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save feedback");
    } finally {
      setFeedbackOpenFor(null);
    }
  };

  const refreshBalance = async () => {
    const token = await getAccessToken();
    if (!token) return;
    const wallet = await getWalletBalance(token);
    setBalanceCredits(wallet.balanceCredits ?? 0);
  };

  const refreshCurrentPlan = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) {
      setActiveSubscriptionCode(null);
      return;
    }
    try {
      const plan = await getCurrentPlan(token);
      const code = plan.code;
      setActiveSubscriptionCode(
        code === "free" || code === "starter" || code === "pro" || code === "power" ? code : null
      );
    } catch {
      setActiveSubscriptionCode(null);
    }
  }, [getAccessToken]);

  useEffect(() => {
    void refreshCurrentPlan();
  }, [refreshCurrentPlan]);

  const loadInvoices = useCallback(async () => {
    setInvoiceLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        setInvoiceRows([]);
        return;
      }
      const page = await getUserInvoices(token, undefined, 25);
      setInvoiceRows(page.items ?? []);
    } catch {
      setInvoiceRows([]);
      toast.error("Could not load invoices.");
    } finally {
      setInvoiceLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    if (settingsOpen && activeSettingsTab === "invoices") {
      void loadInvoices();
    }
  }, [settingsOpen, activeSettingsTab, loadInvoices]);

  const handleBuy = async (packCode: "spark" | "catalyst" | "accelerator") => {
    if (loadingPlan) return;
    setLoadingPlan(packCode);
    setSubscriptionStage("creating");
    try {
      toast.info("Creating secure top-up order...");
      const token = await getAccessToken();
      if (!token) throw new Error("Please sign in again.");
      const order = await createTopupOrder(token, packCode);
      const ready = await loadRazorpayScript();
      if (!ready) throw new Error("Payment SDK failed to load.");

      const RazorpayCtor = (window as Window & {
        Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
      }).Razorpay;
      if (!RazorpayCtor) throw new Error("Payment SDK unavailable.");

      setSubscriptionStage("awaiting_payment");
      const razorpay = new RazorpayCtor({
        key: order.keyId,
        amount: order.amountPaise,
        currency: "INR",
        name: "Safyne",
        description: `${order.pack.name} top-up`,
        order_id: order.orderId,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          setSubscriptionStage("verifying");
          toast.info("Verifying top-up payment...");
          try {
            const verified = await verifyTopupPayment(token, {
              packCode,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });
            setBalanceCredits(verified.wallet?.balanceCredits ?? balanceCredits);
            toast.success(`${verified.pack?.name ?? "Top-up"} applied successfully.`);
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Top-up verification failed.");
          } finally {
            setLoadingPlan(null);
            setSubscriptionStage("idle");
          }
        },
        modal: {
          ondismiss: () => {
            if (subscriptionStageRef.current !== "verifying") {
              toast.message("Payment cancelled.");
              setLoadingPlan(null);
              setSubscriptionStage("idle");
            }
          }
        },
        theme: {
          color: "#1357fb"
        }
      });
      razorpay.open();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to start top-up payment.");
      setLoadingPlan(null);
      setSubscriptionStage("idle");
    }
  };

  const handleSubscribeFree = async () => {
    if (loadingSubscription) return;
    setLoadingSubscription("free");
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Please sign in again.");
      const result = await subscribeFreePlan(token);
      await refreshCurrentPlan();
      toast.success(result.message ?? "Free plan activated.");
      setTopUpOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not activate Free plan.");
    } finally {
      setLoadingSubscription(null);
    }
  };

  useEffect(() => {
    const shouldOpenBilling = searchParams.get("billing") === "1";
    if (!shouldOpenBilling) return;
    setTopUpOpen(true);
    const planParam = searchParams.get("plan");
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("billing");
    nextParams.delete("plan");
    setSearchParams(nextParams, { replace: true });
    if (planParam === "free") {
      void (async () => {
        if (loadingSubscription) return;
        setLoadingSubscription("free");
        try {
          const token = await getAccessToken();
          if (!token) return;
          const result = await subscribeFreePlan(token);
          await refreshCurrentPlan();
          toast.success(result.message ?? "Free plan activated.");
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Could not activate Free plan.");
        } finally {
          setLoadingSubscription(null);
        }
      })();
    }
  }, [searchParams, setSearchParams, getAccessToken, refreshCurrentPlan, loadingSubscription]);

  const handleSubscribe = async (subscriptionCode: "starter" | "pro" | "power") => {
    if (loadingSubscription) return;
    setLoadingSubscription(subscriptionCode);
    setSubscriptionStage("creating");
    try {
      toast.info("Creating subscription link...");
      const token = await getAccessToken();
      if (!token) throw new Error("Please sign in again.");
      const sub = await createRecurringSubscription(token, subscriptionCode);
      if (!sub.shortUrl) throw new Error("Subscription link unavailable.");
      setSubscriptionStage("awaiting_payment");
      toast.message("Redirecting to secure subscription checkout...");
      window.location.href = sub.shortUrl as string;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Subscription activation failed.");
      setLoadingSubscription(null);
      setSubscriptionStage("idle");
    }
  };

  const handleRetryVerification = async () => {
    if (!pendingVerification) return;
    setSubscriptionStage("verifying");
    setLoadingSubscription(pendingVerification.subscriptionCode);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Please sign in again.");
      const verified = await verifySubscriptionPayment(token, pendingVerification);
      await refreshBalance();
      await refreshCurrentPlan();
      setPendingVerification(null);
      toast.success(
        `Plan activated: ${pendingVerification.subscriptionCode.toUpperCase()} (+${verified.grantCredits ?? 0} credits).`
      );
      setTopUpOpen(false);
    } catch {
      toast.error("Verification still pending. Please retry shortly.");
    } finally {
      setLoadingSubscription(null);
      setSubscriptionStage("idle");
    }
  };

  const handleUpload = async (file: File) => {
    if (activeSubscriptionCode === "free") {
      toast.error("Document uploads are not available on the Free plan. Upgrade to a paid subscription.");
      return;
    }
    const token = await getAccessToken();
    if (!token) throw new Error("Please sign in again.");
    const result = (await uploadAttachment(token, file)) as {
      filename: string;
      mimetype: string;
      sizeBytes?: number;
      rag?: { upfrontCreditsCharged?: number };
      billing?: { headline: string; detail: string; upfrontCreditsTotal: number };
      lowCreditWarning?: { message?: string };
    };
    await refreshBalance();
    if (result.lowCreditWarning) {
      toast.warning(result.lowCreditWarning.message ?? "Your credits are about to finish. Add a top-up to keep using Safyne.");
    }
    setPendingAttachments((prev) => [
      ...(prev ?? []),
      {
        filename: result.filename,
        mimetype: result.mimetype,
        sizeBytes: result.sizeBytes ?? file.size,
        chargedCredits: result.rag?.upfrontCreditsCharged ?? result.billing?.upfrontCreditsTotal ?? 0
      }
    ]);
    const title = result.billing?.headline ?? `Uploaded ${result.filename}.`;
    const description =
      result.billing?.detail ??
      `Charged ${result.rag?.upfrontCreditsCharged ?? 0} credits for processing. Chat turns that include this file are billed separately via input tokens.`;
    toast.success(title, { description, duration: 10_000 });
  };

  const handleRemoveAttachment = (filename: string) => {
    setPendingAttachments((prev) => (prev ?? []).filter((f) => f.filename !== filename));
  };

  const handleClearHistory = () => {
    setChatSessions([]);
    setMessagesBySession({});
    setActiveSessionId(null);
    setPendingAttachments([]);
    toast.success("All history cleared");
  };

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success("Signed out.");
      navigate("/auth");
    } catch {
      toast.error("Failed to sign out. Try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex h-screen w-full overflow-hidden bg-background text-foreground"
    >
      {/* Sidebar — Inteliq Col-Sidebar spacing (20px / 32px) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[min(18rem,100vw-2rem)] min-h-0 flex-col overflow-hidden border-r border-border bg-sidebar px-4 pb-2.5 pt-8 text-sidebar-foreground transition-transform md:static md:w-80 md:min-w-80 md:max-w-[21rem] md:translate-x-0 md:px-5 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border pb-5">
          <a href="/" className="flex items-center gap-2">
            <img src={safyneLogo} alt="safyne" className="h-8 w-8 rounded-lg object-contain" />
            <span className="font-display text-base font-bold lowercase">safyne</span>
          </a>
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-sidebar-accent md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5">
          <button
            onClick={handleNewThread}
            className="flex w-full items-center gap-2 rounded-2xl border border-border bg-card px-3 py-3 text-sm font-medium shadow-[var(--inteliq-shadow-short)] transition hover:border-primary/35"
          >
            <Plus className="h-4 w-4" />
            New Thread
          </button>
        </div>

        <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-y-auto">
          <p className="px-1 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Recent
          </p>
          {chatSessions.length === 0 ? (
            <p className="px-1 py-2 text-xs text-muted-foreground/80">
              No threads yet. Start a new one.
            </p>
          ) : (
            <ul className="space-y-1 pr-1">
              {chatSessions.map((session) => {
                const isActive = activeSessionId === session.id;
                const isRenaming = renamingId === session.id;
                return (
                  <li key={session.id}>
                    <ContextMenu>
                      <ContextMenuTrigger asChild>
                        <div
                          className={`flex w-full items-center gap-2 rounded-2xl px-2.5 py-2.5 text-sm transition ${
                            isActive
                              ? "border border-border bg-card text-foreground shadow-[var(--inteliq-shadow-short)]"
                              : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                          }`}
                        >
                          <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                          {isRenaming ? (
                            <input
                              autoFocus
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onBlur={commitRename}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") commitRename();
                                if (e.key === "Escape") setRenamingId(null);
                              }}
                              className="flex-1 truncate bg-transparent text-left text-sm focus:outline-none"
                            />
                          ) : (
                            <button
                              onClick={() => setActiveSessionId(session.id)}
                              className="flex-1 truncate text-left"
                            >
                              {session.title}
                            </button>
                          )}
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent className="w-40">
                        <ContextMenuItem onClick={() => handleRename(session.id)}>
                          <Pencil className="mr-2 h-3.5 w-3.5" />
                          Rename
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() => handleDelete(session.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Delete
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Profile widget with dropdown */}
        <div className="relative mt-auto shrink-0 border-t border-border pt-3" onClick={(e) => e.stopPropagation()}>
          {profileOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-md">
              <button
                onClick={() => {
                  setProfileOpen(false);
                  setTopUpOpen(true);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition hover:bg-muted"
              >
                <CreditCard className="h-4 w-4 text-primary" />
                Subscriptions
              </button>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  setActivityOpen(true);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition hover:bg-muted"
              >
                <ActivityIcon className="h-4 w-4 text-primary" />
                Activity
              </button>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  setSettingsOpen(true);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition hover:bg-muted"
              >
                <SettingsIcon className="h-4 w-4 text-primary" />
                User settings
              </button>
            </div>
          )}
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left shadow-[var(--inteliq-shadow-short)] transition hover:border-primary/35"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
              <span className="text-sm font-semibold">{email.slice(0, 2).toUpperCase()}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{email}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen(false);
                  setTopUpOpen(true);
                }}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Zap className="h-3 w-3 fill-primary" />
                {balanceCredits} Credits
              </button>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${profileOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main — Inteliq Col-Container + panel */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card shadow-[var(--inteliq-shadow-short)]"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            onClick={() => setTopUpOpen(true)}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-[var(--inteliq-shadow-short)] transition hover:text-foreground"
          >
            Credits Balance · <span className="text-primary">⚡ {balanceCredits}</span>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-2 pb-3 pt-1 md:px-2 md:pb-3 md:pt-2">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--inteliq-shadow-short)] md:rounded-br-2xl md:rounded-tl-[1.25rem] md:rounded-tr-2xl">
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
          {currentMessages.length === 0 ? (
            <div className="mx-auto flex min-h-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
              <h1 className="font-display text-[clamp(2.25rem,8vw,4rem)] font-extrabold leading-none tracking-tight text-foreground md:text-7xl">
                Safyne.
              </h1>
              <div className="mt-10 w-full">
                <Composer
                  value={input}
                  onChange={setInput}
                  onSend={() => sendMessage(input)}
                  onUpload={handleUpload}
                  pendingAttachments={(pendingAttachments ?? []).map((a) => ({ filename: a.filename, chargedCredits: a.chargedCredits }))}
                  onRemoveAttachment={handleRemoveAttachment}
                  isSending={isSending}
                  placeholder="Type your request..."
                  large
                />
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
              <div className="space-y-10">
                {currentMessages.map((m) => {
                  if (m.role === "user") {
                    return (
                      <div key={m.id} className="text-left">
                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          You asked
                        </p>
                        <p className="text-lg font-medium leading-relaxed text-foreground">
                          {m.content}
                        </p>
                        {m.attachments && m.attachments.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {m.attachments.map((a) => (
                              <span key={`${m.id}-${a.filename}`} className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
                                {a.filename} (-{a.chargedCredits})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div key={m.id} className="-mt-4 text-left">
                      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                        <Sparkles className="h-3 w-3" />
                        Safyne AI Response
                      </p>
                      <div className="rounded-2xl border border-border bg-secondary/45 px-5 py-4">
                        {m.isLoading ? (
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <span>Safyne is thinking</span>
                            <span className="flex items-center gap-1" aria-hidden>
                              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/70 [animation-delay:-0.2s]" />
                              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/70 [animation-delay:-0.1s]" />
                              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/70" />
                            </span>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground md:text-[15px]">
                            {m.content}
                          </p>
                        )}
                      </div>

                      {/* Feedback buttons */}
                      {!m.isLoading && (
                      <div className="mt-2 flex items-center gap-1 pl-1">
                        <button
                          onClick={() => handleFeedback(m.id, "up")}
                          className={`flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground ${
                            m.feedback === "up" ? "text-primary" : ""
                          }`}
                          aria-label="Like response"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleFeedback(m.id, "down")}
                          className={`flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground ${
                            m.feedback === "down" ? "text-destructive" : ""
                          }`}
                          aria-label="Dislike response"
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      )}

                      {!m.isLoading && feedbackOpenFor === m.id && m.feedback && (
                        <FeedbackBox
                          type={m.feedback}
                          onSubmit={(text) => void submitFeedback(m.id, text)}
                          onCancel={() => setFeedbackOpenFor(null)}
                        />
                      )}
                    </div>
                  );
                })}

                <div className="pt-4">
                  <Composer
                    value={input}
                    onChange={setInput}
                    onSend={() => sendMessage(input)}
                    onUpload={handleUpload}
                    pendingAttachments={(pendingAttachments ?? []).map((a) => ({ filename: a.filename, chargedCredits: a.chargedCredits }))}
                    onRemoveAttachment={handleRemoveAttachment}
                    isSending={isSending}
                    placeholder="Type your request..."
                  />
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    Safyne is a new model, and under training, it can make some mistakes
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Subscriptions & Top-Up */}
      <Dialog open={topUpOpen} onOpenChange={(open) => {
        setTopUpOpen(open);
        if (open && topUpPlans.length === 0 && subscriptionPlans.length === 0) {
          void loadPlanCatalog();
        }
      }}>
        <DialogContent className="flex max-h-[min(90dvh,880px)] w-[calc(100vw-1.5rem)] max-w-3xl flex-col gap-0 overflow-hidden border-border bg-card p-0 sm:w-full">
          <div className="shrink-0 space-y-4 border-b border-border px-4 pb-4 pr-12 pt-6 sm:px-6 sm:pr-14">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Zap className="h-5 w-5 text-primary" />
                Subscriptions & Top-Up
              </DialogTitle>
              <DialogDescription className="text-left">
                Top up credits or choose a subscription plan.
              </DialogDescription>
            </DialogHeader>

            <motion.div className="rounded-xl border border-border bg-secondary/40 px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {activeSubscriptionCode === "free" ? "Current plan" : "Current Balance"}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-2xl font-bold text-primary">
                {activeSubscriptionCode === "free" ? (
                  <>Free · OpenRouter basic</>
                ) : (
                  <>
                    <Zap className="h-5 w-5 fill-primary" />
                    {balanceCredits} Credits
                  </>
                )}
              </p>
            </motion.div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 [-webkit-overflow-scrolling:touch] sm:px-6 sm:py-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {topUpPlans.map((p) => (
                <div
                  key={p.code}
                  className={`relative flex flex-col rounded-xl border p-4 transition ${
                    p.code === "catalyst"
                      ? "border-primary/60 bg-primary/5 shadow-[var(--shadow-glow)]"
                      : "border-border bg-secondary/40"
                  }`}
                >
                  {p.code === "catalyst" && (
                    <span className="absolute -top-2 right-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      Best Value
                    </span>
                  )}
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="mt-3 text-2xl font-bold">₹{p.priceInr}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                    {p.credits.toLocaleString()} Credits
                  </p>
                  <button
                    onClick={() => handleBuy(p.code)}
                    disabled={loadingPlan !== null}
                    className={`mt-4 flex h-10 min-h-[44px] items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition disabled:opacity-60 ${
                      p.code === "catalyst"
                        ? "bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-glow))]"
                        : "border border-border bg-background hover:border-primary/50 hover:bg-secondary"
                    }`}
                  >
                    {loadingPlan === p.code ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Zap className="h-3.5 w-3.5" />
                        Buy ⚡ {p.credits.toLocaleString()}
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <motion.div
              className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="mb-3 text-xs uppercase tracking-wider text-emerald-200/90">Free subscription</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <motion.div>
                  <p className="text-base font-semibold text-foreground">Free</p>
                  <p className="mt-1 text-sm text-muted-foreground">₹0 · Basic chat via OpenRouter · No credits required</p>
                </motion.div>
                <button
                  type="button"
                  onClick={handleSubscribeFree}
                  disabled={loadingSubscription !== null || activeSubscriptionCode === "free"}
                  className={`flex h-10 min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-semibold transition disabled:opacity-80 ${
                    activeSubscriptionCode === "free"
                      ? "border border-green-500/60 bg-green-600 text-white"
                      : "border border-emerald-500/40 bg-emerald-600/90 text-white hover:bg-emerald-600"
                  }`}
                >
                  {loadingSubscription === "free" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : activeSubscriptionCode === "free" ? (
                    <>
                      <Check className="h-4 w-4" />
                      Active
                    </>
                  ) : (
                    "Start free"
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div className="mt-6">
              <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Subscriptions (Paid)</p>
              {pendingVerification && (
                <div className="mb-3 flex flex-col gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200 sm:flex-row sm:items-center sm:justify-between">
                  <span>Payment received. Verification pending for {pendingVerification.subscriptionCode.toUpperCase()}.</span>
                  <button
                    type="button"
                    onClick={handleRetryVerification}
                    disabled={loadingSubscription !== null}
                    className="shrink-0 rounded-md border border-amber-300/40 px-2 py-1.5 text-[11px] font-semibold text-amber-100 hover:bg-amber-500/20 disabled:opacity-60"
                  >
                    Retry verification
                  </button>
                </div>
              )}
              {loadingSubscription && (
                <div className="mb-3 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
                  {subscriptionStage === "creating" && "Creating secure order..."}
                  {subscriptionStage === "awaiting_payment" && "Waiting for payment confirmation in Razorpay..."}
                  {subscriptionStage === "verifying" && "Verifying payment securely..."}
                </div>
              )}
              <motion.div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {subscriptionPlans
                  .filter((p) => p.code !== "free")
                  .map((p) => {
                  const isActiveSubscription = p.code === activeSubscriptionCode;
                  const m = p.marketing;
                  const usd =
                    typeof p.priceUsd === "number" && Number.isFinite(p.priceUsd) ? p.priceUsd.toFixed(2) : "—";
                  const uploadMb =
                    m?.maxUploadBytes && m.maxUploadBytes > 0
                      ? Math.round(m.maxUploadBytes / (1024 * 1024))
                      : null;
                  return (
                    <div key={p.code} className="flex flex-col rounded-xl border border-border bg-secondary/40 p-4">
                      <p className="text-base font-semibold leading-tight text-foreground">{p.name}</p>
                      <p className="mt-2 text-2xl font-bold leading-tight text-foreground">₹{p.priceInr}</p>
                      <p className="mt-1 text-sm text-muted-foreground">${usd} USD</p>
                      <p className="mt-3 text-sm font-medium text-foreground">
                        Grant {p.monthlyGrantCredits.toLocaleString()} Cr
                      </p>
                      {m ? (
                        <div className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                          <p className="text-foreground/90">
                            Daily chat credits:{" "}
                            {typeof m.dailyCreditLimitCr === "number"
                              ? m.dailyCreditLimitCr.toLocaleString()
                              : "—"}{" "}
                            Cr
                          </p>
                          <p>
                            {typeof m.dailyImageGenerationLimit === "number"
                              ? m.dailyImageGenerationLimit.toLocaleString()
                              : "—"}{" "}
                            Images / day
                          </p>
                          <p>
                            {typeof m.dailyDocumentUploadLimit === "number"
                              ? m.dailyDocumentUploadLimit.toLocaleString()
                              : "—"}{" "}
                            Doc uploads / day
                            {uploadMb != null ? ` · Max file ${uploadMb} MB` : ""}
                          </p>
                        </div>
                      ) : (
                        <p className="mt-4 text-xs text-muted-foreground">Limits unavailable for this plan.</p>
                      )}
                      <button
                        onClick={() => handleSubscribe(p.code as "starter" | "pro" | "power")}
                        disabled={loadingSubscription !== null || isActiveSubscription}
                        className={`mt-4 flex h-10 min-h-[44px] w-full items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition disabled:opacity-80 ${
                          isActiveSubscription
                            ? "border border-green-500/60 bg-green-600 text-white"
                            : "border border-border bg-background hover:border-primary/50 hover:bg-secondary"
                        }`}
                      >
                        {loadingSubscription === p.code ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {subscriptionStage === "creating" && "Creating order..."}
                            {subscriptionStage === "awaiting_payment" && "Awaiting payment..."}
                            {subscriptionStage === "verifying" && "Verifying..."}
                          </>
                        ) : isActiveSubscription ? (
                          <>
                            <Check className="h-4 w-4" />
                            Active
                          </>
                        ) : (
                          "Pay & Activate"
                        )}
                      </button>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Activity & Usage */}
      <Dialog open={activityOpen} onOpenChange={setActivityOpen}>
        <DialogContent className="max-w-2xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <ActivityIcon className="h-5 w-5 text-primary" />
              Activity & Usage
            </DialogTitle>
            <DialogDescription>Your recent credit ledger and routing activity.</DialogDescription>
          </DialogHeader>
          <div className="mt-2 max-h-[60vh] overflow-y-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-secondary/60 backdrop-blur-xl">
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Task / Model</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 text-right font-medium">Credits</th>
                </tr>
              </thead>
              <tbody>
                {activityRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      No activity yet.
                    </td>
                  </tr>
                ) : (
                  activityRows.map((row, i) => (
                    <tr key={i} className="border-t border-border transition hover:bg-secondary/40">
                      <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                      <td className="px-4 py-3 font-medium">{row.task}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.action}</td>
                      <td
                        className={`px-4 py-3 text-right font-semibold ${
                          row.credits > 0 ? "text-emerald-400" : "text-foreground"
                        }`}
                      >
                        {row.credits > 0 ? "+" : ""}
                        {row.credits} ⚡
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: User Settings (simplified) */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-3xl border-border bg-card p-0">
          <div className="flex flex-col md:flex-row md:min-h-[420px]">
            <div className="border-b border-border md:w-56 md:border-b-0 md:border-r">
              <div className="p-6 pb-3">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <SettingsIcon className="h-5 w-5 text-primary" />
                  Settings
                </h2>
              </div>
              <nav className="flex flex-row gap-1 px-3 pb-3 md:flex-col">
                {settingsTabs.map((t) => {
                  const Icon = t.icon;
                  const active = activeSettingsTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveSettingsTab(t.id)}
                      className={`flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm transition md:flex-none ${
                        active
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {t.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="flex-1 p-6">
              {activeSettingsTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold">Profile</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Your account and appearance.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Email
                    </label>
                    <input
                      value={email}
                      disabled
                      readOnly
                      className="flex h-10 w-full cursor-not-allowed rounded-lg border border-border bg-secondary/40 px-3 text-sm text-muted-foreground focus:outline-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Theme
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { id: "light", label: "Light", icon: Sun, preview: "bg-white border-slate-200" },
                        { id: "dark", label: "Dark", icon: Moon, preview: "bg-[#0f172a] border-[#1e293b]" },
                      ] as const).map((opt) => {
                        const Icon = opt.icon;
                        const active = theme === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setTheme(opt.id)}
                            className={`group flex flex-col items-start gap-3 rounded-xl border p-3 text-left transition ${
                              active
                                ? "border-primary bg-primary/5 shadow-[var(--shadow-glow)]"
                                : "border-border bg-secondary/40 hover:border-primary/50"
                            }`}
                          >
                            <div className={`flex h-16 w-full items-center justify-center rounded-lg border ${opt.preview}`}>
                              <Icon className={`h-5 w-5 ${opt.id === "light" ? "text-slate-700" : "text-white"}`} />
                            </div>
                            <div className="flex w-full items-center justify-between">
                              <span className="text-sm font-semibold">{opt.label}</span>
                              {active && (
                                <span className="flex items-center gap-1 text-xs text-primary">
                                  <Check className="h-3 w-3" /> Active
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-secondary/30 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Session
                    </p>
                    <button
                      onClick={handleSignOut}
                      className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:border-primary/50 hover:bg-secondary"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}

              {activeSettingsTab === "help" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold">Help & Support</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Quick answers to the most common questions.
                    </p>
                  </div>
                  <Accordion type="single" collapsible className="rounded-xl border border-border bg-secondary/30 px-4">
                    {faqItems.map((item, i) => (
                      <AccordionItem key={i} value={`item-${i}`} className="border-border last:border-b-0">
                        <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="whitespace-pre-line text-sm text-muted-foreground">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Need more help?</p>
                      <p className="mt-1 text-muted-foreground">
                        Contact our support team at{" "}
                        <a
                          href="mailto:safynesupport@gmail.com"
                          className="font-medium text-primary hover:underline"
                        >
                          safynesupport@gmail.com
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsTab === "invoices" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold">Invoices</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Purchase history only (buy date and pack details).
                    </p>
                  </div>
                  <div className="max-h-[420px] overflow-y-auto rounded-xl border border-border bg-secondary/20">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-secondary/60 backdrop-blur-xl">
                        <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                          <th className="px-4 py-3 font-medium">Buy Date</th>
                          <th className="px-4 py-3 font-medium">Type</th>
                          <th className="px-4 py-3 font-medium">Pack</th>
                          <th className="px-4 py-3 text-right font-medium">Credits</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceLoading ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                              Loading invoices...
                            </td>
                          </tr>
                        ) : invoiceRows.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                              No purchases yet.
                            </td>
                          </tr>
                        ) : (
                          invoiceRows.map((row) => (
                            <tr key={row.id} className="border-t border-border">
                              <td className="px-4 py-3 text-muted-foreground">
                                {new Date(row.purchasedAt).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 capitalize">{row.purchaseType}</td>
                              <td className="px-4 py-3 uppercase">{row.packCode}</td>
                              <td className="px-4 py-3 text-right font-semibold text-emerald-400">
                                +{row.amountCredits}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeSettingsTab === "danger" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-base font-semibold text-destructive">Danger Zone</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Irreversible actions. Proceed with care.
                    </p>
                  </div>
                  <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
                    <p className="text-sm font-medium">Clear All History</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      This will permanently remove all chat threads from your sidebar.
                    </p>
                    <button
                      onClick={handleClearHistory}
                      className="mt-4 flex items-center gap-2 rounded-lg border border-destructive/60 px-4 py-2 text-sm font-semibold text-destructive transition hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear All History
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Chat;
