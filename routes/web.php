<?php

use App\Jobs\ProcessAiStreamJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::post('/chat-broadcast', function (Request $request) {
        ProcessAiStreamJob::dispatch(
            channel: 'ai-stream.'.$request->user()->id
        );

        return response()->json(['status' => 'processing']);
    });
});

require __DIR__.'/settings.php';
