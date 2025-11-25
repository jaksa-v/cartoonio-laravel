import { useAiStream } from '@/hooks/use-ai-stream';
import { Button } from '../ui/button';

export default function ChatReverb() {
    const { message, handleSubmit } = useAiStream('/chat-broadcast');

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Button type="submit">Send</Button>
            </form>
            <p>{message}</p>
        </>
    );
}
