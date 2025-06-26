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
export class Encounter {
    constructor(
        public ane_encounter_id?:string,
        public person_id?: string,
        public arrivaltime?: any,
        public presentingcomplaint?: string,
        public clinician?: string,
        public ratorsee?: string,
        public ct?: string,
        public referredtospecialty?: string,
        public triagecategory?: string,
        public anecategory?: string,
        public anelocation?: string,
        public triaged?: boolean,
        public triagedatetime?: any,
        public treatmentstartdatetime?: any,
        public referredtospecialtytime?: any,
        public ambulancereference?: string,
        public disposal?: string,
        public anestatus?: string,
        public treatmentcompletedatetime?: any,
        public actualdeparturenow?: boolean,
        public departuredatetime?: any,
        public effectivedischargedatetime?: any,
        public editbreachoveride?: boolean,
        public reasonforbreach?: string,
        public xray?: string,
        public dtaward?: string,
        public allergyinformation?: string,
        public latestlabresults?: string
    ) { }
}
