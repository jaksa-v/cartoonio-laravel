import { Button } from '@/components/ui/button';
import { useAiStream } from '@/hooks/use-ai-stream';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { message, handleSubmit } = useAiStream('/chat-broadcast');

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
