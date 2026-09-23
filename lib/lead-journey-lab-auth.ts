import { scryptSync, timingSafeEqual } from "node:crypto";

const PASSWORD_SALT = "KkKYQiGRWaRed1IxcdEQ6A==";
const PASSWORD_VERIFIER = "rvVCLKgwCcrDPvtLkSMf2piVEy+nNCC9CYP333P0syM=";

export function passwordMatches(input:string){
  if(!input)return false;
  const salt=Buffer.from(PASSWORD_SALT,"base64");
  const expected=Buffer.from(PASSWORD_VERIFIER,"base64");
  const actual=scryptSync(input,salt,32,{N:16384,r:8,p:1});
  return actual.length===expected.length && timingSafeEqual(actual,expected);
}
