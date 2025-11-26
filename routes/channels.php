<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('ai-stream.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('creations.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
