<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Property extends Model
{
    protected $fillable = [
        'title',
        'description',
        'price',
        'location',
        'property_type',
        'bedrooms',
        'bathrooms',
        'area',
        'status',
        'image',
    ];

    /**
     * Images belonging to this property.
     */
    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class);
    }
}