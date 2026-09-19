import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { TripStatus } from "./tripstatus.js";

export class TripCreat {
    @IsNumber()
    @IsNotEmpty()
    riderId : number;
    @IsNotEmpty()
    tripStatus : TripStatus;
}