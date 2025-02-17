// resize-images.js
const glob = require("glob");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Define input and output folders
const inputPattern = "assets/fabric/**/*.webp";
const outputFolder = "assets/fabric_optimized_2048";

// Make sure the output folder exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

glob(inputPattern, (err, files) => {
  if (err) {
    console.error("Glob error:", err);
    return;
  }
  files.forEach((file) => {
    // Create a similar folder structure under outputFolder
    const relativePath = path.relative("assets/fabric", file);
    const outputPath = path.join(outputFolder, relativePath);
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    sharp(file)
      .resize({ width: 2048 })
      .webp({ quality: 80 })
      .toFile(outputPath, (err, info) => {
        if (err) console.error("Error processing", file, err);
        else console.log("Processed", file, "->", outputPath);
      });
  });
});
