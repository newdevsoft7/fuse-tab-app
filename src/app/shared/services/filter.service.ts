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
  workareas = 'workareas',
  shiftStatuses = 'shiftStatuses',
  shifts = 'shifts',
  trackingCategories = 'trackingCategories',
  trackingOptions = 'trackingOptions',
  clients = 'clients',
  outsourceCompanies = 'outsourceCompanies',
  locations = 'locations',
  profileCategories = 'pCategories'
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
      query = query.trim().toLowerCase();

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

      query = query.trim().toLowerCase();
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

  async getShiftFilters(fromDate, toDate, query = ''): Promise<any> {
    try {
      const [
        shiftStatuses,
        shifts,
        workareas,
        trackingCategories,
        trackingOptions,
        clients,
        users,
        outsourceCompanies
      ] = await Promise.all([
        this.getShiftStatuses(),
        this.getShifts(fromDate, toDate),
        this.getWorkareas(),
        this.getTrackingCategories(),
        this.getTrackingOptions(),
        this.getClients(),
        this.getUsers(),
        this.getOutsourceCompanies()
      ]);

      const data = [];
      query = query.trim().toLowerCase();

      if ('deleted'.indexOf(query) > -1 || query === '') {
        data.push({
          id: 'deleted',
          text: 'Deleted'
        });
      }

      if ('no work area'.indexOf(query) > -1 || query === '') {
        data.push({
          id: 'noWorkArea',
          text: 'No Work Area Assigned'
        });
      }

      if (query.length) {

        // shift status
        const filteredShiftStatuses = shiftStatuses.filter(s => s.status.toLowerCase().indexOf(query) > -1);
        if (filteredShiftStatuses.length) {
          const children = []
          filteredShiftStatuses.forEach(s => {
            children.push(...[
              {
                id: `shift_status_id:=:${s.id}`,
                text: s.status
              },
              {
                id: `shift_status_id:!=:${s.id}`,
                text: `Not ${s.status}`
              }
            ]);
          });
          data.push({
            children,
            text: 'Status'
          });
        }

        // location
        if (query.length > 2) {
          const children = [];
          shifts.filter(s => s.location && s.location.toLowerCase().indexOf(query) > -1)
            .forEach(s => {
              children.push({
                id: `location:=:${s.location}`,
                text: s.location
              });
            });
          if (children.length) {
            data.push({
              children,
              text: 'Location'
            });
          }
        }

        // work area
        if (query.length > 2) {
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

        // tracking
        if (query.length > 2) {
          trackingCategories.forEach(cat => {
            const children = [];
            trackingOptions.filter(option => {
              return option.tracking_cat_id == cat.id && option.oname && option.oname.toLowerCase().indexOf(query) > -1;
            }).forEach(option => {
              children.push(...[
                {
                  id: `tracko:=:${option.id}`,
                  text: option.oname
                },
                {
                  id: `tracko:!=:${option.id}`,
                  text: `Not ${option.oname}`
                }
              ]);
            });
            if (children.length) {
              data.push({
                children,
                text: cat.cname
              });
            }
          });
        }

        // clients
        if (query.length > 2) {
          const children = [];
          clients.filter(c => c.cname && c.cname.toLowerCase().indexOf(query) > -1)
            .forEach(c => {
              children.push(...[
                {
                  id: `client_id:=:${c.id}`,
                  text: c.cname
                },
                {
                  id: `client_id:!=:${c.id}`,
                  text: `Not ${c.cname}`
                }
              ]);
            });
          if (children.length) {
            data.push({
              children,
              text: 'Client'
            });
          }
        }

        // manager
        if (query.length > 2) {
          const children = [];
          users.filter(user => {
            return user.active === 'active' && ['owner', 'admin'].indexOf(user.lvl) > -1 && `${user.fname} ${user.lname}`.toLowerCase().indexOf(query) > -1;
          }).forEach(user => {
            children.push(...[
              {
                id: `man:=:${user.id}`,
                text: `${user.fname} ${user.lname}`
              },
              {
                id: `man:!=:${user.id}`,
                text: `Not ${user.fname} ${user.lname}`
              }
            ]);
          });
          if (children.length) {
            data.push({
              children,
              text: 'Manager'
            });
          }
        }

        // outsource company
        if (query.length > 2) {
          const children = [];
          outsourceCompanies.filter(c => c.cname && c.cname.toLowerCase().indexOf(query) > -1)
            .forEach(c => {
              children.push(...[
                {
                  id: `outsource_company_id:=:${c.id}`,
                  text: c.cname
                },
                {
                  id: `outsource_company_id:!=:${c.id}`,
                  text: `Not ${c.cname}`
                }
              ]);
            });
          if (children.length) {
            data.push({
              children,
              text: 'Outsource Company'
            });
          }
        }

        // selected staff
        if (query.length > 2) {
          const children = [];
          users.filter(user => {
            return user.active === 'active' && ['owner', 'admin'].indexOf(user.lvl) > -1 && `${user.fname} ${user.lname}`.toLowerCase().indexOf(query) > -1;
          }).forEach(user => {
            children.push({
              id: `selected:=:${user.id}`,
              text: `${user.fname} ${user.lname}`
            });
          });
          if (children.length) {
            data.push({
              children,
              text: 'Selected'
            });
          }
        }
      }

      return data;

    } catch (e) {
      return [];
    }
  }

  async getUserFilterByLevel(level, query = ''): Promise<any[]> {
    try {
      query = query.trim().toLowerCase();
      const users = await this.getUsers();
      let filteredUsers = users.filter(u => u.lvl === level && u.active === 'active')
        .map(u => {
          u.name = `${u.fname} ${u.lname}`;
          return u;
        });
      if (query.length) {
        filteredUsers = filteredUsers.filter(u => u.name.toLowerCase().indexOf(query) > -1);
      }
      return filteredUsers;
    } catch (e) {
      return [];
    }
  }

  async getReportFilter(type, query: string): Promise<any> {
    try {
      query = query.trim().toLowerCase();
      let reports = await this.getReports();
      reports = reports.filter(r => r.type.toLowerCase() === type);
      if (query.length) {
        reports = reports.filter(r => r.rname.toLowerCase().indexOf(query) > -1);
      }
      return reports;
    } catch (e) {
      return [];
    }
  }

  async getClientFilter(query: string): Promise<any[]> {
    try {
      query = query.trim().toLowerCase();
      let clients = await this.getClients();
      if (query.length) {
        clients = clients.filter(c => c.cname.toLowerCase().indexOf(query) > -1);
      }
      return clients;
    } catch (e) {
      return [];
    }
  }

  async getOutsourceCompanyFilter(query: string): Promise<any[]> {
    try {
      query = query.trim().toLowerCase();
      let outsources = await this.getOutsourceCompanies();
      if (query.length) {
        outsources = outsources.filter(out => out.cname.toLowerCase().indexOf(query) > -1);
      }
      return outsources;
    } catch (e) {
      return [];
    }
  }

  async getLocationFilter(query = ''): Promise<any> {
    try {
      query = query.trim().toLowerCase();
      let locations = await this.getLocations();
      if (query.length > 1) {
        locations = locations.filter(v => v.lname.toLowerCase().indexOf(query) > -1);
      }
      return locations.slice(0, 20);
    } catch (e) {
      return [];
    }
  }

  async getManagerFilter(query: string): Promise<any> {
    try {
      query = query.trim().toLowerCase();
      let users = await this.getUsers();
      users = users.filter(u => ['owner', 'admin'].indexOf(u.lvl) > -1)
        .map(u => ({
          ...u,
          name: `${u.fname} ${u.lname}`
        }));
      if (query.length) {
        users = users.filter(u => u.name.toLowerCase().indexOf(query) > -1);
      }
      return users;
    } catch (e) {
      return [];
    }
  }

  async getUsersFilterForThisCompany(query: string): Promise<any> {
    try {
      query = query.trim().toLowerCase();
      let users = await this.getUsers();
      users = users.filter(u => ['owner', 'admin', 'staff'].indexOf(u.lvl) > -1 && u.works_here == 1)
        .map(u => ({
          ...u,
          name: `${u.fname} ${u.lname}`
        }));
      if (query.length) {
        users = users.filter(u => u.name.toLowerCase().indexOf(query) > -1);
      }
      return users;
    } catch (e) {
      return [];
    }
  }

  async getWorkAreaFilter(query: string): Promise<any> {
    try {
      query = query.trim().toLowerCase();
      let workareas = await this.getWorkareas();
      if (query.length) {
        workareas = workareas.filter(w => w.aname.toLowerCase().indexOf(query) > -1);
      }
      return workareas;
    } catch (e) {
      return [];
    }
  }

  async  getExtraUserInfoFilter(query = ''): Promise<any> {
    try {
      query = query.trim().toLowerCase();
      const data = [];
      const [categories, elements] = await Promise.all([
        this.getProfileCategories(),
        this.getProfileElements()
      ]);
      _.orderBy(categories, 'cname').forEach(pc => {
        let pes = elements.filter(pe => pe.profile_cat_id == pc.id);
        if (query.length) {
          pes = pes.filter(pe => pe.ename.toLowerCase().indexOf(query) > -1);
        }
        _.orderBy(pes, 'ename').forEach(pe => {
          data.push({
            id: pe.id,
            text: `${pc.cname} - ${pe.ename}`
          });
        });
      });
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

  private getProfileCategories(): Promise<any> {
    if (!this.promises.pCategories) {
      this.promises.pCategories = this.http.get(`${baseUrl}/profileStructure/category`).toPromise();
    }
    return this.promises.pCategories;
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

  getShiftStatuses(): Promise<any> {
    if (!this.promises.shiftStatuses) {
      this.promises.shiftStatuses = this.http.get(`${baseUrl}/shiftStatuses`).toPromise();
    }
    return this.promises.shiftStatuses;
  }

  private getShifts(fromDate, toDate): Promise<any> {
    if (!this.promises.shifts) {
      this.promises.shifts = this.http.get(`${baseUrl}/shifts/${fromDate}/${toDate}`).toPromise();
    }
    return this.promises.shifts;
  }

  private getTrackingCategories(): Promise<any> {
    if (!this.promises.trackingCategories) {
      this.promises.trackingCategories = this.http.get(`${baseUrl}/tracking/category`).toPromise();
    }
    return this.promises.trackingCategories;
  }

  private getTrackingOptions(): Promise<any> {
    if (!this.promises.trackingOptions) {
      this.promises.trackingOptions = this.http.get(`${baseUrl}/tracking/option`).toPromise();
    }
    return this.promises.trackingOptions;
  }

  private getClients(): Promise<any> {
    if (!this.promises.clients) {
      this.promises.clients = this.http.get(`${baseUrl}/clients`).toPromise();
    }
    return this.promises.clients;
  }

  private getOutsourceCompanies(): Promise<any> {
    if (!this.promises.outsourceCompanies) {
      this.promises.outsourceCompanies = this.http.get(`${baseUrl}/outsourceCompany`).toPromise();
    }
    return this.promises.outsourceCompanies;
  }

  private getLocations(): Promise<any> {
    if (!this.promises.locations) {
      this.promises.locations = this.http.get(`${baseUrl}/locations`).toPromise();
    }
    return this.promises.locations;
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
