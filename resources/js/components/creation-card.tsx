import CreationController from '@/actions/App/Http/Controllers/CreationController';
import { CreationStatusBadge } from '@/components/creation-status-badge';
import { DeleteCreationDialog } from '@/components/delete-creation-dialog';
import { type Creation } from '@/types';
import { Link } from '@inertiajs/react';

export function CreationCard({ creation }: { creation: Creation }) {
    return (
        <Link
            href={CreationController.show.url(creation.id)}
            className="group block overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
        >
            <div className="relative aspect-4/3 overflow-hidden bg-muted/30">
                <div className="absolute inset-0 grid grid-cols-2 gap-px bg-border">
                    <div className="relative bg-card">
                        <div className="absolute top-2 left-2 z-10 rounded-md bg-background/80 px-2 py-1 backdrop-blur-sm">
                            <p className="text-xs font-medium text-foreground">
                                Original
                            </p>
                        </div>
                        <img
                            src={CreationController.image.url([
                                creation.id,
                                'input',
                            ])}
                            alt="Original"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="relative bg-card">
                        <div className="absolute top-2 right-2 z-10 rounded-md bg-background/80 px-2 py-1 backdrop-blur-sm">
                            <p className="text-xs font-medium text-foreground">
                                Generated
                            </p>
                        </div>
                        {creation.output_image_path ? (
                            <img
                                src={CreationController.image.url([
                                    creation.id,
                                    'output',
                                ])}
                                alt="Generated"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted/50">
                                <p className="text-xs font-medium text-muted-foreground">
                                    {creation.status === 'processing'
                                        ? 'Processing...'
                                        : 'Pending'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-2">
                        <CreationStatusBadge status={creation.status} />
                        <span className="text-xs text-muted-foreground">
                            {new Date(creation.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <div
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <DeleteCreationDialog creationId={creation.id} />
                    </div>
                </div>

                {creation.error_message && (
                    <p className="mt-3 text-xs text-red-600 dark:text-red-400">
                        {creation.error_message}
                    </p>
                )}
            </div>
        </Link>
    );
}
