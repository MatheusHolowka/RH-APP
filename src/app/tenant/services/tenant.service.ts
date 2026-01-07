import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private apiUrl = 'http://localhost:3000/tenant'; // URL da API de Tenant
  private http = inject(HttpClient);

  // Note que este serviço precisará de um token de ADMIN
  // Mas, para o registro, vamos assumir que o 'create' é público
  // (Precisamos ajustar isso no backend depois!)
  create(data: { nomeEmpresa: string }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}