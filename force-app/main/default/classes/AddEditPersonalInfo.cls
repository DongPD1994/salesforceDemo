public with sharing class AddEditPersonalInfo {
    @AuraEnabled(cacheable = false)
    public static boolean insertInfo(personal_info__c insertInfo){
        boolean isSuccess;
        try {
            if (personal_info__c.SObjectType.getDescribe().isAccessible()){
                insert insertInfo;
                isSuccess = true;
            }
        }
        catch (Exception e) {
            System.debug(e);
            isSuccess = false;
        }
        return isSuccess;
    }
}