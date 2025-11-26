import { CreationForm } from '@/components/creation-form';
import { CreationList } from '@/components/creation-list';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useCreationUpdates } from '@/hooks/use-creation-updates';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type Creation } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type Props = {
    creations: Creation[];
};

export default function Dashboard({ creations }: Props) {
    useCreationUpdates();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="mx-auto w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Create Artwork</CardTitle>
                        <CardDescription>
                            Upload an image and provide a prompt to generate AI
                            artwork
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CreationForm />
                    </CardContent>
                </Card>

                {creations.length > 0 && (
                    <Card className="mx-auto w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle>Your Creations</CardTitle>
                            <CardDescription>
                                View and manage your artwork creations
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CreationList creations={creations} />
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
