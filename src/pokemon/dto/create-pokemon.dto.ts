import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreatePokemonDto {    
    @IsInt()
    @IsPositive()
    no: number;

    @IsString()
    @IsNotEmpty()
    name: string;
}
