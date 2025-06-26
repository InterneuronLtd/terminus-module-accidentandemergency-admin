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

import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import * as jwt_decode from "jwt-decode";


@Injectable({
    providedIn: 'root'
})

export class AppService {
    subscriptions: Subscription;
    public personId: string;
    public apiService: any;
    public baseURI: string;
    public postAnEEncounterURI: string;
    public getAdmissionDetailsURI: string;
    public orderByAndLimitForGetAdmissionDetails: string;
    public autonomicsBaseURI: string;
    public appConfig: any = null;
    public loggedInUserName: string = null;
    public enableLogging: boolean = true;
    constructor() { }

    decodeAccessToken(token: string): any {
        try {
            return jwt_decode(token);
        }
        catch (Error) {
            return null;
        }
    }

    logToConsole(msg: any) {
        if (this.enableLogging) {
            console.log(msg);
        }
    }
}
