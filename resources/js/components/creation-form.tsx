import CreationController from '@/actions/App/Http/Controllers/CreationController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';
import { useState } from 'react';

export function CreationForm() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    }

    return (
        <Form
            {...CreationController.store.form()}
            options={{
                preserveScroll: true,
            }}
            onSuccess={() => {
                setPreviewUrl(null);
            }}
            resetOnSuccess
            className="space-y-6"
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="image">Upload Image</Label>

                        <Input
                            id="image"
                            type="file"
                            name="image"
                            accept="image/jpeg,image/png,image/webp"
                            required
                            onChange={handleImageChange}
                            disabled={processing}
                        />

                        <InputError message={errors.image} />

                        {previewUrl && (
                            <div className="mt-4">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="max-h-64 rounded-lg border object-contain"
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="prompt">Prompt</Label>

                        <textarea
                            id="prompt"
                            name="prompt"
                            rows={4}
                            required
                            disabled={processing}
                            placeholder="Describe what you want to generate..."
                            className="flex w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:ring-destructive/40"
                        />

                        <InputError message={errors.prompt} />
                    </div>

                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full"
                    >
                        {processing ? 'Uploading...' : 'Generate'}
                    </Button>
                </>
            )}
        </Form>
    );
}
