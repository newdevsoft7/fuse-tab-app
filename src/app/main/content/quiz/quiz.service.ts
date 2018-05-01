import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

const QUIZ_URL = `${environment.apiUrl}/quiz`;

@Injectable()
export class QuizService {
  constructor(
    private http: HttpClient
  ) {}

}
