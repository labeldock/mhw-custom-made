const axios = require("axios");
const path = require("path");
const fs = require("fs");
const mkdirp = require('mkdirp');
const baseUrl = "http://www.mhwdb.kr/apis";

const dbPath = path.join(__dirname, "../db");

const categories = {
  skills:{categoryUrl:`${baseUrl}/skills`},
  items:{categoryUrl:`${baseUrl}/items`},
  armors:{categoryUrl:`${baseUrl}/armors`,map:(datum)=>{
    const { slots } = datum;
    datum.slots = (slots||"").split("").map(v=>Number(v));
    return datum;
  }},
  charms:{categoryUrl:`${baseUrl}/charms`}
};


mkdirp.sync(dbPath);

Object.keys(categories).map(async categoryName=>{
  const { categoryUrl, map:mapFn } = categories[categoryName];
  console.log(`fetch ${categoryName} :: ${categoryUrl}`);

  try {
    let { data } = await axios.get(categoryUrl);
    
    if(typeof mapFn === "function"){
      data = data.map(mapFn);
    }
    
    const content = JSON.stringify(data,2,2);
    fs.writeFileSync(path.join(dbPath,`/${categoryName}.json`),content);
  } catch(e){
    console.log("Request Error", e);
  }
    
});
