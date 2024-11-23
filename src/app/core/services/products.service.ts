import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}
  getProducts(pageSize: number, pageIndex: number): Observable<any> {
    const params = new HttpParams()
      .set('PageSize', pageSize.toString())
      .set('PageIndex', pageIndex.toString());
    return this.http.get<any>(environment.product, { params });
  }

  addProduct(request: any): Observable<any> {
    return this.http.post<any>(environment.product, request);
  }

  editProduct(request: any): Observable<any> {
    return this.http.put<any>(environment.product, request);
  }

  getProductWithId(id: number) {
    return this.http.get<any>(`${environment.product}/${id}`);
  }

  deleteProduct(id: number) {
    return this.http.delete<any>(`${environment.product}/${id}`);
  }

  //   filterCountry(request: any): Observable<any> {
  //     return this.http.post<any>(
  //       `${environment.cart}/GetList/ByDynamic`,
  //       request
  //     );
  //   }
}
