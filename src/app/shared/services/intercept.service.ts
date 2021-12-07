// Angular
import {Injectable} from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
// RxJS
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

/**
 * More information there => https://medium.com/@MetonymyQT/angular-http-interceptors-what-are-they-and-how-to-use-them-52e060321088
 */
@Injectable()
export class InterceptService implements HttpInterceptor {
    // intercept request and add token
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // tslint:disable-next-line:no-
        // modify request
        ///OS Change Set
        ///// Interceptor Profile Picture
        if (
            !request.url.includes('Document/SubmitDocument') &&
            !request.url.includes('Land/LandDataUpload') &&
            !request.url.includes('Customer/MarkAsDeceasedCustomer') &&
            !request.url.includes('SeedKhadVendor/AddUpdateVendor') &&
            !request.url.includes('LoanUtilization/UploadUtlization')
        ) {
            request = request.clone({
                setHeaders: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',

                    //Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                },
            });
        }

        //
        //
        //

        return next.handle(request).pipe(
            tap(
                (event) => {
                    if (event instanceof HttpResponse) {
                        //
                        // http response status code
                        //
                    }
                },
                (error) => {
                    //
                }
            )
        );
    }
}
