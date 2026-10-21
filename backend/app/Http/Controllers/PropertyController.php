<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PropertyController extends Controller
{
    /**
     * Display all properties.
     */
    public function index()
    {
        $properties = Property::with('images')
            ->latest()
            ->get();

        return response()->json($properties);
    }


    /**
     * Store a new property.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',

            'description' => 'nullable|string',

            'price' => 'required|numeric|min:0',

            'location' => 'required|string|max:255',

            'property_type' => 'required|string|max:100',

            'bedrooms' => 'nullable|integer|min:0',

            'bathrooms' => 'nullable|integer|min:0',

            'area' => 'nullable|numeric|min:0',

            'status' => 'required|string|max:100',

            /*
             * Main property image.
             */
            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            /*
             * Multiple gallery images.
             */
            'images' => [
                'nullable',
                'array',
            ],

            'images.*' => [
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
        ]);


        /*
         * Upload main property image.
         */
        if ($request->hasFile('image')) {

            $validated['image'] = $request
                ->file('image')
                ->store('properties', 'public');
        }


        /*
         * Create property.
         */
        $property = Property::create($validated);


        /*
         * Upload gallery images.
         */
        if ($request->hasFile('images')) {

            foreach ($request->file('images') as $image) {

                $path = $image->store(
                    'properties/gallery',
                    'public'
                );

                PropertyImage::create([
                    'property_id' => $property->id,
                    'image' => $path,
                ]);
            }
        }


        /*
         * Return property with images.
         */
        $property->load('images');

        return response()->json(
            $property,
            201
        );
    }


    /**
     * Display a single property.
     */
    public function show(Property $property)
    {
        $property->load('images');

        return response()->json($property);
    }


    /**
     * Update a property.
     */
    public function update(
        Request $request,
        Property $property
    ) {

        $validated = $request->validate([
            'title' => 'required|string|max:255',

            'description' => 'nullable|string',

            'price' => 'required|numeric|min:0',

            'location' => 'required|string|max:255',

            'property_type' => 'required|string|max:100',

            'bedrooms' => 'nullable|integer|min:0',

            'bathrooms' => 'nullable|integer|min:0',

            'area' => 'nullable|numeric|min:0',

            'status' => 'required|string|max:100',

            /*
             * Main image.
             */
            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            /*
             * New gallery images.
             */
            'images' => [
                'nullable',
                'array',
            ],

            'images.*' => [
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
        ]);


        /*
         * Replace main property image.
         */
        if ($request->hasFile('image')) {

            if ($property->image) {

                Storage::disk('public')
                    ->delete($property->image);
            }

            $validated['image'] = $request
                ->file('image')
                ->store('properties', 'public');
        }


        /*
         * Update property information.
         */
        $property->update($validated);


        /*
         * Add new gallery images.
         */
        if ($request->hasFile('images')) {

            foreach ($request->file('images') as $image) {

                $path = $image->store(
                    'properties/gallery',
                    'public'
                );

                PropertyImage::create([
                    'property_id' => $property->id,
                    'image' => $path,
                ]);
            }
        }


        /*
         * Return updated property.
         */
        $property->load('images');

        return response()->json($property);
    }


    /**
     * Delete a property.
     */
    public function destroy(Property $property)
    {
        /*
         * Delete main image.
         */
        if ($property->image) {

            Storage::disk('public')
                ->delete($property->image);
        }


        /*
         * Delete gallery images.
         */
        foreach ($property->images as $propertyImage) {

            if ($propertyImage->image) {

                Storage::disk('public')
                    ->delete($propertyImage->image);
            }
        }


        /*
         * Delete property.
         *
         * The database will automatically delete
         * property_images because of cascadeOnDelete().
         */
        $property->delete();


        return response()->json([
            'message' => 'Property deleted successfully.',
        ]);
    }
}