public with sharing class SaveFieldInfo {
    @AuraEnabled(cacheable = false)
    public static boolean updateFieldInfo(Object data) {
        boolean isSuccess;
        List<FieldInfo__c> dataForUpdate = (List<FieldInfo__c>) JSON.deserialize(
            JSON.serialize(data),
            List<FieldInfo__c>.class
        );
        system.debug(dataForUpdate);
        try {
            if (FieldInfo__c.SObjectType.getDescribe().isAccessible()){
                update dataForUpdate;
                isSuccess = true;
            }
        }
        catch (Exception e) {
           isSuccess = false;
        }
        return isSuccess;
    }
}