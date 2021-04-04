import { LightningElement, api, track } from 'lwc';
import insertInfo from '@salesforce/apex/AddEditPersonalInfo.insertInfo';
import { getToastMessage, jsonParse, TYPE_MESS } from 'c/utils';

export default class AddEditPersonalInfo extends LightningElement {
    @api inputData;
    @api allField;

    // get getFirstNameValue() {
    //     return this.inputData.first_name__c;
    // }
    get getField(){
        const tmpField = this.allField;
        return jsonParse(JSON.stringify(tmpField));
    }
    submitInfo(event) {
        const allValue = this.template.querySelectorAll('lightning-input');
        const dataInsert = {};
        if (allValue.length > 0) {
            allValue.forEach(element => {
                const key = element.name;
                dataInsert[key] = element.value;
            });
        }
        const result = insertInfo({insertInfo: dataInsert});
        this.dispatchEvent(getToastMessage(TYPE_MESS.Success, `Records updared`));

    }
}