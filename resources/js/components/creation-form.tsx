import CreationController from '@/actions/App/Http/Controllers/CreationController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { CARTOON_STYLES } from '@/lib/cartoon-styles';
import { Form } from '@inertiajs/react';
import { useState } from 'react';

type CreationFormProps = {
    onImageChange: (url: string | null) => void;
    isSubmitting: boolean;
};

export function CreationForm({
    onImageChange,
    isSubmitting,
}: CreationFormProps) {
    const [selectedStyle, setSelectedStyle] = useState<string>('');
    const [customText, setCustomText] = useState<string>('');

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            onImageChange(URL.createObjectURL(file));
        } else {
            onImageChange(null);
        }
    }

    function buildFinalPrompt(): string {
        const style = CARTOON_STYLES.find((s) => s.value === selectedStyle);
        if (!style) {
            return '';
        }

        if (customText.trim()) {
            return `${style.prompt}. Additional details: ${customText.trim()}`;
        }

        return style.prompt;
    }

    return (
        <Form
            {...CreationController.store.form()}
            options={{
                preserveScroll: true,
                preserveState: true,
            }}
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
                            disabled={processing || isSubmitting}
                            onChange={handleImageChange}
                        />

                        <InputError message={errors.image} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="style">Cartoon Style *</Label>

                        <Select
                            value={selectedStyle}
                            onValueChange={setSelectedStyle}
                            disabled={processing || isSubmitting}
                        >
                            <SelectTrigger id="style">
                                <SelectValue placeholder="Choose a cartoon style..." />
                            </SelectTrigger>
                            <SelectContent>
                                {CARTOON_STYLES.map((style) => (
                                    <SelectItem
                                        key={style.value}
                                        value={style.value}
                                    >
                                        {style.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <InputError message={errors.prompt} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="customText">
                            Additional Details (optional)
                        </Label>

                        <Input
                            id="customText"
                            type="text"
                            value={customText}
                            onChange={(e) => setCustomText(e.target.value)}
                            maxLength={500}
                            disabled={processing || isSubmitting}
                            placeholder="e.g., wearing sunglasses, smiling"
                        />

                        <p className="text-xs text-muted-foreground">
                            {customText.length}/500 characters
                        </p>
                    </div>

                    <input
                        type="hidden"
                        name="prompt"
                        value={buildFinalPrompt()}
                    />

                    <Button
                        type="submit"
                        disabled={processing || isSubmitting || !selectedStyle}
                        className="w-full"
                    >
                        {processing || isSubmitting ? (
                            <>
                                <Spinner className="mr-2 size-4" />
                                Uploading...
                            </>
                        ) : (
                            'Generate'
                        )}
                    </Button>
                </>
            )}
        </Form>
    );
}
