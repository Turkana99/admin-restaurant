import { Component } from '@angular/core';
import { TablesService } from '../../../core/services/tables.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss'
})
export class TablesComponent {
  tables: any;
  showSpinner = false;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private tableService: TablesService,
    private router: Router,
    private messageService: MessageService
  ) {}

  displayedColumns: any[] = [
    {
      key: 'name',
      name: 'Masa',
    },
  ];
  ngOnInit(): void {
    this.getAllInfo(this.pageSize, this.pageIndex);
  }
  getAllInfo(pageIndex: number, pageSize: number) {
    this.tableService
      .getTables(pageIndex, pageSize+1)
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.showSpinner = false;
          }, 200);
        })
      )
      .subscribe(
        (response) => {
          this.tables = response.items;
          console.log('tables', this.tables);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }
  

  onPageChange($event: any) {
    this.getAllInfo($event.pageSize, $event.pageIndex);
  }

  editTablesPageInfo(id: any) {
    this.router.navigate(['/new-about', id]);
  }
}
