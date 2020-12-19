import { Controller, Get, Param, Post, Delete, Patch, Body} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/Movie.entity';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {

  constructor(readonly moviesService : MoviesService) {}
  @Get()
  getAll() : Movie[] {
    return this.moviesService.getAll();
  }

  @Get("/:id")
  getOne(@Param("id") movieId : number) : Movie { // * id 라는 파라미터를 id 라는 argument에 string타입으로 저장한다.
    return this.moviesService.getOne(movieId);
  }

  @Post()
  create(@Body() movieData : CreateMovieDto) {
    return this.moviesService.create(movieData);
  }

  @Delete("/:id")
  remove(@Param("id") movieId : number) {
    return  this.moviesService.deleteOne(movieId);
  }

  @Patch('/:id')
  patch(@Param("id") movieId : number, @Body() updateData : UpdateMovieDto) {
    return this.moviesService.update(movieId, updateData);
  }

  
}

