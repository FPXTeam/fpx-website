import { scryptSync, timingSafeEqual } from "node:crypto";

const PASSWORD_SALT = "TFuCJEjDa1dujdQcFaie0A==";
const PASSWORD_VERIFIER = "Bv1l08sZ1gU8yg3lHLTEBA6NeZSF8WrA2iYqn7usMhc=";

export function passwordMatches(input:string){
  if(!input)return false;
  const salt=Buffer.from(PASSWORD_SALT,"base64");
  const expected=Buffer.from(PASSWORD_VERIFIER,"base64");
  const actual=scryptSync(input,salt,32,{N:16384,r:8,p:1});
  return actual.length===expected.length && timingSafeEqual(actual,expected);
}
