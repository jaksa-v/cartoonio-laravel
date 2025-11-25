import CreationController from '@/actions/App/Http/Controllers/CreationController';
import { CreationImagesGrid } from '@/components/creation-images-grid';
import { CreationStatusBadge } from '@/components/creation-status-badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type Creation } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

type Props = {
    creation: Creation;
};

function getBreadcrumbs(creationId: number): BreadcrumbItem[] {
    return [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Creation',
            href: CreationController.show.url(creationId),
        },
    ];
}

export default function CreationShow({ creation }: Props) {
    return (
        <AppLayout breadcrumbs={getBreadcrumbs(creation.id)}>
            <Head title="Creation Details" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="mx-auto w-full max-w-4xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <CardTitle>Creation Details</CardTitle>
                                <CardDescription>
                                    {new Date(
                                        creation.created_at,
                                    ).toLocaleString()}
                                </CardDescription>
                            </div>
                            <Link href={dashboard().url}>
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="mr-2 size-4" />
                                    Back to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-medium">Status</h3>
                                <CreationStatusBadge status={creation.status} />
                            </div>
                            {creation.error_message && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {creation.error_message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Prompt</h3>
                            <p className="rounded-md border bg-muted/50 p-3 text-sm">
                                {creation.prompt}
                            </p>
                        </div>

                        <CreationImagesGrid creation={creation} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
