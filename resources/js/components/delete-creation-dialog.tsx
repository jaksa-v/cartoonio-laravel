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
import { Form } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

export function DeleteCreationDialog({ creationId }: { creationId: number }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2 className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Delete Creation</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this creation? This action
                    cannot be undone.
                </DialogDescription>

                <Form
                    {...CreationController.destroy.form(creationId)}
                    options={{
                        preserveScroll: true,
                    }}
                >
                    {({ processing }) => (
                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                            </DialogClose>

                            <Button
                                variant="destructive"
                                disabled={processing}
                                asChild
                            >
                                <button type="submit">Delete</button>
                            </Button>
                        </DialogFooter>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
