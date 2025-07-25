import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { ApiError } from "@shared/interfaces/api-response.interface";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`).pipe(catchError(this.handleError));
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data).pipe(catchError(this.handleError));
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data).pipe(catchError(this.handleError));
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "Ha ocurrido un error inesperado";

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 0) {
      errorMessage = "No se pudo conectar con el servidor";
    } else if (error.status === 404) {
      errorMessage = "Recurso no encontrado";
    } else if (error.status === 500) {
      errorMessage = "Error interno del servidor";
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error ${error.status}: ${error.statusText}`;
    }

    const apiError: ApiError = {
      message: errorMessage,
      status: error.status,
    };

    return throwError(() => apiError);
  }
}
