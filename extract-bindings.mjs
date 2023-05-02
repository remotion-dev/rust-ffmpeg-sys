import { execSync } from "node:child_process";
import { readdirSync, mkdirSync } from "node:fs";

for (const file of readdirSync("zips")) {
  if (file.includes("SOURCE")) {
    continue;
  }
  mkdirSync("bindings", { recursive: true });
  execSync(`tar xf zips/${file} --include='bindings.rs' -C bindings`);
  execSync(`mv bindings/bindings.rs bindings/${file.replace(".gz", "")}.rs`);
}
