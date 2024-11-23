import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CabinetComponent } from './cabinet.component';
import { MainComponent } from './components/main/main.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { SubCategoriesComponent } from './components/sub-categories/sub-categories.component';
import { CartsComponent } from './components/carts/carts.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductsComponent } from './components/products/products.component';
import { TablesComponent } from './components/tables/tables.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  {
    path: '',
    component: CabinetComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'categories',
      },
      {
        path: 'categories',
        component: CategoriesComponent,
      },
      {
        path: 'sub-categories',
        component: SubCategoriesComponent,
      },
      {
        path: 'carts',
        component: CartsComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'tables',
        component: TablesComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CabinetRoutingModule {}
