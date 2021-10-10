import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import { catchError, first } from 'rxjs/operators';

import { Book } from '../models/book';

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
    this.http.get<Book[]>(this.apiBaseUrl).pipe(
      first(),
      catchError(error => {
        console.log(error);
        return of([]);
      })
    ).subscribe((books: any) => {
      this.books = books.data;
      this.books$.next(this.books);
    });
  }

  add(book: Book) {
    this.http.post<any>(`${this.apiBaseUrl}`, Book).pipe(
      first(),
      catchError(error => {
        console.log(error);
        return EMPTY;
      })
    ).subscribe(res => {
      book.id = res.data.id;
      this.books.push(book);
      this.books$.next(this.books);
    });
  }

  edit(book: Book) {
    let findElem = this.books.find(p => p.id == book.id);
    findElem.title = book.title;
    findElem.content = book.content;
    findElem.updated_at = new Date().toString();

    this.http.put<any>(`${this.apiBaseUrl}/${book.id}`, findElem).pipe(
      first(),
      catchError(error => {
        console.log(error);
        return EMPTY;
      })
    ).subscribe(() => {
      this.books$.next(this.books);
    });
  }

  remove(id: number) {
    this.http.delete<any>(`${this.apiBaseUrl}/${id}`).pipe(
      first(),
      catchError(error => {
        console.log(error);
        return EMPTY;
      })
    ).subscribe(() => {
      this.books = this.books.filter(p => {
        return p.id != id
      });

      this.books$.next(this.books);
    });
  }
}
