import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateLibraryDto {
    @IsString()
    @ApiProperty()
    name: string;

    // @IsString()
    // @ApiProperty()
    // src: string;
}
