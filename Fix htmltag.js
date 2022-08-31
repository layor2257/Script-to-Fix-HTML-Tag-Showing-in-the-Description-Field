/ Change entity name here
const entityName = "appointment"
// Change the field here
const columnName = "description"



// Request to find some metadata about the field being converted
fetch(`api/data/v9.0/EntityDefinitions(LogicalName='${entityName}')?$select=EntitySetName&$expand=Attributes`)
.then((r) => r.json())
.then((json) => {
const column = json.Attributes.find((attr) => attr.LogicalName === columnName)
// Odata Type "Microsoft.Dynamics.CRM.StringAttributeMetadata" or "Microsoft.Dynamics.CRM.MemoAttributeMetadata"
const odataType = column["@odata.type"]
// Schema name of the changed field
const schemaName = column.SchemaName
// MetadataId of the changed field
const columnMetadataId = column.MetadataId



// Enity metadata Id
const entityMetadataId = json.MetadataId



return {
entityMetadataId,
odataType,
schemaName,
columnMetadataId,
}
})
.then((data) => {
// Required headers
const headers = {
Accept: "application/json",
"Content-Type": "application/json; charset=utf-8",
"OData-MaxVersion": "4.0",
"OData-Version": "4.0",
}



// Attributes to update
const attributeUpdate = `{
"SchemaName": "${data.schemaName}",
"@odata.type": "${data.odataType}",
"FormatName": {
"Value": "RichText"
},
"Format": "RichText"
}`



// Request to update field to "RichText" format
return fetch(`api/data/v9.0/EntityDefinitions(${data.entityMetadataId})/Attributes(${data.columnMetadataId})`, {
headers,
method: "PUT",
body: attributeUpdate,
})
})
.then((result) => console.log(result))