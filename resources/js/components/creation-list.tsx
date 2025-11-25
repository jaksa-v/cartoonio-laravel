import { CreationCard } from '@/components/creation-card';
import { type Creation } from '@/types';

export function CreationList({ creations }: { creations: Creation[] }) {
    return (
        <div className="space-y-4">
            {creations.map((creation) => (
                <CreationCard key={creation.id} creation={creation} />
            ))}
        </div>
    );
}
