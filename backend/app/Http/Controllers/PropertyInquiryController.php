<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyInquiry;
use Illuminate\Http\Request;

class PropertyInquiryController extends Controller
{
    /**
     * Display all property inquiries.
     */
    public function index()
    {
        $inquiries = PropertyInquiry::with('property')
            ->latest()
            ->get();

        return response()->json($inquiries);
    }

    /**
     * Store a new property inquiry.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:30',
            'message' => 'required|string|max:2000',
        ]);

        $property = Property::findOrFail(
            $validated['property_id']
        );

        $inquiry = PropertyInquiry::create($validated);

        return response()->json([
            'message' => 'Your inquiry has been sent successfully.',
            'inquiry' => $inquiry,
            'property' => $property->title,
        ], 201);
    }

    /**
     * Update an inquiry status.
     */
    public function update(Request $request, PropertyInquiry $propertyInquiry)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,contacted,closed',
        ]);

        $propertyInquiry->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Inquiry status updated successfully.',
            'inquiry' => $propertyInquiry->load('property'),
        ]);
    }
}