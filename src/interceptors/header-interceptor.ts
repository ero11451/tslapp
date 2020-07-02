import { Storage } from '@ionic/storage';
import { LocalStorageKey } from '../app/config/app.constants';
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokenPromise = this.getToken();
    return Observable.fromPromise(tokenPromise)
      .mergeMap(token => {
        console.log(req.url);
        if (!req.url.includes('googleapis')) {
          const headers = req.headers
            .set("Authorization", `Bearer ${token}`);
          const authReq = req.clone({ headers });
          return next.handle(authReq);
        }
        return next.handle(req);
      });
  }

  getToken(): Promise<string> {

    return this.injector.get(Storage).get(LocalStorageKey.accessToken);
  }

}
