function deleteScriptProperty(){
  const prop=PropertiesService.getScriptProperties();
  prop.deleteAllProperties();
}
