//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2025  Interneuron Limited

//This program is free software: you can redistribute it and/or modify
//it under the terms of the GNU General Public License as published by
//the Free Software Foundation, either version 3 of the License, or
//(at your option) any later version.

//This program is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

//See the
//GNU General Public License for more details.

//You should have received a copy of the GNU General Public License
//along with this program.If not, see<http://www.gnu.org/licenses/>.
//END LICENSE BLOCK 
/* Interneuron Observation App
Copyright(C) 2019  Interneuron CIC
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.If not, see<http://www.gnu.org/licenses/>. */

import { Component, OnDestroy, Input } from '@angular/core';
import { SubjectsService } from './services/subjects.service';
import { AppService } from './services/app.service';
import { Subscription, Subject } from 'rxjs';
import { ApirequestService } from './services/apirequest.service';
import { isArray } from 'util';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
    title = 'terminus-module-accidentandemergency-admin';
    subscriptions: Subscription = new Subscription();
    alerts: any[] = [];

    @Input() set personid(value: string) {
        this.appService.personId = value;
    }
    @Input() set apiservice(value: any) {

        if (!this.appService.appConfig) {
            this.initConfig(value);
        }
        else {
            this.appService.logToConsole("Service reference is being set");
            this.appService.apiService = value;
            this.appService.logToConsole("Service reference is being published");
            this.subjects.apiServiceReferenceChange.next();
            this.appService.logToConsole("personid is being published");
            this.subjects.personIdChange.next();
        }
    }
    @Input() set unload(value: Subject<any>) {
        this.subjects.unload = value;
    }

    constructor(private subjects: SubjectsService, private appService: AppService, private apiRequest: ApirequestService) {
        this.initConfig(null);

        this.subscriptions.add(this.subjects.showMessage.subscribe((status: any) => {
            this.showMessage(status);
        }));
    }

    initConfig(value: any) {

        this.appService.apiService = value;

        if (this.appService.apiService) {
            let decodedToken = this.appService.decodeAccessToken(this.appService.apiService.authService.user.access_token);
            if (decodedToken != null)
                this.appService.loggedInUserName = decodedToken.name ? (isArray(decodedToken.name) ? decodedToken.name[0] : decodedToken.name) : decodedToken.IPUId;
        }
        this.subscriptions.add(this.apiRequest.getRequest("./assets/config/AandEAdminConfig.json").subscribe(
            (response) => {
                this.appService.appConfig = response;
                this.appService.baseURI = this.appService.appConfig.uris.baseuri;
                this.appService.autonomicsBaseURI = this.appService.appConfig.uris.autonomicsbaseuri;
                this.appService.postAnEEncounterURI = this.appService.appConfig.uris.postaneencounteruri;
                this.appService.getAdmissionDetailsURI = this.appService.appConfig.uris.getadmissiondetailsuri;
                this.appService.orderByAndLimitForGetAdmissionDetails = this.appService.appConfig.uris.orderbyandlimitclauseforgetadmissiondetails;
                this.appService.enableLogging = this.appService.appConfig.enablelogging;

                //emit events after getting initial config. //this happens on first load only. 
                this.appService.logToConsole("Service reference is being published from init config");
                this.subjects.apiServiceReferenceChange.next();
                this.appService.logToConsole("personid is being published from init config");
                this.subjects.personIdChange.next();
            }));
    }

    ngOnDestroy() {
        this.appService.logToConsole("app component being unloaded");
        this.appService.personId = null;

        this.subscriptions.unsubscribe();
        this.subjects.unload.next("app-accidentandemergency-admin");
    }

    showMessage(status: any) {
        if (status.result == "complete") {

            this.alerts = [];
            this.alerts.push({
                type: 'success',
                msg: `${status.message}`,
                timeout: status.timeout ? status.timeout : 0
            });
        }
        else if (status.result == "failed") {
            this.alerts = [];
            this.alerts.push({
                type: 'danger',
                msg: `${status.message}`,
                timeout: status.timeout ? status.timeout : 0
            });
        }
        else if (status.result == "inprogress") {
            this.alerts = [];
            this.alerts.push({
                type: 'info',
                msg: `${status.message}`,
                timeout: status.timeout ? status.timeout : 0
            });
        }

    }
}
