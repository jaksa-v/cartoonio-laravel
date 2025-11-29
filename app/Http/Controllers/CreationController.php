<?php

namespace App\Http\Controllers;

use App\CreationStatus;
use App\Events\CreationUpdated;
use App\Http\Requests\StoreCreationRequest;
use App\Jobs\ProcessCreationJob;
use App\Models\Creation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CreationController extends Controller
{
    /**
     * Display gallery with paginated creations.
     */
    public function index(Request $request): Response
    {
        $creations = $request->user()
            ->creations()
            ->latest()
            ->paginate(20);

        return Inertia::render('creations/gallery', [
            'creations' => $creations,
        ]);
    }

    /**
     * Show creation form page.
     */
    public function create(Request $request): Response
    {
        $latestCreation = $request->user()
            ->creations()
            ->latest()
            ->first();

        return Inertia::render('creations/create', [
            'latestCreation' => $latestCreation,
        ]);
    }

    /**
     * Store a new creation.
     */
    public function store(StoreCreationRequest $request): RedirectResponse
    {
        $path = $request->user()->storeEncrypted($request->file('image'), 'creations');

        $creation = $request->user()->creations()->create([
            'prompt' => $request->validated('prompt'),
            'input_image_path' => $path,
            'status' => CreationStatus::Pending,
        ]);

        broadcast(new CreationUpdated($creation));

        ProcessCreationJob::dispatch($creation->id);

        return to_route('creations.create');
    }

    /**
     * Show a single creation.
     */
    public function show(Request $request, Creation $creation): Response
    {
        if ($creation->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('creations/show', [
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

        if (! $path || ! Storage::disk('s3')->exists($path)) {
            abort(404);
        }

        $decrypted = $request->user()->getEncrypted($path);

        return response($decrypted)
            ->header('Content-Type', 'image/png');
    }

    /**
     * Delete a creation.
     */
    public function destroy(Request $request, Creation $creation): RedirectResponse
    {
        if ($creation->user_id !== $request->user()->id) {
            abort(403);
        }

        $request->user()->deleteEncrypted($creation->input_image_path);

        if ($creation->output_image_path) {
            $request->user()->deleteEncrypted($creation->output_image_path);
        }

        $creation->delete();

        return to_route('creations.index');
    }
}
