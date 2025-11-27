import { CreationCard } from '@/components/creation-card';
import { type Creation } from '@/types';

export function CreationList({ creations }: { creations: Creation[] }) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {creations.map((creation) => (
                <CreationCard key={creation.id} creation={creation} />
            ))}
        </div>
    );
}
