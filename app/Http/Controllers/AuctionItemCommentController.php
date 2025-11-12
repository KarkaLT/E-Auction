<?php

namespace App\Http\Controllers;

use App\Models\AuctionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuctionItemCommentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function store(Request $request, AuctionItem $auctionItem)
    {
        $request->validate([
            'body' => 'required|string',
        ]);

        $comment = $auctionItem->comments()->create([
            'user_id' => Auth::id(),
            'body' => $request->body,
        ]);

        // Load the user relation so the frontend can render the author immediately
        $comment->load('user');

        // If the request expects JSON (AJAX/fetch), return the created comment
        if ($request->expectsJson()) {
            return response()->json($comment, 201);
        }

        return back()->with('success', 'Comment added successfully.');
    }
}
