import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Creation {
    id: number;
    prompt: string;
    input_image_path: string;
    output_image_path: string | null;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    error_message: string | null;
    created_at: string;
}

// Prism Streaming Event Types
export interface StreamStartEvent {
    id: string;
    timestamp: number;
    model: string;
    provider: string;
    metadata?: {
        request_id?: string;
        rate_limits?: unknown[];
        [key: string]: unknown;
    };
}

export interface TextStartEvent {
    id: string;
    timestamp: number;
    message_id: string;
}

export interface TextDeltaEvent {
    id: string;
    timestamp: number;
    delta: string;
    message_id: string;
}

export interface TextCompleteEvent {
    id: string;
    timestamp: number;
    message_id: string;
    content?: string;
}

export interface ThinkingStartEvent {
    id: string;
    timestamp: number;
    reasoning_id?: string;
    message_id?: string;
}

export interface ThinkingDeltaEvent {
    id: string;
    timestamp: number;
    delta: string;
    reasoning_id?: string;
    message_id?: string;
}

export interface ThinkingCompleteEvent {
    id: string;
    timestamp: number;
    reasoning_id?: string;
    message_id?: string;
}

export interface ToolCallEvent {
    id: string;
    timestamp: number;
    tool_id: string;
    tool_name: string;
    arguments: Record<string, unknown>;
    message_id: string;
    reasoning_id?: string | null;
}

export interface ToolResultEvent {
    id: string;
    timestamp: number;
    tool_call_id: string;
    tool_name: string;
    result: unknown;
    message_id: string;
    reasoning_id?: string | null;
}

export interface ProviderToolEvent {
    id: string;
    timestamp: number;
    type: string;
    event_key: string;
    tool_type: string;
    status: string;
    item_id: string;
    data: Record<string, unknown>;
}

export interface StreamErrorEvent {
    id: string;
    timestamp: number;
    message: string;
    code?: string;
    recoverable?: boolean;
    [key: string]: unknown;
}

export interface StreamUsage {
    prompt_tokens: number;
    completion_tokens: number;
    cache_write_input_tokens?: number;
    cache_read_input_tokens?: number;
    thought_tokens?: number;
    [key: string]: unknown;
}

export interface StreamEndEvent {
    id: string;
    timestamp: number;
    finish_reason: string;
    usage: StreamUsage;
}

export type PrismStreamEvent =
    | StreamStartEvent
    | TextStartEvent
    | TextDeltaEvent
    | TextCompleteEvent
    | ThinkingStartEvent
    | ThinkingDeltaEvent
    | ThinkingCompleteEvent
    | ToolCallEvent
    | ToolResultEvent
    | ProviderToolEvent
    | StreamErrorEvent
    | StreamEndEvent;
