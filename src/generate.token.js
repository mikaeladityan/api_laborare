import crypto from "crypto";

console.log(`SECRETE_TOKEN_JWT=${crypto.randomBytes(64).toString("hex")}`);
console.log(`SECRETE_REFRESH_TOKEN_JWT=${crypto.randomBytes(64).toString("hex")}`);
