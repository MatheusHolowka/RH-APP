import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessoService {
  private http = inject(HttpClient);
  
  // URL da nossa API NestJS
  private apiUrl = 'http://localhost:3000/processo'; 

  getProcessos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // --- ADICIONE ESTE MÉTODO ---
  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}