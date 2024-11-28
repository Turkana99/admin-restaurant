import { Component } from '@angular/core';
import { CartsService } from '../../../core/services/carts.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrl: './carts.component.scss'
})
export class CartsComponent {
  carts: any;
  showSpinner = false;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private cartService: CartsService,
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
    this.cartService
      .getCarts(pageIndex, pageSize+1)
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.showSpinner = false;
          }, 200);
        })
      )
      .subscribe(
        (response) => {
          this.carts = response.items;
          console.log('carts', this.carts);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }
  

  onPageChange($event: any) {
    this.getAllInfo($event.pageSize, $event.pageIndex);
  }

  editCartsPageInfo(id: any) {
    this.router.navigate(['/new-carts', id]);
  }
}
