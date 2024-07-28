import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from '../pokemon/entities/pokemon.entity';

@Injectable()
export class SeedService {  

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    const pokemonToInsert: { name: string, no: number }[] = [];    
    data.results.forEach(({name, url}) => {
      const segments = url.split('/');
      const no = +segments[ segments.length - 2];
      // const pokemon = await this.pokemonModel.create({no, name});
      pokemonToInsert.push({name, no});
    });

    this.pokemonModel.insertMany(pokemonToInsert);    
    return 'Seed executed';

    // try {
    //   await this.pokemonModel.deleteMany();
    //   const pokemons = data.results.map(({name, url}) => {
    //     const segments = url.split('/');
    //     const no: number = +segments[segments.length - 2]
    //     return {no, name};
    //   });
    //   await this.pokemonModel.insertMany(pokemons);
    //   return 'Seed Executed';
    // } catch (error) {      
    //   if (error.code === 11000) {
    //     console.log(error);
    //     throw new BadRequestException('Duplicate Pokémon cannot be created');
    //   }
    //   console.log(error);
    //   throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
    // }
  }

}
