
<?php

use App\Http\Controllers\Api\BooksController;
use Illuminate\Support\Facades\Route;
use Orion\Facades\Orion;

Route::group(['as' => 'api.'], function() {
    Orion::resource('Books', BooksController::class);
});