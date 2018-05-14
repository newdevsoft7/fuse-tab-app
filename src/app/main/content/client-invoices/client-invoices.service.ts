import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ClientInvoicesService {
  constructor(private http: HttpClient) {}
}
