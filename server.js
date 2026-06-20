const express = require("express");
const cors = require("cors");

const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// Telegram ENV
const API_ID = Number(process.env.API_ID);
const API_HASH = process.env.API_HASH;
const SESSION = process.env.SESSION;


// Telegram Client

const client = new TelegramClient(
  new StringSession(SESSION),
  API_ID,
  API_HASH,
  { connectionRetries: 5 }
);


(async () => {
  try {
    await client.connect();
    console.log("Telegram Connected ✅");
  } catch(err){
    console.log("TG Error:", err.message);
  }
})();


// Username -> ID

async function getTelegramId(user){

  user = user.replace("@","");

  if(/^\d+$/.test(user)){
    return user;
  }

  try{

    let entity = await client.getEntity(user);

    return entity.id.toString();

  }catch(e){

    return null;

  }

}


// MAIN API

app.get("/tg", async(req,res)=>{

 try{

 const {key,id}=req.query;


 if(key !== "1month"){

  return res.status(401).json({
   success:false,
   error:"Wrong API key"
  });

 }


 if(!id){

  return res.json({
   success:false,
   error:"Enter id"
  });

 }


 let tg_id = await getTelegramId(id);


 if(!tg_id){

  return res.json({
   success:false,
   error:"Username not found"
  });

 }


 let url =
`https://api.igfollows.site/TG/index.php?type=user&key=OGGYxKRISH&term=${tg_id}`;


 let response = await fetch(url);

 let data = await response.json();



 if(data.success && data.result){


 return res.json({

 success:true,

 username:id,

 tg_id:data.result.tg_id,

 phone:data.result.number,

 country:data.result.country,

 country_code:data.result.country_code

 });


 }


 res.json({

 success:false,
 error:"No record found"

 });


 }catch(e){

 res.status(500).json({

 success:false,
 error:e.message

 });

 }


});


// Home

app.get("/",(req,res)=>{

res.json({

status:"API ONLINE ✅",

example:"/tg?key=1month&id=username"

});

});



app.listen(PORT,()=>{

console.log("Running on",PORT);

});
