const axios = require("axios");
const path = require("path");
const fs = require("fs");
const baseUrl = "http://www.mhwdb.kr/apis";

const dbPath = path.join(__dirname, "../db");

const categories = {
  skills:`${baseUrl}/skills`,
  items:`${baseUrl}/items`,
  armors:`${baseUrl}/armors`,
  charms:`${baseUrl}/charms`
};


Object.keys(categories).map(async categoryName=>{
  const categoryUrl = categories[categoryName];
  console.log(`fetch ${categoryName} :: ${categoryUrl}`);

  try {
    const { data } = await axios.get(categoryUrl);
    const content = JSON.stringify(data,2,2);
    fs.writeFileSync(path.join(dbPath,`/${categoryName}.json`),content);
  } catch(e){
    console.log("Request Error", e);
  }
    
});
