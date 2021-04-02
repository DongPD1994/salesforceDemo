public with sharing class GetCount {
    @AuraEnabled(cacheable = true)
    public static Integer countRecordOfList(){
      Integer numberDatas = 0;
      if (personal_info__c.SObjectType.getDescribe().isAccessible()){
        numberDatas = [SELECT COUNT() FROM personal_info__c];
      }
      return numberDatas;
    }
}