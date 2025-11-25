import { type PrismStreamEvent, type SharedData } from '@/types';
import { isStreamEndEvent, isTextDeltaEvent } from '@/types/type-guards';
import { usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { useCallback, useState } from 'react';

interface UseAiStreamOptions {
    onStreamEnd?: (event: {
        finish_reason: string;
        usage: {
            prompt_tokens: number;
            completion_tokens: number;
            [key: string]: unknown;
        };
    }) => void;
}

export function useAiStream(
    url: string,
    { onStreamEnd }: UseAiStreamOptions = {},
) {
    const { auth } = usePage<SharedData>().props;
    const [message, setMessage] = useState<string>('');

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                console.error('Failed to send message');
            }
        },
        [url],
    );

    const clearMessage = useCallback(() => {
        setMessage('');
    }, []);

    useEcho<PrismStreamEvent>(
        `ai-stream.${auth.user.id}`,
        ['.stream_start', '.text_start', '.text_delta', '.stream_end'],
        (event) => {
            console.log(event);
            if (isTextDeltaEvent(event)) {
                setMessage((prev) => prev + event.delta);
            }
            if (isStreamEndEvent(event)) {
                console.log('Stream ended:', event.finish_reason, event.usage);
                onStreamEnd?.({
                    finish_reason: event.finish_reason,
                    usage: event.usage,
                });
            }
        },
    );

    return {
        message,
        handleSubmit,
        clearMessage,
    };
}
