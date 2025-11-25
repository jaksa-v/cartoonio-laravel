<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCreationRequest;
use App\Models\Creation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CreationController extends Controller
{
    /**
     * Display the dashboard with creations.
     */
    public function index(Request $request): Response
    {
        $creations = $request->user()
            ->creations()
            ->latest()
            ->get();

        return Inertia::render('dashboard', [
            'creations' => $creations,
        ]);
    }

    /**
     * Store a new creation.
     */
    public function store(StoreCreationRequest $request): RedirectResponse
    {
        $path = $request->file('image')->store('creations', 'local');

        $request->user()->creations()->create([
            'prompt' => $request->validated('prompt'),
            'input_image_path' => $path,
            'status' => 'pending',
        ]);

        return to_route('dashboard');
    }

    /**
     * Show a single creation.
     */
    public function show(Request $request, Creation $creation): Response
    {
        if ($creation->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('creation-show', [
            'creation' => $creation,
        ]);
    }

    /**
     * Serve creation image.
     */
    public function image(Request $request, Creation $creation, string $type): mixed
    {
        if ($creation->user_id !== $request->user()->id) {
            abort(403);
        }

        $path = match ($type) {
            'input' => $creation->input_image_path,
            'output' => $creation->output_image_path,
            default => abort(404),
        };

        if (! $path || ! Storage::disk('local')->exists($path)) {
            abort(404);
        }

        return Storage::disk('local')->response($path);
    }

    /**
     * Delete a creation.
     */
    public function destroy(Request $request, Creation $creation): RedirectResponse
    {
        if ($creation->user_id !== $request->user()->id) {
            abort(403);
        }

        Storage::disk('local')->delete($creation->input_image_path);

        if ($creation->output_image_path) {
            Storage::disk('local')->delete($creation->output_image_path);
        }

        $creation->delete();

        return to_route('dashboard');
    }
}
