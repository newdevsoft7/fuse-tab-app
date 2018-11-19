import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import * as _ from 'lodash';

const baseUrl = `${environment.apiUrl}`;

export enum Type {
  user = 'user',
  ratings = 'ratings',
  elements = 'elements',
  reports = 'reports',
  attributes = 'attributes',
  workareas = 'workareas'
}

@Injectable()
export class FilterService {

  private promises;

  readonly type = Type;

  constructor(
    private http: HttpClient
  ) {
    this.promises = {};
  }

  clean(type: string) {
    this.promises[type] = null;
  }

  async getUserFilter(query: string, userSearch = 1): Promise<any[]> {
    try {
      let data = [];

      if (query.indexOf('near:') === 0) {
        data = await this.http.get<any[]>(`${baseUrl}/users/filter/${query}`).toPromise();
        return data;
      }

      const [users, workareas] = await Promise.all([
        this.getUsers(),
        this.getWorkareas()
      ]);

      // videos
      if ('videos'.indexOf(query) > -1) {
        data.push({
          id: 'videos',
          text: 'Has videos'
        });
      }

      if ('new'.indexOf(query) > -1
        || 'existing'.indexOf(query) > -1
        || 'interviewed'.indexOf(query) > -1
        || query === '') {
        const children = [];
        if ('new'.indexOf(query) > -1 || query === '') {
          children.push({
            id: 'ustat:=:New',
            text: 'New'
          });
        }
        if ('existing'.indexOf(query) > -1 || query === '') {
          children.push({
            id: 'ustat:=:Existing',
            text: 'Existing'
          });
        }
        if ('interviewed'.indexOf(query) > -1 || query === '') {
          children.push({
            id: 'ustat:=:Interviewed',
            text: 'Interviewed'
          });
        }
        data.push({
          children,
          text: 'Status'
        });
      }

      // workareas
      if (query.length) {
        const children = [];
        workareas.filter(w => w.aname && w.aname.toLowerCase().indexOf(query) > -1)
          .forEach(s => children.push(...[
            {
              id: `wa:=:${s.id}`,
              text: s.aname
            },
            {
              id: `wa:!=:${s.id}`,
              text: `Not ${s.aname}`
            }
          ]));
        if (children.length) {
          data.push({
            children,
            text: 'Work Area'
          });
        }
      }

      // user mobile, email, name
      if (userSearch && query.length > 3) {
        if ('videos'.indexOf(query) < 0) {
          data.push({
            id: `search:=:${query}`,
            text: `Search for "${query}"`
          });
        }

        if (!_.isNaN(+query)) { // mobile
          const children = users.filter(u => u.mob && u.mob.toString().indexOf(query) > -1)
            .map(u => ({id: `user:=:${u.id}`, text: `${u.fname} ${u.lname} - ${u.mob}`}));
          if (children.length) {
            data.push({
              children,
              text: 'User'
            });
          }
        } else if (query.indexOf('@') > 0) { // email
          const children = users.filter(u => u.email && u.email.toLowerCase().indexOf(query) > -1)
            .map(u => ({ id: `user:=:${u.id}`, text: `${u.fname} ${u.lname} - ${u.email}` }));
          if (children.length) {
            data.push({
              children,
              text: 'User'
            });
          }
        } else { // name
          const children = users.filter(u => `${u.fname} ${u.lname}`.toLowerCase().indexOf(query) > -1)
            .map(u => ({ id: `user:=:${u.id}`, text: `${u.fname} ${u.lname}` }));
          if (children.length) {
            data.push({
              children,
              text: 'User'
            });
          }
        }


      }

      const more = await this.getRoleRequirementsFilter(query, true);
      data.push(...more);
      return data;
    } catch (e) {
      return [];
    }
  }

  async getRoleRequirementsFilter(query: string, userSearch = false): Promise<any[]> {
    try {
      const [attributes, ratings, elements, reports] = await Promise.all([
        this.getAttributes(),
        this.getRatings(),
        this.getProfileElements(),
        this.getReports()
      ]);

      const data = [];
      let dbQuery = query;
      let operator = '';
      let val = '';

      const operatorPos = this.strposArray(query, ['<', '>', '=']);
      if (operatorPos !== false) {
        dbQuery = query.substr(0, operatorPos);
        operator = query[operatorPos];
        val = query.substr(operatorPos + 1);
      }

      // Sex
      if (query === '' || 'male'.indexOf(query) > -1 || 'female'.indexOf(query) > -1) {
        const children = [];
        if ('male'.indexOf(query) > -1 || query === '') {
          children.push({
            id: 'sex::=:male',
            text: 'Male'
          });
        }
        if ('female'.indexOf(query) > -1 || query === '') {
          children.push({
            id: 'sex::=:female',
            text: 'Female'
          });
        }
        if (children.length) {
          data.push({
            children,
            text: 'Sex'
          });
        }
      }

      // Age
      if ('age>'.indexOf(query) > -1 || 'age<'.indexOf(query) > -1 || query === '') {
        const children = [];
        if ('age>'.indexOf(query) > -1 || query === '') {
          children.push(...[
            { id: 'age::>:18', text: 'Age > 18' },
            { id: 'age::>:19', text: 'Age > 19' },
            { id: 'age::>:20', text: 'Age > 20' },
            { id: 'age::>:21', text: 'Age > 21' },
            { id: 'age::>:22', text: 'Age > 22' },
            { id: 'age::>:23', text: 'Age > 23' },
            { id: 'age::>:24', text: 'Age > 24' },
            { id: 'age::>:25', text: 'Age > 25' },
            { id: 'age::>:26', text: 'Age > 26' },
            { id: 'age::>:27', text: 'Age > 27' },
            { id: 'age::>:28', text: 'Age > 28' },
            { id: 'age::>:29', text: 'Age > 29' },
            { id: 'age::>:30', text: 'Age > 30' },
            { id: 'age::>:31', text: 'Age > 31' },
            { id: 'age::>:32', text: 'Age > 32' },
            { id: 'age::>:33', text: 'Age > 33' },
            { id: 'age::>:34', text: 'Age > 34' },
            { id: 'age::>:35', text: 'Age > 35' },
            { id: 'age::>:36', text: 'Age > 36' },
            { id: 'age::>:37', text: 'Age > 37' },
            { id: 'age::>:38', text: 'Age > 38' },
            { id: 'age::>:39', text: 'Age > 39' },
            { id: 'age::>:40', text: 'Age > 40' },
            { id: 'age::>:41', text: 'Age > 41' },
            { id: 'age::>:42', text: 'Age > 42' },
            { id: 'age::>:43', text: 'Age > 43' },
            { id: 'age::>:44', text: 'Age > 44' },
            { id: 'age::>:45', text: 'Age > 45' },
            { id: 'age::>:46', text: 'Age > 46' },
            { id: 'age::>:47', text: 'Age > 47' },
            { id: 'age::>:48', text: 'Age > 48' },
            { id: 'age::>:49', text: 'Age > 49' },
            { id: 'age::>:50', text: 'Age > 50' }
          ]);
        }
        if ('age<'.indexOf(query) > -1 || query === '') {
          children.push(...[
            { id: 'age::<:50', text: 'Age < 50' },
            { id: 'age::<:49', text: 'Age < 49' },
            { id: 'age::<:48', text: 'Age < 48' },
            { id: 'age::<:47', text: 'Age < 47' },
            { id: 'age::<:46', text: 'Age < 46' },
            { id: 'age::<:45', text: 'Age < 45' },
            { id: 'age::<:44', text: 'Age < 44' },
            { id: 'age::<:43', text: 'Age < 43' },
            { id: 'age::<:42', text: 'Age < 42' },
            { id: 'age::<:41', text: 'Age < 41' },
            { id: 'age::<:40', text: 'Age < 40' },
            { id: 'age::<:39', text: 'Age < 39' },
            { id: 'age::<:38', text: 'Age < 38' },
            { id: 'age::<:37', text: 'Age < 37' },
            { id: 'age::<:36', text: 'Age < 36' },
            { id: 'age::<:35', text: 'Age < 35' },
            { id: 'age::<:34', text: 'Age < 34' },
            { id: 'age::<:33', text: 'Age < 33' },
            { id: 'age::<:32', text: 'Age < 32' },
            { id: 'age::<:31', text: 'Age < 31' },
            { id: 'age::<:30', text: 'Age < 30' },
            { id: 'age::<:29', text: 'Age < 29' },
            { id: 'age::<:28', text: 'Age < 28' },
            { id: 'age::<:27', text: 'Age < 27' },
            { id: 'age::<:26', text: 'Age < 26' },
            { id: 'age::<:25', text: 'Age < 25' },
            { id: 'age::<:24', text: 'Age < 24' },
            { id: 'age::<:23', text: 'Age < 23' },
            { id: 'age::<:22', text: 'Age < 22' },
            { id: 'age::<:21', text: 'Age < 21' },
            { id: 'age::<:20', text: 'Age < 20' },
            { id: 'age::<:19', text: 'Age < 19' },
            { id: 'age::<:18', text: 'Age < 18' }
          ]);
        }
        if (children.length) {
          data.push({
            children,
            text: 'Age'
          });
        }
      }

      if (query.length) {
        // attributes
        const attrs = attributes.filter(attr => attr.aname && attr.aname.toLowerCase().indexOf(query) > -1);
        if (attrs.length) {
          const children = [];
          attrs.forEach(attr => children.push(...[
            {
              id: `attribute:${attr.id}:=:1`,
              text: `${attr.aname}: Yes`
            },
            {
              id: `attribute:${attr.id}:!=:1`,
              text: `${attr.aname}: No`
            }
          ]));
          data.push({
            children,
            text: 'Skills & Qualifications'
          });
        }

        // custom ratings
        const rats = ratings.filter(rat => rat.rname && rat.rname.toLowerCase().indexOf(query) > -1);
        if (rats.length || 'performance'.indexOf(query) > -1) {
          const children = [];
          rats.forEach(rat => {
            if (operator === '' || operator === '>') {
              children.push(...[
                { id: `rating:${rat.id}:>:0`, text: `${rat.rname}> 0` },
                { id: `rating:${rat.id}:>:2`, text: `${rat.rname}> 1` },
                { id: `rating:${rat.id}:>:4`, text: `${rat.rname}> 2` },
                { id: `rating:${rat.id}:>:6`, text: `${rat.rname}> 3` },
                { id: `rating:${rat.id}:>:8`, text: `${rat.rname}> 4` }
              ]);
            }
            if (userSearch && (operator === '' || operator === '<')) {
              children.push(...[
                { id: `rating:${rat.id}:<:10`, text: `${rat.rname}< 5` },
                { id: `rating:${rat.id}:<:8`, text: `${rat.rname}< 4` },
                { id: `rating:${rat.id}:<:6`, text: `${rat.rname}< 3` },
                { id: `rating:${rat.id}:<:4`, text: `${rat.rname}< 2` },
                { id: `rating:${rat.id}:<:2`, text: `${rat.rname}< 1` }
              ]);
            }
          });

          // performances
          if ('performance>'.indexOf(query) > -1) {
            children.push(...[
              { id: 'performance::>:0', text: 'Performance > 0' },
              { id: 'performance::>:2', text: 'Performance > 1' },
              { id: 'performance::>:4', text: 'Performance > 2' },
              { id: 'performance::>:6', text: 'Performance > 3' },
              { id: 'performance::>:8', text: 'Performance > 4' },
            ]);
          }

          if (userSearch && 'performance<'.indexOf(query) > -1) {
            children.push(...[
              { id: 'performance::<:10', text: 'Performance < 5' },
              { id: 'performance::<:8', text: 'Performance < 4' },
              { id: 'performance::<:6', text: 'Performance < 3' },
              { id: 'performance::<:4', text: 'Performance < 2' },
              { id: 'performance::<:2', text: 'Performance < 1' }
            ]);
          }
          data.push({
            children,
            text: 'Ratings'
          });
        }

        // profile elements range
        let pEs = elements.filter(e => {
          return e.etype === 'list' && e.filter === 'range' && e.deletable == 1 && e.ename.toLowerCase().indexOf(dbQuery) > -1;
        });
        if (pEs.length) {
          pEs.forEach(pE => {
            const children = [];
            const lOs = _.orderBy(pE.profile_list_options, 'display_order');
            lOs.forEach(lO => {
              if (operator === '' || operator === '>') {
                if (val === '' || lO.option.indexOf(val) > -1) {
                  children.push({
                    id: `profile_element:${pE.id}:>:${lO.display_order}`,
                    text: `> ${lO.option}`
                  });
                }
              }
            });
            lOs.reverse().forEach(lO => {
              if (operator === '' || operator === '<') {
                if (val === '' || lO.option.indexOf(val) > -1) {
                  children.push({
                    id: `profile_element:${pE.id}:<:${lO.display_order}`,
                    text: `< ${lO.option}`
                  });
                }
              }
            });
            data.push({
              children,
              text: pE.ename
            });
          });
        }

        // profile elements equals
        pEs = elements.filter(e => {
          return e.etype === 'list' && e.filter === 'equals' && e.deletable == 1 && e.ename.toLowerCase().indexOf(dbQuery) > -1;
        });
        if (pEs.length) {
          pEs.forEach(pE => {
            const children = [];
            const lOs = _.orderBy(pE.profile_list_options, 'display_order');
            lOs.forEach(lO => {
              if (operator === '' || operator === '=') {
                if (val === '' || lO.option.indexOf(val) > -1) {
                  children.push({
                    id: `profile_element:${pE.id}:=:${lO.id}`,
                    text: lO.option
                  });
                }
              }
            });
            data.push({
              children,
              text: pE.ename
            });
          });
        }

        // quizs
        const qs = reports.filter(r => r.type === 'quiz' && r.rname.toLowerCase().indexOf(query) > -1);
        if (qs.length) {
          const children = [];
          qs.forEach(q => {
            if (operator === '' || operator === '>') {
              children.push(...[
                { id: `quiz:${q.id}:>:0`, text: `${q.rname}: Completed` },
                { id: `quiz:${q.id}:>:50`, text: `${q.rname}: Score > 50%` },
                { id: `quiz:${q.id}:>:75`, text: `${q.rname}: Score > 75%` },
                { id: `quiz:${q.id}:>:90`, text: `${q.rname}: Score > 90%` },
                { id: `quiz:${q.id}:>:100`, text: `${q.rname}: Perfect score`}
              ]);
            }
            if (userSearch && (operator === '' || operator === '<')) {
              children.push(...[
                { id: `quiz:${q.id}:<:100`, text: `${q.rname}: Score < 100%` },
                { id: `quiz:${q.id}:<:75`, text: `${q.rname}: Score < 75%` },
                { id: `quiz:${q.id}:<:50`, text: `${q.rname}: Score < 50%` },
                { id: `quiz:${q.id}:<:25`, text: `${q.rname}: Score < 25%` },
                { id: `quiz:${q.id}:<:0`, text: `${q.rname}: Not Completed` }
              ]);
            }
          });
          data.push({
            children,
            text: 'Quizs'
          });
        }
      }

      return data;
    } catch (e) {
      return [];
    }
  }

  private getUsers(): Promise<any> {
    if (!this.promises.user) {
      this.promises.user = this.http.get(`${baseUrl}/users`).toPromise();
    }
    return this.promises.user;
  }

  private getRatings(): Promise<any> {
    if (!this.promises.ratings) {
      this.promises.ratings = this.http.get(`${baseUrl}/rating`).toPromise();
    }
    return this.promises.ratings;
  }

  private getProfileElements(): Promise<any> {
    if (!this.promises.elements) {
      this.promises.elements = this.http.get(`${baseUrl}/profileStructure/elements`).toPromise();
    }
    return this.promises.elements;
  }

  private getReports(): Promise<any> {
    if (!this.promises.reports) {
      this.promises.reports = this.http.get(`${baseUrl}/reports/all`).toPromise();
    }
    return this.promises.reports;
  }

  private getAttributes(): Promise<any> {
    if (!this.promises.attributes) {
      this.promises.attributes = this.http.get(`${baseUrl}/attribute`).toPromise();
    }
    return this.promises.attributes;
  }

  private getWorkareas(): Promise<any> {
    if (!this.promises.workareas) {
      this.promises.workareas = this.http.get(`${baseUrl}/workArea`).toPromise();
    }
    return this.promises.workareas;
  }

  private strposArray(haystack, needle) {
    needle = _.cloneDeep(needle);
    if (!Array.isArray(needle)) {
      needle = new Array(needle);
    }
    for (const what of needle) {
      const pos = haystack.indexOf(what);
      if (pos > -1) {
        return pos;
      }
    }
    return false;
  }

}
