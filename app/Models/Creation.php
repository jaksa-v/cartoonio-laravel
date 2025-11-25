<?php

namespace App\Models;

use App\CreationStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Creation extends Model
{
    /** @use HasFactory<\Database\Factories\CreationFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'prompt',
        'input_image_path',
        'output_image_path',
        'status',
        'error_message',
    ];

    protected function casts(): array
    {
        return [
            'status' => CreationStatus::class,
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
