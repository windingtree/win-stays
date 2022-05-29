import { TypedDataField } from "@ethersproject/abstract-signer";

export const PII: Record<string, TypedDataField[]> = {
  PII: [
    { name: "stub", type: "bytes" },
    { name: "who", type: "bytes" }
  ]
}
