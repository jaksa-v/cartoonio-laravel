<?php

use App\Http\Controllers\CreationController;
use App\Jobs\ProcessAiStreamJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Prism\Prism\Facades\Prism;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('gallery', [CreationController::class, 'index'])->name('creations.index');
    Route::get('create', [CreationController::class, 'create'])->name('creations.create');
    Route::redirect('dashboard', 'gallery')->name('dashboard');
    Route::post('creations', [CreationController::class, 'store'])->name('creations.store');
    Route::get('creations/{creation}', [CreationController::class, 'show'])->name('creations.show');
    Route::get('creations/{creation}/image/{type}', [CreationController::class, 'image'])->name('creations.image');
    Route::delete('creations/{creation}', [CreationController::class, 'destroy'])->name('creations.destroy');

    Route::post('/chat-broadcast', function (Request $request) {
        ProcessAiStreamJob::dispatch(
            channel: 'ai-stream.'.$request->user()->id
        );

        return response()->json(['status' => 'processing']);
    });

    Route::post('/chat', function (Request $request) {
        $data = $request->input();

        $text = '';
        if (isset($data['messages']) && is_array($data['messages'])) {
            foreach ($data['messages'] as $message) {
                if (isset($message['parts']) && is_array($message['parts'])) {
                    foreach ($message['parts'] as $part) {
                        if ($part['type'] === 'text') {
                            $text .= $part['text'];
                        }
                    }
                }
            }
        }

        return Prism::text()
            ->using('openai', 'gpt-4.1-mini')
            ->withPrompt($text)
            ->asDataStreamResponse();
    });
});

require __DIR__.'/settings.php';
