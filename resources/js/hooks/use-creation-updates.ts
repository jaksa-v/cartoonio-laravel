import { type Creation, type SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { useCallback, useRef } from 'react';

interface CreationUpdatedEvent {
    creation: {
        id: number;
        status: Creation['status'];
        output_image_path: string | null;
        error_message: string | null;
    };
}

export function useCreationUpdates(
    propName: 'creations' | 'latestCreation' = 'creations',
) {
    const { auth } = usePage<SharedData>().props;
    const isReloadingRef = useRef(false);

    const handleCreationUpdate = useCallback(
        (event: CreationUpdatedEvent) => {
            console.log('Creation updated:', event);

            if (isReloadingRef.current) {
                return;
            }

            isReloadingRef.current = true;

            router.reload({
                only: [propName],
                onFinish: () => {
                    isReloadingRef.current = false;
                },
            });
        },
        [propName],
    );

    useEcho<CreationUpdatedEvent>(
        `creations.${auth.user.id}`,
        ['.creation.updated'],
        handleCreationUpdate,
    );
}
