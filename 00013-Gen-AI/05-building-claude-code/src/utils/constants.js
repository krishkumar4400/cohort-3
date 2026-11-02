import os from "os";
import path from "path";


export const HOME_DIR = os.homedir(); // C:\Users\krish
export const CONFIG_DIR = path.join(HOME_DIR, ".beta"); // C:\Users\krish\.beta
