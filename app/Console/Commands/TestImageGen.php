<?php

namespace App\Console\Commands;

use App\Models\Creation;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Facades\Prism;
use Prism\Prism\ValueObjects\Media\Image;

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
        $creation = Creation::query()->findOrFail(12);
        $imagePath = Storage::disk('local')->path($creation->input_image_path);

        $response = Prism::image()
            ->using(Provider::Gemini, 'gemini-2.5-flash-image')
            ->withPrompt('Make this image look like it was from a South Park episode', [
                Image::fromLocalPath($imagePath)]
            )
            ->generate();

        $this->info('Image count: '.$response->imageCount());

        $imageData = base64_decode($response->firstImage()->base64);
        $outputPath = 'test_image.png';
        Storage::disk('local')->put($outputPath, $imageData);
    }
}
