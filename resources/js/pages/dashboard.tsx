import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import {
    type BreadcrumbItem,
    type PrismStreamEvent,
    type SharedData,
} from '@/types';
import { isStreamEndEvent, isTextDeltaEvent } from '@/types/type-guards';
import { Head, usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    const [message, setMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await fetch('/chat-broadcast', {
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
    };

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
            }
        },
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <form onSubmit={handleSubmit}>
                    <Button type="submit">Send</Button>
                </form>
                <p>{message}</p>
            </div>
        </AppLayout>
    );
}
