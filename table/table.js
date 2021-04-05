import {
  LightningElement,
  wire,
  track
} from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

import fetchDataList from '@salesforce/apex/DataTableLWC.fetchDataList';
import countRecordOfList from '@salesforce/apex/GetCount.countRecordOfList';
import deleteRecordInList from '@salesforce/apex/DeleteRecords.deleteRecordInList';
import editRecordsInList from '@salesforce/apex/EditRecords.editRecordsInList';
import getFieldInformation from '@salesforce/apex/GetFieldInfo.getFieldInformation';
import { getNumberPage, getToastMessage, jsonParse, TYPE_MESS } from 'c/utils';

const defaultHeader = (isEdit) => {
  return [
    {
      label: 'First Name',
      fieldName: 'first_name__c',
      type: 'text',
      initialWidth: 100,
      editable: isEdit
    },
    {
      label: 'Last Name',
      fieldName: 'last_name__c',
      initialWidth: 100,
      type: 'text',
      editable: isEdit
    },
    {
      label: 'Birthday',
      fieldName: 'birthday__c',
      initialWidth: 100,
      editable: isEdit,
      type: 'date-local',
    }
  ]
}

const initHeader = (isEdit, data, addViewAndDel = true) => {
  let headerColumn = [];

  let defValue;
  if (data === undefined || data === null || (Array.isArray(data) && data.length === 0)) {
    defValue = defaultHeader(isEdit);
  } else {
    defValue = data;
  }
  const addOn = [
    {
      label: 'View',
      type: 'button-icon',
      initialWidth: 75,
      typeAttributes: {
        name: 'preview_detail',
        iconName: 'action:preview',
        title: 'Preview',
        variant: 'border-filled',
        alternativeText: 'View',
      }
    },
    {
      label: 'Delete',
      type: 'button-icon',
      fieldName: 'id',
      fixedWidth: 70,
      typeAttributes: {
        iconName: 'utility:delete',
        title: 'Delete',
        variant: 'border-filled',
        alternativeText: 'Delete',
        name: 'delete_record',
      },
    },
  ]
  if (addViewAndDel) {
    headerColumn = defValue.concat(addOn);
  } else {
    headerColumn = defValue;
  }
  return headerColumn;
}

const limitPageValue = [
  {
    label: "3 Records",
    value: 3
  },
  {
    label: "5 Records",
    value: 5
  },
  {
    label: "7 Records",
    value: 7
  }
]

export default class DataTableComponent extends LightningElement {
  lstIdSeleced = [];
  dataList;
  modeEdit = false;
  draftValues = [];
  @track optionsLimit = limitPageValue;
  @track numberSelected = 0;
  @track disableDelete = true;
  @track disableBack = true;
  @track disableNext = true;
  @track totalPageInList = 1;
  @track columns = initHeader(this.modeEdit);
  @track record = {};
  @track rowOffset = 0;
  @track data = {};
  @track bShowModal = false;
  @track error;
  @track currentPage = 1;
  @track limitPage = 3;
  @track dataTable;
  @track modeList = true;
  @track allFiled;
  @track getDataForTableSetting;
  @track infoData = { first_name__c: "a" };

  /**
   * Get data for list
   * @param {*} result 
   */
  @wire(fetchDataList, { offsetNum: 1, limitNum: 3 })
  wiredDataList(result) {
    this.dataList = result;
    if (result.data) {
      this.error = undefined;
      this.dataTable = result.data;
    } else if (result.error) {
      this.dataTable = [];
      this.error = result.error;
    }
  }

  /**
   * Get Navigation Info
   * @param {*} result 
   */
  @wire(countRecordOfList)
  wiredRecordOfList(result) {
    if (result.data) {
      this.error = undefined;
      const totalPage = getNumberPage(result.data, this.limitPage);
      this.totalPageInList = totalPage;
      if (this.currentPage === 1) {
        this.disableBack = true;
      } else {
        this.disableBack = false;
      }
      if (this.currentPage === this.totalPageInList) {
        this.disableNext = true;
      } else {
        this.disableNext = false;
      }
    } else if (result.error) {
      this.counts = 0;
      this.error = result.error;
    }
  }

  getFieldInfoData = () => {
    getFieldInformation().then((result) => {
      this.error = undefined;
      const dataHeader = [];
      const dataAllField = [];
      if (Array.isArray(result) && result.length > 0) {
        result.forEach((e) => {
          dataAllField.push({
            id: e.Id,
            name: e.Name,
            label: e.label_name__c,
            fieldName: e.field_name__c,
            editable: false,
            type: e.field_type__c,
            initialWidth: e.width__c,
            isCheck: e.is_show__c
          })
          if (e.is_show__c) {
            dataHeader.push({
              id: e.Id,
              name: e.Name,
              label: e.label_name__c,
              fieldName: e.field_name__c,
              editable: this.modeEdit,
              type: e.field_type__c,
              initialWidth: e.width__c
            })
          }
        })
        this.columns = initHeader(this.modeEdit, dataHeader);
        this.allFiled = dataAllField;
        this.getDataForTableSetting = initHeader(false, dataHeader, false);
      }
    }).catch((error) => {
      this.columns = initHeader(this.modeEdit);
      this.allFiled = [];
      this.error = error;
    })
  }

  /**
   * Get header of table
   * @param {*} result 
   */
  constructor() {
    super();
    this.getFieldInfoData();
  }

  get getLabelEdit() {
    return this.modeEdit ? "Cancel Edit" : "Edit";
  }

  get getLabelLimitPage() {
    return limitPageValue.find(e => e.value.toString() === this.limitPage.toString()).label;
  }

  editTable() {
    this.modeEdit = !this.modeEdit;
    const tmpColumns = jsonParse(JSON.stringify(this.columns));
    tmpColumns.forEach(element => {
      element.editable = this.modeEdit;
    });
    this.columns = tmpColumns;
  }

  /**
   * Get data of list
   */
  getDataList = (limit) => {
    fetchDataList({ offsetNum: this.currentPage, limitNum: limit })
      .then((result) => {
        this.error = undefined;
        this.dataTable = result;
      })
      .catch((e) => {
        this.error = e;
      })
  }

  getPageInfo = () => {
    countRecordOfList().then((result) => {
      this.error = undefined;
      const totalPage = getNumberPage(result, this.limitPage);
      this.totalPageInList = totalPage;
      if (this.currentPage === 1) {
        this.disableBack = true;
      } else {
        this.disableBack = false;
      }
      if (this.currentPage === this.totalPageInList) {
        this.disableNext = true;
      } else {
        this.disableNext = false;
      }
    }).catch((e) => {
      this.error = e;
    })
  }

  /**
   * Delete a record.
   * @param {*} idRecord id of record
   */
  deleteRecord = (idRecord) => {
    deleteRecord(idRecord)
      .then(() => {
        this.dispatchEvent(getToastMessage(TYPE_MESS.Success, "Record deleted"));
        refreshApex(this.dataList);
      })
      .catch(error => {
        this.dispatchEvent(getToastMessage(TYPE_MESS.Error, error.body.message));
      });
  }

  /**
   * Handle table action
   * @param {*} event 
   */
  handleRowAction(event) {
    const action = event.detail.action;
    const row = event.detail.row;
    this.record = row;
    switch (action.name) {
      case 'preview_detail':
        this.bShowModal = true;
        break;
      case 'delete_record':
        this.deleteRecord(row.Id);
        break;
      default:
        console.log("a", row);
        break;
    }
  }

  // disableNavigation() {
  //   const totalPage = this.totalPageInList;
  //   let test = this.template.querySelectorAll('lightning-button');
  //   for (let i = 0; i < test.length; i++) {
  //     if (test[i].name === "previous") {
  //       if (this.currentPage === 1) test[i].disabled = true;
  //     } else if (test[i].name === "next") {
  //       if (this.currentPage === totalPage) test[i].disabled = true;
  //     }
  //   }
  // }

  /**
   * Handle back or next
   * @param {*} event 
   */
  handleNavigation(event) {
    const action = event.target;
    switch (action.name) {
      case 'previous':
        if (this.currentPage > 1) {
          this.currentPage -= 1;
          this.getDataList(this.limitPage);
        }
        break;
      case 'next':
        if (this.currentPage < this.totalPageInList) {
          this.currentPage += 1;
          this.getDataList(this.limitPage);
        }
        break;
      default:
        console.log("a", action);
        break;
    }
  }

  /**
   * Close modal preview
   */
  closeModal() {
    this.bShowModal = false;
  }

  deleteSelected() {
    if (this.numberSelected > 0) {
      deleteRecordInList({ lstRecordId: this.lstIdSeleced }).then(() => {
        this.dispatchEvent(getToastMessage(TYPE_MESS.Success, `${this.numberSelected} records deleted`));
        refreshApex(this.dataList);
      }).catch((error) => {
        this.dispatchEvent(getToastMessage(TYPE_MESS.Error, error));
      })
    }
  }

  getSelectedRows(event) {
    const listSelected = event.detail.selectedRows;
    this.numberSelected = listSelected.length;
    if (listSelected.length > 0) {
      this.disableDelete = false;
      const lstRecordSeleced = [];
      for (let i = 0; i < listSelected.length; i++) {
        lstRecordSeleced.push(listSelected[i].Id);
      }
      this.lstIdSeleced = lstRecordSeleced;
    } else {
      this.disableDelete = true;
      this.lstIdSeleced = [];
    }
  }

  async handleSave(event) {
    const updatedFields = event.detail.draftValues;
    const result = await editRecordsInList({ data: updatedFields });
    console.log(JSON.stringify("Apex update result: " + result));
    this.dispatchEvent(getToastMessage(TYPE_MESS.Success, `Records updared`));
    this.editTable();
    refreshApex(this.dataList);
  }

  handleChangeLimitPage(event) {
    this.limitPage = event.detail.value;
    this.currentPage = 1;
    this.getDataList(event.detail.value);
    this.getPageInfo()
  }

  openSetting() {
    this.modeList = false;
  }

  closeSetting = () => {
    this.modeList = true;
  }

  updateDataTable = (event, id) => {
    if (event) {
      this.getFieldInfoData();
    }
  }

  refreshTableList = (event) => {
    if (event.detail.isRefresh) refreshApex(this.dataList);
  }

  /**
   * Render call back
   */
  renderedCallback() {
    if (this.currentPage === 1) {
      this.disableBack = true;
    } else {
      this.disableBack = false;
    }
    if (this.currentPage === this.totalPageInList) {
      this.disableNext = true;
    } else {
      this.disableNext = false;
    }
  }
}