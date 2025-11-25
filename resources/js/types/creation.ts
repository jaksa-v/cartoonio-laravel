import { type Creation } from '@/types';

export function getStatusBadgeVariant(
    status: Creation['status'],
): 'default' | 'secondary' | 'destructive' | 'outline' {
    if (status === 'completed') {
        return 'default';
    }
    if (status === 'failed') {
        return 'destructive';
    }
    if (status === 'processing') {
        return 'secondary';
    }
    return 'outline';
}
