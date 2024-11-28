import { Component } from '@angular/core';
import { OrdersService } from '../../../core/services/orders.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  orders: any;
  showSpinner = false;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private orderService: OrdersService,
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
    this.orderService
      .getOrders(pageIndex, pageSize + 1)
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.showSpinner = false;
          }, 200);
        })
      )
      .subscribe(
        (response) => {
          this.orders = response.items;
          console.log('categories', this.orders);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  onPageChange($event: any) {
    this.getAllInfo($event.pageSize, $event.pageIndex);
  }

  editOrdersPageInfo(id: any) {
    this.router.navigate(['/new-about', id]);
  }
}
