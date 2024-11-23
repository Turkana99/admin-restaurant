import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TablesService {
  constructor(private http: HttpClient) {}
  getTables(pageSize: number, pageIndex: number): Observable<any> {
    const params = new HttpParams()
      .set('PageSize', pageSize.toString())
      .set('PageIndex', pageIndex.toString());
    return this.http.get<any>(environment.diningTables, { params });
  }

  addTable(request: any): Observable<any> {
    return this.http.post<any>(environment.diningTables, request);
  }

  editTable(request: any): Observable<any> {
    return this.http.put<any>(environment.diningTables, request);
  }

  getTableWithId(id: number) {
    return this.http.get<any>(`${environment.diningTables}/${id}`);
  }

  deleteTable(id: number) {
    return this.http.delete<any>(`${environment.diningTables}/${id}`);
  }

  //   filterCountry(request: any): Observable<any> {
  //     return this.http.post<any>(
  //       `${environment.cart}/GetList/ByDynamic`,
  //       request
  //     );
  //   }
}
