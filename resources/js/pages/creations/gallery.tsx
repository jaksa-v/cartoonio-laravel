import { CreationList } from '@/components/creation-list';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useCreationUpdates } from '@/hooks/use-creation-updates';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Creation } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gallery',
        href: '/gallery',
    },
];

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

type Props = {
    creations: PaginatedData<Creation>;
};

export default function Gallery({ creations }: Props) {
    useCreationUpdates('creations');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gallery" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mx-auto w-full max-w-7xl space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">
                                Your Gallery
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {creations.total} creation
                                {creations.total !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <Link href="/create">
                            <Button size="lg">
                                <Plus className="mr-2 size-4" />
                                Create New
                            </Button>
                        </Link>
                    </div>

                    <div>
                        {creations.data.length > 0 ? (
                            <>
                                <CreationList creations={creations.data} />

                                {creations.last_page > 1 && (
                                    <div className="mt-6 flex items-center justify-center gap-2">
                                        {creations.links.map((link, index) => {
                                            if (!link.url) {
                                                return (
                                                    <Button
                                                        key={index}
                                                        variant="outline"
                                                        size="sm"
                                                        disabled
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                );
                                            }

                                            return (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    preserveState
                                                    preserveScroll
                                                >
                                                    <Button
                                                        variant={
                                                            link.active
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                        size="sm"
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        ) : (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        No creations yet. Create your first
                                        generation!
                                    </p>
                                    <Link href="/create">
                                        <Button className="mt-4">
                                            <Plus className="mr-2 size-4" />
                                            Create Generation
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
