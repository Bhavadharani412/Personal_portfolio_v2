export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Response<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Response<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

export interface D1Response<T = unknown> {
  success: boolean;
  error?: string;
  meta: Record<string, unknown>;
  results?: T[];
}

export interface D1Result<T = unknown> {
  success: boolean;
  error?: string;
  results: T[];
  meta: Record<string, unknown>;
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

export interface Env {
  DB?: D1Database;
  GROQ_API_KEY?: string;
  GROQ_MODEL?: string;
  ALLOWED_ORIGINS?: string;
  RATE_LIMIT_PER_MINUTE?: string;
}

export type AllowedEventType =
  | "page_view"
  | "project_view"
  | "github_click"
  | "live_demo_click"
  | "article_click"
  | "resume_click"
  | "contact_click"
  | "chat_started"
  | "chat_message"
  | "chat_response";

export type AttributionSource =
  | "linkedin"
  | "github"
  | "resume"
  | "application"
  | "direct";

export interface ChatHistoryTurn {
  role: "user" | "assistant";
  text: string;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
  chat_session_id?: string;
  history?: ChatHistoryTurn[];
}

export interface ChatResponse {
  reply: string;
  chat_session_id?: string;
  request_id?: string;
  sources?: string[];
  error?: string;
}

export interface EventRequest {
  session_id: string;
  event_type: AllowedEventType;
  page?: string;
  project_id?: string;
  metadata?: Record<string, unknown>;
  attribution?: {
    source?: AttributionSource;
    medium?: string;
    campaign?: string;
    landing_page?: string;
  };
}

export interface OperationalLog {
  request_id: string;
  route: string;
  status: number;
  duration_ms: number;
  error_type?: string;
  retrieval_duration_ms?: number;
  groq_duration_ms?: number;
  total_duration_ms?: number;
}
