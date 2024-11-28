import { Component } from '@angular/core';
import { UsersService } from '../../../core/services/users.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  users: any;
  showSpinner = false;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private userService: UsersService,
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
    this.userService
      .getUsers(pageIndex, pageSize + 1)
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.showSpinner = false;
          }, 200);
        })
      )
      .subscribe(
        (response) => {
          this.users = response.items;
          console.log('categories', this.users);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  onPageChange($event: any) {
    this.getAllInfo($event.pageSize, $event.pageIndex);
  }

  editUsersPageInfo(id: any) {
    this.router.navigate(['/new-about', id]);
  }
}
