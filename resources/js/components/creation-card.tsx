import CreationController from '@/actions/App/Http/Controllers/CreationController';
import { CreationStatusBadge } from '@/components/creation-status-badge';
import { DeleteCreationDialog } from '@/components/delete-creation-dialog';
import { Button } from '@/components/ui/button';
import { type Creation } from '@/types';
import { Link } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';

export function CreationCard({ creation }: { creation: Creation }) {
    return (
        <div className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row">
            <div className="flex flex-col justify-between gap-2">
                <div className="space-y-2">
                    <p className="line-clamp-2 text-sm">
                        {creation.prompt.length > 30
                            ? `${creation.prompt.slice(0, 30)}…`
                            : creation.prompt}
                    </p>
                    <div className="flex items-center gap-2">
                        <CreationStatusBadge status={creation.status} />
                        <span className="text-sm text-muted-foreground">
                            {new Date(creation.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    {creation.error_message && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {creation.error_message}
                        </p>
                    )}
                </div>

                <div className="flex gap-2">
                    <Link href={CreationController.show.url(creation.id)}>
                        <Button variant="outline" size="sm">
                            <ExternalLink className="mr-2 size-4" />
                            View Details
                        </Button>
                    </Link>

                    <DeleteCreationDialog creationId={creation.id} />
                </div>
            </div>
            <div className="flex flex-1 gap-4">
                <div className="shrink-0">
                    <img
                        src={CreationController.image.url([
                            creation.id,
                            'input',
                        ])}
                        alt="Original"
                        className="h-24 w-24 rounded-md border object-cover"
                    />
                </div>
                {creation.output_image_path && (
                    <div className="shrink-0">
                        <img
                            src={CreationController.image.url([
                                creation.id,
                                'output',
                            ])}
                            alt="Generated"
                            className="h-24 w-24 rounded-md border object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
