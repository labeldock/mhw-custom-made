console.log("Generate DB assets");

const { writeFileSync, existsSync } = require("fs");
const { groupBy } = require("lodash");
const { sort, promise } = require("@sepalang/pado");
const runner = require("@sepalang/runner");



writeAssets = async ()=>{
  const isEnoughFile = ()=>{
    return !existsSync("./db/armors.json") || !existsSync("./db/charms.json") || !existsSync("./db/items.json") || !existsSync("./db/skills.json")
  }
  
  if(isEnoughFile()){
    await runner(async ({ run })=>{
      await run("npm run fetchdb");
      if(isEnoughFile()){
        process.exit(1);
      }
    })
  }
  
  let armors = require("./db/armors.json");
  let charms = require("./db/charms.json");
  let items = require("./db/items.json");
  let skills = require("./db/skills.json");
    
  //slots to array
  armors = armors.map((datum)=>{
    const { slots } = datum;
    datum.slots = (slots||"").split("").map(v=>Number(v));
    return datum;
  });

  // sort lare
  armors = sort(armors,({ rare:a },{ rare:b })=>Number(a) > Number(b));

  // sort slot 
  armors = sort(armors,({ slots:a },{ slots:b })=>{
    if(a.length === b.length){
      return a[0] > b[0];
    }
    return a.length > b.length
  });

  // groupBy
  armors = groupBy(armors,({ part })=>part);

  console.log("generate assets/armors.json");
  writeFileSync('./src/assets/armors.json',JSON.stringify(armors,2,2));
  console.log("generate assets/charms.json");
  writeFileSync('./src/assets/charms.json',JSON.stringify(charms,2,2));
  console.log("generate assets/items.json");
  writeFileSync('./src/assets/items.json',JSON.stringify(items,2,2));
  console.log("generate assets/skills.json");
  writeFileSync('./src/assets/skills.json',JSON.stringify(skills,2,2));
}

writeAssets();