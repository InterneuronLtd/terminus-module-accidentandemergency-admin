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
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Encounter } from '../model/encounter';
import { v4 as uuid } from 'uuid';
import { AppService } from '../services/app.service';
import { Subscription } from 'rxjs';
import { ApirequestService } from '../services/apirequest.service';
import { SubjectsService } from '../services/subjects.service'; 

@Component({
    selector: 'app-admin-form',
    templateUrl: './admin-form.component.html',
    styleUrls: ['./admin-form.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AdminFormComponent implements OnInit, OnDestroy {

    encounter = new Encounter();

    //locationDate: string;
    //locationTime: string;

    personId: string;

    admitDate: any;
    admitTime: any;

    triageDate: any;
    triageTime: any;

    treatmentDate: any;
    treatmentTime: any;

    referralDate: any;
    referralTime: any;

    treatmentCompleteDate: any;
    treatmentCompleteTime: any;

    departureDate: any;
    departureTime: any;

    effectiveDischargeDate: any;
    effectiveDischargeTime: any;

    triageDateTimeDifference: string;
    treatmentDateTimeDifference: string;
    referralDateTimeDifference: string;
    treatmentCompleteDateTimeDifference: string;
    effectiveDischargeDateTimeDifference: string;
    trolleyTimeDifference: string;

    admitError: any = { isError: false, errorMessage: '' };
    triageError: any = { isError: false, errorMessage: '' };
    treatmentError: any = { isError: false, errorMessage: '' };
    referralError: any = { isError: false, errorMessage: '' };
    treatmentCompleteError: any = { isError: false, errorMessage: '' };
    departureError: any = { isError: false, errorMessage: '' };
    effectiveDischargeError: any = { isError: false, errorMessage: '' };

    subscriptions: Subscription = new Subscription();

    constructor(private appService: AppService, private apiRequestService: ApirequestService, private subjects: SubjectsService) {
        this.subscriptions.add(
            this.subjects.personIdChange.subscribe(() => {
                //this.personId = this.appService.personId;
                this.personId = '9f1bb2c8-de89-439b-8d38-ed371ce108ed';
                this.getAdmissionDetails();
            }));
    }

    ngOnInit() {
    }

    saveAdmissionDetails() {

        this.encounter.ane_encounter_id = this.personId;
        this.encounter.person_id = this.personId;
        //var locationDateTime = this.getDateTime(this.locationDate, this.locationTime);
        if (this.admitDate && this.admitTime) {
            this.encounter.arrivaltime = this.getDateTime(this.admitDate, this.admitTime);
        }

        if (this.triageDate && this.triageTime) {
            this.encounter.triagedatetime = this.getDateTime(this.triageDate, this.triageTime);
        }

        if (this.treatmentDate && this.treatmentTime) {
            this.encounter.treatmentstartdatetime = this.getDateTime(this.treatmentDate, this.treatmentTime);
        }

        if (this.referralDate && this.referralTime) {
            this.encounter.referredtospecialtytime = this.getDateTime(this.referralDate, this.referralTime);
        }

        if (this.treatmentCompleteDate && this.treatmentCompleteTime) {
            this.encounter.treatmentcompletedatetime = this.getDateTime(this.treatmentCompleteDate, this.treatmentCompleteTime);
        }

        if (this.departureDate && this.departureTime) {
            this.encounter.departuredatetime = this.getDateTime(this.departureDate, this.departureTime);
        }

        if (this.effectiveDischargeDate && this.effectiveDischargeTime) {
            this.encounter.effectivedischargedatetime = this.getDateTime(this.effectiveDischargeDate, this.effectiveDischargeTime);
        }

        //console.log(JSON.stringify(this.encounter));

        this.subjects.showMessage.next({ result: "inprogress", message: "<h5>Please wait while the administration details are being added...<h5>" });

        this.subscriptions.add(this.apiRequestService.postRequest(this.appService.baseURI + this.appService.postAnEEncounterURI, JSON.stringify(this.encounter))
            .subscribe(() => {
                this.subjects.showMessage.next({
                    result: "complete", message: "<h5>Administration Details Saved Successfully</h5>", timeout: 5000
                })
                this.getAdmissionDetails();
            }));

        this.clearForm();
        this.gotoTop();
    }

    getDateTime(date, time): string {
        var t = new Date(time);
        var hours = t.getHours();
        var minutes = t.getMinutes();
        var dt = new Date(date);
        dt.setHours(hours);
        dt.setMinutes(minutes);
        var year = dt.getFullYear();
        var month = (dt.getMonth() + 1);
        var d = dt.getDate();
        var hrs = dt.getHours();
        var mins = dt.getMinutes();
        var returndate = (year + "-" + (month < 10 ? "0" + month : month) + "-" + (d < 10 ? "0" + d : d) + "T" + (hrs < 10 ? "0" + hrs : hrs) + ":" + (mins < 10 ? "0" + mins : mins) + ":00.000Z");

        return returndate;
    }

    getDateTimeDifference(date1, date2): string {
        var dt1: any = new Date(date1);
        var dt2: any = new Date(date2);

        var msec = dt2 - dt1;
        var mins = Math.floor(msec / 60000);
        var hrs = Math.floor(mins / 60);
        mins = mins % 60;

        return (hrs < 10 ? "0" + hrs : hrs) + " : " + (mins < 10 ? "0" + mins : mins);
    }

    onFocusOutTriageDifference() {
        var admitDateTime, triageDateTime;

        if (this.admitDate && this.admitTime) {
            admitDateTime = this.getDateTime(this.admitDate, this.admitTime);
        }

        if (this.triageDate != undefined && this.triageTime != undefined) {
            triageDateTime = this.getDateTime(this.triageDate, this.triageTime);
        }

        if (admitDateTime && triageDateTime) {
            if (new Date(admitDateTime) > new Date(triageDateTime)) {
                this.triageError = { isError: true, errorMessage: "Triage Date / Time can't be less than Admit Date Time" };
                this.triageDateTimeDifference = "";
            }
            else if (new Date(triageDateTime) > new Date(this.getDateTime(new Date(), new Date()))) {
                this.triageError = { isError: true, errorMessage: "Triage Date / Time can't be greater than Current Date Time" };
                this.triageDateTimeDifference = "";
            }
            else {
                this.triageError = { isError: false, errorMessage: "" };
                this.triageDateTimeDifference = this.getDateTimeDifference(admitDateTime, triageDateTime);
            }
        }
    }

    onFocusOutTreatmentDifference() {
        var admitDateTime, treatmentDateTime;

        if (this.admitDate && this.admitTime) {
            admitDateTime = this.getDateTime(this.admitDate, this.admitTime);
        }

        if (this.treatmentDate && this.treatmentTime) {
            treatmentDateTime = this.getDateTime(this.treatmentDate, this.treatmentTime);
        }

        if (admitDateTime && treatmentDateTime) {
            if (new Date(admitDateTime) > new Date(treatmentDateTime)) {
                this.treatmentError = { isError: true, errorMessage: "Treatment Start Date / Time can't be less than Admit Date Time" };
                this.treatmentDateTimeDifference = "";
            }
            else if (new Date(treatmentDateTime) > new Date(this.getDateTime(new Date(), new Date()))) {
                this.treatmentError = { isError: true, errorMessage: "Treatment Start Date / Time can't be greater than Current Date Time" };
                this.treatmentDateTimeDifference = "";
            }
            else {
                this.treatmentError = { isError: false, errorMessage: "" };
                this.treatmentDateTimeDifference = this.getDateTimeDifference(admitDateTime, treatmentDateTime);
            }
        }
    }

    onFocusOutReferralDifference() {
        var admitDateTime, referralDateTime;

        if (this.admitDate && this.admitTime) {
            admitDateTime = this.getDateTime(this.admitDate, this.admitTime);
        }

        if (this.referralDate && this.referralTime) {
            referralDateTime = this.getDateTime(this.referralDate, this.referralTime);
        }

        if (admitDateTime && referralDateTime) {
            if (new Date(admitDateTime) > new Date(referralDateTime)) {
                this.referralError = { isError: true, errorMessage: "Referral Date / Time can't be less than Admit Date Time" };
                this.referralDateTimeDifference = "";
            }
            else if (new Date(referralDateTime) > new Date(this.getDateTime(new Date(), new Date()))) {
                this.referralError = { isError: true, errorMessage: "Referral Date / Time can't be greater than Current Date Time" };
                this.referralDateTimeDifference = "";
            }
            else {
                this.referralError = { isError: false, errorMessage: "" };
                this.referralDateTimeDifference = this.getDateTimeDifference(admitDateTime, referralDateTime);
            }
        }
    }

    onFocusOutTreatmentCompleteDifference() {
        var admitDateTime, treatmentCompleteDateTime;

        if (this.admitDate && this.admitTime) {
            admitDateTime = this.getDateTime(this.admitDate, this.admitTime);
        }

        if (this.treatmentCompleteDate && this.treatmentCompleteTime) {
            treatmentCompleteDateTime = this.getDateTime(this.treatmentCompleteDate, this.treatmentCompleteTime);
        }

        if (admitDateTime && treatmentCompleteDateTime) {
            if (new Date(admitDateTime) > new Date(treatmentCompleteDateTime)) {
                this.treatmentCompleteError = { isError: true, errorMessage: "Treatment Complete Date / Time can't be less than Admit Date Time" };
                this.treatmentCompleteDateTimeDifference = "";
            }
            else if (new Date(treatmentCompleteDateTime) > new Date(this.getDateTime(new Date(), new Date()))) {
                this.treatmentCompleteError = { isError: true, errorMessage: "Treatment Complete Date / Time can't be greater than Current Date Time" };
                this.treatmentCompleteDateTimeDifference = "";
            }
            else {
                this.treatmentCompleteError = { isError: false, errorMessage: "" };
                this.treatmentCompleteDateTimeDifference = this.getDateTimeDifference(admitDateTime, treatmentCompleteDateTime);
            }
        }
    }

    onFocusOutEffectiveDischargeDifference() {
        var admitDateTime, effectiveDischargeDateTime;

        if (this.admitDate && this.admitTime) {
            admitDateTime = this.getDateTime(this.admitDate, this.admitTime);
        }

        if (this.effectiveDischargeDate && this.effectiveDischargeTime) {
            effectiveDischargeDateTime = this.getDateTime(this.effectiveDischargeDate, this.effectiveDischargeTime);
        }

        if (!effectiveDischargeDateTime) {
            effectiveDischargeDateTime = this.getDateTime(new Date(), new Date());
        }

        if (admitDateTime && effectiveDischargeDateTime) {
            if (new Date(admitDateTime) > new Date(this.getDateTime(new Date(), new Date()))) {
                this.admitError = { isError: true, errorMessage: "Admit Date / Time can't be greater than Current Date Time" };
                this.effectiveDischargeDateTimeDifference = "";
            }
            else {
                this.admitError = { isError: false, errorMessage: "" };
                this.effectiveDischargeDateTimeDifference = this.getDateTimeDifference(admitDateTime, effectiveDischargeDateTime);
                this.onFocusOutTriageDifference();
                this.onFocusOutTreatmentDifference();
                this.onFocusOutReferralDifference();
                this.onFocusOutTreatmentCompleteDifference();
            }
        }
    }

    onFocusOutDepartureDifference() {
        var admitDateTime, departureDateTime;

        if (this.admitDate && this.admitTime) {
            admitDateTime = this.getDateTime(this.admitDate, this.admitTime);
        }

        if (this.departureDate && this.departureTime) {
            departureDateTime = this.getDateTime(this.departureDate, this.departureTime);
        }

        if (admitDateTime && departureDateTime) {
            if (new Date(admitDateTime) > new Date(departureDateTime)) {
                this.departureError = { isError: true, errorMessage: "Departure Date / Time can't be less than Admit Date Time" };
            }
            else if (new Date(departureDateTime) > new Date(this.getDateTime(new Date(), new Date()))) {
                this.departureError = { isError: true, errorMessage: "Departure Date / Time can't be greater than Current Date Time" };
            }
            else {
                this.departureError = { isError: false, errorMessage: "" };
                this.onFocusOutTrolleyDifference();
            }
        }
    }

    onFocusOutTrolleyDifference() {
        var admitDateTime, departureDateTime, effectiveDischargeDateTime;

        if (this.admitDate && this.admitTime) {
            admitDateTime = this.getDateTime(this.admitDate, this.admitTime);
        }

        if (this.departureDate && this.departureTime) {
            departureDateTime = this.getDateTime(this.departureDate, this.departureTime);
        }

        if (this.effectiveDischargeDate && this.effectiveDischargeTime) {
            effectiveDischargeDateTime = this.getDateTime(this.effectiveDischargeDate, this.effectiveDischargeTime);
        }

        if (!effectiveDischargeDateTime) {
            effectiveDischargeDateTime = this.getDateTime(new Date(), new Date());
        }

        if (admitDateTime && effectiveDischargeDateTime) {
            if (new Date(admitDateTime) > new Date(effectiveDischargeDateTime)) {
                this.effectiveDischargeError = { isError: true, errorMessage: "Effective Discharge Date / Time can't be less than Admit Date Time" };
                this.trolleyTimeDifference = "";
            }
            else if (new Date(effectiveDischargeDateTime) > new Date(this.getDateTime(new Date(), new Date()))) {
                this.effectiveDischargeError = { isError: true, errorMessage: "Effective Discharge Date / Time can't be greater than Current Date Time" };
                this.trolleyTimeDifference = "";
            }
            else {
                this.effectiveDischargeError = { isError: false, errorMessage: "" };
                if (departureDateTime && effectiveDischargeDateTime) {
                    this.trolleyTimeDifference = this.getDateTimeDifference(departureDateTime, effectiveDischargeDateTime);
                }
            }
            this.effectiveDischargeDateTimeDifference = this.getDateTimeDifference(admitDateTime, effectiveDischargeDateTime);
        }
    }

    checkActualDeparture() {
        if (this.encounter.actualdeparturenow == true) {
            this.departureDate = new Date();
            this.departureTime = new Date();
            this.effectiveDischargeDate = new Date();
            this.effectiveDischargeTime = new Date();

            this.onFocusOutTrolleyDifference();
        }
        else {
            this.departureDate = null;
            this.departureTime = null;
            this.effectiveDischargeDate = null;
            this.effectiveDischargeTime = null;
        }
    }

    checkTriaged() {
        if (!this.encounter.triaged) {
            this.triageDate = null;
            this.triageTime = null;
        }
    }

    checkBreached() {
        if (!this.encounter.editbreachoveride) {
            this.encounter.reasonforbreach = "";
        }
    }

    clearForm() {
        this.admitDate = null;
        this.triageDate = null;
        this.treatmentDate = null;
        this.referralDate = null;
        this.treatmentCompleteDate = null;
        this.departureDate = null;
        this.effectiveDischargeDate = null;
        this.triageDateTimeDifference = "";
        this.treatmentDateTimeDifference = "";
        this.referralDateTimeDifference = "";
        this.treatmentCompleteDateTimeDifference = "";
        this.effectiveDischargeDateTimeDifference = "";
        this.trolleyTimeDifference = "";
    }

    gotoTop() {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    getAdmissionDetails() {
        this.subscriptions.add(this.apiRequestService.getRequest(this.appService.baseURI + this.appService.getAdmissionDetailsURI + this.personId + this.appService.orderByAndLimitForGetAdmissionDetails)
            .subscribe((response) => {
                //console.log(JSON.parse(response)[0]);
                this.encounter = <Encounter>JSON.parse(response)[0];

                if (this.encounter.arrivaltime) {
                    this.admitDate = new Date(this.encounter.arrivaltime);
                    this.admitTime = this.encounter.arrivaltime;
                }

                if (this.encounter.triagedatetime) {
                    this.triageDate = new Date(this.encounter.triagedatetime);
                    this.triageTime = this.encounter.triagedatetime;
                    if (this.encounter.arrivaltime) {
                        this.triageDateTimeDifference = this.getDateTimeDifference(this.encounter.arrivaltime, this.encounter.triagedatetime);
                    }
                }

                if (this.encounter.treatmentstartdatetime) {
                    this.treatmentDate = new Date(this.encounter.treatmentstartdatetime);
                    this.treatmentTime = this.encounter.treatmentstartdatetime;
                    if (this.encounter.arrivaltime) {
                        this.treatmentDateTimeDifference = this.getDateTimeDifference(this.encounter.arrivaltime, this.encounter.treatmentstartdatetime);
                    }
                }

                if (this.encounter.referredtospecialtytime) {
                    this.referralDate = new Date(this.encounter.referredtospecialtytime);
                    this.referralTime = this.encounter.referredtospecialtytime;
                    if (this.encounter.arrivaltime) {
                        this.referralDateTimeDifference = this.getDateTimeDifference(this.encounter.arrivaltime, this.encounter.referredtospecialtytime);
                    }
                }

                if (this.encounter.treatmentcompletedatetime) {
                    this.treatmentCompleteDate = new Date(this.encounter.treatmentcompletedatetime);
                    this.treatmentCompleteTime = this.encounter.treatmentcompletedatetime;
                    if (this.encounter.arrivaltime) {
                        this.treatmentCompleteDateTimeDifference = this.getDateTimeDifference(this.encounter.arrivaltime, this.encounter.treatmentcompletedatetime);
                    }
                }

                if (this.encounter.departuredatetime) {
                    this.departureDate = new Date(this.encounter.departuredatetime);
                    this.departureTime = this.encounter.departuredatetime;
                    if (this.encounter.effectivedischargedatetime) {
                        this.trolleyTimeDifference = this.getDateTimeDifference(this.encounter.departuredatetime, this.encounter.effectivedischargedatetime);
                    }
                }

                if (this.encounter.effectivedischargedatetime) {
                    this.effectiveDischargeDate = new Date(this.encounter.effectivedischargedatetime);
                    this.effectiveDischargeTime = this.encounter.effectivedischargedatetime;
                    if (this.encounter.departuredatetime) {
                        this.trolleyTimeDifference = this.getDateTimeDifference(this.encounter.departuredatetime, this.encounter.effectivedischargedatetime);
                    }
                    if (this.encounter.arrivaltime) {
                        this.effectiveDischargeDateTimeDifference = this.getDateTimeDifference(this.encounter.arrivaltime, this.encounter.effectivedischargedatetime);
                    }
                }
                else {
                    var effectiveDischargeDateTime;

                    effectiveDischargeDateTime = this.getDateTime(new Date(), new Date());

                    if (this.encounter.departuredatetime) {
                        this.trolleyTimeDifference = this.getDateTimeDifference(this.encounter.departuredatetime, effectiveDischargeDateTime);
                    }
                    if (this.encounter.arrivaltime) {
                        this.effectiveDischargeDateTimeDifference = this.getDateTimeDifference(this.encounter.arrivaltime, effectiveDischargeDateTime);
                    }
                }
            }));
    }
}
