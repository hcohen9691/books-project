import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { Book } from '../book';
import { BookService } from '../book.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { BookFormDialogComponent } from '../Book-form-dialog/Book-form-dialog.component';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['id', 'name', 'author', 'updated_at', 'created_at'];
  public columnsToDisplay: string[] = [...this.displayedColumns, 'actions'];

  public columnsFilters = {};

  public dataSource: MatTableDataSource<Book>;
  private serviceSubscribe: Subscription;

  constructor(private BookService: BookService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Book>();
  }

  edit(data: Book) {
    const dialogRef = this.dialog.open(BookFormDialogComponent, {
      width: '800px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.BookService.edit(result);
      }
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.BookService.remove(id);
      }
    });
  }

  add() {
    const dialogRef = this.dialog.open(BookFormDialogComponent, {
      width: '800px',
      data: {
        id: '',
        name: '',
        author: '',
        updated_at: '',
        created_at: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.BookService.add(result);
      }
    });
  }

  private filter() {

    this.dataSource.filterPredicate = (data: Book, filter: string) => {

      let find = true;

      for (var columnName in this.columnsFilters) {

        let currentData = "" + data[columnName];

        //if there is no filter, jump to next loop, otherwise do the filter.
        if (!this.columnsFilters[columnName]) {
          return;
        }

        let searchValue = this.columnsFilters[columnName]["contains"];

        if (!!searchValue && currentData.indexOf("" + searchValue) < 0) {

          find = false;
          //exit loop
          return;
        }

        searchValue = this.columnsFilters[columnName]["equals"];

        if (!!searchValue && currentData != searchValue) {
          find = false;
          //exit loop
          return;
        }

        searchValue = this.columnsFilters[columnName]["greaterThan"];

        if (!!searchValue && currentData <= searchValue) {
          find = false;
          //exit loop
          return;
        }

        searchValue = this.columnsFilters[columnName]["lessThan"];

        if (!!searchValue && currentData >= searchValue) {
          find = false;
          //exit loop
          return;
        }

        searchValue = this.columnsFilters[columnName]["startWith"];

        if (!!searchValue && !currentData.startsWith("" + searchValue)) {
          find = false;
          //exit loop
          return;
        }

        searchValue = this.columnsFilters[columnName]["endWith"];

        if (!!searchValue && !currentData.endsWith("" + searchValue)) {
          find = false;
          //exit loop
          return;
        }
      }
      return find;

    };

    this.dataSource.filter = null;
    this.dataSource.filter = 'activate';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
  
   * Create a filter for the column name and operate the filter action.
  
   */

  applyFilter(columnName: string, operationType: string, searchValue: string) {

    this.columnsFilters[columnName] = {};
    this.columnsFilters[columnName][operationType] = searchValue;
    this.filter();
  }

  /**
  
   * clear all associated filters for column name.
  
   */

  clearFilter(columnName: string) {
    if (this.columnsFilters[columnName]) {
      delete this.columnsFilters[columnName];
      this.filter();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * initialize data-table by providing Books list to the dataSource.
   */
  ngOnInit(): void {
    this.BookService.getAll();
    this.serviceSubscribe = this.BookService.books$.subscribe(res => {
      this.dataSource.data = res;
    })
  }

  ngOnDestroy(): void {
    this.serviceSubscribe.unsubscribe();
  }
}