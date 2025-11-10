<?php

namespace App\Http\Controllers;

use App\Models\AuctionItemComment;
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

        $auctionItem->comments()->create([
            'user_id' => Auth::id(),
            'body' => $request->body,
        ]);

        return back()->with('success', 'Comment added successfully.');
    }
}
