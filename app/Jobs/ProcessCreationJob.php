<?php

namespace App\Jobs;

use App\Enums\CreationStatus;
use App\Events\CreationUpdated;
use App\Models\Creation;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Facades\Prism;
use Prism\Prism\ValueObjects\Media\Image;
use Throwable;

class ProcessCreationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;

    public int $timeout = 300;

    public function __construct(
        public int $creationId
    ) {}

    /**
     * @throws Exception
     */
    public function handle(): void
    {
        $creation = Creation::find($this->creationId);

        if (! $creation) {
            return;
        }

        try {
            $creation->update(['status' => CreationStatus::Processing]);
            broadcast(new CreationUpdated($creation));

            $inputImageData = $creation->user->getEncrypted($creation->input_image_path);
            $tempPath = sys_get_temp_dir().'/'.uniqid('creation_', true).'.png';
            file_put_contents($tempPath, $inputImageData);

            $response = Prism::image()
                ->using(Provider::Gemini, 'gemini-2.5-flash-image')
                ->withPrompt($creation->prompt, [
                    Image::fromLocalPath($tempPath),
                ])
                ->withClientOptions(['timeout' => 120])
                ->generate();

            unlink($tempPath);

            $editedImage = $response->firstImage();
            $imageData = base64_decode($editedImage->base64);

            $outputPath = 'creations/output_'.time().'_'.basename($creation->input_image_path);
            $creation->user->putEncrypted($outputPath, $imageData);

            $creation->update([
                'output_image_path' => $outputPath,
                'status' => CreationStatus::Completed,
            ]);

            broadcast(new CreationUpdated($creation));

        } catch (Exception $e) {
            $creation->update([
                'status' => CreationStatus::Failed,
                'error_message' => 'Image generation failed: '.$e->getMessage(),
            ]);

            broadcast(new CreationUpdated($creation));

            throw $e;
        }
    }

    public function failed(Throwable $exception): void
    {
        $creation = Creation::find($this->creationId);

        if ($creation) {
            $creation->update([
                'status' => CreationStatus::Failed,
                'error_message' => 'Failed after retries: '.$exception->getMessage(),
            ]);

            broadcast(new CreationUpdated($creation));
        }
    }
}
