//import * as functions from "firebase-functions";
import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';



/*
admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: functions.config().private.key.replace(/\\n/g, '\n'),
    projectId: functions.config().project.id,
    clientEmail: functions.config().client.email
  }),
  databaseURL: 'https://[your_project_id].firebaseio.com'
})
*/

const organizations:string = "organizations";
//let organization:string = "organization";
//const fileLocation:string = "gs://default-bucket/";

admin.initializeApp();


export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello World", {structuredData: true});
  response.send("Hello World");
});

/**
 * 전체 기관(예: 순천향대학교, 커뮤니티매핑)의 이름만 반환해 줌
 * no parameter
 * return  [{\"siteCode\":\"unv_0001\",\"name\":\"순천향대학교\"},{\"siteCode\":\"org_0001\",\"name\":\"커뮤니키매핑\"}]"
 */
 export const getOrganizations = functions.https.onRequest(async (request, response) => {
  functions.logger.info("getOrganizations", {structuredData: true});
  const db = admin.firestore();

  let outputArray:any = [];
  
  try{
    const allEntries =  db.collection(organizations).get();
    (await allEntries).forEach(  (doc)=>{
      outputArray.push({
        siteCode : doc.get('siteCode'),
        name: doc.get('name')
      });
    });
    response.setHeader("Content-Type","application/json");
    response.status(200).json(JSON.stringify(outputArray));
  }catch(error){
    response.status(500).json(error.message);
  }
});


/**
 * 파일 전송이 성공하면 파일명을 파라미터로 하여 호출함
 * return : 입력된 데이타 건수 (통상적이라면 60) , -1 이면 오류발생을 의미
 */
 export const dispatch = functions.https.onRequest(async (request, response) => {
  functions.logger.info("dispatch", {structuredData: true});
  const fileName = request.body.fileName;
  
  const storage =  admin.storage();

  // const [files] = await storage.bucket("gs://default-bucket/").getFiles(); length 0
  // const [files] = await storage.bucket("default-bucket").getFiles(); 
  const [files] = await storage.bucket('default-bucket').getFiles(); 

  console.log('Files:' + files.length + storage.app.name);
  files.forEach(file => {
    //console.log(fileName + file.name);
    functions.logger.debug(file.name+fileName);
  });
  
  

  //const files = bucket.getFilesStream(fileName);
  
  /*
  const obj = {
    rows: files.
  }*/
  
  response.status(200).json("obj");
  
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
 * 사용자가 선택한 기관정보가 옭고 그른지를 판단
 * 코드/키 값으로 기관이 존재하는지 여부 판단, code 와 key가 일치하면 암호화할 때 사용할 수 있는 암호키를 반환함
 * request param (예)
  {
	  "siteCode" : "unv_0001",
	  "key" : "Qkslffk@91"
  }
 * return encKey
    respnose code: 200 에 {"encKey":"zhzhfh@76"} or response code : 404 에 { "message": "Not Found"}
 */
export const isCorrect4Organization = functions.https.onRequest(async (request, response) => {
  functions.logger.info("isCorrect4Organization", {structuredData: true});
  const db = admin.firestore();

  let siteCode:string;
  siteCode = request.body.siteCode;
  let key:string ;
  key = request.body.key;


  let isFound:boolean = false;
  let str:string = '';
  const ref = db.collection(organizations).where("siteCode", "==" , siteCode).where("key", "==" , key).get();
  await ref.then(function( snapshot){
     snapshot.forEach(async (doc)=>{
      isFound = true;
      const obj = {
        encKey : doc.get("encKey")
      }
      str = JSON.stringify(obj);
      functions.logger.debug(str);
    });
  });


  if(isFound){
    response.status(200).json(str);  
  }else{
    str =  "{ \"message\": \"Not Found\"}";
    response.status(404).json(str);  
  }

}); 

/**
 * 기관 등록 
 * params
  {
	  "siteCode" : "unv_0001",
	  "encKey" : "zhzhfh@76",
	  "key" : "Qkslffk@91",
	  "name" : "순천향대학교"
  }
 */
export const upsertOrganization = functions.https.onRequest((request, response) => {
  try{
    functions.logger.info("isCorrect4Organization", {structuredData: true});
    const db = admin.firestore();
    const entry = db.collection('organizations').doc();
    const entryObject = {
      siteCode : request.body.siteCode,
      encKey : request.body.encKey,
      key : request.body.key,
      name: request.body.name
    };
    const obj = {
      rows : "1"
    };    
    entry.set(entryObject);
    response.status(200).json(obj);
  }catch(error){
    response.status(500).json(error.message);
  }
  
}); 