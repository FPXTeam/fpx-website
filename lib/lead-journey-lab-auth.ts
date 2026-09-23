import { scryptSync, timingSafeEqual } from "node:crypto";

const PASSWORD_SALT = "Em8ucXUNLxeotacBNIrUFw==";
const PASSWORD_VERIFIER = "Bu2oq/on+rKKzIQLDk3cjv5OIYa+nNKC0sVZ3rY3MI4=";

export function passwordMatches(input:string){
  if(!input)return false;
  const salt=Buffer.from(PASSWORD_SALT,"base64");
  const expected=Buffer.from(PASSWORD_VERIFIER,"base64");
  const actual=scryptSync(input,salt,32,{N:16384,r:8,p:1});
  return actual.length===expected.length && timingSafeEqual(actual,expected);
}
