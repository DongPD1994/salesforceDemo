public with sharing class DeleteRecords {
    @AuraEnabled(cacheable = false)
    public static List<String> deleteRecordInList(List<String> lstRecordId) {
        List <String> errorMsg = new List < String > ();
        if (personal_info__c.SObjectType.getDescribe().isAccessible() && Schema.SObjectType.personal_info__c.fields.Id.isAccessible()){
            personal_info__c[] lstDeleteRec = [SELECT Id FROM personal_info__c WHERE Id IN: lstRecordId];
            system.debug(lstDeleteRec);
            Database.DeleteResult[] deleteResult = Database.delete(lstDeleteRec, false);
            for (Database.DeleteResult dr: deleteResult) {
                if (dr.isSuccess()) {
                    system.debug('Delete successful');
                } else {
                    errorMsg.add('');
                    for (Database.Error err: dr.getErrors()) {
                        errorMsg.add(err.getStatusCode() + ': ' + err.getMessage());
                    }
                }
            }
        }
        return errorMsg;
    }
}