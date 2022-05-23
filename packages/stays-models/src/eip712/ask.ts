import { TypedDataField } from "@ethersproject/abstract-signer";

export const Date: Record<string, TypedDataField[]> = {
  Date: [
    { name: "year", type: "uint16" },
    { name: "month", type: "uint8" },
    { name: "day", type: "uint8" }
  ]
}

export const Ask: Record<string, TypedDataField[]> = {
  Ask: [
    { name: "checkIn", type: "Date" },
    { name: "checkOut", type: "Date" },
    { name: "numPaxAdult", type: "uint32" },
    { name: "numPaxChild", type: "uint32" },
    { name: "numSpacesReq", type: "uint32" }
  ]
}
Ask["Date"] = Date.Date
