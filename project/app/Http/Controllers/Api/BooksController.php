<?php

namespace App\Http\Controllers\Api;

use App\Models\Book;
use Orion\Concerns\DisableAuthorization;
use Orion\Http\Controllers\Controller;

class BooksController extends Controller
{

    use DisableAuthorization;

    protected $model = Book::class;
}