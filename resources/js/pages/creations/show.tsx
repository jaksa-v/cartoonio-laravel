import CreationController from '@/actions/App/Http/Controllers/CreationController';
import { CreationImagesGrid } from '@/components/creation-images-grid';
import { CreationStatusBadge } from '@/components/creation-status-badge';
import { DeleteCreationDialog } from '@/components/delete-creation-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Creation } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Trash2 } from 'lucide-react';

type Props = {
    creation: Creation;
};

function getBreadcrumbs(creationId: number): BreadcrumbItem[] {
    return [
        {
            title: 'Gallery',
            href: '/gallery',
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
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="mx-auto w-full max-w-7xl space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">
                                Creation Details
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {new Date(creation.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <DeleteCreationDialog creationId={creation.id}>
                                <Button variant="destructive" size="icon">
                                    <Trash2 className="size-4" />
                                </Button>
                            </DeleteCreationDialog>
                            <Link href="/gallery">
                                <Button variant="outline" size="lg">
                                    <ArrowLeft className="mr-2 size-4" />
                                    Back to Gallery
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="space-y-6 pt-6">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-medium">
                                        Status
                                    </h3>
                                    <CreationStatusBadge
                                        status={creation.status}
                                    />
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
            </div>
        </AppLayout>
    );
}
