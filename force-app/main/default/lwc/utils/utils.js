import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const TYPE_MESS = {
  Error : "error",
  Success : "success"
}

const getNumberPage = (numberRecord, limitPage) => {
  return numberRecord % limitPage == 0 ? numberRecord / limitPage : ~~(numberRecord / limitPage) + 1;
}

const getToastMessage = (type, mess) => {
  console.log("aa: ", type, mess)
  const eventMessSuccess = new ShowToastEvent({
    title: type === TYPE_MESS.Success ? "Success" : "Error",
    message: mess,
    variant: type.toString()
  })
  return eventMessSuccess;
}

const jsonParse = (str, defaultVal = null) => {
  try {
    return JSON.parse(str);
  } catch {
    return defaultVal;
  }
};

export {getNumberPage, getToastMessage, jsonParse, TYPE_MESS}