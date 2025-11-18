{
"accountID": "73c9f403-949a-4950-9636-8c51fb1e4272",
"accountName": "testing-extend-session acc test person",
"accountLevel": "testing contract3",
"accountTimestamps": {
"timezone": "Asia/Ho_Chi_Minh"
},
"isBlocked": false,
"isNew": true,
"isSynced": false,
"displayInfo": true,
"enabledDomain": [
{
"domain": "ztest.hostedstaging3.com"
},
{
"domain": "qatest.hostedstaging3.com"
},
{
"domain": "dtest.hostedstaging3.com"
},
{
"domain": "mastertemplate.local"
},
{
"domain": "demo5.hostedstaging.com"
},
{
"domain": "demo.hostedstaging.com"
}
],
"enabledListeners": {
"internalClicks": {
"enabled": true,
"id": "4f99c6e0-07ca-4243-a39b-388f5a687665",
"listenerName": "Internal Clicks",
"type": "click",
"features": {
"internalLinkClick": {
"enabled": true,
"name": "Track Internal Clicks",
"customEventName": "",
"timestamps": true,
"featureId": "4a9ca30a-6245-4638-995a-84cf3f4c02ef",
"event": "internalLinkClick",
"featuresSupport": [],
"config": {}
}
}
},
"pdfClicks": {
"enabled": true,
"id": "0b87ed28-0884-446f-85e0-388c3bc261e2",
"listenerName": "PDF & Document Clicks",
"type": "click",
"features": {
"documentLinkClick": {
"enabled": true,
"name": "Track PDF Clicks",
"customEventName": "",
"timestamps": true,
"featureId": "d78525c7-85e9-4807-8a60-b5d2185012da",
"event": "documentLinkClick",
"featuresSupport": [],
"config": {}
}
}
},
"clickIDs": {
"enabled": true,
"id": "ff86eaf0-ee22-435c-be30-ac5f8d71434f",
"listenerName": "Click IDs",
"type": "click",
"features": {
"clickID": {
"enabled": true,
"name": "Capture Click IDs",
"customEventName": "testID",
"timestamps": true,
"featureId": "40110082-8baa-4663-b882-fcba8015218e",
"event": "clickID",
"featuresSupport": [
{
"clickIdSettings": [
{
"id": "68412ade-31a8-4a41-8683-dbad2427dcb9",
"type": "url_parameter",
"name": "gclid",
"prioritize": "first_value"
},
{
"id": "5e2416f6-6321-4f98-977b-fcc7acb7b36d",
"type": "url_parameter",
"name": "msclkid",
"prioritize": "first_value"
},
{
"id": "de91907b-914d-4f71-bb03-8b5ba48ef47f",
"type": "url_parameter",
"name": "fbclid",
"prioritize": "first_value"
},
{
"id": "d8c02cec-70da-4dac-a275-5d8a7e984d01",
"type": "cookie",
"name": "_ga",
"prioritize": "first_value"
},
{
"id": "116da2b7-4a42-411a-a6dd-7f02fc8261c1",
"type": "cookie",
"name": "_fbc",
"prioritize": "first_value"
},
{
"id": "eb7e44fd-7531-416c-a086-c5416e445941",
"type": "cookie",
"name": "_fbp",
"prioritize": "first_value"
},
{
"id": "b571cc2e-00ad-4c58-a1d7-e3e2385f7b7e",
"type": "url_parameter",
"name": "li_fat_id",
"prioritize": "first_value"
},
{
"id": "5d42eee7-7cb1-49e0-9144-43c819acdb9d",
"type": "local_storage",
"name": "local 1",
"prioritize": "last_value"
}
]
}
],
"config": {}
}
}
},
"pageView": {
"enabled": true,
"id": "3468b155-d395-4193-9e9f-34e822bcbf69",
"listenerName": "Pageviews",
"type": "page",
"features": {
"pageView": {
"enabled": true,
"name": "Page View",
"customEventName": "",
"timestamps": true,
"featureId": "c9680191-0a58-44eb-918a-f75371171dc7",
"event": "pageView",
"featuresSupport": [],
"config": {}
}
}
},
"sessionEngagement": {
"enabled": true,
"id": "c11547ae-3f8d-46bc-b729-5b70e705e71c",
"listenerName": "Session Engagement",
"type": "engagement",
"features": {
"tabHidden": {
"enabled": true,
"name": "Tab Hidden",
"customEventName": "",
"timestamps": true,
"featureId": "66bcbb0e-2e37-4ea8-8281-5e9bbd18e466",
"event": "tabHidden",
"featuresSupport": [],
"config": {}
},
"tabVisible": {
"enabled": true,
"name": "Session Engagement Tab Visible",
"customEventName": "",
"timestamps": true,
"featureId": "5b5b389a-bb52-437d-b2ad-1653672c990c",
"event": "tabVisible",
"featuresSupport": [],
"config": {}
},
"tabClosed": {
"enabled": true,
"name": "Session Engagement Tab Closed",
"customEventName": "",
"timestamps": true,
"featureId": "bac01bb1-6886-4a86-9b1d-f32569213fde",
"event": "tabClosed",
"featuresSupport": [],
"config": {}
},
"engagedSession": {
"enabled": true,
"name": "Engaged Session",
"customEventName": "",
"timestamps": true,
"featureId": "e684b810-74b1-47cc-8c29-63bf0eefcb3a",
"event": "engagedSession",
"featuresSupport": [],
"config": {}
},
"tabIdle": {
"enabled": true,
"name": "tabIdle",
"customEventName": "",
"timestamps": true,
"featureId": "7507b63b-e670-49ba-b06e-3ff88a3e4a0f",
"event": "tabIdle",
"featuresSupport": [],
"config": {}
},
"scrollDepth": {
"enabled": true,
"name": "Scroll Depth",
"customEventName": "",
"timestamps": true,
"featureId": "a84d93b7-b97c-4965-b592-fb53294f4808",
"event": "scrollDepth",
"featuresSupport": [],
"config": {
"scrollDepth": [
{
"value": 10,
"bottomOfPage": false
},
{
"value": 25,
"bottomOfPage": false
},
{
"value": 50,
"bottomOfPage": false
},
{
"value": 75,
"bottomOfPage": false
},
{
"value": 90,
"bottomOfPage": true
},
{
"value": 100,
"bottomOfPage": false
}
]
}
}
}
},
"clickToCall": {
"enabled": true,
"id": "70668419-a16f-4cfd-9b68-417921425257",
"listenerName": "Click to Call",
"type": "click",
"features": {
"clickToCall": {
"enabled": true,
"name": "Click to Call",
"customEventName": "",
"timestamps": true,
"featureId": "b4f5a917-20ed-4cf1-add0-a93643fb19da",
"event": "clickToCall",
"featuresSupport": [],
"config": {}
}
}
},
"userDevice": {
"enabled": true,
"id": "99c56dbe-2075-4f08-a4f0-47c21ddbc8b8",
"listenerName": "User Device",
"type": "ud",
"features": {
"userDevice": {
"enabled": true,
"name": "Capture User Device",
"customEventName": "",
"timestamps": true,
"featureId": "ad022a2f-71b8-4a28-ae7f-832cd1313cd9",
"event": "userDevice",
"featuresSupport": [],
"config": {}
}
}
},
"userSource": {
"enabled": true,
"id": "2c12bc2d-4060-4ef3-a096-d3433e522a98",
"listenerName": "User Source",
"type": "source",
"features": {
"userSource": {
"enabled": true,
"name": "Capture User Source",
"customEventName": "",
"timestamps": true,
"featureId": "c1131b75-29dd-41fe-844d-04b85b87a94f",
"event": "userSource",
"featuresSupport": [
{
"engagement": [
{
"id": "a9200dbe-5931-4346-8d53-0fdad8fdce5a",
"name": "Push Event on Every Container Load",
"code": "pushEventonEveryContainerLoad",
"type": "source",
"status": false
}
]
}
],
"config": {}
}
}
},
"urlParameters": {
"enabled": true,
"id": "fcbfb931-6719-4e2a-9d05-185140edec03",
"listenerName": "URL Parameters",
"type": "url",
"features": {
"urlParameters": {
"enabled": true,
"name": "Capture Parameters",
"customEventName": "",
"timestamps": true,
"featureId": "32c95d22-5250-46cf-a382-f1c62718d69d",
"event": "urlParameters",
"featuresSupport": [],
"config": {}
}
}
},
"outboundClicks": {
"enabled": true,
"id": "106eb42e-30d6-4095-a618-3fc0379a9888",
"listenerName": "Outbound Clicks",
"type": "click",
"features": {
"outboundClick": {
"enabled": true,
"name": "Track Outbound Clicks",
"customEventName": "",
"timestamps": true,
"featureId": "335efc0d-8cfc-402d-9b93-93aba86ba949",
"event": "outboundClick",
"featuresSupport": [],
"config": {}
}
}
},
"userGeolocation": {
"enabled": true,
"id": "847b6bd7-63b9-487f-a614-99d91493238b",
"listenerName": "User Geolocation",
"type": "ug",
"features": {
"userGeolocation": {
"enabled": true,
"name": "Get User’s General Location",
"customEventName": "",
"timestamps": true,
"featureId": "8d755b73-3573-4f63-9c0c-caee1fbe862a",
"event": "userGeolocation",
"featuresSupport": [
{
"id": "ea123187-7303-4040-92f4-286664824d82",
"code": "userGeolocationPreciseLocation",
"name": "Ask for Precise Location",
"status": true,
"askForPreciseLocation": {
"askForPreciseLocation": {
"askTheUserForTheirPreciseLocation": "Immediately when their session begins",
"userDoesNotClickOnThePopup": "Keep showing it on every page",
"whenGetUserGeneralLocation": "Immediately upon their visit"
}
}
}
],
"config": {}
}
}
},
"marketoForms": {
"enabled": true,
"id": "3b9582a7-d02a-4f15-b6ee-94183a3f6ee1",
"listenerName": "Marketo Forms",
"type": "form",
"features": {
"marketoFormSubmitted": {
"enabled": true,
"name": "Form Submissions",
"customEventName": "",
"timestamps": true,
"featureId": "82a4d579-e56f-493a-b628-35e6244f0205",
"event": "marketoFormSubmitted",
"featuresSupport": [],
"config": {}
},
"marketoFormLoaded": {
"enabled": true,
"name": "Form Loads",
"customEventName": "",
"timestamps": true,
"featureId": "654021c1-ace4-424f-a978-b0c879637538",
"event": "marketoFormLoaded",
"featuresSupport": [],
"config": {}
},
"marketoFormValidationFailed": {
"enabled": true,
"name": "Form Validations",
"customEventName": "",
"timestamps": true,
"featureId": "70df5fb3-b6f8-47ca-92ba-de232b656abe",
"event": "marketoFormValidationFailed",
"featuresSupport": [],
"config": {}
},
"marketoFormVisible": {
"enabled": true,
"name": "Form Visible",
"customEventName": "",
"timestamps": true,
"featureId": "d8811f3b-58b0-46b6-b962-d698cdbaf1fb",
"event": "marketoFormVisible",
"featuresSupport": [],
"config": {}
},
"marketoFormStart": {
"enabled": true,
"name": "Form Start",
"customEventName": "",
"timestamps": true,
"featureId": "728bc8b7-f56e-4a8e-b529-63bbc2d8f53d",
"event": "marketoFormStart",
"featuresSupport": [],
"config": {}
},
"marketoFormFieldComplete": {
"enabled": true,
"name": "Form Field Complete",
"customEventName": "",
"timestamps": true,
"featureId": "751bd8a1-4dd4-4df5-95a2-2b0158a4fe0d",
"event": "marketoFormFieldComplete",
"featuresSupport": [],
"config": {}
},
"marketoFormFieldStart": {
"enabled": true,
"name": "Form Field Start",
"customEventName": "",
"timestamps": true,
"featureId": "b0506cbc-1e68-4b07-ad61-5fe9a96b105d",
"event": "marketoFormFieldStart",
"featuresSupport": [],
"config": {}
}
}
},
"gravityForms": {
"enabled": true,
"id": "29101358-b3ca-4f12-a456-4111bd7acfcb",
"listenerName": "Gravity Forms",
"type": "form",
"features": {
"gfFormSubmitted": {
"enabled": true,
"name": "Single-step Form Submissions",
"customEventName": "",
"timestamps": true,
"featureId": "9c106d6c-9d28-47b3-8da1-cb4b7a327877",
"event": "gfFormSubmitted",
"featuresSupport": [],
"config": {}
},
"gfFormStepsSubmitted": {
"enabled": true,
"name": "Multi-step Form Submissions",
"customEventName": "",
"timestamps": true,
"featureId": "5ef502e2-361a-454a-90bd-4ad7ab933886",
"event": "gfFormStepsSubmitted",
"featuresSupport": [],
"config": {}
},
"gfFormLoaded": {
"enabled": true,
"name": "Form Loads",
"customEventName": "",
"timestamps": true,
"featureId": "d3e9fd9e-80f7-4a24-8989-c617e336b3ae",
"event": "gfFormLoaded",
"featuresSupport": [],
"config": {}
},
"gfFormValidationFailed": {
"enabled": true,
"name": "Form Validations",
"customEventName": "",
"timestamps": true,
"featureId": "709ecd2b-6fc6-4890-a9f2-dbeca8c03b6f",
"event": "gfFormValidationFailed",
"featuresSupport": [],
"config": {}
},
"selectorBasedValues": {
"enabled": true,
"name": "Selector-Based Automatic Values",
"customEventName": "",
"timestamps": true,
"featureId": "5eb4c53e-47ec-48d8-acf0-483b354d58da",
"event": "selectorBasedValues",
"featuresSupport": [],
"config": {}
},
"gfFormFieldStart": {
"enabled": true,
"name": "Form Field Start",
"customEventName": "",
"timestamps": true,
"featureId": "01dd7ca2-9e85-44a1-9b06-a721461ad6f4",
"event": "gfFormFieldStart",
"featuresSupport": [],
"config": {}
},
"gfFormStepChange": {
"enabled": true,
"name": "Gravity Form Step Change",
"customEventName": "",
"timestamps": true,
"featureId": "1c51f0b0-9cc4-40aa-8743-8a515587edff",
"event": "gfFormStepChange",
"featuresSupport": [],
"config": {}
},
"gfFormFieldComplete": {
"enabled": true,
"name": "Form Field Complete",
"customEventName": "",
"timestamps": true,
"featureId": "30544e1d-f35e-49c0-a691-8048f11183d3",
"event": "gfFormFieldComplete",
"featuresSupport": [],
"config": {}
},
"gfFormVisible": {
"enabled": true,
"name": "Form Visible",
"customEventName": "",
"timestamps": true,
"featureId": "d136870e-100e-4434-994d-2620b2aeddcf",
"event": "gfFormVisible",
"featuresSupport": [],
"config": {}
},
"gfFormStart": {
"enabled": true,
"name": "Form Start",
"customEventName": "",
"timestamps": true,
"featureId": "9ffbb866-6255-484a-8854-9c7f2ae7d0da",
"event": "gfFormStart",
"featuresSupport": [],
"config": {}
},
"gfFormStepStart": {
"enabled": true,
"name": "Form Step Start",
"customEventName": "",
"timestamps": true,
"featureId": "a2efefac-eee8-4882-8c0c-b4cfb11cfb17",
"event": "gfFormStepStart",
"featuresSupport": [],
"config": {}
}
}
},
"fluentForms": {
"enabled": true,
"id": "7306c076-d92d-4245-98a5-e797d2df9860",
"listenerName": "Fluent Forms",
"type": "form",
"features": {
"flFormStepChange": {
"enabled": true,
"name": "Fluent Form Step Change",
"customEventName": "",
"timestamps": true,
"featureId": "ae8400a7-a435-4a14-aac3-bd554d184b11",
"event": "flFormStepChange",
"featuresSupport": [],
"config": {}
},
"flFormStepsSubmitted": {
"enabled": true,
"name": "Fluent Form Steps Submitted",
"customEventName": "",
"timestamps": true,
"featureId": "ac2f266f-43db-4a5d-80f5-bded5714bac8",
"event": "flFormStepsSubmitted",
"featuresSupport": [
"flFormsSendAfter"
],
"config": {}
},
"flFormLoaded": {
"enabled": true,
"name": "Fluent Form Loaded",
"customEventName": "",
"timestamps": true,
"featureId": "bd5d7795-ab70-4c08-a655-cc3cbeab3c40",
"event": "flFormLoaded",
"featuresSupport": [],
"config": {}
},
"flFormSubmitted": {
"enabled": true,
"name": "Fluent Forms Submitted",
"customEventName": "",
"timestamps": true,
"featureId": "25aea638-3906-4457-986d-c0d1ecb484e4",
"event": "flFormSubmitted",
"featuresSupport": [
"flFormsSendAfter"
],
"config": {}
},
"flFormValidationFailed": {
"enabled": true,
"name": "Fluent Forms Validation Failed",
"customEventName": "",
"timestamps": true,
"featureId": "e7cff2c1-1904-49b2-8dcb-fdc031e82ba2",
"event": "flFormValidationFailed",
"featuresSupport": [],
"config": {}
}
}
},
"hubspotForms": {
"enabled": true,
"id": "e8a033b0-6f13-4dea-b109-aa234660331f",
"listenerName": "Hubspot Forms",
"type": "form",
"features": {
"hsPopupLoaded": {
"enabled": true,
"name": "Popup Form Loads",
"customEventName": "",
"timestamps": true,
"featureId": "a4c82a55-1405-4fb4-a571-96816c20030f",
"event": "hsPopupLoaded",
"featuresSupport": [],
"config": {}
},
"hsFormFieldComplete": {
"enabled": true,
"name": "Form Field Complete",
"customEventName": "",
"timestamps": true,
"featureId": "c348eb09-4f83-4811-8c18-9d2b64431d9a",
"event": "hsFormFieldComplete",
"featuresSupport": [],
"config": {}
},
"hsFormLoaded": {
"enabled": true,
"name": "Form Loads",
"customEventName": "",
"timestamps": true,
"featureId": "b4e3ac9b-7668-4e01-87ef-0d89ce41de33",
"event": "hsFormLoaded",
"featuresSupport": [],
"config": {}
},
"hsFormValidationFailed": {
"enabled": true,
"name": "Form Validations",
"customEventName": "",
"timestamps": true,
"featureId": "26f4ec0a-471f-4acb-9825-5c802960537e",
"event": "hsFormValidationFailed",
"featuresSupport": [],
"config": {}
},
"hsFormSubmitted": {
"enabled": true,
"name": "Form Submissions",
"customEventName": "",
"timestamps": true,
"featureId": "953e1751-3ace-4097-bec9-2ab614042454",
"event": "hsFormSubmitted",
"featuresSupport": [],
"config": {}
},
"hsPopupSubmitted": {
"enabled": true,
"name": "Popup Form Submissions",
"customEventName": "",
"timestamps": true,
"featureId": "53ed763d-6108-4a67-8fff-b604703ec687",
"event": "hsPopupSubmitted",
"featuresSupport": [],
"config": {}
},
"hsPopupValidationFailed": {
"enabled": true,
"name": "Popup Form Validations",
"customEventName": "",
"timestamps": true,
"featureId": "a6b5355b-5e99-441b-b655-d6a07028c848",
"event": "hsPopupValidationFailed",
"featuresSupport": [],
"config": {}
},
"hsFormStart": {
"enabled": true,
"name": "Form Start",
"customEventName": "",
"timestamps": true,
"featureId": "90fff37b-19c9-4695-b955-7da1515a700a",
"event": "hsFormStart",
"featuresSupport": [],
"config": {}
},
"hsPopupStart": {
"enabled": true,
"name": "Popup Form Start",
"customEventName": "",
"timestamps": true,
"featureId": "bee929f1-f984-4a73-913f-b60ab8328df7",
"event": "hsPopupStart",
"featuresSupport": [],
"config": {}
},
"hsFormVisible": {
"enabled": true,
"name": "Form Visible",
"customEventName": "",
"timestamps": true,
"featureId": "e4d49279-0f5d-4f12-bea2-b5d0383057fc",
"event": "hsFormVisible",
"featuresSupport": [],
"config": {}
},
"hsPopupVisible": {
"enabled": true,
"name": "Popup Form Visible",
"customEventName": "",
"timestamps": true,
"featureId": "4b3bb259-e1d0-483e-9e53-03576d2de518",
"event": "hsPopupVisible",
"featuresSupport": [],
"config": {}
},
"hsFormFieldStart": {
"enabled": true,
"name": "Form Field Start",
"customEventName": "",
"timestamps": true,
"featureId": "89fd87b8-9906-41e2-8816-d4267821e208",
"event": "hsFormFieldStart",
"featuresSupport": [],
"config": {}
}
}
},
"livechat": {
"enabled": true,
"id": "07d155ec-cc28-46fc-b6d3-691f178725f8",
"listenerName": "LiveChat",
"type": "chat",
"features": {
"livechatMessagefromAgent": {
"enabled": true,
"name": "Live Chat Message from Agent",
"customEventName": "",
"timestamps": true,
"featureId": "da8b8536-4022-4581-88d1-1a5ff4c6bfce",
"event": "livechatMessagefromAgent",
"featuresSupport": [],
"config": {}
},
"livechatMessagefromUser": {
"enabled": true,
"name": "Live Chat Message from User",
"customEventName": "",
"timestamps": true,
"featureId": "38560d43-8d18-4d43-84a6-7f257d02cfa9",
"event": "livechatMessagefromUser",
"featuresSupport": [],
"config": {}
},
"livechatChatStarted": {
"enabled": true,
"name": "Live Chat Started",
"customEventName": "",
"timestamps": true,
"featureId": "6e259108-6de9-48c0-906b-123541ec742c",
"event": "livechatChatStarted",
"featuresSupport": [],
"config": {}
},
"livechatUserEnteredEmail": {
"enabled": true,
"name": "User Entered Email",
"customEventName": "",
"timestamps": true,
"featureId": "7439d791-1827-4140-ba36-4f03cc65d3d6",
"event": "livechatUserEnteredEmail",
"featuresSupport": [],
"config": {}
},
"livechatAgentOfflineForm": {
"enabled": true,
"name": "Track Agent Offline Form",
"customEventName": "",
"timestamps": true,
"featureId": "d8dd08cf-e186-49c6-a01b-222ec23b645b",
"event": "livechatAgentOfflineForm",
"featuresSupport": [],
"config": {}
}
}
},
"drift": {
"enabled": true,
"id": "6575f587-35ff-4834-aaa2-2d3f6c890556",
"listenerName": "Drift Chat",
"type": "chat",
"features": {
"driftChatStarted": {
"enabled": true,
"name": "Chat Started",
"customEventName": "",
"timestamps": true,
"featureId": "743a8e7e-e4ca-4726-9a4c-3f2edaa81b6d",
"event": "driftChatStarted",
"featuresSupport": [],
"config": {}
},
"driftMessagefromAgent": {
"enabled": true,
"name": "Message from Agent",
"customEventName": "",
"timestamps": true,
"featureId": "c377dfa5-2bf6-4eb4-b5fa-1761b9de1d8f",
"event": "driftMessagefromAgent",
"featuresSupport": [],
"config": {}
},
"driftUserEnteredEmail": {
"enabled": true,
"name": "User Entered Email",
"customEventName": "",
"timestamps": true,
"featureId": "56e4496b-2073-4f22-9cbb-832ffcda374f",
"event": "driftUserEnteredEmail",
"featuresSupport": [],
"config": {}
},
"driftMessagefromUser": {
"enabled": true,
"name": "Message From User",
"customEventName": "",
"timestamps": true,
"featureId": "99a60ba1-7716-4e78-817e-b2dc78b0a0ee",
"event": "driftMessagefromUser",
"featuresSupport": [],
"config": {}
}
}
},
"woocommerce": {
"enabled": true,
"id": "a6c186f2-86e5-40ce-8a88-2ab2951a1611",
"listenerName": "WooCommerce",
"type": "ecom",
"features": {
"wooViewCart": {
"enabled": true,
"name": "View Cart",
"customEventName": "",
"timestamps": true,
"featureId": "8407e770-1af7-4c44-be7d-b5787aa2f67b",
"event": "wooViewCart",
"featuresSupport": [],
"config": {}
},
"wooViewItemList": {
"enabled": true,
"name": "View List of Products",
"customEventName": "",
"timestamps": true,
"featureId": "1cb3b7eb-62ec-4556-ad00-e077962273ab",
"event": "wooViewItemList",
"featuresSupport": [],
"config": {}
},
"wooAddShipping": {
"enabled": true,
"name": "Add Shipping",
"customEventName": "",
"timestamps": true,
"featureId": "05900b84-4a1d-4771-808d-4ae1d7c6ce3c",
"event": "wooAddShipping",
"featuresSupport": [],
"config": {}
},
"wooPurchase": {
"enabled": true,
"name": "Purchase",
"customEventName": "",
"timestamps": true,
"featureId": "c3b8f578-4265-4e7f-a07f-2caf3237b4ec",
"event": "wooPurchase",
"featuresSupport": [],
"config": {}
},
"wooClickItem": {
"enabled": true,
"name": "Click Product",
"customEventName": "",
"timestamps": true,
"featureId": "aff32610-2b28-4fc3-817c-06fb8c0e71fa",
"event": "wooClickItem",
"featuresSupport": [],
"config": {}
},
"wooAddPayment": {
"enabled": true,
"name": "Add Payment",
"customEventName": "",
"timestamps": true,
"featureId": "3960a193-eb22-479a-a417-ae60f8154418",
"event": "wooAddPayment",
"featuresSupport": [],
"config": {}
},
"wooAddToCart": {
"enabled": true,
"name": "Add to Cart",
"customEventName": "",
"timestamps": true,
"featureId": "8ceb7e56-d05c-4dff-a1f5-1d0352e14813",
"event": "wooAddToCart",
"featuresSupport": [],
"config": {}
},
"wooBeginCheckout": {
"enabled": true,
"name": "Begin Checkout",
"customEventName": "",
"timestamps": true,
"featureId": "6708a001-5d7a-4c7d-9653-e2b815b3484c",
"event": "wooBeginCheckout",
"featuresSupport": [],
"config": {}
},
"wooRemoveFromCart": {
"enabled": true,
"name": "Remove from Cart",
"customEventName": "",
"timestamps": true,
"featureId": "fcc8315a-6074-49d2-a059-e4758b22143b",
"event": "wooRemoveFromCart",
"featuresSupport": [],
"config": {}
},
"wooViewItemPage": {
"enabled": true,
"name": "View Product Page",
"customEventName": "",
"timestamps": true,
"featureId": "7793cfab-020c-489d-8fb0-8096da932252",
"event": "wooViewItemPage",
"featuresSupport": [],
"config": {}
}
}
},
"vidyard": {
"enabled": true,
"id": "12c42181-830f-4774-be51-99d9549b35bd",
"listenerName": "Vidyard",
"type": "video",
"features": {
"vidyardProgress": {
"enabled": true,
"name": "Video Progress",
"customEventName": "",
"timestamps": true,
"featureId": "7a14e1ee-c8c2-4617-b41d-60d2d2450d52",
"event": "vidyardProgress",
"featuresSupport": [
{
"video": [
"25",
"50",
"75",
"100"
]
}
],
"config": {}
},
"vidyardVideoEnd": {
"enabled": true,
"name": "Vidyard Video End",
"customEventName": "",
"timestamps": true,
"featureId": "a937fd87-bd7a-4d2e-a17f-1b7b15652cba",
"event": "vidyardVideoEnd",
"featuresSupport": [],
"config": {}
},
"vidyardEngagement": {
"enabled": true,
"name": "Video Engagement",
"customEventName": "",
"timestamps": true,
"featureId": "d74ad20a-b566-4e88-b100-cb5334740511",
"event": "vidyardEngagement",
"featuresSupport": [
"videoPlay",
"videoStop",
"videoVolume",
"videoSize",
"videoQuality",
"videoSeek"
],
"config": {}
},
"vidyardVideoStart": {
"enabled": true,
"name": "Vidyard Video Start",
"customEventName": "",
"timestamps": true,
"featureId": "c1b1fe0d-b5fb-4e2b-bb8a-e40bdc215512",
"event": "vidyardVideoStart",
"featuresSupport": [],
"config": {}
},
"vidyardVideoLoaded": {
"enabled": true,
"name": "Video Loads",
"customEventName": "",
"timestamps": true,
"featureId": "ad46f24e-3c58-47fc-93f0-d8e34c9ec2e3",
"event": "vidyardVideoLoaded",
"featuresSupport": [],
"config": {}
}
}
},
"userWeather": {
"enabled": true,
"id": "755172c3-15c4-4db7-a0c8-8d4e005ede5a",
"listenerName": "User Weather",
"type": "uw",
"features": {
"currentWeather": {
"enabled": true,
"name": "Capture User Weather",
"customEventName": "",
"timestamps": true,
"featureId": "c6e4dbd8-075a-4c60-8dd7-efaa8c701049",
"event": "currentWeather",
"featuresSupport": [
{
"temperature": {
"useFahrenheit": true,
"data": [
{
"label": "Very Hot",
"value": [
"greater than",
98
]
},
{
"label": "Hot",
"value": [
80,
98
]
},
{
"label": "Warm",
"value": [
65,
80
]
},
{
"label": "Mild",
"value": [
50,
65
]
},
{
"label": "Chilly",
"value": [
39,
49
]
},
{
"label": "Cold",
"value": [
27,
38
]
},
{
"label": "Freezing",
"value": [
"less than",
27
]
}
]
}
}
],
"config": {}
},
"recentWeather": {
"enabled": true,
"name": "Recent Weather",
"customEventName": "",
"timestamps": true,
"featureId": "c4fce3cc-20f6-4ba9-8c71-4184a647f6cd",
"event": "recentWeather",
"featuresSupport": [
{
"temperature": {
"useFahrenheit": true,
"data": [
{
"label": "Very Hot",
"value": [
"greater than",
98
]
},
{
"label": "Hot",
"value": [
80,
98
]
},
{
"label": "Warm",
"value": [
65,
80
]
},
{
"label": "Mild",
"value": [
50,
65
]
},
{
"label": "Chilly",
"value": [
39,
49
]
},
{
"label": "Cold",
"value": [
27,
38
]
},
{
"label": "Freezing",
"value": [
"less than",
27
]
}
]
}
}
],
"config": {}
}
}
},
"contactForm7": {
"enabled": true,
"id": "3eab9b1a-cf32-4329-b26d-e6fbb8b4a698",
"listenerName": "Contact Form 7",
"type": "form",
"features": {
"cf7FormSubmitted": {
"enabled": true,
"name": "Form Submissions",
"customEventName": "",
"timestamps": true,
"featureId": "1ac0fe7b-c6d3-4d01-89be-f9881e6bd1dd",
"event": "cf7FormSubmitted",
"featuresSupport": [],
"config": {}
},
"cf7FormLoaded": {
"enabled": true,
"name": "Form Loads",
"customEventName": "",
"timestamps": true,
"featureId": "4f14c74b-00f0-442e-9a4b-2f7c1a17b833",
"event": "cf7FormLoaded",
"featuresSupport": [],
"config": {}
},
"cf7FormValidationFailed": {
"enabled": true,
"name": "Form Validations",
"customEventName": "",
"timestamps": true,
"featureId": "18ee706e-0387-4ef5-aae5-0036f44a0655",
"event": "cf7FormValidationFailed",
"featuresSupport": [],
"config": {}
}
}
},
"mailchimp": {
"enabled": true,
"id": "d28fb1dc-1f18-45af-9a4f-92c5d1c852ed",
"listenerName": "MailChimp Forms",
"type": "form",
"features": {
"mailchimpFormSubmitted": {
"enabled": true,
"name": "Form Submissions",
"customEventName": "",
"timestamps": true,
"featureId": "cd1f9637-3b17-48ba-a5e9-1dc25acb09b5",
"event": "mailchimpFormSubmitted",
"featuresSupport": [],
"config": {}
},
"mailchimpFormValidationFailed": {
"enabled": true,
"name": "Form Validations",
"customEventName": "",
"timestamps": true,
"featureId": "b0e38316-4430-43be-8efb-ac4b970441ba",
"event": "mailchimpFormValidationFailed",
"featuresSupport": [],
"config": {}
},
"mailchimpFormLoaded": {
"enabled": true,
"name": "Form Loads",
"customEventName": "",
"timestamps": true,
"featureId": "caa10733-14a5-4e33-88aa-a01d0afffebb",
"event": "mailchimpFormLoaded",
"featuresSupport": [],
"config": {}
}
}
},
"uberflip": {
"enabled": true,
"id": "487d91d0-2907-4265-829e-9dcfab48e05d",
"listenerName": "Uberflip",
"type": "form",
"features": {
"uberflipFormSubmitted": {
"enabled": true,
"name": "Form CTA Submissions",
"customEventName": "",
"timestamps": true,
"featureId": "4de7ee23-ba03-4d40-882a-30027ed257b8",
"event": "uberflipFormSubmitted",
"featuresSupport": [],
"config": {}
},
"uberflipFormLoaded": {
"enabled": true,
"name": "Form CTA Loads",
"customEventName": "",
"timestamps": true,
"featureId": "ba81c75c-13ce-48e4-b2fd-318bce4e1fd1",
"event": "uberflipFormLoaded",
"featuresSupport": [],
"config": {}
},
"uberflipFormValidationFailed": {
"enabled": true,
"name": "Form CTA Validations",
"customEventName": "",
"timestamps": true,
"featureId": "d6e7083c-8060-4e49-aafc-c230d21c8b4e",
"event": "uberflipFormValidationFailed",
"featuresSupport": [],
"config": {}
}
}
},
"nativeBrowserStorage": {
"enabled": true,
"id": "409b57da-8e3c-48f3-ba66-d2c9b797649d",
"listenerName": "Native Browser Storage",
"type": "nativebrowserstorage",
"features": {
"nativeLocalStorage": {
"enabled": true,
"name": "Get Native Local Storage",
"customEventName": "",
"timestamps": true,
"featureId": "e6aad305-8a7b-43de-bd8e-0c88fc3ae6e4",
"event": "nativeLocalStorage",
"featuresSupport": [
{
"native": [
{
"nativeId": "c502da33-083e-2fa4-beb2-e8d9cf40443c",
"name": "local value",
"type": "local storage",
"format": "single value",
"valueChange": true
}
]
}
],
"config": {}
},
"nativeCookie": {
"enabled": true,
"name": "Get Native Cookies",
"customEventName": "",
"timestamps": true,
"featureId": "a28781ab-5293-4a23-830e-b2b74b809d7f",
"event": "nativeCookie",
"featuresSupport": [],
"config": {}
},
"nativeSessionStorage": {
"enabled": true,
"name": "Get Native Session Storage",
"customEventName": "",
"timestamps": true,
"featureId": "ef7b90f4-5359-4ca1-b7ae-ac9392f7759a",
"event": "nativeSessionStorage",
"featuresSupport": [
{
"native": [
{
"nativeId": "69c6ae6a-77a0-fa46-7b2b-cfef08bf0cbe",
"name": "session value",
"type": "session storage",
"format": "json",
"valueChange": true
},
{
"nativeId": "6abdedf2-3428-90f1-c7ce-ee8ea5710afd",
"name": "session value 1",
"type": "session storage",
"format": "single value",
"valueChange": true
}
]
}
],
"config": {}
}
}
},
"nativeDataLayers": {
"enabled": true,
"id": "c2fb5436-586d-43e5-9752-5223da4c520e",
"listenerName": "Native Data Layers",
"type": "nativedatalayer",
"features": {
"nativeDataLayer": {
"enabled": true,
"name": "Capture Native Data Layers",
"customEventName": "",
"timestamps": true,
"featureId": "b12b1ad5-4046-4a01-85fa-f1231c24c772",
"event": "nativeDataLayer",
"featuresSupport": [
{
"event": "pageView",
"eventsCollectPerson": false
}
],
"config": {}
}
}
},
"activeCampaign": {
"enabled": true,
"id": "db528860-1762-458c-b008-55e4e4cee0d7",
"listenerName": "ActiveCampaign Forms",
"type": "form",
"features": {
"acFormSubmitted": {
"enabled": true,
"name": "Form Submissions | Regular Forms",
"customEventName": "",
"timestamps": true,
"featureId": "463b377d-ecdf-4e44-a1fc-9fe8d521157c",
"event": "acFormSubmitted",
"featuresSupport": [],
"config": {}
},
"acFormLoaded": {
"enabled": true,
"name": "Form Loads | Regular Forms",
"customEventName": "",
"timestamps": true,
"featureId": "f65f5215-e7dc-4e59-9ca9-a6e331baf6a1",
"event": "acFormLoaded",
"featuresSupport": [],
"config": {}
},
"acPopupSubmitted": {
"enabled": true,
"name": "Form Submissions | Popup Forms",
"customEventName": "",
"timestamps": true,
"featureId": "7c0389eb-2290-41f4-a18f-e7c2232a9fd9",
"event": "acPopupSubmitted",
"featuresSupport": [],
"config": {}
},
"acPopupLoaded": {
"enabled": true,
"name": "Form Loads | Popup Forms",
"customEventName": "",
"timestamps": true,
"featureId": "37889082-8dca-4420-bc59-f3e109069697",
"event": "acPopupLoaded",
"featuresSupport": [],
"config": {}
},
"acPopupValidationFailed": {
"enabled": true,
"name": "Form Validations | Popup Forms",
"customEventName": "",
"timestamps": true,
"featureId": "b1a57c02-5c9c-4c24-8008-b492054ea7b5",
"event": "acPopupValidationFailed",
"featuresSupport": [],
"config": {}
},
"acFormValidationFailed": {
"enabled": true,
"name": "Form Validations | Regular Forms",
"customEventName": "",
"timestamps": true,
"featureId": "384b9c06-abf0-451a-ad04-f29225b3d597",
"event": "acFormValidationFailed",
"featuresSupport": [],
"config": {}
}
}
},
"acuityScheduling": {
"enabled": true,
"id": "26614683-7792-4bd9-92f7-d97232b0bada",
"listenerName": "Acuity (Squarespace) Scheduling",
"type": "appointment",
"features": {
"acuityAppointmentScheduled": {
"enabled": true,
"name": "Acuity Appointment Scheduled",
"customEventName": "",
"timestamps": true,
"featureId": "487f7d9d-96bb-4904-aae2-9c2151e743ec",
"event": "acuityAppointmentScheduled",
"featuresSupport": [],
"config": {}
}
}
},
"angular": {
"enabled": true,
"id": "ce430891-6160-449a-b043-9a5bc21754e7",
"listenerName": "Angular",
"type": "route",
"features": {
"angularRoutesPath": {
"enabled": true,
"name": "Angular Change Path",
"customEventName": "",
"timestamps": true,
"featureId": "826df9c2-b77a-404d-b00c-f9a855208e67",
"event": "angularRoutesPath",
"featuresSupport": [],
"config": {}
}
}
},
"drupalWebForm": {
"enabled": true,
"id": "5e3660d3-4f71-4559-b7fb-b88433db97f6",
"listenerName": "Drupal Webform",
"type": "form",
"features": {
"dpFormLoaded": {
"enabled": true,
"name": "Drupal Form Loaded",
"customEventName": "",
"timestamps": true,
"featureId": "a718814b-733a-456e-a8bb-ec5311f38beb",
"event": "dpFormLoaded",
"featuresSupport": [],
"config": {}
},
"dpFormStepChange": {
"enabled": true,
"name": "Drupal Webform Step Change",
"customEventName": "",
"timestamps": true,
"featureId": "9cf2684a-080f-4af4-98ec-eec624b57d14",
"event": "dpFormStepChange",
"featuresSupport": [],
"config": {}
},
"dpFormSubmitted": {
"enabled": true,
"name": "Drupal Form Submit",
"customEventName": "",
"timestamps": true,
"featureId": "8cb8c97f-32d0-45c7-8d4b-e85eafe26def",
"event": "dpFormSubmitted",
"featuresSupport": [],
"config": {}
},
"dpFormValidationFailed": {
"enabled": true,
"name": "Drupal Form Validation Failed",
"customEventName": "",
"timestamps": true,
"featureId": "c9d7a309-462c-4602-b0dd-9bbdf0aad71d",
"event": "dpFormValidationFailed",
"featuresSupport": [],
"config": {}
},
"dpFormStepsSubmitted": {
"enabled": true,
"name": "Form Submissions | Multi-step",
"customEventName": "",
"timestamps": true,
"featureId": "8881ca20-909d-42f3-90de-fd1cfa301716",
"event": "dpFormStepsSubmitted",
"featuresSupport": [],
"config": {}
}
}
},
"activeCampaignChat": {
"enabled": true,
"id": "48129377-4c4a-4eeb-a5af-40a06d88a43c",
"listenerName": "ActiveCampaign Chat",
"type": "chat",
"features": {}
},
"elementClick": {
"enabled": true,
"id": "9fe16db8-4df5-47aa-bd24-820d0562eefe",
"listenerName": "Element Clicks",
"type": "click",
"features": {
"elementClick": {
"enabled": true,
"name": "Element Click",
"customEventName": "",
"timestamps": true,
"featureId": "3d001cce-fbf2-4a87-b522-8fa62d7f3e8f",
"event": "elementClick",
"featuresSupport": [],
"config": {}
}
}
},
"customForms": {
"enabled": true,
"id": "870d952b-0845-4b5e-80f3-b64b8039ce98",
"listenerName": "Custom HTML Forms",
"type": "form",
"features": {
"customFormLoaded": {
"enabled": true,
"name": "Form Loads",
"customEventName": "",
"timestamps": true,
"featureId": "9f3fde01-2097-429e-85ec-fbcdfbee24ba",
"event": "customFormLoaded",
"featuresSupport": [],
"config": {}
},
"customFormVisible": {
"enabled": true,
"name": "Form Visible",
"customEventName": "",
"timestamps": true,
"featureId": "21f4ce36-0beb-4a61-92ec-f67427b01995",
"event": "customFormVisible",
"featuresSupport": [],
"config": {}
},
"customFormSubmitted": {
"enabled": true,
"name": "Form Submissions",
"customEventName": "",
"timestamps": true,
"featureId": "892dfce2-e5a6-449e-a5ac-dc8aa553d00b",
"event": "customFormSubmitted",
"featuresSupport": [],
"config": {}
},
"customFormValidationFailed": {
"enabled": true,
"name": "Form Validations",
"customEventName": "",
"timestamps": true,
"featureId": "fa917193-5e96-4918-90b6-275bfd773140",
"event": "customFormValidationFailed",
"featuresSupport": [],
"config": {}
},
"selectorBasedValues": {
"enabled": true,
"name": "Selector-Based Automatic Values",
"customEventName": "",
"timestamps": true,
"featureId": "d797ec5a-edc0-497b-8e57-639a21250e66",
"event": "selectorBasedValues",
"featuresSupport": [
{
"selectorId": "f9f7c0c0-9b5a-a328-a91a-b79b2d68a8fd",
"selector": "test 123",
"variable": "test"
}
],
"config": {}
}
}
},
"hubspotChat": {
"enabled": true,
"id": "48b1dfd2-39dc-4555-b796-9517b4d73832",
"listenerName": "Hubspot Chat",
"type": "chat",
"features": {
"hschatMessagefromAgent": {
"enabled": true,
"name": "Message from Agent",
"customEventName": "",
"timestamps": true,
"featureId": "24762c27-15c3-491c-a25b-84051d779fab",
"event": "hschatMessagefromAgent",
"featuresSupport": [],
"config": {}
},
"hschatStarted": {
"enabled": true,
"name": "Chat Started",
"customEventName": "",
"timestamps": true,
"featureId": "c037e321-0724-485b-8adc-f038db85e0d5",
"event": "hschatStarted",
"featuresSupport": [],
"config": {}
},
"hschatMessagefromUser": {
"enabled": true,
"name": "Message from User ",
"customEventName": "",
"timestamps": true,
"featureId": "f5bbe4e0-310f-4e19-a43e-da982bd2cee3",
"event": "hschatMessagefromUser",
"featuresSupport": [],
"config": {}
},
"hschatUserEnteredEmail": {
"enabled": true,
"name": "User Enters Email",
"customEventName": "",
"timestamps": true,
"featureId": "a2bd7adb-699c-4852-b5d3-98ce17857589",
"event": "hschatUserEnteredEmail",
"featuresSupport": [],
"config": {}
}
}
},
"hubspotCTA": {
"enabled": true,
"id": "cc405502-f417-47f2-9f81-69a50957edff",
"listenerName": "HubSpot CTA",
"type": "cta",
"features": {
"hsCTAClick": {
"enabled": true,
"name": "Hubspot CTA",
"customEventName": "",
"timestamps": true,
"featureId": "12997eb6-5067-49a8-9d88-1e8d9ab52e60",
"event": "hsCTAClick",
"featuresSupport": [],
"config": {}
},
"hsCTALoaded": {
"enabled": true,
"name": "Hubspot CTA Loaded",
"customEventName": "",
"timestamps": true,
"featureId": "3d1f48a0-0e36-42d0-b762-9c37007fc14a",
"event": "hsCTALoaded",
"featuresSupport": [],
"config": {}
}
}
},
"hsMeetingScheduler": {
"enabled": true,
"id": "0a2f7477-37b2-4ee4-a0d5-0c11171e0229",
"listenerName": "Hubspot Meeting Scheduler",
"type": "meeting",
"features": {
"hsMeetingScheduled": {
"enabled": true,
"name": "Hubspot Meeting Scheduler",
"customEventName": "",
"timestamps": true,
"featureId": "95ad91bc-dea7-435b-859f-b09f4d9dea04",
"event": "hsMeetingScheduled",
"featuresSupport": [],
"config": {}
},
"hsSchedulerLoaded": {
"enabled": true,
"name": "hsSchedulerLoaded",
"customEventName": "",
"timestamps": true,
"featureId": "e64a86c7-3037-49a5-a885-a69db68dd5b7",
"event": "hsSchedulerLoaded",
"featuresSupport": [],
"config": {}
}
}
},
"intercom": {
"enabled": true,
"id": "8e7154a6-fd50-4f6b-8a26-b38871f1cbfc",
"listenerName": "Intercom",
"type": "chat",
"features": {
"intercomUserEnteredEmail": {
"enabled": true,
"name": "User Enters Email",
"customEventName": "",
"timestamps": true,
"featureId": "6c1a4256-178c-487b-a6c7-6767b3e7a107",
"event": "intercomUserEnteredEmail",
"featuresSupport": [],
"config": {}
},
"intercomMessagefromAgent": {
"enabled": true,
"name": "Intercom Message from Agent",
"customEventName": "",
"timestamps": true,
"featureId": "aa2556b3-7ef2-4a2f-b2e7-227b7d48acab",
"event": "intercomMessagefromAgent",
"featuresSupport": [],
"config": {}
},
"intercomMessagefromUser": {
"enabled": true,
"name": "Intercom Message from User",
"customEventName": "",
"timestamps": true,
"featureId": "83570502-7bac-49bd-923f-4b58aad37a6a",
"event": "intercomMessagefromUser",
"featuresSupport": [],
"config": {}
},
"intercomChatStarted": {
"enabled": true,
"name": "Intercom Started",
"customEventName": "",
"timestamps": true,
"featureId": "db64ba38-0e0c-4b7e-87d2-f295b0a900f2",
"event": "intercomChatStarted",
"featuresSupport": [],
"config": {}
}
}
},
"shopify": {
"enabled": true,
"id": "93633d8c-c226-4e74-be96-36f41cdefc1d",
"listenerName": "Shopify",
"type": "ecom",
"features": {
"shopifyViewCart": {
"enabled": true,
"name": "View Cart",
"customEventName": "",
"timestamps": true,
"featureId": "a4961e4a-d1bf-449d-8778-1ad62cb12e47",
"event": "shopifyViewCart",
"featuresSupport": [],
"config": {}
},
"shopifyRemoveFromCart": {
"enabled": true,
"name": "Remove from Cart",
"customEventName": "",
"timestamps": true,
"featureId": "99800b1d-a550-4e1f-b6b8-256b440f7f05",
"event": "shopifyRemoveFromCart",
"featuresSupport": [],
"config": {}
},
"shopifyAddToCart": {
"enabled": true,
"name": "Add to Cart",
"customEventName": "",
"timestamps": true,
"featureId": "edc5fa13-006d-4719-b41a-69b11791ca23",
"event": "shopifyAddToCart",
"featuresSupport": [],
"config": {}
},
"shopifyPurchase": {
"enabled": true,
"name": "Purchase",
"customEventName": "",
"timestamps": true,
"featureId": "84f408ca-a92e-4b01-9ca5-1ae7cc81cde8",
"event": "shopifyPurchase",
"featuresSupport": [],
"config": {}
},
"shopifyAddShipping": {
"enabled": true,
"name": "Add Shipping",
"customEventName": "",
"timestamps": true,
"featureId": "f56e4bb2-30ac-409a-a6b6-4467709e680a",
"event": "shopifyAddShipping",
"featuresSupport": [],
"config": {}
},
"shopifyViewItemPage": {
"enabled": true,
"name": "View Product Page",
"customEventName": "",
"timestamps": true,
"featureId": "d5e0493c-699f-469f-ae90-95b9e64b73f5",
"event": "shopifyViewItemPage",
"featuresSupport": [],
"config": {}
},
"shopifyAddPayment": {
"enabled": true,
"name": "Add Payment",
"customEventName": "",
"timestamps": true,
"featureId": "f30b3474-0ff6-4ba4-8eac-78f86b856032",
"event": "shopifyAddPayment",
"featuresSupport": [],
"config": {}
},
"shopifyViewItemList": {
"enabled": true,
"name": "View List of Products",
"customEventName": "",
"timestamps": true,
"featureId": "fe1c4e7a-0235-49b6-b312-cee26dfc5b07",
"event": "shopifyViewItemList",
"featuresSupport": [],
"config": {}
},
"shopifyBeginCheckout": {
"enabled": true,
"name": "Begin Checkout",
"customEventName": "",
"timestamps": true,
"featureId": "f99da8bf-a896-491d-aadd-4f95218cd159",
"event": "shopifyBeginCheckout",
"featuresSupport": [],
"config": {}
},
"shopifyClickItem": {
"enabled": true,
"name": "Click Product",
"customEventName": "",
"timestamps": true,
"featureId": "a15e0eb2-6f63-4497-a68b-64ed5d456b52",
"event": "shopifyClickItem",
"featuresSupport": [],
"config": {}
}
}
}
},
"consentListener": {
"consentTool": "cookieYes",
"listenerForGPC": true,
"gpc": {
"ad_storage": false,
"analytics_storage": true,
"functionality_storage": true,
"personalization_storage": true,
"security_storage": true
}
},
"consentRules": [
{
"id": "67b4b0a5-0fbf-4c72-a4b6-0cefb5e5eeec",
"key": "defaultExplicit",
"name": "Explicit Consent - GDPR Countries",
"consentMethod": "explicitConsent",
"dataStorageRetention": {
"timeRemove": "24",
"region": "europe"
},
"geographicRegions": [
{
"regionType": "regulatoryRegion",
"continent": "GDPRCountries",
"country": "",
"stateProvinces": ""
}
],
"visitorIdentification": {
"notAllow": "anonymizeVisitors",
"allow": "anonymizeVisitors"
}
},
{
"id": "6e681c9d-9154-47ee-a8c8-7125b11696a3",
"key": "defaultImplied",
"name": "Implied Consent - California",
"consentMethod": "impliedConsent",
"dataStorageRetention": {
"timeRemove": "24",
"region": "northAmerica"
},
"geographicRegions": [
{
"regionType": "stateProvinces",
"continent": "",
"countryOfState": "United States",
"country": "",
"stateProvinces": "California"
}
],
"visitorIdentification": {
"notAllow": "anonymizeVisitors",
"allow": "identifyVisitors",
"level": "identifyStrong"
}
},
{
"id": "c0712df0-e770-4328-a946-5e9f93f771ec",
"key": "defaultOpen",
"name": "Open Consent - Worldwide",
"consentMethod": "openConsent",
"dataStorageRetention": {
"timeRemove": "24",
"region": "northAmerica"
},
"geographicRegions": [
{
"regionType": "worldWide",
"continent": "",
"country": "",
"stateProvinces": ""
}
],
"visitorIdentification": {
"notAllow": "",
"allow": "identifyVisitors",
"level": "identifyStrong"
}
}
],
"triggerRules": [
{
"id": "2cbeec62-745a-409a-8a57-0c8cc8b45724",
"name": "test trigger clickID",
"type": "simple",
"conditions": [
{
"conjunction": "or",
"g0": {
"type": "Event",
"id": "",
"key": "clickID",
"operator": "eq",
"value": "true",
"conjunction": "and"
},
"g1": {
"type": "Variable",
"id": "",
"key": "clickIDAutomaticValues.msclkid",
"operator": "exav",
"value": "",
"conjunction": ""
}
},
{
"conjunction": "",
"g0": {
"type": "Event",
"id": "",
"key": "clickID",
"operator": "eq",
"value": "true",
"conjunction": "and"
},
"g1": {
"type": "Variable",
"id": "",
"key": "clickIDAutomaticValues.fbclid",
"operator": "gt",
"value": "100",
"conjunction": ""
}
}
],
"customVariables": [],
"consent": [
{
"conjunction": "",
"g0": {
"key": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"consentBlock": false,
"slug": "test-trigger-clickid"
}
},
{
"id": "06cf1ab2-d37b-4a82-990e-4aadff6e9f79",
"name": "form fail",
"type": "simple",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Event",
"id": "",
"key": "flFormStepChange",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g1": {
"type": "Event",
"id": "",
"key": "gfFormStepChange",
"operator": "eq",
"value": "true",
"conjunction": ""
}
}
],
"customVariables": [],
"consent": [
{
"conjunction": "",
"g0": {
"key": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"consentBlock": false,
"slug": "form-fail"
}
},
{
"id": "0288a42b-b96a-4808-80f5-950a04ea59a5",
"name": "Ecommerce Events",
"type": "lookup",
"conditions": [
[
{
"conjunction": "and",
"g0": {
"isRegex": false,
"key": "wooPurchase",
"operator": "eq",
"type": "Event",
"value": "true"
}
}
],
[
{
"conjunction": "and",
"g0": {
"isRegex": false,
"key": "wooClickItem",
"operator": "eq",
"type": "Event",
"value": "true"
}
}
],
[
{
"conjunction": "and",
"g0": {
"isRegex": false,
"key": "wooViewCart",
"operator": "eq",
"type": "Event",
"value": "true"
}
}
],
[
{
"conjunction": "and",
"g0": {
"isRegex": false,
"key": "wooAddToCart",
"operator": "eq",
"type": "Event",
"value": "true"
}
}
],
[
{
"conjunction": "and",
"g0": {
"isRegex": false,
"key": "wooBeginCheckout",
"operator": "eq",
"type": "Event",
"value": "true"
}
}
],
[
{
"conjunction": "and",
"g0": {
"isRegex": false,
"key": "wooAddShipping",
"operator": "eq",
"type": "Event",
"value": "true"
}
}
],
[
{
"conjunction": "and",
"g0": {
"isRegex": false,
"key": "wooRemoveFromCart",
"operator": "eq",
"type": "Event",
"value": "true"
}
}
],
[
{
"conjunction": "and",
"g0": {
"isRegex": false,
"key": "wooAddPayment",
"operator": "eq",
"type": "Event",
"value": "true"
}
}
],
[
{
"conjunction": "and",
"g0": {
"isRegex": false,
"key": "wooViewItemList",
"operator": "eq",
"type": "Event",
"value": "true"
}
}
],
[
{
"conjunction": "and",
"g0": {
"isRegex": false,
"key": "wooViewItemPage",
"operator": "eq",
"type": "Event",
"value": "true"
}
}
],
[
{
"conjunction": "and",
"g0": {
"isRegex": false,
"key": "shopifyAddPayment",
"operator": "eq",
"type": "Event",
"value": "true"
}
}
],
[
{
"conjunction": "and",
"g0": {
"isRegex": false,
"key": "shopifyViewCart",
"operator": "eq",
"type": "Event",
"value": "true"
}
}
],
[
{
"conjunction": "and",
"g0": {
"isRegex": false,
"key": "shopifyViewItemPage",
"operator": "eq",
"type": "Event",
"value": "true"
}
}
],
[
{
"conjunction": "and",
"g0": {
"isRegex": false,
"key": "shopifyViewItemList",
"operator": "eq",
"type": "Event",
"value": "true"
}
}
],
[
{
"conjunction": "and",
"g0": {
"isRegex": false,
"key": "shopifyClickItem",
"operator": "eq",
"type": "Event",
"value": "true"
}
}
],
[
{
"conjunction": "and",
"g0": {
"isRegex": false,
"key": "shopifyBeginCheckout",
"operator": "eq",
"type": "Event",
"value": "true"
}
}
],
[
{
"conjunction": "and",
"g0": {
"isRegex": false,
"key": "shopifyRemoveFromCart",
"operator": "eq",
"type": "Event",
"value": "true"
}
}
],
[
{
"conjunction": "and",
"g0": {
"isRegex": false,
"key": "shopifyAddToCart",
"operator": "eq",
"type": "Event",
"value": "true"
}
}
],
[
{
"conjunction": "and",
"g0": {
"isRegex": false,
"key": "shopifyAddShipping",
"operator": "eq",
"type": "Event",
"value": "true"
}
}
],
[
{
"conjunction": "and",
"g0": {
"isRegex": false,
"key": "shopifyPurchase",
"operator": "eq",
"type": "Event",
"value": "true"
}
}
]
],
"customVariables": [
[
{
"id": "T4929246359321"
}
],
[
{
"id": "T5845811359321"
}
],
[
{
"id": "T0418353519321"
}
],
[
{
"id": "T9168714369321"
}
],
[
{
"id": "T7391709289321"
}
],
[
{
"id": "T5981078329321"
}
],
[
{
"id": "T5265176759321"
}
],
[
{
"id": "T0068076439321"
}
],
[
{
"id": "T4491212479321"
}
],
[
{
"id": "T9376587169321"
}
],
[
{
"id": "T0068076439321"
}
],
[
{
"id": "T0418353519321"
}
],
[
{
"id": "T9376587169321"
}
],
[
{
"id": "T4491212479321"
}
],
[
{
"id": "T5845811359321"
}
],
[
{
"id": "T7391709289321"
}
],
[
{
"id": "T5265176759321"
}
],
[
{
"id": "T9168714369321"
}
],
[
{
"id": "T5981078329321"
}
],
[
{
"id": "T4929246359321"
}
]
],
"consent": [
{
"conjunction": "",
"g0": {
"key": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"consentBlock": false,
"triggers": [
{
"name": "Add Payment Info",
"eventName": "add_payment_info",
"id": "T0068076439321",
"slug": "add-payment-info"
},
{
"name": "Add Shipping Info",
"eventName": "add_shipping_info",
"id": "T5981078329321",
"slug": "add-shipping-info"
},
{
"name": "View Product",
"eventName": "view_item",
"id": "T9376587169321",
"slug": "view-product"
},
{
"name": "Select Product",
"eventName": "select_item",
"id": "T5845811359321",
"slug": "select-product"
},
{
"name": "View Product List",
"eventName": "view_item_list",
"id": "T4491212479321",
"slug": "view-product-list"
},
{
"name": "Remove from Cart",
"eventName": "remove_from_cart",
"id": "T5265176759321",
"slug": "remove-from-cart"
},
{
"name": "Purchase",
"eventName": "purchase",
"id": "T4929246359321",
"slug": "purchase"
},
{
"name": "Add to Cart",
"eventName": "add_to_cart",
"id": "T9168714369321",
"slug": "add-to-cart"
},
{
"name": "Begin Checkout",
"eventName": "begin_checkout",
"id": "T7391709289321",
"slug": "begin-checkout"
},
{
"name": "View Cart",
"eventName": "view_cart",
"id": "T0418353519321",
"slug": "view-cart"
}
]
}
},
{
"id": "a437c7e1-33e3-459d-8128-8f2a00aa9e6c",
"name": "All Page Requests",
"type": "simple",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Event",
"id": "",
"key": "pageRequested",
"operator": "eq",
"value": "true",
"conjunction": ""
}
}
],
"customVariables": [],
"consent": [
{
"conjunction": "",
"g0": {
"key": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"consentBlock": false,
"key": "pageRequested",
"slug": "all-page-requests"
}
},
{
"id": "c74be985-fbd4-4db6-93d8-95d2b0ec849e",
"name": "All Page Views",
"type": "simple",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Event",
"id": "",
"key": "pageView",
"operator": "eq",
"value": "true",
"conjunction": ""
}
}
],
"customVariables": [],
"consent": [
{
"conjunction": "",
"g0": {
"key": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"consentBlock": false,
"key": "pageView",
"slug": "all-page-views"
}
},
{
"id": "7c39fcbe-90fc-4f48-b79b-f06e942cd3ec",
"name": "All Click to Call",
"type": "simple",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Event",
"key": "clickToCall",
"operator": "eq",
"value": "true",
"conjunction": ""
}
}
],
"customVariables": [],
"consent": [
{
"conjunction": "",
"g0": {
"type": "",
"key": "",
"operator": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"consentBlock": false,
"key": "clickToCall",
"slug": "all-click-to-call"
}
},
{
"id": "dc060e2d-daf3-4f74-893c-1ae78bb8e6d9",
"name": "All Form Submissions",
"type": "simple",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Event",
"id": "",
"key": "gfFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g1": {
"type": "Event",
"id": "",
"key": "gfFormStepsSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g2": {
"type": "Event",
"id": "",
"key": "flFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g3": {
"type": "Event",
"id": "",
"key": "flFormStepsSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g4": {
"type": "Event",
"id": "",
"key": "hsPopupSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g5": {
"type": "Event",
"id": "",
"key": "hsFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g6": {
"type": "Event",
"id": "",
"key": "cf7FormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g7": {
"type": "Event",
"id": "",
"key": "customFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g8": {
"type": "Event",
"id": "",
"key": "mailchimpFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g9": {
"type": "Event",
"id": "",
"key": "uberflipFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g10": {
"type": "Event",
"id": "",
"key": "acFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g11": {
"type": "Event",
"id": "",
"key": "acPopupSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g12": {
"type": "Event",
"id": "",
"key": "dpFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g13": {
"type": "Event",
"id": "",
"key": "dpFormStepsSubmitted",
"operator": "eq",
"value": "true",
"conjunction": ""
}
}
],
"customVariables": [],
"consent": [
{
"conjunction": "",
"g0": {
"key": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"consentBlock": false,
"key": "submitted",
"slug": "all-form-submissions"
}
},
{
"id": "2b6563af-892a-4c30-b8cd-8b0963aed0b6",
"name": "All Chat Started",
"type": "simple",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Event",
"id": "",
"key": "driftChatStarted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g1": {
"type": "Event",
"id": "",
"key": "hschatStarted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g2": {
"type": "Event",
"id": "",
"key": "intercomChatStarted",
"operator": "eq",
"value": "true",
"conjunction": ""
}
}
],
"customVariables": [],
"consent": [
{
"conjunction": "",
"g0": {
"type": "",
"key": "",
"operator": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"consentBlock": false,
"key": "chatStarted",
"slug": "all-chat-started"
}
},
{
"id": "813188e5-715d-4624-9263-0586e1456c4c",
"name": "All Engaged Sessions",
"type": "simple",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Event",
"id": "",
"key": "engagedSession",
"operator": "eq",
"value": "true",
"conjunction": ""
}
}
],
"customVariables": [],
"consent": [
{
"conjunction": "",
"g0": {
"type": "",
"key": "",
"operator": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"consentBlock": false,
"key": "engagedSession",
"slug": "all-engaged-sessions"
}
},
{
"id": "ef1ab060-3dfc-4abc-8160-dc6dabae3df5",
"name": "All Chat High Quality",
"type": "simple",
"conditions": [
{
"conjunction": "and",
"g0": {
"type": "Event",
"id": "",
"key": "driftMessagefromUser",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g1": {
"type": "Event",
"id": "",
"key": "hschatMessagefromUser",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g2": {
"type": "Event",
"id": "",
"key": "intercomMessagefromUser",
"operator": "eq",
"value": "true",
"conjunction": ""
}
},
{
"conjunction": "",
"g0": {
"type": "Variable",
"id": "",
"key": "chatAutomaticValues.messageFromUserCount",
"operator": "eq",
"value": "5",
"conjunction": ""
}
}
],
"customVariables": [],
"consent": [
{
"conjunction": "",
"g0": {
"type": "",
"key": "",
"operator": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"consentBlock": false,
"key": "messagefromUser",
"slug": "all-chat-high-quality"
}
},
{
"id": "6ba2ac14-9a04-44d8-94cf-97f83ecd8998",
"name": "All Chat User Entered Email",
"type": "simple",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Event",
"id": "",
"key": "driftUserEnteredEmail",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g1": {
"type": "Event",
"id": "",
"key": "hschatUserEnteredEmail",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g2": {
"type": "Event",
"id": "",
"key": "intercomUserEnteredEmail",
"operator": "eq",
"value": "true",
"conjunction": ""
}
}
],
"customVariables": [],
"consent": [
{
"conjunction": "",
"g0": {
"type": "",
"key": "",
"operator": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"consentBlock": false,
"key": "enteredEmail",
"slug": "all-chat-user-entered-email"
}
},
{
"id": "042a9741-02fb-42ad-b6d9-3118e24b225a",
"name": "All Outbound Clicks",
"type": "simple",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Event",
"id": "",
"key": "outboundClick",
"operator": "eq",
"value": "true",
"conjunction": ""
}
}
],
"customVariables": [],
"consent": [
{
"conjunction": "",
"g0": {
"type": "",
"key": "",
"operator": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"consentBlock": false,
"key": "outboundClick",
"slug": "all-outbound-clicks"
}
},
{
"id": "2e8270d4-b177-4be4-9ef2-264e9815e61f",
"name": "Reached Bottom of Page",
"type": "simple",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Event",
"id": "",
"key": "scrollDepth",
"operator": "eq",
"value": "true",
"conjunction": "and"
},
"g1": {
"type": "Variable",
"id": "",
"key": "engagementAutomaticValues.maxViewed.bottom",
"operator": "ct",
"value": "yes",
"conjunction": ""
}
}
],
"customVariables": [],
"consent": [
{
"conjunction": "",
"g0": {
"type": "",
"key": "",
"operator": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"consentBlock": false,
"key": "scrollDepth",
"slug": "reached-bottom-of-page"
}
},
{
"id": "5f32e3f2-bb08-4415-ab4b-27fb697fb2a7",
"name": "All Document Link Clicks",
"type": "simple",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Event",
"id": "",
"key": "documentLinkClick",
"operator": "eq",
"value": "true",
"conjunction": ""
}
}
],
"customVariables": [],
"consent": [
{
"conjunction": "",
"g0": {
"type": "",
"key": "",
"operator": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"consentBlock": false,
"key": "documentLinkClick",
"slug": "all-document-link-clicks"
}
}
],
"conversionRules": [
{
"id": "f3af1c39-0758-482f-bcd8-dfc5d02ae170",
"name": "conv-clickID",
"type": "simple",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Event",
"key": "clickID",
"operator": "eq",
"value": "true",
"conjunction": "and"
},
"g1": {
"type": "Variable",
"key": "clickIDAutomaticValues._fbp",
"operator": "exav",
"value": "",
"conjunction": ""
}
}
],
"customVariables": {
"type": "primary",
"value": "",
"currency": "",
"cursor": {
"index": -1,
"position": -1
}
},
"consent": [
{
"conjunction": "",
"g0": {
"key": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"conditionType": false,
"consentBlock": false,
"conversionValue": false,
"slug": "conv-clickid"
}
},
{
"id": "af8021db-1998-4ba1-934c-17dbbd99e423",
"name": "conv ecom",
"type": "lookup",
"conditions": [
[
"T5845811359321",
"T0418353519321",
"T7391709289321"
],
[
"T5845811359321",
"T7391709289321",
"T0418353519321"
]
],
"customVariables": [
[
{
"name": "conv_product",
"type": "primary",
"value": "100",
"currency": "USD",
"slug": "conv-product",
"id": "C6559727667970"
}
],
[
{
"name": "conv_checkout",
"type": "secondary",
"value": "200",
"currency": "USD",
"slug": "conv-checkout",
"id": "C9597968102022"
}
],
[
{
"name": "conv_viewcart",
"type": "primary",
"value": "300",
"currency": "USD",
"slug": "conv-viewcart",
"id": "C3082723652022"
}
]
],
"consent": [
{
"conjunction": "",
"g0": {
"key": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"conditionType": true
}
},
{
"id": "ea67f5d1-2135-44af-b5b3-abd7cda7ca0a",
"name": "rule URL",
"type": "simple",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Event",
"key": "urlParameters",
"operator": "eq",
"value": "true",
"conjunction": ""
}
}
],
"customVariables": {
"type": "primary",
"value": "999",
"currency": "USD",
"cursor": {
"index": -1,
"position": -1
}
},
"consent": [
{
"conjunction": "",
"g0": {
"key": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"conditionType": false,
"consentBlock": false,
"conversionValue": true,
"slug": "rule-url"
}
},
{
"id": "02b0867a-bca7-4f33-adc1-d4f3f05d229a",
"name": "conv fail",
"type": "lookup",
"conditions": [
[
{
"conjunction": "and",
"g0": {
"type": "Event",
"key": "mailchimpFormValidationFailed",
"operator": "eq",
"value": "true",
"isRegex": false
}
},
{
"conjunction": "and",
"g0": {
"type": "Event",
"key": "customFormValidationFailed",
"operator": "eq",
"value": "false",
"isRegex": false
}
},
{
"conjunction": "",
"g0": {
"type": "Event",
"key": "marketoFormValidationFailed",
"operator": "eq",
"value": "false",
"isRegex": false
}
}
],
[
{
"conjunction": "and",
"g0": {
"type": "Event",
"key": "mailchimpFormValidationFailed",
"operator": "eq",
"value": "false",
"isRegex": false
}
},
{
"conjunction": "and",
"g0": {
"type": "Event",
"key": "customFormValidationFailed",
"operator": "eq",
"value": "true",
"isRegex": false
}
},
{
"conjunction": "",
"g0": {
"type": "Event",
"key": "marketoFormValidationFailed",
"operator": "eq",
"value": "false",
"isRegex": false
}
}
],
[
{
"conjunction": "and",
"g0": {
"type": "Event",
"key": "mailchimpFormValidationFailed",
"operator": "eq",
"value": "false",
"isRegex": false
}
},
{
"conjunction": "and",
"g0": {
"type": "Event",
"key": "customFormValidationFailed",
"operator": "eq",
"value": "false",
"isRegex": false
}
},
{
"conjunction": "",
"g0": {
"type": "Event",
"key": "marketoFormValidationFailed",
"operator": "eq",
"value": "true",
"isRegex": false
}
}
]
],
"customVariables": [
[
{
"name": "conv 1_form mail",
"type": "primary",
"value": "",
"currency": "",
"slug": "conv-1",
"id": "C9469298649300"
}
],
[
{
"name": "conv 2_form custom",
"type": "secondary",
"value": "",
"currency": "",
"slug": "conv-2",
"id": "C6331153139029"
}
],
[
{
"name": "conv 3_form mark",
"type": "secondary",
"value": "",
"currency": "",
"slug": "conv-3",
"id": "C1672329589029"
}
]
],
"consent": [
{
"conjunction": "",
"g0": {
"key": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"conditionType": false
}
},
{
"id": "a2d2f4b7-ca0f-44dc-af08-3b7f3e0f7ad2",
"name": "Form - Contact Us",
"type": "simple",
"conditions": [
{
"conjunction": "and",
"g0": {
"conjunction": "or",
"type": "Event",
"key": "flFormSubmitted",
"operator": "eq",
"value": true
},
"g1": {
"conjunction": "or",
"type": "Event",
"key": "flFormStepsSubmitted",
"operator": "eq",
"value": true
},
"g2": {
"conjunction": "or",
"type": "Event",
"key": "hsFormSubmitted",
"operator": "eq",
"value": true
},
"g3": {
"conjunction": "or",
"type": "Event",
"key": "gfFormSubmitted",
"operator": "eq",
"value": true
},
"g4": {
"conjunction": "or",
"type": "Event",
"key": "marketoFormSubmitted",
"operator": "eq",
"value": true
},
"g5": {
"conjunction": "or",
"type": "Event",
"key": "gfFormStepsSubmitted",
"operator": "eq",
"value": true
},
"g6": {
"conjunction": "or",
"type": "Event",
"key": "hsPopupSubmitted",
"operator": "eq",
"value": true
},
"g7": {
"type": "Event",
"id": "",
"key": "cf7FormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g8": {
"type": "Event",
"id": "",
"key": "customFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g9": {
"type": "Event",
"id": "",
"key": "mailchimpFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g10": {
"type": "Event",
"id": "",
"key": "uberflipFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g11": {
"type": "Event",
"id": "",
"key": "acFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g12": {
"type": "Event",
"id": "",
"key": "acPopupSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g13": {
"type": "Event",
"id": "",
"key": "dpFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g14": {
"type": "Event",
"id": "",
"key": "dpFormStepsSubmitted",
"operator": "eq",
"value": "true",
"conjunction": ""
}
},
{
"conjunction": "",
"g0": {
"conjunction": "",
"key": "formAutomaticValues.categories.formCategory",
"operator": "eq",
"type": "Variable",
"value": "Contact Us",
"vid": "165c9c83-a4ec-4699-8a5e-f6dbdf0fd83d"
}
}
],
"customVariables": {
"currency": "",
"type": "primary",
"value": "",
"cursor": {
"index": -1,
"position": -1
}
},
"consent": [
{
"conjunction": "",
"g0": {
"type": "",
"key": "",
"operator": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"conditionType": false,
"consentBlock": false,
"conversionValue": false,
"key": "submitted",
"slug": "form-contact-us"
}
},
{
"id": "a908d20f-adb2-4a08-abf9-ad9243e59ac5",
"name": "Chat - Entered Email",
"type": "simple",
"conditions": [
{
"conjunction": "",
"g0": {
"conjunction": "",
"operator": "",
"type": "",
"key": "",
"value": "6ba2ac14-9a04-44d8-94cf-97f83ecd8998"
}
}
],
"customVariables": {
"currency": "",
"type": "primary",
"value": "",
"cursor": {
"index": -1,
"position": -1
}
},
"consent": [
{
"conjunction": "",
"g0": {
"type": "",
"key": "",
"operator": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"conditionType": true,
"consentBlock": false,
"conversionValue": false,
"slug": "chat-entered-email"
}
},
{
"id": "9065f091-5dd5-4419-adaf-0bffb39a4f11",
"name": "Chat - High Quality",
"type": "simple",
"conditions": [
{
"conjunction": "",
"g0": {
"conjunction": "",
"operator": "",
"type": "",
"key": "",
"value": "ef1ab060-3dfc-4abc-8160-dc6dabae3df5"
}
}
],
"customVariables": {
"currency": "",
"type": "primary",
"value": "",
"cursor": {
"index": -1,
"position": -1
}
},
"consent": [
{
"conjunction": "",
"g0": {
"type": "",
"key": "",
"operator": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"conditionType": true,
"consentBlock": false,
"conversionValue": false,
"slug": "chat-high-quality"
}
},
{
"id": "b427096f-9845-4db8-b3f4-081d5c228dbc",
"name": "Chat - Started",
"type": "simple",
"conditions": [
{
"conjunction": "",
"g0": {
"conjunction": "",
"operator": "",
"type": "",
"key": "",
"value": "2b6563af-892a-4c30-b8cd-8b0963aed0b6"
}
}
],
"customVariables": {
"currency": "",
"type": "primary",
"value": "",
"cursor": {
"index": -1,
"position": -1
}
},
"consent": [
{
"conjunction": "",
"g0": {
"type": "",
"key": "",
"operator": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"conditionType": true,
"consentBlock": false,
"conversionValue": false,
"slug": "chat-started"
}
},
{
"id": "83777776-d3a8-449a-bc60-afcd54af7adf",
"name": "Form - Support Request",
"type": "simple",
"conditions": [
{
"conjunction": "and",
"g0": {
"conjunction": "or",
"type": "Event",
"key": "flFormSubmitted",
"operator": "eq",
"value": true
},
"g1": {
"conjunction": "or",
"type": "Event",
"key": "flFormStepsSubmitted",
"operator": "eq",
"value": true
},
"g2": {
"conjunction": "or",
"type": "Event",
"key": "hsFormSubmitted",
"operator": "eq",
"value": true
},
"g3": {
"conjunction": "or",
"type": "Event",
"key": "gfFormSubmitted",
"operator": "eq",
"value": true
},
"g4": {
"conjunction": "or",
"type": "Event",
"key": "marketoFormSubmitted",
"operator": "eq",
"value": true
},
"g5": {
"conjunction": "or",
"type": "Event",
"key": "gfFormStepsSubmitted",
"operator": "eq",
"value": true
},
"g6": {
"conjunction": "or",
"type": "Event",
"key": "hsPopupSubmitted",
"operator": "eq",
"value": true
},
"g7": {
"type": "Event",
"id": "",
"key": "cf7FormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g8": {
"type": "Event",
"id": "",
"key": "customFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g9": {
"type": "Event",
"id": "",
"key": "mailchimpFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g10": {
"type": "Event",
"id": "",
"key": "uberflipFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g11": {
"type": "Event",
"id": "",
"key": "acFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g12": {
"type": "Event",
"id": "",
"key": "acPopupSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g13": {
"type": "Event",
"id": "",
"key": "dpFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g14": {
"type": "Event",
"id": "",
"key": "dpFormStepsSubmitted",
"operator": "eq",
"value": "true",
"conjunction": ""
}
},
{
"conjunction": "",
"g0": {
"conjunction": "",
"key": "formAutomaticValues.categories.formCategory",
"operator": "eq",
"type": "Variable",
"value": "Support Request",
"vid": "4dc69616-904b-4475-ab7e-c52b942c4a29"
}
}
],
"customVariables": {
"currency": "",
"type": "primary",
"value": "",
"cursor": {
"index": -1,
"position": -1
}
},
"consent": [
{
"conjunction": "",
"g0": {
"type": "",
"key": "",
"operator": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"conditionType": false,
"consentBlock": false,
"conversionValue": false,
"key": "submitted",
"slug": "form-support-request"
}
},
{
"id": "11c9be7f-560b-4499-a8b9-abdf99112cd3",
"name": "Form - Webinar Registration",
"type": "simple",
"conditions": [
{
"conjunction": "and",
"g0": {
"conjunction": "or",
"type": "Event",
"key": "flFormSubmitted",
"operator": "eq",
"value": true
},
"g1": {
"conjunction": "or",
"type": "Event",
"key": "flFormStepsSubmitted",
"operator": "eq",
"value": true
},
"g2": {
"conjunction": "or",
"type": "Event",
"key": "hsFormSubmitted",
"operator": "eq",
"value": true
},
"g3": {
"conjunction": "or",
"type": "Event",
"key": "gfFormSubmitted",
"operator": "eq",
"value": true
},
"g4": {
"conjunction": "or",
"type": "Event",
"key": "marketoFormSubmitted",
"operator": "eq",
"value": true
},
"g5": {
"conjunction": "or",
"type": "Event",
"key": "gfFormStepsSubmitted",
"operator": "eq",
"value": true
},
"g6": {
"conjunction": "or",
"type": "Event",
"key": "hsPopupSubmitted",
"operator": "eq",
"value": true
},
"g7": {
"type": "Event",
"id": "",
"key": "cf7FormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g8": {
"type": "Event",
"id": "",
"key": "customFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g9": {
"type": "Event",
"id": "",
"key": "mailchimpFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g10": {
"type": "Event",
"id": "",
"key": "uberflipFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g11": {
"type": "Event",
"id": "",
"key": "acFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g12": {
"type": "Event",
"id": "",
"key": "acPopupSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g13": {
"type": "Event",
"id": "",
"key": "dpFormSubmitted",
"operator": "eq",
"value": "true",
"conjunction": "or"
},
"g14": {
"type": "Event",
"id": "",
"key": "dpFormStepsSubmitted",
"operator": "eq",
"value": "true",
"conjunction": ""
}
},
{
"conjunction": "",
"g0": {
"conjunction": "",
"key": "formAutomaticValues.categories.formCategory",
"operator": "eq",
"type": "Variable",
"value": "Webinar Registration",
"vid": "5fb345e8-3d40-4398-94f0-d3d417d77c7a"
}
}
],
"customVariables": {
"currency": "",
"type": "primary",
"value": "",
"cursor": {
"index": -1,
"position": -1
}
},
"consent": [
{
"conjunction": "",
"g0": {
"type": "",
"key": "",
"operator": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"conditionType": false,
"consentBlock": false,
"conversionValue": false,
"key": "submitted",
"slug": "form-webinar-registration"
}
},
{
"id": "6489118d-77bf-4967-a138-382c9768b652",
"name": "Purchase",
"type": "simple",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Variable",
"key": "",
"operator": "",
"value": "T4929246359321",
"conjunction": ""
}
}
],
"customVariables": {
"currency": "USD",
"cursor": {
"index": -1,
"position": -1
},
"type": "primary",
"value": "{{ecomAutomaticValues.ecommerce.value}}"
},
"consent": [
{
"conjunction": "",
"g0": {
"key": "",
"value": "",
"conjunction": ""
}
}
],
"data": {
"consentBlock": false,
"conditionType": true,
"conversionValue": true,
"slug": "purchase"
}
}
],
"dataActionRules": [
{
"id": "cba8111c-0f67-4a55-9454-fb14805c19aa",
"name": "GA4 Page View",
"type": "simple",
"conditions": {
"template": {
"value": "Google Analytics GA4 Configuration",
"content": {
"sendPageView": true,
"enableSendToServerContainer": false,
"measurementId": "{{destinations.ga4.general.measurementID}}",
"fieldsToSet": [
{
"name": "ll_user_id",
"value": "{{userDetails.userID}}"
}
]
},
"priority": {
"type": "integer",
"value": "1000"
}
}
},
"customVariables": {
"triggersName": [
"c74be985-fbd4-4db6-93d8-95d2b0ec849e"
]
},
"consent": [],
"data": {
"slug": "ga4-page-view"
},
"destinationCode": "googleAnalytics4",
"isCustom": false,
"sendToServerSide": true,
"blockByRules": null
}
],
"defineMyValues": [
{
"listener": "fluentForms",
"name": "test",
"type": "Simple Rule",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Event",
"id": "361a6d69-ae95-4552-ba1e-5773d8921dd9",
"key": "flFormLoaded",
"operator": "eq",
"value": "true",
"conjunction": ""
}
}
],
"fields": [
{
"id": "acf9cc6c-4dc0-46db-92f9-d0b1210e10d2",
"value": "zztest1",
"name": "value1"
}
]
},
{
"listener": "hubspotForms",
"name": "test hs",
"type": "Lookup Rule",
"conditions": [
[
{
"conjunction": "and",
"g0": {
"type": "Event",
"id": "712d5585-411c-47d7-a27b-b67a6ed9104c",
"key": "hsPopupStart",
"operator": "eq",
"value": "true",
"isRegex": false
}
},
{
"conjunction": "",
"g0": {
"type": "Event",
"id": "197ceac3-215e-4269-b4a9-4a29005d62ac",
"key": "hsFormStart",
"operator": "eq",
"value": "false",
"isRegex": false
}
}
],
[
{
"conjunction": "and",
"g0": {
"type": "Event",
"id": "712d5585-411c-47d7-a27b-b67a6ed9104c",
"key": "hsPopupStart",
"operator": "eq",
"value": "false",
"isRegex": false
}
},
{
"conjunction": "",
"g0": {
"type": "Event",
"id": "197ceac3-215e-4269-b4a9-4a29005d62ac",
"key": "hsFormStart",
"operator": "eq",
"value": "true",
"isRegex": false
}
}
]
],
"fields": [
[
{
"id": "878e8f37-1c38-48ec-947b-577da3d14124",
"value": "real",
"name": "value2"
}
],
[
{
"id": "878e8f37-1c38-48ec-947b-577da3d14124",
"value": "fake",
"name": "value2"
}
]
]
},
{
"listener": "urlParameters",
"name": "test URL",
"type": "Simple Rule",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Event",
"id": "fc50272e-8311-42a2-a19e-77def48f1ab3",
"key": "urlParameters",
"operator": "eq",
"value": "true",
"conjunction": ""
}
}
],
"fields": [
{
"id": "eadff77c-6637-4bd7-a823-ec4e15ff2740",
"value": "rich",
"name": "value3"
}
]
},
{
"listener": "userSource",
"name": "test source",
"type": "Simple Rule",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Variable",
"key": "sourceAutomaticValues.source",
"operator": "ct",
"value": "Ads",
"conjunction": "",
"id": "5e228eb7-715a-41b7-a5ff-e776c8421607"
}
}
],
"fields": [
{
"id": "43433981-db88-45cf-bd9e-d89c436e9bc3",
"value": "{{ListenLayer.accountID}}",
"name": "value4"
}
]
}
],
"defineMyBrowserValues": [
{
"listener": "fluentForms",
"name": "test",
"type": "Local Storage",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Custom Variable",
"id": "acf9cc6c-4dc0-46db-92f9-d0b1210e10d2",
"key": "value1",
"operator": "ct",
"value": "zztest",
"conjunction": "and"
},
"g1": {
"type": "Event",
"id": "361a6d69-ae95-4552-ba1e-5773d8921dd9",
"key": "flFormLoaded",
"operator": "eq",
"value": "true",
"conjunction": ""
}
}
],
"fields": [
{
"action": "set",
"id": "be276ecf-6627-4777-803e-fbf8fe930c15",
"value": "{{userDetails.userID}}.{{userDetails.sessionID}}",
"existingValueAction": "overwrite",
"key": "",
"name": "local 1",
"type": "Local Storage"
}
]
},
{
"listener": "gravityForms",
"name": "test gravity",
"type": "Cookie Storage",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Event",
"id": "2020e727-8a0d-42c6-938e-4ecbfaa3739a",
"key": "gfFormLoaded",
"operator": "eq",
"value": "true",
"conjunction": ""
}
}
],
"fields": [
{
"action": "set",
"id": "e8cc9a65-8314-4112-9401-835f5ce92ca5",
"value": "fb.1.{{userDetails.sessionID}}",
"existingValueAction": "overwrite",
"daysToExpiration": 1,
"key": "",
"name": "_fbp",
"type": "Cookie Storage"
},
{
"action": "set",
"id": "6a82bc3e-0770-49c5-8de1-96f5e2cf5392",
"key": "",
"value": "GA1.1.{{formAutomaticValues.assignedFormID}}",
"existingValueAction": "overwrite",
"daysToExpiration": 1,
"name": "_ga",
"type": "Cookie Storage"
}
]
},
{
"listener": "hubspotForms",
"name": "test hs form",
"type": "Cookie Storage",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Event",
"id": "1eaabc23-9817-44f0-8163-1c5e554c89e1",
"key": "hsFormLoaded",
"operator": "eq",
"value": "true",
"conjunction": ""
}
}
],
"fields": [
{
"action": "set",
"id": "24943a91-68f5-4960-a64f-93174fab4637",
"value": "{{userDetails.sessionID}}.{{formAutomaticValues.assignedFormID}}",
"existingValueAction": "overwrite",
"daysToExpiration": 1,
"key": "",
"name": "_fbc",
"type": "Cookie Storage"
}
]
},
{
"listener": "marketoForms",
"name": "test marketo form",
"type": "Cookie Storage",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Event",
"id": "6c821c1f-5615-4071-9ddc-0d5ecc8ab192",
"key": "marketoFormLoaded",
"operator": "eq",
"value": "true",
"conjunction": ""
}
}
],
"fields": [
{
"action": "set",
"id": "a604f68e-4ed9-41ce-8264-35b4d5b78288",
"value": "li.1.{{userDetails.sessionID}}.{{formAutomaticValues.assignedFormID}}",
"existingValueAction": "overwrite",
"daysToExpiration": 1,
"key": "",
"name": "li_fat_id",
"type": "Cookie Storage"
}
]
}
],
"defineMyMonitoringValues": [],
"defineMyPopulateValues": [
{
"id": "2ebb8b20-afa3-4579-a7be-fa5b243d8b73",
"listener": "contactForm7",
"name": "test 1",
"type": "Simple Rule",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Event",
"id": "314255f8-7bc6-4d3c-b2d5-803d43101b41",
"key": "cf7FormLoaded",
"operator": "eq",
"value": "true",
"conjunction": ""
}
}
],
"fields": [
{
"id": "populate-cookie-0",
"getValueFrom": "cookie",
"keyName": {
"id": "1e81fba0-353e-443e-b5c6-b6f62744de89",
"name": "value 1",
"type": "Cookie Storage",
"group": "browser",
"label": "value 1"
},
"pushField": "",
"selectorField": "test",
"isSelector": true
}
]
},
{
"id": "6b41038e-1ed7-45be-bd98-f43ffdb35ebc",
"listener": "customForms",
"name": "test 1",
"type": "Simple Rule",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Event",
"id": "95f1148d-6824-46bc-abb4-1caa85d54c8d",
"key": "customFormLoaded",
"operator": "eq",
"value": "true",
"conjunction": ""
}
}
],
"fields": [
{
"id": "populate-localStorage-0",
"getValueFrom": "localStorage",
"keyName": {
"id": "be276ecf-6627-4777-803e-fbf8fe930c15",
"name": "local 1",
"type": "Local Storage",
"group": "browser",
"label": "local 1"
},
"pushField": "email",
"selectorField": "",
"isSelector": false
}
]
},
{
"id": "dc1d913e-230a-4a49-9f9a-0e81b0b88249",
"listener": "fluentForms",
"name": "test 1",
"type": "Simple Rule",
"conditions": [
{
"conjunction": "",
"g0": {
"type": "Variable",
"key": "ListenLayer.accountID",
"operator": "ct",
"value": "12",
"conjunction": "and",
"id": "f9d4c710-0c77-4f17-9fff-7c6f12c594d7"
},
"g1": {
"type": "Event",
"id": "361a6d69-ae95-4552-ba1e-5773d8921dd9",
"key": "flFormLoaded",
"operator": "eq",
"value": "true",
"conjunction": ""
}
}
],
"fields": [
{
"id": "populate-sessionStorage-0",
"getValueFrom": "sessionStorage",
"keyName": {
"id": "19d8806b-b511-4675-8e99-907b3b4078e4",
"name": "session 1",
"type": "Session Storage",
"group": "browser",
"label": "session 1"
},
"pushField": "email",
"selectorField": "",
"isSelector": false
}
]
}
],
"defineUserSource": [
{
"id": "bc690f73-b36c-45d3-9c5d-5035222cda05",
"listener": "userSource",
"name": "CT campaign & term",
"type": "Lookup Rule Custom",
"conditions": [
[
{
"conjunction": "and",
"g0": {
"type": "Variable",
"id": "4f8209b7-496f-47bb-8c76-dda4b712656e",
"key": "sourceAutomaticValues.url.query.utm_campaign",
"operator": "ct",
"value": "Caredit",
"isRegex": false
}
},
{
"conjunction": "",
"g0": {
"type": "Variable",
"id": "cac4b303-637a-4e4b-811b-c65c5b94a328",
"key": "sourceAutomaticValues.url.query.utm_term",
"operator": "ct",
"value": "redd",
"isRegex": false
}
}
],
[
{
"conjunction": "and",
"g0": {
"type": "Variable",
"id": "4f8209b7-496f-47bb-8c76-dda4b712656e",
"key": "sourceAutomaticValues.url.query.utm_campaign",
"operator": "ct",
"value": "cam-snap",
"isRegex": false
}
},
{
"conjunction": "",
"g0": {
"type": "Variable",
"id": "cac4b303-637a-4e4b-811b-c65c5b94a328",
"key": "sourceAutomaticValues.url.query.utm_term",
"operator": "ct",
"value": "Snapchat",
"isRegex": false
}
}
],
[
{
"conjunction": "and",
"g0": {
"type": "Variable",
"id": "4f8209b7-496f-47bb-8c76-dda4b712656e",
"key": "sourceAutomaticValues.url.query.utm_campaign",
"operator": "ct",
"value": "Cam-ytb",
"isRegex": false
}
},
{
"conjunction": "",
"g0": {
"type": "Variable",
"id": "cac4b303-637a-4e4b-811b-c65c5b94a328",
"key": "sourceAutomaticValues.url.query.utm_term",
"operator": "ct",
"value": "YouTuBe",
"isRegex": false
}
}
]
],
"fields": [
[
{
"name": "User Source",
"value": "Reddit Ads"
}
],
[
{
"name": "User Source",
"value": "Snapchat Ads Remarketing"
}
],
[
{
"name": "User Source",
"value": "YouTube Organic"
}
]
]
},
{
"id": "e2936d8a-850e-4601-8873-1c937f4ebc80",
"listener": "userSource",
"name": "CT medium & source",
"type": "Lookup Rule Custom",
"conditions": [
[
{
"conjunction": "and",
"g0": {
"type": "Variable",
"id": "5717bc72-b110-4be8-9089-c5244594e116",
"key": "sourceAutomaticValues.url.query.utm_medium",
"operator": "ct",
"value": "med",
"isRegex": false
}
},
{
"conjunction": "",
"g0": {
"type": "Variable",
"id": "fbd99819-61c3-4ec5-93c5-f0e2a30dd642",
"key": "sourceAutomaticValues.url.query.utm_source",
"operator": "ct",
"value": "Bing",
"isRegex": false
}
}
],
[
{
"conjunction": "and",
"g0": {
"type": "Variable",
"id": "5717bc72-b110-4be8-9089-c5244594e116",
"key": "sourceAutomaticValues.url.query.utm_medium",
"operator": "ct",
"value": "Duckmed",
"isRegex": false
}
},
{
"conjunction": "",
"g0": {
"type": "Variable",
"id": "fbd99819-61c3-4ec5-93c5-f0e2a30dd642",
"key": "sourceAutomaticValues.url.query.utm_source",
"operator": "ct",
"value": "duck",
"isRegex": false
}
}
],
[
{
"conjunction": "and",
"g0": {
"type": "Variable",
"id": "5717bc72-b110-4be8-9089-c5244594e116",
"key": "sourceAutomaticValues.url.query.utm_medium",
"operator": "ct",
"value": "Med-Meta",
"isRegex": false
}
},
{
"conjunction": "",
"g0": {
"type": "Variable",
"id": "fbd99819-61c3-4ec5-93c5-f0e2a30dd642",
"key": "sourceAutomaticValues.url.query.utm_source",
"operator": "ct",
"value": "Meta",
"isRegex": false
}
}
]
],
"fields": [
[
{
"name": "User Source",
"value": "Bing Organic"
}
],
[
{
"name": "User Source",
"value": "DuckDuckGo Organic"
}
],
[
{
"name": "User Source",
"value": "Meta Ads"
}
]
]
},
{
"id": "51fe1791-d2dd-427c-9d47-732c94c8e9cd",
"listener": "userSource",
"name": "CT source",
"type": "Lookup Rule Custom",
"conditions": [
[
{
"conjunction": "",
"g0": {
"type": "Variable",
"id": "fbd99819-61c3-4ec5-93c5-f0e2a30dd642",
"key": "sourceAutomaticValues.url.query.utm_source",
"operator": "ct",
"value": "Slack",
"isRegex": false
}
}
],
[
{
"conjunction": "",
"g0": {
"type": "Variable",
"id": "fbd99819-61c3-4ec5-93c5-f0e2a30dd642",
"key": "sourceAutomaticValues.url.query.utm_source",
"operator": "ct",
"value": "Zalo",
"isRegex": false
}
}
],
[
{
"conjunction": "",
"g0": {
"type": "Variable",
"id": "fbd99819-61c3-4ec5-93c5-f0e2a30dd642",
"key": "sourceAutomaticValues.url.query.utm_source",
"operator": "ct",
"value": "BAIDU",
"isRegex": false
}
}
]
],
"fields": [
[
{
"name": "User Source",
"value": "Slack Ads"
}
],
[
{
"name": "User Source",
"value": "Zalo Organic"
}
],
[
{
"name": "User Source",
"value": "Baidu Ads"
}
]
]
},
{
"id": "163e6999-01c8-46d7-9f95-35ba168205ee",
"listener": "userSource",
"name": "Query String Rules",
"type": "Lookup Rule",
"conditions": [
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "google-display"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "google-remarketing"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "google-discovery"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "google-video"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "google-search"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "google"
},
{
"urlParameter": "gclid",
"matchType": "exav",
"value": "*"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "bing-display"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "microsoft-display"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "bing-remarketing"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "microsoft-remarketing"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "bing-video"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "microsoft-video"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "bing-search"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "microsoft-search"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "bing"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "microsoft"
},
{
"urlParameter": "msclkid",
"matchType": "exav",
"value": "*"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "facebook-display"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "facebook-remarketing"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "facebook-discovery"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "facebook"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "instagram-display"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "instagram-remarketing"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "instagram-discovery"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "instagram"
},
{
"urlParameter": "fbclid",
"matchType": "exav",
"value": "*"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "linkedin-display"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "linkedin-remarketing"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "linkedin-discovery"
},
{
"urlParameter": "utm_source",
"matchType": "ct",
"value": "linkedin"
}
],
"fields": [
{
"userSource": "Google Ads Display"
},
{
"userSource": "Google Ads Remarketing"
},
{
"userSource": "Google Ads Discovery"
},
{
"userSource": "Google Ads Video"
},
{
"userSource": "Google Ads Search"
},
{
"userSource": "Google Ads"
},
{
"userSource": "Google Ads"
},
{
"userSource": "Microsoft Ads Display"
},
{
"userSource": "Microsoft Ads Display"
},
{
"userSource": "Microsoft Ads Remarketing"
},
{
"userSource": "Microsoft Ads Remarketing"
},
{
"userSource": "Microsoft Ads Video"
},
{
"userSource": "Microsoft Ads Video"
},
{
"userSource": "Microsoft Ads Search"
},
{
"userSource": "Microsoft Ads Search"
},
{
"userSource": "Microsoft Ads"
},
{
"userSource": "Microsoft Ads"
},
{
"userSource": "Microsoft Ads"
},
{
"userSource": "Facebook Ads Display"
},
{
"userSource": "Facebook Ads Remarketing"
},
{
"userSource": "Facebook Ads Discovery"
},
{
"userSource": "Facebook Ads"
},
{
"userSource": "Instagram Ads Display"
},
{
"userSource": "Instagram Ads Remarketing"
},
{
"userSource": "Instagram Ads Discovery"
},
{
"userSource": "Instagram Ads"
},
{
"userSource": "Facebook Ads"
},
{
"userSource": "Linkedin Ads Display"
},
{
"userSource": "Linkedin Ads Remarketing"
},
{
"userSource": "Linkedin Ads Discovery"
},
{
"userSource": "Linkedin Ads"
}
]
},
{
"id": "3e20e43d-8425-4f41-a554-a667096b706b",
"listener": "userSource",
"name": "Referrer Rules",
"type": "Lookup Rule",
"conditions": [
{
"urlParameter": "hostname",
"matchType": "ct",
"value": "www.google."
},
{
"urlParameter": "hostname",
"matchType": "ct",
"value": "bing.com"
},
{
"urlParameter": "hostname",
"matchType": "ct",
"value": "facebook.com"
},
{
"urlParameter": "hostname",
"matchType": "ct",
"value": "instagram.com"
},
{
"urlParameter": "hostname",
"matchType": "ct",
"value": "linkedin.com"
},
{
"urlParameter": "hostname",
"matchType": "exav",
"value": "*",
"block": true
}
],
"fields": [
{
"userSource": "Google Organic"
},
{
"userSource": "Bing Organic"
},
{
"userSource": "Facebook Organic"
},
{
"userSource": "Instagram Organic"
},
{
"userSource": "Linkedin Organic"
},
{
"userSource": "Referral"
}
]
}
],
"customFormTargetRules": {
"customForms": [
{
"conjunction": "",
"g0": {
"attribute": "CSS ID",
"operator": "ct",
"value": "form1",
"conjunction": ""
}
}
]
},
"defineClickRules": [
{
"id": "75d90bdf-bf32-4bd3-9b83-d9295d721cce",
"listener": "outboundClicks",
"name": "Outbound Click URL Rule Set",
"type": "Lookup Rule",
"conditions": [
{
"clickUrlElement": "hostname",
"matchType": "ct",
"value": "ztest.hostedstaging3.com"
},
{
"clickUrlElement": "hostname",
"matchType": "ct",
"value": "qatest.hostedstaging3.com"
},
{
"clickUrlElement": "hostname",
"matchType": "ct",
"value": "dtest.hostedstaging3.com"
},
{
"clickUrlElement": "hostname",
"matchType": "ct",
"value": "mastertemplate.local"
},
{
"clickUrlElement": "hostname",
"matchType": "ct",
"value": "demo5.hostedstaging.com"
},
{
"clickUrlElement": "hostname",
"matchType": "ct",
"value": "demo.hostedstaging.com"
}
],
"fields": [
{
"trackAsClicks": "no"
},
{
"trackAsClicks": "no"
},
{
"trackAsClicks": "no"
},
{
"trackAsClicks": "no"
},
{
"trackAsClicks": "no"
},
{
"trackAsClicks": "no"
}
]
},
{
"id": "e8995b66-7535-4812-9d4d-d59539cca282",
"listener": "pdfClicks",
"name": "PDF Click Rule Set",
"type": "Lookup Rule",
"conditions": [
{
"clickUrlElement": "fileExtension",
"matchType": "ct",
"value": ".pdf"
}
],
"fields": [
{
"trackAsClicks": "yes"
}
]
},
{
"id": "6da0bb33-c630-41a6-aa60-bea5aeb11107",
"listener": "internalClicks",
"name": "Internal Click URL Rule Set",
"type": "Lookup Rule",
"conditions": [
{
"clickUrlElement": "hostname",
"matchType": "ct",
"value": "ztest.hostedstaging3.com"
},
{
"clickUrlElement": "hostname",
"matchType": "ct",
"value": "qatest.hostedstaging3.com"
},
{
"clickUrlElement": "hostname",
"matchType": "ct",
"value": "dtest.hostedstaging3.com"
},
{
"clickUrlElement": "hostname",
"matchType": "ct",
"value": "mastertemplate.local"
},
{
"clickUrlElement": "hostname",
"matchType": "ct",
"value": "demo5.hostedstaging.com"
},
{
"clickUrlElement": "hostname",
"matchType": "ct",
"value": "demo.hostedstaging.com"
}
],
"fields": [
{
"trackAsClicks": "yes"
},
{
"trackAsClicks": "yes"
},
{
"trackAsClicks": "yes"
},
{
"trackAsClicks": "yes"
},
{
"trackAsClicks": "yes"
},
{
"trackAsClicks": "yes"
}
]
}
],
"destinations": {
"microsoftAds": {
"id": "512a281f-9939-4ee8-b9d0-b8496da85c23",
"isCustom": false,
"usingType": "gtm",
"generalSettings": {
"tagId": "123123"
},
"ecommerceEvent": []
},
"facebookAds": {
"id": "f7591fa6-2ac9-4742-b797-39a16ff7f009",
"isCustom": false,
"usingType": "gtm",
"data": {
"conversions": []
},
"generalSettings": {
"pixelId": "123"
},
"ecommerceEvent": []
},
"googleAds": {
"id": "4962c093-113c-4bef-aff5-cbc4fc26749c",
"isCustom": false,
"usingType": "gtm",
"data": {
"conversions": []
},
"generalSettings": {
"conversionId": "99999",
"merchantId": ""
},
"ecommerceEvent": []
},
"googleAnalytics4": {
"id": "5c525f0d-68f2-495e-a48f-4d0abc4f08db",
"isCustom": false,
"usingType": "either",
"data": {
"conversions": [
{
"id": "f3af1c39-0758-482f-bcd8-dfc5d02ae170",
"name": "conv-clickID",
"sendTo": true,
"eventId": "convclickid",
"accountRuleId": "f3af1c39-0758-482f-bcd8-dfc5d02ae170",
"isCustom": true,
"customVariables": {
"type": "primary",
"value": "",
"currency": "",
"cursor": {
"index": -1,
"position": -1
}
},
"customScript": ""
},
{
"id": "11c9be7f-560b-4499-a8b9-abdf99112cd3",
"name": "Form - Webinar Registration",
"sendTo": true,
"eventId": "form_webinar_registration",
"accountRuleId": "11c9be7f-560b-4499-a8b9-abdf99112cd3",
"isCustom": true,
"customVariables": {
"currency": "",
"type": "primary",
"value": "",
"cursor": {
"index": -1,
"position": -1
}
},
"customScript": "",
"updateRule": false,
"sendToServerSide": false,
"overrideMeasurement": false
}
]
},
"generalSettings": {
"measurementId": "G-Y6C9SBKG4R"
},
"ecommerceEvent": []
},
"linkedInAds": {
"id": "ed989fc3-9d6f-41a1-98f0-4cbb447dfcc5",
"isCustom": false,
"usingType": "gtm",
"data": {
"conversions": []
},
"ecommerceEvent": []
},
"testZapier": {
"id": "847b46ba-a84f-407d-8c7f-aa39f3674300",
"isCustom": true,
"usingType": "gtm"
}
},
"defineEngagementRules": [
{
"id": "26dfb955-ebfd-4f87-b367-ab12786c800a",
"listener": "sessionEngagement",
"name": "Conversions",
"type": "Simple Rule",
"conditions": [
{
"conjunction": "",
"g0": {
"conjunction": "",
"type": "Conversion Count",
"operator": "gt",
"value": 0,
"key": ""
}
}
]
},
{
"id": "d3eaf6f1-345b-4c5d-966e-5eebec56cd56",
"listener": "sessionEngagement",
"name": "Page Views",
"type": "Simple Rule",
"conditions": [
{
"conjunction": "",
"g0": {
"conjunction": "",
"type": "Page View Count",
"operator": "gt",
"value": 1,
"key": ""
}
}
]
},
{
"id": "8d07f922-6cf4-49a3-b369-9c348ede007e",
"listener": "sessionEngagement",
"name": "Page Engagement",
"type": "Simple Rule",
"conditions": [
{
"conjunction": "",
"g0": {
"conjunction": "and",
"type": "Tab Visible",
"operator": "gt",
"value": 29,
"key": ""
},
"g1": {
"conjunction": "",
"type": "Scroll Depth",
"operator": "gt",
"value": 19,
"key": ""
}
}
]
}
],
"personalData": {
"id": "edddce42-d9e6-47ae-b667-2ca00ef76792",
"accountId": "73c9f403-949a-4950-9636-8c51fb1e4272",
"hashedData": false,
"events": {
"identifyPerson": {
"customEventName": "",
"pushEveryTime": true
}
},
"settings": {
"externalID": {
"provideManually": false,
"type": "",
"key": ""
},
"email": {
"listening": true,
"provideManually": false,
"type": "",
"key": ""
},
"phone": {
"listening": true,
"type": "",
"key": ""
},
"firstName": {
"type": "",
"key": ""
},
"lastName": {
"type": "",
"key": ""
},
"addressStreet": {
"type": "",
"key": ""
},
"addressCity": {
"type": "",
"key": ""
},
"addressRegion": {
"type": "",
"key": ""
},
"addressCountry": {
"type": "",
"key": ""
},
"addressPostalCode": {
"type": "",
"key": ""
}
},
"status": true,
"created_at": "2025-05-20T01:32:26.772Z",
"updated_at": "2025-08-01T04:12:51.175Z"
},
"accountPersonRules": [
{
"id": "8b20de24-71a7-4d65-846c-159a6e041cfa",
"accountId": "73c9f403-949a-4950-9636-8c51fb1e4272",
"name": "Block Identify People on Certain Pages",
"description": "",
"conditions": {
"isOnly": false,
"isNever": false,
"isAlways": false,
"conditions": [
{
"g0": {
"key": "pageUrl",
"type": "",
"value": "click",
"condition": "ct",
"conjunction": ""
},
"conjunction": ""
}
]
},
"status": true,
"created_at": "2025-05-20T04:23:18.355Z",
"updated_at": "2025-06-21T01:27:01.044Z"
},
{
"id": "3100d1a5-72ab-4ace-bc16-397f4dd4f9e8",
"accountId": "73c9f403-949a-4950-9636-8c51fb1e4272",
"name": "Block collection of test Email and Phone",
"description": "",
"conditions": {
"isOnly": false,
"isNever": false,
"isAlways": false,
"conditions": [
{
"g0": {
"key": "email",
"value": "tester@gmail.com",
"condition": "eq",
"conjunction": "or"
},
"g1": {
"key": "email",
"value": "tu.le@gg.com",
"condition": "eq",
"conjunction": "or"
},
"g2": {
"key": "email",
"value": "tu@gmail.com",
"condition": "eq",
"conjunction": "or"
},
"g3": {
"key": "email",
"value": "ztest@ztest.com",
"condition": "ct",
"conjunction": "or"
},
"g4": {
"key": "phone",
"type": "",
"value": "1212121212",
"condition": "eq",
"conjunction": ""
},
"conjunction": ""
}
]
},
"status": true,
"created_at": "2025-05-20T04:29:33.750Z",
"updated_at": "2025-06-13T09:45:40.864Z"
},
{
"id": "d01e07f4-08ca-4577-9e97-826e2a293a93",
"accountId": "73c9f403-949a-4950-9636-8c51fb1e4272",
"name": "People from URL Parameters",
"description": "",
"conditions": {
"isOnly": true,
"isNever": false,
"isAlways": false,
"conditions": [
{
"g0": {
"key": "urlParameter",
"type": "email",
"value": "email",
"condition": "eq",
"conjunction": "or"
},
"g1": {
"key": "urlParameter",
"type": "email",
"value": "Email",
"condition": "eq",
"conjunction": "or"
},
"g2": {
"key": "urlParameter",
"type": "email",
"value": "e-mail",
"condition": "eq",
"conjunction": "or"
},
"g3": {
"key": "urlParameter",
"type": "email",
"value": "e_mail",
"condition": "eq",
"conjunction": ""
},
"conjunction": "or"
},
{
"g0": {
"key": "urlParameter",
"type": "phone",
"value": "phone",
"condition": "eq",
"conjunction": "or"
},
"g1": {
"key": "urlParameter",
"type": "phone",
"value": "phonenumber",
"condition": "eq",
"conjunction": "or"
},
"g2": {
"key": "urlParameter",
"type": "phone",
"value": "pnumber",
"condition": "eq",
"conjunction": "or"
},
"g3": {
"key": "urlParameter",
"type": "phone",
"value": "phone_number",
"condition": "eq",
"conjunction": "or"
},
"g4": {
"key": "urlParameter",
"type": "phone",
"value": "phone-number",
"condition": "eq",
"conjunction": ""
},
"conjunction": ""
}
]
},
"status": true,
"created_at": "2025-06-13T09:46:03.220Z",
"updated_at": "2025-06-13T09:46:09.388Z"
}
],
"enrichmentRules": [
{
"id": "2737ee6e-a95e-4c27-89cb-3e4b1abbfde9",
"accountId": "73c9f403-949a-4950-9636-8c51fb1e4272",
"name": "rule cart B2B",
"description": "",
"conditions": {
"conditions": [
{
"g0": {
"id": "C6331153139029",
"key": "conv 2_form custom",
"type": "Conversion",
"value": "true",
"operator": "eq",
"conjunction": "",
"enrichmentType": "B2B"
},
"conjunction": ""
}
]
},
"status": true,
"created_at": "2025-09-15T01:19:01.749Z",
"updated_at": "2025-09-16T02:51:54.407Z",
"type": null,
"ruleType": "Enrichment Rule"
},
{
"id": "cb16a59c-bce2-47eb-bdea-87695b818c53",
"accountId": "73c9f403-949a-4950-9636-8c51fb1e4272",
"name": "test scroll B2C",
"description": "",
"conditions": {
"conditions": [
{
"g0": {
"id": "2e8270d4-b177-4be4-9ef2-264e9815e61f",
"key": "Reached Bottom of Page",
"type": "Trigger",
"value": "true",
"operator": "eq",
"conjunction": "",
"enrichmentType": "B2C"
},
"conjunction": ""
}
]
},
"status": true,
"created_at": "2025-09-15T01:18:28.776Z",
"updated_at": "2025-09-15T01:18:28.776Z",
"type": null,
"ruleType": "Enrichment Rule"
},
{
"id": "019d36f8-76ec-42ce-9d73-45d8c4e86c28",
"accountId": "73c9f403-949a-4950-9636-8c51fb1e4272",
"name": "Default Pixel Tracking Rule",
"description": "",
"conditions": {
"conditions": [
{
"g0": {
"id": "813188e5-715d-4624-9263-0586e1456c4c",
"key": "All Engaged Sessions",
"type": "Trigger",
"value": "true",
"operator": "eq",
"conjunction": ""
},
"conjunction": ""
}
]
},
"status": true,
"created_at": "2025-07-30T04:38:50.848Z",
"updated_at": "2025-09-15T01:09:34.589Z",
"type": "pixel",
"ruleType": "Enrichment Rule"
}
],
"formRules": [
{
"id": "d2b4d377-8e32-41a9-8799-0cc25ccb93c9",
"listener": "",
"name": "Categorize Forms",
"type": "Lookup Rule",
"conditions": [
[
{
"conjunction": "and",
"g0": {
"type": "Variable",
"id": "238e7572-4260-4cdf-a77e-9e2bf0c9f515",
"key": "formAutomaticValues.formID",
"operator": "eq",
"value": "fluentform_1",
"isRegex": false,
"isClass": false
}
},
{
"conjunction": "",
"g0": {
"type": "Variable",
"id": "238e7572-4260-4cdf-a77e-9e2bf0c9f515",
"key": "formAutomaticValues.formLocation.originPathName",
"operator": "eq",
"value": "https://ztest.hostedstaging3.com/fluent-form-single/",
"isRegex": false
}
}
],
[
{
"conjunction": "and",
"g0": {
"type": "Variable",
"id": "e14ddfd3-e681-45af-8b05-3086635003a0",
"key": "formAutomaticValues.formID",
"operator": "eq",
"value": "0199fb68-4f73-46a3-a6c9-a85255def784",
"isRegex": false,
"isClass": false
}
},
{
"conjunction": "",
"g0": {
"type": "Variable",
"id": "e14ddfd3-e681-45af-8b05-3086635003a0",
"key": "formAutomaticValues.formLocation.originPathName",
"operator": "eq",
"value": "https://qatest.hostedstaging3.com/hubspot-regular-form/",
"isRegex": false
}
}
],
[
{
"conjunction": "and",
"g0": {
"type": "Variable",
"id": "cf9313a3-5dda-432c-af41-ce3ed4302856",
"key": "formAutomaticValues.formID",
"operator": "eq",
"value": "fluentform_1",
"isRegex": false,
"isClass": false
}
},
{
"conjunction": "",
"g0": {
"type": "Variable",
"id": "cf9313a3-5dda-432c-af41-ce3ed4302856",
"key": "formAutomaticValues.formLocation.originPathName",
"operator": "eq",
"value": "https://qatest.hostedstaging3.com/fluent-form-single/",
"isRegex": false
}
}
],
[
{
"conjunction": "and",
"g0": {
"type": "Variable",
"id": "3253c046-67e2-4b91-8657-a00fe543d1d0",
"key": "formAutomaticValues.formID",
"operator": "eq",
"value": "fluentform_1",
"isRegex": false,
"isClass": false
}
},
{
"conjunction": "",
"g0": {
"type": "Variable",
"id": "3253c046-67e2-4b91-8657-a00fe543d1d0",
"key": "formAutomaticValues.formLocation.originPathName",
"operator": "eq",
"value": "https://dtest.hostedstaging3.com/fluent-form-single/",
"isRegex": false
}
}
],
[
{
"conjunction": "and",
"g0": {
"type": "Variable",
"id": "",
"key": "formAutomaticValues.formID",
"operator": "ct",
"value": "(.*?)",
"isRegex": true
}
},
{
"conjunction": "",
"g0": {
"type": "Variable",
"id": "",
"key": "formAutomaticValues.formLocation.originPathName",
"operator": "ct",
"value": "(.*?)",
"isRegex": true
}
}
]
],
"fields": [
[
{
"id": "165c9c83-a4ec-4699-8a5e-f6dbdf0fd83d",
"formName": "test"
}
],
[
{
"id": "c2741835-a515-42c2-8c3b-abc06e75c359",
"formName": "test"
}
],
[
{
"id": "165c9c83-a4ec-4699-8a5e-f6dbdf0fd83d",
"formName": "test"
}
],
[
{
"id": "165c9c83-a4ec-4699-8a5e-f6dbdf0fd83d",
"formName": "test"
}
],
[
{
"id": "5fb345e8-3d40-4398-94f0-d3d417d77c7a"
}
]
]
}
],
"formCrawlBlockRules": [],
"customCategories": [
{
"id": "5fb345e8-3d40-4398-94f0-d3d417d77c7a",
"name": "Webinar Registration",
"isFallback": true
},
{
"id": "c2741835-a515-42c2-8c3b-abc06e75c359",
"name": "test",
"isFallback": false
},
{
"id": "165c9c83-a4ec-4699-8a5e-f6dbdf0fd83d",
"name": "Contact Us",
"isFallback": false
},
{
"id": "4dc69616-904b-4475-ab7e-c52b942c4a29",
"name": "Support Request",
"isFallback": false
}
],
"ignoredFormCategories": [
{
"id": "c785ea7f-9ee8-4052-b0f8-b371e9e38150",
"formId": null,
"formClass": "form-search-menu",
"formLocation": null,
"assignedFormID": "e136e19749764f1ed268e5680f28ee72",
"parentIgnore": true
},
{
"id": "93a4ad49-9ba7-4862-8c7f-28979fee2ff2",
"formId": "listenlayer-attribute",
"formClass": "listenlayer",
"formLocation": null,
"assignedFormID": "2f3f3bd27280d759abe260adc12913a3",
"parentIgnore": true
},
{
"id": "219f0811-638c-439c-b784-f8a6524ef9a2",
"formId": "21dxzmq",
"formClass": "form",
"formLocation": null,
"assignedFormID": "f85fd9a9ebd87b1f1d9f2a13155a1362",
"parentIgnore": true
}
],
"isRunningV2": true,
"versionConsent": null,
"pixelStatus": true,
"sessionExpiration": {
"hours": "0",
"minutes": "30"
}
}
