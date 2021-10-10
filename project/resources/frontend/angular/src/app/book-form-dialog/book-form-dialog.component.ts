
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Book } from '../models/book';


@Component({
  selector: 'app-form-dialog',
  templateUrl: './book-form-dialog.component.html',
  styleUrls: ['./book-form-dialog.component.scss']
})

export class BookFormDialogComponent {

  formInstance: FormGroup;

  constructor(public dialogRef: MatDialogRef<BookFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Book) {
    
    this.formInstance = new FormGroup({
      "id": new FormControl({ value: '', disabled: !!data.id ? true: false }, Validators.required),
      "title": new FormControl('', Validators.required),
      "content": new FormControl('', Validators.required),
      "updated_at": new FormControl({ value: '', disabled: !!data.updated_at ? true : false }, Validators.required),
      "created_at": new FormControl({ value: '', disabled: !!data.created_at ? true : false}, Validators.required),
    });

    this.formInstance.setValue(data);
  }

  save(): void {
    let book: Book = Object.assign(new Book(), {
      id: this.data.id,
      title: this.formInstance.value.title,
      content: this.formInstance.value.content,
      updated_at: new Date().toISOString(),
      created_at: this.data.created_at,
    });

    this.dialogRef.close(book);
  }
}