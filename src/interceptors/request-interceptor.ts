import { Events } from 'ionic-angular';
import { BaseProvider } from './../providers/base/base';
import { Storage } from '@ionic/storage';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { LocalStorageKey } from '../app/config/app.constants';
@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  newToken: any;
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  constructor(private event: Events, private api: BaseProvider, private injector: Injector) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          console.error('Intercept error occurred:', error.error);

          if (error.status === 401) {
            if (this.refreshTokenInProgress) {
              return this.refreshTokenSubject
                .filter(result => result !== null)
                .take(1)
                .switchMap(() => next.handle(this.addAuthenticationToken(req)));
            } else {
              this.refreshTokenInProgress = true;

              // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
              this.refreshTokenSubject.next(null);

              return this.refreshTokens()
                .switchMap((res) => {
                  this.storeTokens(res.data)
                  //When the call to refreshToken completes we reset the refreshTokenInProgress to false
                  // for the next time the token needs to be refreshed
                  this.refreshTokenInProgress = false;
                  this.refreshTokenSubject.next(res.data.token);
                  this.newToken = res.data.token;
                  return next.handle(this.addAuthenticationToken(req));
                })
                .catch((error: any) => {
                  this.refreshTokenInProgress = false;
                  this.event.publish("auth:logout");
                  return Observable.throw(error);
                });
            }
          }
        }
        // return an observable with a user-facing error message
        return Observable.throw(
          { ...error });
      })
    )

  }

  getToken(): Promise<string> {
    return this.injector.get(Storage).get(LocalStorageKey.accessToken);
  }

  refreshTokens() {
    return Observable.fromPromise(this.injector.get(Storage).get(LocalStorageKey.refreshToken))
      .mergeMap(refreshToken => {
        if (refreshToken) {
          this.api.setActionUrl("/auth", '/token');
          return this.api.post<any>({ refreshToken });
        }
        Observable.throw("Refresh token not found");
      })
  }

  storeTokens(data) {
    this.newToken = data.token;
    this.injector.get(Storage).set(LocalStorageKey.accessToken, data.token);
    this.injector.get(Storage).set(LocalStorageKey.refreshToken, data.refreshToken);
  }

  addAuthenticationToken(req) {
    const headers = req.headers
      .set("Authorization", `Bearer ${this.newToken}`);
    const authReq = req.clone({ headers });
    return authReq;
  }
}
