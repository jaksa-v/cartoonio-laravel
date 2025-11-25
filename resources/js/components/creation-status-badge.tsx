import { Badge } from '@/components/ui/badge';
import { type Creation } from '@/types';
import { getStatusBadgeVariant } from '@/types/creation';

export function CreationStatusBadge({
    status,
}: {
    status: Creation['status'];
}) {
    return <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>;
}
