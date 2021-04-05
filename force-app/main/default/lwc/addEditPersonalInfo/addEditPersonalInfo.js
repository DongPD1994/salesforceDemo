import { LightningElement, api, track } from 'lwc';
import insertInfo from '@salesforce/apex/AddEditPersonalInfo.insertInfo';
import { getToastMessage, jsonParse, TYPE_MESS } from 'c/utils';

export default class AddEditPersonalInfo extends LightningElement {
  @api inputData;
  @api allField;
  // @api refreshTableList;

  get getField() {
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
    const result = insertInfo({ insertInfo: dataInsert });
    this.dispatchEvent(getToastMessage(result ? TYPE_MESS.Success : TYPE_MESS.Error, result ? `Records insert success` : `Records insert faild`));
    if (result) {
      // this.refreshTableList(true);
      this.dispatchEvent(new CustomEvent('refresh', { detail: { isRefresh: true } }),
        {
          bubbles: true,
          // composed: true 
        });
    }
  }
}