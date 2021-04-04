public with sharing class AddEditPersonalInfo {
    @AuraEnabled(cacheable = false)
    public static string insertInfo(personal_info__c insertInfo){
        string mess;
        try {
            if (personal_info__c.SObjectType.getDescribe().isAccessible()){
                insert insertInfo;
                mess = 'Success: add successfully';
            }
        }
        catch (Exception e) {
           mess = 'The following exception has occurred: ' + e.getMessage();
        }
        return mess;
    }
}
