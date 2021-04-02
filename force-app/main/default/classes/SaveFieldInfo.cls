public with sharing class SaveFieldInfo {
    @AuraEnabled(cacheable = false)
    public static string updateFieldInfo(Object data) {
        string mess;
        List<FieldInfo__c> dataForUpdate = (List<FieldInfo__c>) JSON.deserialize(
            JSON.serialize(data),
            List<FieldInfo__c>.class
        );
        system.debug(dataForUpdate);
        try {
            if (FieldInfo__c.SObjectType.getDescribe().isAccessible()){
                update dataForUpdate;
                mess = 'Success: field info updated successfully';
            }
        }
        catch (Exception e) {
           mess = 'The following exception has occurred: ' + e.getMessage();
        }
        return mess;
    }
}