import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  /**
   * @param credentials - Um objeto { email, senha }
   */
  login(credentials: any): Observable<any> {
    
    return this.http.post(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response: any) => {
          
          if (response && response.access_token) {
            localStorage.setItem('access_token', response.access_token);
            console.log('Token salvo no localStorage!');
          }
        })
      );
  }
  logout(): void {
    localStorage.removeItem('access_token');
    console.log('Token removido.');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}