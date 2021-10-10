import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import { catchError, first } from 'rxjs/operators';

import { Book } from './book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiBaseUrl = `http://localhost:8000/api/Books`;
  books$: BehaviorSubject<Book[]>;
  books: Array<Book> = [];

  constructor(
    private http: HttpClient
  ) {
    this.books$ = new BehaviorSubject([]);
  }

  getAll() {
    this.http.get<Book[]>(this.apiBaseUrl).subscribe((books: any) => {
      this.books = books.data;
      this.books$.next(this.books);
    });
  }

  add(book: Book) {
    this.http.post<any>(`${this.apiBaseUrl}`, book).subscribe(res => {
      book.id = res.data.id;
      this.books.push(book);
      this.books$.next(this.books);
    });
  }

  edit(book: Book) {
    let findElem = this.books.find(p => p.id == book.id);
    findElem.name = book.name;
    findElem.author = book.author;
    findElem.updated_at = new Date().toString();

    this.http.put<any>(`${this.apiBaseUrl}/${book.id}`, findElem).subscribe(() => {
      this.books$.next(this.books);
    });
  }

  remove(id: number) {
    this.http.delete<any>(`${this.apiBaseUrl}/${id}`).subscribe(() => {
      this.books = this.books.filter(p => {
        return p.id != id
      });

      this.books$.next(this.books);
    });
  }
}
