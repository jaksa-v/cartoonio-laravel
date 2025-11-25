<?php

namespace App\Jobs;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Prism\Prism\Facades\Prism;

class ProcessAiStreamJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $message = 'Hello, how are you?',
        public string $channel = 'ai-stream',
        public string $model = 'gpt-4.1-mini'
    ) {}

    public function handle(): void
    {
        Prism::text()
            ->using('openai', $this->model)
            ->withPrompt($this->message)
            ->asBroadcast(new PrivateChannel($this->channel));
    }
}
