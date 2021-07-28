import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import * as fs from 'fs';


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

/**
 * 측정 기관 collection
 * 기관의 siteCode naming rules
 * 대학 : unv_0001 ~ unv_9999
 * 공공기관 : org_0001 ~ org_9999
 */
const organizations:string  = "organizations";

/**
 * 공기질 측정 결과 집합 
 * siteCode | serialNum | lat | long | reportTime | pm5 | pm10 | temp | humid | vocs | co2 | timeZone
 */
const airqualities:string = 'airqualities';

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
    functions.logger.debug(JSON.stringify(outputArray));
    response.status(200).json(outputArray);
  }catch(error){
    response.status(500).json(error.message);
  }
});


/**
 * 파일 전송이 성공하면 파일명을 파라미터로 하여 호출함
 * return : 입력된 데이타 건수 (통상적이라면 60) , -1 이면 오류발생을 의미
 */
 export const dispatch =  functions.https.onRequest( async  (request, response) => {

   try{

    functions.logger.info("dispatch", {structuredData: true});
    
    //let bucket = await admin.storage().bucket("mytypescript-62c14.appspot.com");
    let bucket = await admin.storage().bucket("default-bucket");
    
    const fileName = await request.body.fileName;


    //const options = {      destination: "/tmp/"+fileName    };
    const options = {      destination: fileName    };

    
    const _file = await bucket.file(fileName);

    const db = admin.firestore();

    try{
      await _file.download(options);
    }catch(error){
      console.log(error);
    }

    response.setHeader("Content-Type","application/json");
    let cnt:number = 0;
    // let file = fs.readFileSync("/tmp/"+fileName);
    let file = fs.readFileSync(fileName);
    // reference siteCode via log file name
    const dump = fileName.split('-');

    const msg = file.toString();
    const arr = msg.replace(/\r\n/g,'\n').split('\n');
        
    for(let f of arr) {
      const str  = f.toString().replace(/\r\n/g,'\n').split('|');
      let i:number = 0;
        const obj = {
          siteCode    : dump[0],
          serialNum   : str[i++],
          lat         : str[i++],
          long        : str[i++],
          reportTime  : str[i++],
          pm5         : str[i++],
          pm10        : str[i++],
          temp        : str[i++],
          humid       : str[i++],
          vocs        : str[i++],
          co2         : str[i++],
          timeZone    : str[i++],
        }
      i = 0;
      const doc = db.collection(airqualities).doc();
      
      doc.create(obj);
      cnt++;
    }
    
    const result = {
      "rows" : cnt
    }
    response.status(200).json(result);    
    _file.delete();

  }catch(error){
    console.log(error);
    const result = {
      message : "Error occur ! while log dispatching"
    }
    response.status(500).json(result);  
  }

  
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
 *  timeZone    : GMT+9 ,
 *  sitecode    : 1234567890123456,
 *  encKey      : organization_enc_key ( = IV_TEXT)
 * }
 */
export const getData = functions.https.onRequest(async(request, response) => {
  
  functions.logger.info("getData", {structuredData: true});

  const serialNum     =  request.body.serialNum;
  const fromDate      = request.body.fromDate;
  const toDate        =  request.body.toDate;
  const siteCode      =  request.body.siteCode;
  const key           = request.body.key;
  const format:string        = request.body.format;

  const iFromDate = Number(fromDate);
  const iToDate = Number(toDate);

  if(iToDate - iFromDate > 10000){ // 1 hour
    const obj = {
      message : "Too big, Condition Period only within One Hour"
    };
    response.status(403).json(obj);  
    return;
  }

  const db = admin.firestore();
  let ref = db.collection(organizations).where("siteCode", "==" , siteCode).where("key", "==" , key).get();
  await ref.then(function( snapshot){
    if ( snapshot.size == 0 ){
      const obj = {
        message : "Not Found Site"
      };
      response.status(404).json(obj);  
      return;
    }
  }).catch(error=>{
    console.log(error);
    const obj = {
      message : "Internal Server Error",
      content : error.message
    };
    response.status(500).json(obj);  
    return;
  });

  ref = db.collection(airqualities)
  .where("siteCode","==", siteCode)
  .where("reportTime", ">=" , fromDate)
  .where("reportTime", "<" , toDate).get();//*/

  if(format.toLocaleLowerCase() === "csv"){

    await ref.then(function( snapshot){
      try{
        response.setHeader("Content-Type","text/csv");
      }catch(error){
        console.log(error);
      }
      let buffer:string = "SerialNum, Co2, Humid, Pm10, Pm5, Temp, Vocs, timeZone, ReportTime, Lat, Long," + "\n";
      let str:string = "";
  
      snapshot.forEach(async (doc)=>{
          str = doc.get("serialNum")      + "," 
          + doc.get("co2")                + "," 
          + doc.get("humid")              + "," 
          + doc.get("pm10")               + "," 
          + doc.get("pm5")                + "," 
          + doc.get("temp")               + "," 
          + doc.get("vocs")               + ","
          + doc.get("timeZone")           + ","
          + doc.get("reportTime")         + ","
          + doc.get("lat")                + "," 
          + doc.get("long")               + "," +"\n";
          buffer += str;       
      });
      response.setHeader("Content-Disposition", "attachment; filename=" + serialNum + "_" + fromDate+ "_"  + toDate + ".csv");
      response.status(200).send(buffer) ;
      return;
    }).catch(error=>{
      console.log(error);
      const obj = {
        message : "Internal Server Error",
        content : error.message
      };
      response.status(500).json(obj);  
    });
  }

  if(format.toLocaleLowerCase() === "json"){
    try{
      try{
        response.setHeader("Content-Type","application/json");
      }catch(error){
        console.log(error);
      }
      let outputArray:any = [];
  
      (await ref).forEach(  (doc)=>{
        outputArray.push({
          serialNum : doc.get('serialNum'),
          co2 : doc.get("co2"),
          humid : doc.get("humid"),
          pm10 : doc.get("pm10"),
          pm5 : doc.get("pm5"),
          temp : doc.get("temp"),
          vocs : doc.get("vocs"),
          timeZone : doc.get("timeZone"),
          reportTime : doc.get("reportTime"),          
          lat : doc.get("lat"),
          long : doc.get("long"),
        });
      });
      response.status(200).json(outputArray);
    }catch(error){
      console.log(error);
      const obj = {
        message : "Internal Server Error",
        content : error.message
      };
      response.status(500).json(obj);  
    }
    return;  
  
  }

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
  try{
    const db = admin.firestore();
    let siteCode:string;
    siteCode = request.body.siteCode;
    let key:string ;
    key = request.body.key;
    let isFound:boolean = false;

    const ref = db.collection(organizations).where("siteCode", "==" , siteCode).where("key", "==" , key).get();
    response.setHeader("Content-Type","application/json");
    await ref.then(function( snapshot){
      snapshot.forEach(async (doc)=>{
        isFound = true;
        const obj = {
          encKey : doc.get("encKey")
        }
        response.status(200).json(obj); 
        return;
      });
    });
    if(isFound){

    }else{
      const obj = {
        message : "not found"
      };
      response.status(404).json(obj);  
    }    
  }catch(error){
    response.status(500).json(error);  
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
    functions.logger.info("upsertOrganization", {structuredData: true});
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