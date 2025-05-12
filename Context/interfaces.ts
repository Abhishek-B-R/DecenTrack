import { TransactionResponse } from "ethers";

export interface createWebsiteSuccess{
    status:string,
    response:TransactionResponse
}

export interface createWebsiteError{
    status:string,
    response:unknown
}