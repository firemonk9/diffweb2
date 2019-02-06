import { Component, OnInit } from '@angular/core';
import {  DataService } from '../data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss']
})
export class ApiComponent implements OnInit {

    formObject : FormGroup;  
    sessionId : string = '';
    projects : object;
    flows : object;
    jobs : object;
    executions : object;

    constructor(private data : DataService, private formBuilder : FormBuilder) { }

    ngOnInit() {
        this.formObject = this.formBuilder.group({
          project_name : ['', Validators.required],
          flow_id : ['', Validators.required],
          job_id : ['', Validators.required],
          project_id : ['', Validators.required],
          schedule_id : ['', Validators.required],
          exec_id : ['', Validators.required],
        });
    }

    onSubmit(){
        //alert('submited');
    };

    onClickGetAuthentication(){
        this.data.getSessionId()
        .subscribe(data=> {
          this.sessionId = data['session.id'];
        });
    }

    onClickGetAllProject(){
        if (!this.sessionId){ alert('Empty Session Id'); return; }
        
        let body = new URLSearchParams();
        body.set('session.id', this.sessionId);
        body.set('ajax', 'fetchallprojects');

        this.data.request('get', body, 'index')
        .subscribe(data=> {
            this.projects = data;
            console.log(data);
        });
    }

    onClickGetAllFlowsfrProject(){
        //alert('getflows');
        var project_name = this.formObject.controls.project_name.value;
        if (!project_name){ alert('Empty Project Name'); return; }

        this.data.fetchprojectflows(this.sessionId, project_name)
        .subscribe(data => {
            this.flows = data;
            console.log(data);
          /**/
        });
    }

    onGetJobsfrFlow(){

        var project_name = this.formObject.controls.project_name.value;
        var flow_id = this.formObject.controls.flow_id.value;
        if (!project_name){ alert('Empty Project Name'); return; }
        if (!flow_id){ alert('Empty Flow ID'); return; }

        let body = new URLSearchParams();
        body.set('session.id', this.sessionId);
        body.set('ajax', 'fetchflowgraph');
        body.set('project', project_name);
        body.set('flow', flow_id);

        this.data.request('get', body, 'manager')
        .subscribe(data => {
            this.jobs = data;
            console.log(data);
          /**/
        });
    }

    onFecthExecution(){

        var project_name = this.formObject.controls.project_name.value;
        var flow_id = this.formObject.controls.flow_id.value;
        if (!project_name){ alert('Empty Project Name'); return; }
        if (!flow_id){ alert('Empty Flow ID'); return; }

        let body = new URLSearchParams();
        body.set('session.id', this.sessionId);
        body.set('ajax', 'fetchFlowExecutions');
        body.set('project', project_name);
        body.set('flow', flow_id);
        body.set('start', "0");
        body.set('length', "100");

        return this.data.request('get', body, 'manager')
        .subscribe(data => {
            this.executions = data;
            console.log(data);
          /**/
        });
    }

    onExecuteFlow(){
        
        var project_name = this.formObject.controls.project_name.value;
        var flow_id = this.formObject.controls.flow_id.value;
        if (!project_name){ alert('Empty Project Name'); return; }
        if (!flow_id){ alert('Empty Flow ID'); return; }

        let body = new URLSearchParams();
        body.set('session.id', this.sessionId);
        body.set('ajax', 'executeFlow');
        body.set('project', project_name);
        body.set('flow', flow_id);
        return this.data.request('get', body, 'executor')
        .subscribe(data => {
            if (data.error) alert(data.error);
            else if (data.message) alert(data.message);
            this.onFecthExecution();
            console.log(data);
        });
    }

    onCancelFlow(){
        var exec_id = this.formObject.controls.exec_id.value;
        if (!exec_id){ alert('Empty Execution'); return; }

        let body = new URLSearchParams();
        body.set('session.id', this.sessionId);
        body.set('ajax', 'cancelFlow');
        body.set('execid', exec_id);
        return this.data.request('get', body, 'executor')
        .subscribe(data => {
            if (data.error) alert(data.error);
            else alert('Execution ' + exec_id + ' is successfully killed.');
            this.onFecthExecution();

            console.log(data);
        });
    }

    onScheduleFlow(){
        var project_name = this.formObject.controls.project_name.value;
        var flow_id = this.formObject.controls.flow_id.value;
        if (!project_name){ alert('Empty Project Name'); return; }
        if (!flow_id){ alert('Empty Flow Name'); return; }

        let body = new URLSearchParams();
        body.set('session.id', this.sessionId);
        body.set('ajax', 'scheduleCronFlow');
        body.set('projectName', project_name);
        body.set('flow', flow_id);
        body.set('cronExpression', "0 23/30 5,7-10 ? * 6#3");
        this.data.request('get', body, 'schedule')
        .subscribe(data => {
            if (data['status'] == 'success')
                alert('Success');
            else{
                alert('Error' + data['nessage']);
            }
        });
    }

    onFetchSchedule(){
        var project_id = this.formObject.controls.project_id.value;
        var flow_id = this.formObject.controls.flow_id.value;

        if (!project_id){
            alert('Empty Project ID'); return;
        }

        if (!flow_id){
            alert('Empty Flow Name'); return;
        }

        this.data.onFetchSchedule(this.sessionId, project_id, flow_id)
        .subscribe(data => {
            if (data['status'] == 'success')
                alert('Success');
            else{
                alert('Error' + data['nessage']);
            }
        });
    }

    onRemoveSched(){
        var schedule_id = this.formObject.controls.schedule_id.value;
        if (!schedule_id){
            alert('Empty Schedule ID'); return;
        }
        this.data.onRemoveSched(this.sessionId, schedule_id)
        .subscribe(data => {
            //if (data['status'] == 'success')
            alert(data['message']);
        });
    }

    onPauseFlow(){
        var exec_id = this.formObject.controls.exec_id.value;
        if (!exec_id){
            alert('Empty Exection ID');
            return;
        }
        this.data.onPauseFlow(this.sessionId, exec_id)
        .subscribe(data => {
            //if (data['status'] == 'success')
            if (data['error']){
                alert(data['error']);
            }else{
                alert('Success');
            }
        });
    }
}
