import CreationController from '@/actions/App/Http/Controllers/CreationController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { type ReactNode, useState } from 'react';
import { Trash2 } from 'lucide-react';

export function DeleteCreationDialog({
    creationId,
    children,
}: {
    creationId: number;
    children?: ReactNode;
}) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(CreationController.destroy.url(creationId), {
            preserveScroll: true,
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children ?? (
                    <Button variant="destructive" size="sm">
                        <Trash2 className="size-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Delete Creation</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this creation? This action
                    cannot be undone.
                </DialogDescription>

                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>

                    <Button
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
