public with sharing class EditRecords {
    @AuraEnabled(cacheable = false)
    public static string editRecordsInList(Object data) {
        string mess;
        List<personal_info__c> dataForUpdate = (List<personal_info__c>) JSON.deserialize(
            JSON.serialize(data),
            List<personal_info__c>.class
        );
        system.debug(dataForUpdate);
        try {
            if (personal_info__c.SObjectType.getDescribe().isAccessible()){
                update dataForUpdate;
                mess = 'Success: contacts updated successfully';
            }
        }
        catch (Exception e) {
           mess = 'The following exception has occurred: ' + e.getMessage();
        }
        return mess;
    }
}