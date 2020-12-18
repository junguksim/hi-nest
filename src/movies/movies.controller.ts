import { Controller, Get, Param, Post, Delete, Patch, Body, Query} from '@nestjs/common';

@Controller('movies')
export class MoviesController {
  @Get()
  getAll() {
    return "This will return all movies";
  }

  @Get("search")
  search(@Query("year") searchingYear : string) {
    return `We are searching for a movie made after : ${searchingYear}`
  }

  @Get("/:id")
  getOne(@Param("id") movieId : string) { // * id 라는 파라미터를 id 라는 argument에 string타입으로 저장한다.
    return `This will return one movie with the id : ${movieId}`;
  }

  @Post()
  create(@Body() movieData) {
    return movieData;
  }

  @Delete("/:id")
  remove(@Param("id") movieId : string) {
    return  `This will delete a movie with the id : ${movieId}`;
  }

  @Patch('/:id')
  patch(@Param("id") movieId : string, @Body() updateData) {
    return {
      updatedMovie : movieId,
      ...updateData
    }
  }

  
}

