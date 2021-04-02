public with sharing class DataTableLWC {

    @AuraEnabled(cacheable = true)
    public static List<personal_info__c> fetchDataList(Integer offsetNum, Integer limitNum){
      List<personal_info__c> listData;
      if (personal_info__c.SObjectType.getDescribe().isAccessible() && 
          Schema.SObjectType.personal_info__c.fields.Id.isAccessible() &&
          Schema.SObjectType.personal_info__c.fields.Name.isAccessible() &&
          Schema.SObjectType.personal_info__c.fields.first_name__c.isAccessible() &&
          Schema.SObjectType.personal_info__c.fields.last_name__c.isAccessible() &&
          Schema.SObjectType.personal_info__c.fields.birthday__c.isAccessible() &&
          Schema.SObjectType.personal_info__c.fields.address__c.isAccessible() &&
          Schema.SObjectType.personal_info__c.fields.email__c.isAccessible() &&
          Schema.SObjectType.personal_info__c.fields.phone_number__c.isAccessible() &&
          Schema.SObjectType.personal_info__c.fields.bio__c.isAccessible() &&
          Schema.SObjectType.personal_info__c.fields.links__c.isAccessible()
      ) {
        listData = [SELECT Id , 
                          Name, 
                          first_name__c, 
                          last_name__c, 
                          birthday__c, 
                          address__c, 
                          email__c, 
                          phone_number__c, 
                          bio__c,
                          links__c
                          FROM personal_info__c
                          LIMIT :limitNum
                          OFFSET :((offsetNum - 1) * limitNum)];
    }
    return listData;
  }

  @AuraEnabled(cacheable = true)
  public static Integer countRecordOfList(){
    Integer numberDatas = 0;
    if (personal_info__c.SObjectType.getDescribe().isAccessible()){
      numberDatas = [SELECT COUNT() FROM personal_info__c];
    }
    return numberDatas;
  }
}