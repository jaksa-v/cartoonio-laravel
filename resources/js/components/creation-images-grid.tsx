import CreationController from '@/actions/App/Http/Controllers/CreationController';
import { type Creation } from '@/types';

export function CreationImagesGrid({ creation }: { creation: Creation }) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
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
                creation.status === 'processing' && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Generated Image</h3>
                        <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-muted/50">
                            <p className="text-sm text-muted-foreground">
                                Processing...
                            </p>
                        </div>
                    </div>
                )}
        </div>
    );
}
