import { Component } from '@angular/core';
import { CategoriesService } from '../../../core/services/categories.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  categories: any;
  showSpinner = false;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private categoryService: CategoriesService,
    private router: Router,
    private messageService: MessageService
  ) {}

  displayedColumns: any[] = [
    {
      key: 'name',
      name: 'Kateqoriya',
    },
  ];
  ngOnInit(): void {
    this.getAllInfo(this.pageSize, this.pageIndex);
  }
  getAllInfo(pageIndex: number, pageSize: number) {
    this.categoryService
      .getCategories(pageIndex, pageSize+1)
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.showSpinner = false;
          }, 200);
        })
      )
      .subscribe(
        (response) => {
          this.categories = response.items;
          console.log('categories', this.categories);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }
  

  onPageChange($event: any) {
    this.getAllInfo($event.pageSize, $event.pageIndex);
  }

  editCategoryPageInfo(id: any) {
    this.router.navigate(['/new-about', id]);
  }
}
