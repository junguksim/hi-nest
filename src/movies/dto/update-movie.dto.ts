import { PartialType } from "@nestjs/mapped-types";
import { CreateMovieDto } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) { // * 기본적으로 CreateMovieDto와 같지만 PartialType 이라 모든 값이 필수는 아니다!

}