<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Prism\Prism\Facades\Prism;

class TestImageGen extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-image-gen';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $response = Prism::image()
            ->using('openai', 'gpt-image-1')
            ->withPrompt('A cute baby sea otter floating on its back in calm blue water')
            ->withProviderOptions([
                'size' => '1024x1024',
                'n' => 1,
            ])
            ->withClientOptions(['timeout' => 120])
            ->generate();

        $this->info('Has images: '.$response->hasImages());
        $this->info('First image: '.$response->firstImage());
        $this->info('Image count: '.$response->imageCount());
    }
}
