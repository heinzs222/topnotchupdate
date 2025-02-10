const fs = require("fs");
const path = require("path");
const { glbToGltf } = require("gltf-pipeline");

// 1) Replace "YOUR_PATH_HERE" with your .glb path:
const filePath = "C:/Users/SPECIAL/Desktop/topnotch/jacket.glb";

const glb = fs.readFileSync(filePath);

// 2) Convert glb → gltf in memory:
glbToGltf(glb).then((results) => {
  // results.gltf is the in-memory glTF JSON
  console.log(`Contents of ${path.basename(filePath)}:\n`);
  console.log(JSON.stringify(results.gltf, null, 2));
});
