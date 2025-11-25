import type {
    PrismStreamEvent,
    StreamStartEvent,
    TextStartEvent,
    TextDeltaEvent,
    TextCompleteEvent,
    ToolCallEvent,
    ToolResultEvent,
    StreamEndEvent,
    StreamErrorEvent,
} from './index';

// Type guards for event discrimination
export function isStreamStartEvent(
    event: PrismStreamEvent,
): event is StreamStartEvent {
    return 'model' in event && 'provider' in event && !('delta' in event);
}

export function isTextStartEvent(
    event: PrismStreamEvent,
): event is TextStartEvent {
    return 'message_id' in event && !('delta' in event) && !('model' in event);
}

export function isTextDeltaEvent(
    event: PrismStreamEvent,
): event is TextDeltaEvent {
    return 'delta' in event && typeof event.delta === 'string';
}

export function isTextCompleteEvent(
    event: PrismStreamEvent,
): event is TextCompleteEvent {
    return (
        'message_id' in event &&
        !('delta' in event) &&
        !('finish_reason' in event)
    );
}

export function isToolCallEvent(
    event: PrismStreamEvent,
): event is ToolCallEvent {
    return 'tool_id' in event && 'tool_name' in event && 'arguments' in event;
}

export function isToolResultEvent(
    event: PrismStreamEvent,
): event is ToolResultEvent {
    return 'tool_call_id' in event && 'result' in event;
}

export function isStreamEndEvent(
    event: PrismStreamEvent,
): event is StreamEndEvent {
    return 'finish_reason' in event && 'usage' in event;
}

export function isStreamErrorEvent(
    event: PrismStreamEvent,
): event is StreamErrorEvent {
    return 'message' in event && !('delta' in event);
}
