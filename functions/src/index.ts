import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
   functions.logger.info("Hello World", {structuredData: true});
   response.send("Hello World");
 });

/**
 * 공기질 파일 데이타를 storage에 저장
 * 파일명은 serialNum_yyyymmdd24HHminSS_TimeZone.log 형식으로 지정하여 폰에서 업로드할 수 있도록 함
 */
export const uploadFile = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello World", {structuredData: true});
  response.send("Hello World");
});

/**
 * 지정된 serialNum 장비가 측정한 해당 시간대의 공기질 데이타를 반환함.
 * 해당 장비가 없을 경우, 404/Device Not Found 를 반환
 * request params
 * {
 *  serialNum   : 23:34:34:34 ,
 *  periodFrom  : yyyymmdd ,
 *  periodTo    : yyyymmdd ,
 *  timezone    : GMT+9 
 * }
 */
export const getData = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello World", {structuredData: true});
  response.send("Hello World");
});

export const getOrganizations = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello World", {structuredData: true});
  response.send("Hello World");
});

/**
 * 사용자가 선택한 기관정보가 옭고 그른지를 판단
 * 코드/키 값으로 기관이 존재하는지 여부 판단
 * request param
 * {
 *  organizationCode : code
 *  organizationKey : key
 * }
 */
export const isCorrect4Organization = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello World", {structuredData: true});
  response.send("Hello World");
});


 