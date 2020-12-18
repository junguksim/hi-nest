# Hi Nest!

노마드코더의 강좌를 들으며 nestjs 를 공부해보는 시간

### 강의 노트!

1. 태초에 main.ts가 있었다.
2. Controller === 라우터 : url 을 가져오고 함수를 실행

```jsx
import { Controller, Get } from '@nestjs/common';

@Controller('movies') //여기서 url의 entry point가 url/movies 로 정해지고,
export class MoviesController {
  @Get()
  getAll() {
    return "This will return all movies";
  }
	@Get('/hello') // url/movies/hello 가 된다.
	sayHello() {
		return "Hello World!";
	}
}
```

- **데코레이터와 함수는 붙어있어야 한다.**

1. 하지만 NestJS 에서 Controller 는 URL 의 구분, 즉 라우팅만 하는 것을 권장함.

- 위의 예시처럼 컨트롤러가 직접 '무언가'를 하는 것은 권장하지 않고,
- 실제 function들을 가지는 **Service**에서 가져와서 쓰는 것을 권장

```jsx
// app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Nest!';
  }
  getHi() : string {
    return 'Hi Nest!';
  }
}

// app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get("/hello")
  sayHello() : string {
    return this.appService.getHi();
		//app.service.ts에서 export하는 AppService 객체의
		//getHi 함수를 실행한다.
  }
}
```

1. AppModule 은 우리가 하는 모든 것을 import 한다.

```jsx
//in main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
	// app 은 NestFactory 가 AppModule을 매개로 만든 객체이기 때문에
  // 우리가 무슨 기능을 추가하든
  // AppModule 안에 import 되어야만 반영된다.
  await app.listen(3000);
}
```

1. Put 은 모든 리소스를 바꾸고, Patch 는 일부 리소스만 바꾼다.
2. :param 이 위에 있으면 querystring 사용 불가

```jsx
 @Get("/:id")
  getOne(@Param("id") movieId : string) { // * id 라는 파라미터를 id 라는 argument에 string타입으로 저장한다.
    return `This will return one movie with the id : ${movieId}`;
  }
// 이렇게 있다면?
@Get("search")
  search() {
    return `We are searching for a movie with title : `
  }
// /search?year=2020 으로 GET 요청을 받았을 때
// id = search 로 인식함
```