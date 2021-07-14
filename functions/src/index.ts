import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
   functions.logger.info("Hello World", {structuredData: true});
   response.send("Hello World");
 });


/**
 * 파일 전송이 성공하면 파일명을 파라미터로 하여 호출함
 * return : 입력된 데이타 건수 (통상적이라면 60) , -1 이면 오류발생을 의미
 */
 export const dispatch = functions.https.onRequest((request, response) => {
  
  functions.logger.info("Hello World", {structuredData: true});
  response.send("Hello World");
});



/**
 * Not used !!!!!! by 김창호
 * 공기질 파일 데이타를 storage에 저장
 * 파일명은 serialNum_yyyymmdd24HHminSS_TimeZone_SiteCode.log 형식으로 지정하여 폰에서 업로드할 수 있도록 함
 */
export const uploadFile = functions.https.onRequest((request, response) => {
  
  functions.logger.info("Hello World", {structuredData: true});
  response.send("Hello World");
});

/**
 * 지정된 serialNum 장비가 측정한 해당 시간대의 공기질 데이타를 반환함.
 * 합당한 요청자인지를 확인하기 위해 sitecode 값과 ecnKey를 요청조건과 같이 보내야함
 * 해당 장비가 없을 경우, 404/Device Not Found 를 반환
 * request params (예)
 * {
 *  serialNum   : 23:34:34:34 ,
 *  periodFrom  : yyyymmdd ,
 *  periodTo    : yyyymmdd ,
 *  timezone    : GMT+9 ,
 *  sitecode    : 1234567890123456,
 *  encKey      : organization_enc_key ( = IV_TEXT)
 * }
 */
export const getData = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello World", {structuredData: true});
  response.send("Hello World");
});

/**
 * 전체 기관(예: 순천향대학교, 커뮤니티매핑)의 이름만 반환해 줌
 * no parameter
 * return name
 */
export const getOrganizations = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello World", {structuredData: true});
  response.send("Hello World");
});

/**
 * 사용자가 선택한 기관정보가 옭고 그른지를 판단
 * 코드/키 값으로 기관이 존재하는지 여부 판단, code 와 key가 일치하면 암호화할 때 사용할 수 있는 암호키를 반환함
 * request param (예)
 * {
 *  organizationCode : code
 *  organizationKey : key
 * }
 * return encKey
 */
export const isCorrect4Organization = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello World", {structuredData: true});
  response.send("Hello World");
});


 