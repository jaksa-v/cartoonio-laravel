<?php

namespace App\Events;

use App\Models\Creation;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CreationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Creation $creation
    ) {}

    public function broadcastOn(): Channel
    {
        return new PrivateChannel('creations.'.$this->creation->user_id);
    }

    public function broadcastAs(): string
    {
        return 'creation.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'creation' => [
                'id' => $this->creation->id,
                'status' => $this->creation->status->value,
                'output_image_path' => $this->creation->output_image_path,
                'error_message' => $this->creation->error_message,
            ],
        ];
    }
}
