"use strict";

import fs from 'fs'
import { detect } from 'detect-package-manager'
const pman = await detect()
let path = ``

try {
  if (pman === "pnpm") {
    const dirs = fs.readdirSync("./node_modules/.pnpm/")
    for (const directory of dirs) {
      if (directory.startsWith("mineflayer@")) {
        path = `./node_modules/.pnpm/${directory}/node_modules`
        console.log("📦 Found pnpm mineflayer directory.")
        break
      }
    }
  } else if (pman === "npm" || pman === "yarn") {
    path = `./node_modules/`
  }
  
  let mineflayerDefs = fs.readFileSync(`./node_modules/mineflayer/index.d.ts`, 'utf-8')
  if (!mineflayerDefs.includes(`// @ts-ignore\nimport { Recipe } from 'prismarine-recipe'`)) {
    mineflayerDefs = mineflayerDefs.replace("import { Recipe } from 'prismarine-recipe'", "// @ts-ignore\nimport { Recipe } from 'prismarine-recipe'")
    fs.writeFileSync(`./node_modules/mineflayer/index.d.ts`, mineflayerDefs)
  }
  
  let prismarineChatDef = fs.readFileSync(`${path}/prismarine-chat/index.d.ts`, 'utf-8')
  if (!prismarineChatDef.includes(`declare const loader: (registryOrVersion: any) => typeof ChatMessage`)) {
    prismarineChatDef = prismarineChatDef.replace("declare const loader: (registryOrVersion) => typeof ChatMessage", "declare const loader: (registryOrVersion: any) => typeof ChatMessage")
    fs.writeFileSync(`${path}/prismarine-chat/index.d.ts`, prismarineChatDef)
  }
  
  
  console.log("✅ Adjusted TypeScript Defintions.")
} catch (error) {
  console.error("❌ Failed to adjust TypeScript Definitions. This TypeScript build may fail.")
}