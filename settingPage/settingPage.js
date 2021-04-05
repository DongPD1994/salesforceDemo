import { LightningElement, track, api } from 'lwc';
import updateFieldInfo from '@salesforce/apex/SaveFieldInfo.updateFieldInfo';
import { getToastMessage, jsonParse, TYPE_MESS } from 'c/utils';

export default class SettingPage extends LightningElement {
  tmpFieldInfo;
  @api allField;
  @api updateDataTable;
  @api closeSetting;
  @track dataTable;
  @track lstFieldTmp;
  @api
  get lstField() {
    return this.lstFieldTmp;
  }
  set lstField(value) {
    this.setAttribute('lstField', ...value);
    this.lstFieldTmp = [...value];
  }

  get getAllField() {
    return this.allField;
  }

  get getHeaderData() {
    const tmpColumns = jsonParse(JSON.stringify(this.lstFieldTmp));
    tmpColumns.forEach(element => {
      element.editable = false;
      element.type = "text";
    });
    this.tmpFieldInfo = tmpColumns;
    return tmpColumns;
  }

  async changeItem(event) {
    const isCheck = event.target.checked;
    const id = event.target.value;
    const dataUpdate = [{ Id: event.target.value, is_show__c: isCheck }];
    const result = await updateFieldInfo({ data: dataUpdate });
    this.dispatchEvent(getToastMessage(result ? TYPE_MESS.Success : TYPE_MESS.Error, result ? "Update Field Success" : `Update Field Faild`));
    if (result) {
      this.updateDataTable(true, id);
    }
  }

  async headerAction(event) {
    const actionName = event.detail.columnWidths;
    const dataForSaveFieldInfo = [];
    const data = jsonParse(JSON.stringify(this.dataTable));
    const tmp = this.tmpFieldInfo;
    tmp.forEach((e, i) => {
      if (e.initialWidth !== actionName[i]) {
        data[0][e.fieldName] = actionName[i] + " px";
        e.initialWidth = actionName[i];
        dataForSaveFieldInfo.push({
          Id: e.id,
          width__c: e.initialWidth
        });
      }
    })
    if (dataForSaveFieldInfo.length > 0) {
      this.dataTable = [...data];
      this.lstFieldTmp = [...tmp];
      const result = await updateFieldInfo({ data: dataForSaveFieldInfo });
      this.dispatchEvent(getToastMessage(result ? TYPE_MESS.Success : TYPE_MESS.Error, result ? "Update Field Success" : `Update Field Faild`));
    }
  }

  handleClickClose() {
    this.closeSetting();
  }

  connectedCallback() {
    const data = [];
    const obj = {};
    this.lstFieldTmp.forEach(e => {
      const key = e.fieldName;
      obj[key] = e.initialWidth + " px";
    })
    data.push(obj);
    this.dataTable = data;
  }
}