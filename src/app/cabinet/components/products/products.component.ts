import { Component } from '@angular/core';
import { ProductsService } from '../../../core/services/products.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  products: any;
  showSpinner = false;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private productService: ProductsService,
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
    this.productService
      .getProducts(pageIndex, pageSize+1)
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.showSpinner = false;
          }, 200);
        })
      )
      .subscribe(
        (response) => {
          this.products = response.items;
          console.log('products', this.products);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }
  

  onPageChange($event: any) {
    this.getAllInfo($event.pageSize, $event.pageIndex);
  }

  editproductsPageInfo(id: any) {
    this.router.navigate(['/new-about', id]);
  }
}
