<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        return Message::where(function ($q) use ($request) {
                $q->where('sender_id', Auth::id())
                  ->where('receiver_id', $request->user_id);
            })
            ->orWhere(function ($q) use ($request) {
                $q->where('sender_id', $request->user_id)
                  ->where('receiver_id', Auth::id());
            })
            ->orderBy('created_at')
            ->get();
    }

    public function store(Request $request)
    {
        $message = Message::create([
            'body' => $request->body,
            'sender_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
        ]);
        // event(new MessageSent($message));
        MessageSent::dispatch($message);

        return $message;
    }
}
