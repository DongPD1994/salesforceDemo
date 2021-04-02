public with sharing class GetFieldInfo {
    @AuraEnabled
    public static List<FieldInfo__c> getFieldInformation() {
        List<FieldInfo__c> lstFieldInfo;
        if (FieldInfo__c.SObjectType.getDescribe().isAccessible() && 
          Schema.SObjectType.FieldInfo__c.fields.Id.isAccessible() &&
          Schema.SObjectType.FieldInfo__c.fields.Name.isAccessible() &&
          Schema.SObjectType.FieldInfo__c.fields.field_name__c.isAccessible() &&
          Schema.SObjectType.FieldInfo__c.fields.is_show__c.isAccessible() &&
          Schema.SObjectType.FieldInfo__c.fields.width__c.isAccessible() &&
          Schema.SObjectType.FieldInfo__c.fields.field_type__c.isAccessible() &&
          Schema.SObjectType.FieldInfo__c.fields.order__c.isAccessible() &&
          Schema.SObjectType.FieldInfo__c.fields.label_name__c.isAccessible()
        ) {
            lstFieldInfo = [SELECT Id , 
                            Name, 
                            field_name__c, 
                            is_show__c, 
                            width__c,
                            field_type__c,
                            label_name__c 
                            FROM FieldInfo__c
                            ORDER BY order__c ASC NULLS LAST];
        }
        System.debug('******** logs end');
        System.debug(lstFieldInfo[0]);
        return lstFieldInfo;
    }
}