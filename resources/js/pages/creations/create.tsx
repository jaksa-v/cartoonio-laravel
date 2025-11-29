import { CreationForm } from '@/components/creation-form';
import { CreationImagesGrid } from '@/components/creation-images-grid';
import { CreationStatusBadge } from '@/components/creation-status-badge';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useCreationUpdates } from '@/hooks/use-creation-updates';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Creation } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create',
        href: '/create',
    },
];

type Props = {
    latestCreation: Creation | null;
};

export default function Create({ latestCreation }: Props) {
    const [currentCreationId, setCurrentCreationId] = useState<number | null>(
        null,
    );
    const [uploadedImagePreview, setUploadedImagePreview] = useState<
        string | null
    >(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    useCreationUpdates('latestCreation');

    useEffect(() => {
        const handleStart = () => {
            setIsSubmitting(true);
        };

        const handleSuccess = () => {
            setIsSubmitting(false);
            if (latestCreation) {
                setCurrentCreationId(latestCreation.id);
            }
        };

        const handleError = () => {
            setIsSubmitting(false);
        };

        const startListener = router.on('start', handleStart);
        const successListener = router.on('success', handleSuccess);
        const errorListener = router.on('error', handleError);

        return () => {
            startListener();
            successListener();
            errorListener();
        };
    }, [latestCreation]);

    const showCreationPreview =
        currentCreationId &&
        latestCreation &&
        latestCreation.id === currentCreationId &&
        ['pending', 'processing', 'completed'].includes(
            latestCreation.status,
        );

    const showUploadPreview = uploadedImagePreview && !showCreationPreview;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mx-auto w-full max-w-7xl">
                    <h1 className="mb-6 text-3xl font-bold tracking-tight">
                        Create Generation
                    </h1>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="mb-4 space-y-2">
                                    <h2 className="text-lg font-semibold">
                                        Upload & Style
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Upload image and select cartoon style
                                    </p>
                                </div>
                                <CreationForm
                                    onImageChange={setUploadedImagePreview}
                                    isSubmitting={isSubmitting}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                {showCreationPreview ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-2">
                                                <h2 className="text-lg font-semibold">
                                                    Live Preview
                                                </h2>
                                                <p className="text-sm text-muted-foreground">
                                                    Watch your creation in
                                                    real-time
                                                </p>
                                            </div>
                                            <CreationStatusBadge
                                                status={latestCreation.status}
                                            />
                                        </div>

                                        <CreationImagesGrid
                                            creation={latestCreation}
                                        />

                                        {latestCreation.error_message && (
                                            <p className="text-sm text-red-600 dark:text-red-400">
                                                {latestCreation.error_message}
                                            </p>
                                        )}
                                    </div>
                                ) : showUploadPreview ? (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <h2 className="text-lg font-semibold">
                                                Preview
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                Your uploaded image
                                            </p>
                                        </div>

                                        {isSubmitting ? (
                                            <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-lg border bg-muted/50">
                                                <Spinner className="size-8" />
                                                <p className="text-sm text-muted-foreground">
                                                    Uploading and processing...
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <img
                                                    src={uploadedImagePreview}
                                                    alt="Uploaded preview"
                                                    className="w-full rounded-lg border object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex h-full min-h-[400px] items-center justify-center">
                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground">
                                                Preview will appear here after
                                                upload
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
