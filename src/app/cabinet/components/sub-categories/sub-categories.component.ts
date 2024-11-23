import { Component } from '@angular/core';
import { SubCategoriesService } from '../../../core/services/subCategories.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sub-categories',
  templateUrl: './sub-categories.component.html',
  styleUrl: './sub-categories.component.scss',
})
export class SubCategoriesComponent {
  subCategories: any;
  showSpinner = false;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private subCategoryService: SubCategoriesService,
    private router: Router,
    private messageService: MessageService
  ) {}

  displayedColumns: any[] = [
    {
      key: 'name',
      name: 'Alt Kateqoriya',
    },
    {
      key: 'categoryName',
      name: 'Kateqoriya',
    },
  ];
  ngOnInit(): void {
    this.getAllInfo(this.pageSize, this.pageIndex);
  }
  getAllInfo(pageIndex: number, pageSize: number) {
    this.subCategoryService
      .getSubCategories(pageIndex, pageSize + 1)
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.showSpinner = false;
          }, 200);
        })
      )
      .subscribe(
        (response) => {
          this.subCategories = response.items;
          console.log('subCategories', this.subCategories);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  onPageChange($event: any) {
    this.getAllInfo($event.pageSize, $event.pageIndex);
  }

  editSubCategoryPageInfo(id: any) {
    this.router.navigate(['/new-about', id]);
  }
}
