import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';

import { Subject } from 'rxjs/Subject';
import { SCMessageService } from '@shared/services/sc-message.service';
import { environment } from '@environments/environment';

const BASE_URL = `${environment.apiUrl}`;

export interface Payload {
  folder?: string;
  id?: number;
  from?: string;
  to?: string;
}

@Injectable()
export class ReportsUploadsService {

  onFilesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onFileSelected: BehaviorSubject<any> = new BehaviorSubject([]);
  onPeriodChanged: Subject<any> = new Subject();
  folders: any[] = []; // Save folder tree in top-down order

  folder: any;
  id: any;
  period: any;

  constructor(
    private http: HttpClient,
    private scMessageService: SCMessageService
  ) {
    this.onPeriodChanged.subscribe(({ from, to }) => {
      this.period = {
        from,
        to
      };
      this.getFilesByDate();
    });
  }

  getFiles(file: any | 'up' = {}, period: any): Promise<any> {
    if (file === 'up') {
      this.folders.pop();
      file = this.folders[this.folders.length - 1];
    } else {
      this.folders.push(file);
    }
    this.folder = file.folder;
    this.id = file.id;

    const payload: Payload = this.makePayloadForFileList(period);
    const url = `${BASE_URL}/reportsUploads/fileManager`;
    return new Promise((resolve, reject) => {
      this.onFileSelected.next([file]);
      this.http.post(url, payload)
        .subscribe((response: any) => {
          resolve(response);
          this.onFilesChanged.next(response);
        }, reject);
    });
  }

  async getFilesByDate() {
    try {
      const payload: Payload = this.makePayloadForFileList(this.period);
      const url = `${BASE_URL}/reportsUploads/fileManager`;
      const res = await this.http.post(url, payload).toPromise();
      this.onFilesChanged.next(res);
    } catch (e) {
      this.scMessageService.error(e);
    }
  }

  private makePayloadForFileList(period): Payload {
    const payload: Payload = {};
    if (this.folder !== null) {
      payload.folder = this.folder;
    }
    if (this.id !== null) {
      payload.id = this.id;
    }
    if (period) {
      if (period.from) {
        payload.from = moment(period.from).format('YYYY-MM-DD');
      }
      if (period.to) {
        payload.to = moment(period.to).format('YYYY-MM-DD');
      }
    }
    return payload;
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

  downloadReports(ids) {
    const url = `${BASE_URL}/reportsUploads/reports/${ids.join(',')}`;
    return this.http.get(url, { observe: 'response', responseType: 'blob' }).toPromise()
      .then(res => this.downloadFile(res['body'], 'reports.xlsx'))
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
