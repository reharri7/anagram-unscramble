import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime} from "rxjs";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatToolbar,
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatHeaderRow,
    MatRowDef,
    MatHeaderRowDef,
    MatRow,
    MatNoDataRow,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderCell,
    MatCell,
    MatSort,
    MatTable,
    MatColumnDef,
    MatPaginator
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit {

  displayedColumns = ['word'];

  textControl = new FormControl('');
  listOfPermutations: string[] = [];
  dataSource: MatTableDataSource<string>;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;


  constructor() {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.textControl.valueChanges.pipe(debounceTime(400)).subscribe((value: string | null) => {
      if(!!value) {
        this.listOfPermutations = this.getAllCombinations(value);
        this.dataSource.data = this.listOfPermutations;
      }
    });
  }

  ngAfterViewInit() {
    if(this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if(this.sort) {
      this.dataSource.sort = this.sort;
    }

    this.dataSource.filterPredicate = (data: string, fil: string)=> {
      return fil.split('').map((char, idx) => {
        return char === '%' || char.toLowerCase() === data.at(idx)?.toLowerCase();
      }).every(res => res);
    }
  }

  getAllCombinations(str: string): string[] {
    const result: string[] = [];

    // Helper function to perform recursive permutation generation
    function permute(remaining: string, current: string = "") {
      if (remaining.length === 0) {
        result.push(current); // Push the permutation to the result when no characters remain
        return;
      }

      for (let i = 0; i < remaining.length; i++) {
        const newRemaining = remaining.slice(0, i) + remaining.slice(i + 1);
        permute(newRemaining, current + remaining[i]);
      }
    }

    permute(str);
    // filter duplicates
    result.filter((value, index, self) => self.indexOf(value) === index);
    return result;
  }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
