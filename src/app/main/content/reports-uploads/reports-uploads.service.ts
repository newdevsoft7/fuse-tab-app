import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';

import { environment } from '../../../../environments/environment';
import { SCMessageService } from '../../../shared/services/sc-message.service';

const BASE_URL = `${environment.apiUrl}`;

@Injectable()
export class ReportsUploadsService {

  onFilesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onFileSelected: BehaviorSubject<any> = new BehaviorSubject([]);
  folders: any[] = []; // Save folder tree in top-down order

  constructor(
    private http: HttpClient,
    private scMessageService: SCMessageService
  ) { }

  getFiles(file: any | 'up' = {}): Promise<any> {
    if (file === 'up') {
      this.folders.pop();
      file = this.folders[this.folders.length - 1];
    } else {
      this.folders.push(file);
    }
    const folder = _.isNil(file.folder) ? '' : file.folder;
    const id = _.isNil(file.id) ? '' : file.id;
    const url = `${BASE_URL}/reportsUploads/fileManager/${folder}/${id}`;
    return new Promise((resolve, reject) => {
      this.onFileSelected.next([file]);
      this.http.get(url.replace(/\/+$/, ''))
        .subscribe((response: any) => {
          resolve(response);
          this.onFilesChanged.next(response);
        }, reject);
    });
  }

  getShifts(trackingId, date, q = ''): Promise<any> {
    const url = `${BASE_URL}/autocomplete/tracking/${trackingId}/shifts/${date}/${q}`;
    return this.http.get(url.replace(/\/+$/, '')).toPromise();
  }

  reportsUploads(body): Promise<any> {
    const url = `${BASE_URL}/reportsUploads/upload`;
    return this.http.post(url, body).toPromise();
  }

  reportsUploadsApprove(type, id, set = 1): Promise<any> {
    const url = `${BASE_URL}/reportsUploads/approve/${type}/${id}/${set}`;
    return this.http.put(url, {}).toPromise();
  }

  deleteCompletedReport(id): Promise<any> {
    const url = `${BASE_URL}/report/completed/${id}`;
    return this.http.delete(url).toPromise();
  }

  deleteFile(fileId: number, fileType = 'file'): Promise<any> {
    const url = `${BASE_URL}/file/${fileType}/${fileId}`;
    return this.http.delete(url).toPromise();
  }

  downloadReports(ids, type = 'csv') {
    const url = `${BASE_URL}/reportsUploads/reports/${ids.join(',')}/${type}`;
    return this.http.get(url, { observe: 'response', responseType: 'blob' }).toPromise()
      .then(res => this.downloadFile(res['body'], 'reports.csv'))
      .catch(e => this.scMessageService.error(e));
  }

  downloadZip(params: {
    file_ids: number[],
    report_ids: number[]
  }) {
    const url = `${BASE_URL}/reportsUploads/download`;
    return this.http.post(url, params, { observe: 'response', responseType: 'blob'}).toPromise()
      .then(res => this.downloadFile(res['body']))
      .catch(e => this.scMessageService.error(e));
  }

  downloadFile(data, filename = null) {
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(data);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    if (filename) {
      dwldLink.setAttribute("download", filename);
    }
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

}
