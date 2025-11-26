<?php

namespace App\Jobs;

use App\CreationStatus;
use App\Events\CreationUpdated;
use App\Models\Creation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Prism\Prism\Facades\Prism;
use Prism\Prism\ValueObjects\Media\Image;

class ProcessCreationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;

    public int $timeout = 300;

    public function __construct(
        public int $creationId
    ) {}

    public function handle(): void
    {
        $creation = Creation::find($this->creationId);

        if (! $creation) {
            return;
        }

        try {
            $creation->update(['status' => CreationStatus::Processing]);
            broadcast(new CreationUpdated($creation))->toOthers();

            $inputPath = Storage::disk('local')->path($creation->input_image_path);

            $response = Prism::image()
                ->using('openai', 'gpt-image-1')
                ->withPrompt($creation->prompt, [
                    Image::fromLocalPath($inputPath),
                ])
                ->withProviderOptions([
                    'size' => '1024x1024',
                    'n' => 1,
                ])
                ->withClientOptions(['timeout' => 120])
                ->generate();

            $editedImage = $response->firstImage();
            $imageData = base64_decode($editedImage->base64);

            $outputPath = 'creations/output_'.time().'_'.basename($creation->input_image_path);
            Storage::disk('local')->put($outputPath, $imageData);

            $creation->update([
                'output_image_path' => $outputPath,
                'status' => CreationStatus::Completed,
            ]);

            broadcast(new CreationUpdated($creation))->toOthers();

        } catch (\Exception $e) {
            $creation->update([
                'status' => CreationStatus::Failed,
                'error_message' => 'Image generation failed: '.$e->getMessage(),
            ]);

            broadcast(new CreationUpdated($creation))->toOthers();

            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        $creation = Creation::find($this->creationId);

        if ($creation) {
            $creation->update([
                'status' => CreationStatus::Failed,
                'error_message' => 'Failed after retries: '.$exception->getMessage(),
            ]);

            broadcast(new CreationUpdated($creation))->toOthers();
        }
    }
}
