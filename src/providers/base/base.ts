import { BaseModel } from './../../models/baseModel';
import { API_URL } from './../../app/config/app.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/timeoutWith';

/*
  Generated class for the BaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BaseProvider {
  private baseUrl: string;
  private _actionUrl: string;
  private timeOut: number;

  constructor(public http: HttpClient) {
    this.baseUrl = API_URL;
    this.timeOut = 60000;
  }


  public get<T>() {
    return this.http.get<BaseModel<T>>(`${this.baseUrl}${this.actionUrl}`)
      .timeoutWith(this.timeOut, this.handleTimeout());

  }

  public getAllPaginate<T>(pageNumber = 0): Observable<BaseModel<T>> {
    return this.http.get<BaseModel<T>>(`${this.baseUrl}${this.actionUrl}?PageNumber=${pageNumber}`)
      .timeoutWith(this.timeOut, this.handleTimeout());

  }

  public getById<T>(id: number): Observable<BaseModel<T>> {
    return this.http.get<BaseModel<T>>(`${this.baseUrl}${this.actionUrl}/${id}`)
      .timeoutWith(this.timeOut, this.handleTimeout());

  }

  public getByUser<T>(id: number, pageNumber = 0): Observable<BaseModel<T>> {
    return this.http.get<BaseModel<T>>(`${this.baseUrl}${this.actionUrl}getbyuser/${id}?PageNumber=${pageNumber}`)
      .timeoutWith(this.timeOut, this.handleTimeout());

  }
  public getByUserId<T>(id: number, pageNumber = 0, param = ''): Observable<BaseModel<T>> {
    return this.http.get<BaseModel<T>>(`${this.baseUrl}${this.actionUrl}getbyuserid/${id}?PageNumber=${pageNumber}&${param}`)
      .timeoutWith(this.timeOut, this.handleTimeout());

  }

  public getByProject<T>(id: number, pageNumber = 0): Observable<BaseModel<T>> {
    return this.http.get<BaseModel<T>>(`${this.baseUrl}${this.actionUrl}getbyproject/${id}?PageNumber=${pageNumber}`)
      .timeoutWith(this.timeOut, this.handleTimeout());

  }

  public post<T>(input: any): Observable<BaseModel<T>> {
    return this.http.post<BaseModel<T>>(`${this.baseUrl}${this.actionUrl}`, input)
      .timeoutWith(this.timeOut, this.handleTimeout());
  }
  public update<T>(id: string, data: any): Observable<BaseModel<T>> {
    // const data = JSON.stringify(itemToUpdate);

    return this.http.put<BaseModel<T>>(`${this.baseUrl}${this.actionUrl}/${id}`, data)
      .timeoutWith(this.timeOut, this.handleTimeout());

  }

  public delete<T>(id: number): Observable<BaseModel<T>> {
    return this.http.delete<BaseModel<T>>(`${this.baseUrl}${this.actionUrl}id`)
      .timeoutWith(this.timeOut, this.handleTimeout());

  }

  public setActionUrl(actionUrl: string, path = '') {
    this._actionUrl = `${actionUrl}${path}`;
  }
  public get actionUrl(): string {
    return this._actionUrl;
  }
  public set actionUrl(value: string) {
    this._actionUrl = value;
  }

  private handleTimeout<T>(): Observable<BaseModel<T>> {
    return new Observable(obs => obs.error({ error: { message: 'Request timed out' } }));
  }
}
