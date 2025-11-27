import CreationController from '@/actions/App/Http/Controllers/CreationController';
import { Spinner } from '@/components/ui/spinner';
import { type Creation } from '@/types';

export function CreationImagesGrid({ creation }: { creation: Creation }) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Original Image</h3>
                <img
                    src={CreationController.image.url([creation.id, 'input'])}
                    alt="Original"
                    className="w-full rounded-lg border object-cover"
                />
            </div>

            {creation.output_image_path && (
                <div className="space-y-2">
                    <h3 className="text-sm font-medium">Generated Image</h3>
                    <img
                        src={CreationController.image.url([
                            creation.id,
                            'output',
                        ])}
                        alt="Generated"
                        className="w-full rounded-lg border object-cover"
                    />
                </div>
            )}

            {!creation.output_image_path &&
                (creation.status === 'processing' ||
                    creation.status === 'pending') && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Generated Image</h3>
                        <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-lg border bg-muted/50">
                            <Spinner className="size-8" />
                            <p className="text-sm text-muted-foreground">
                                {creation.status === 'pending'
                                    ? 'Queued for processing...'
                                    : 'Generating your cartoon...'}
                            </p>
                        </div>
                    </div>
                )}
        </div>
    );
}
