import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

    /*account*/
    server_address : string = "http://dataq-automation-alb-1598668034.us-east-1.elb.amazonaws.com:8083/";
    username : string = "dataq";
    password : string = "dataq";

    constructor(private http: HttpClient) { }
    
    request(type : string = 'get', body : URLSearchParams, url = 'index'){
        if ('post' == type){
            let options = {
                headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
            };
            return this.http.post(this.server_address + url, body.toString(), options);
        }else ('get' == type)
            return this.http.get(this.server_address + url + "?" + body.toString());
    }

    getUsers(){
        return this.http.get('https://reqres.in/api/users');
    }

    /*DU-15*/
    getSessionId(){
        let body = new URLSearchParams();
        body.set('action', "login");
        body.set('username', this.username);
        body.set('password', this.password);

        return this.request('post', body);
    }
    /*DU-14*/
     getAllProjects(sessionId){
        let body = new URLSearchParams();
        body.set('session.id', sessionId);
        body.set('ajax', 'fetchallprojects');

        return this.request('get', body);
    }

    fetchprojectflows(sessionId, projectname){
        let body = new URLSearchParams();
        body.set('session.id', sessionId);
        body.set('ajax', 'fetchprojectflows');
        body.set('project', projectname);

        return this.request('get', body, 'manager');
    }

    /*DU-16*/
    fetchExecution(sessionId, projectname, flow_id){
      let body = new URLSearchParams();
      body.set('session.id', sessionId);
      body.set('ajax', 'fetchFlowExecutions');
      body.set('project', projectname);
      body.set('flow', flow_id);
      body.set('start', "0");
      body.set('length', "100");
      return this.request('get', body, 'manager');
    }

    onExecuteFlow(sessionId, project_name, flow_id){
        let body = new URLSearchParams();
        body.set('session.id', sessionId);
        body.set('ajax', 'executeFlow');
        body.set('project', project_name);
        body.set('flow', flow_id);
        return this.request('get', body);
    }

    cancelFlow(sessionId, flow_id){
      let body = new URLSearchParams();
      body.set('session.id', sessionId);
      body.set('ajax', 'cancelFlow');
      body.set('execid', flow_id);
      return this.request('get', body);
    }

    onScheduleFlow(sessionId, project_name, flow_id){
        let body = new URLSearchParams();
        body.set('session.id', sessionId);
        body.set('ajax', 'scheduleCronFlow');
        body.set('projectName', project_name);
        body.set('flow', flow_id);
        body.set('cronExpression', "0 23/30 5,7-10 ? * 6#3");
        return this.request('get', body);
    }

    onFetchSchedule(sessionId, project_id, flow_id){
        let body = new URLSearchParams();
        body.set('sesion.id', sessionId);
        body.set('ajax', 'fetchSchedule');
        body.set('projectId', project_id);
        body.set('flowId', flow_id);
        return this.request('get', body);
    }

    onRemoveSched(sessionId, schedule_id){
        let body = new URLSearchParams();
        body.set('sesion.id', sessionId);
        body.set('ajax', 'removeSched');
        body.set('scheduleId', schedule_id);
        return this.request('get', body);
    }

    onPauseFlow(sessionId, exec_id){
        let body = new URLSearchParams();
        body.set('sesion.id', sessionId);
        body.set('ajax', 'pauseFlow');
        body.set('execid', exec_id);
        return this.request('get', body);
    }
}
