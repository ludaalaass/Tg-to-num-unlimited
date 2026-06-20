const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// MAIN API
// /tg?key=1month&id=123456789

app.get("/tg", async (req, res) => {

  const { key, id } = req.query;


  // API KEY CHECK
  if (key !== "1month") {

    return res.status(401).json({
      success:false,
      error:"Invalid API key"
    });

  }


  // ID CHECK
  if (!id) {

    return res.status(400).json({
      success:false,
      error:"id required"
    });

  }


  try {


    const api =
    `https://api.igfollows.site/TG/index.php?type=user&key=OGGYxKRISH&term=${encodeURIComponent(id)}`;


    const response = await fetch(api);


    let data = await response.json();



    // REMOVE ORIGINAL API INFO

    delete data.tag;
    delete data.developer;
    delete data.key_expiry;



    // SEND CLEAN RESPONSE

    return res.json(data);



  } catch (e) {


    return res.status(500).json({

      success:false,

      error:"API fetch failed"

    });


  }

});



// HOME

app.get("/", (req,res)=>{


 res.json({

  status:"ONLINE ✅",

  api:"/tg?key=1month&id=123456789"

 });


});



// HEALTH

app.get("/health",(req,res)=>{


 res.json({

  status:"OK",

  time:new Date().toISOString()

 });


});



// START SERVER

app.listen(PORT,()=>{

 console.log(`🚀 Server running on ${PORT}`);

});
