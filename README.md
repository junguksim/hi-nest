# Hi Nest!

노마드코더의 강좌를 들으며 nestjs 를 공부해보는 시간

### 강의 노트!

1. 태초에 main.ts가 있었다.
2. Controller === 라우터 : url 을 가져오고 함수를 실행

```typescript
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

3. 하지만 NestJS 에서 Controller 는 URL 의 구분, 즉 라우팅만 하는 것을 권장함.

- 위의 예시처럼 컨트롤러가 직접 '무언가'를 하는 것은 권장하지 않고,
- 실제 function들을 가지는 **Service**에서 가져와서 쓰는 것을 권장

```typescript
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

4. AppModule 은 우리가 하는 모든 것을 import 한다.

```typescript
//in main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
	// app 은 NestFactory 가 AppModule을 매개로 만든 객체이기 때문에
  // 우리가 무슨 기능을 추가하든
  // AppModule 안에 import 되어야만 반영된다.
  await app.listen(3000);
}
```

5. Put 은 모든 리소스를 바꾸고, Patch 는 일부 리소스만 바꾼다.
6.  :param 이 위에 있으면 querystring 사용 불가

```typescript
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

7. DTO(Data Transfer Object)

   1. 들어오는 쿼리의 유효성 검사

   2. Pipe 와 함께 쓰인다!

   3. 파이프란? : 우리의 코드가 지나가는 곳

      ```typescript
      //main.ts
      async function bootstrap() {
        const app = await NestFactory.create(AppModule);
        app.useGlobalPipes( // pipe 를 사용할 것이다
          new ValidationPipe({ // 유효성 검사 파이프를 사용한다
            whitelist : true, // decorator가 아무것도 없는 property를 가진 object를 거른다
            forbidNonWhitelisted : true, // 누군가가 이상한 걸 보내면 아예 막아버린다
            transform : true // 내가 정한 타입으로 자동 형변환을 해준다(ex. url에 1 을 입력하면 string으로 오는데 이를 							number로 정해놨다면 number로 자동변환해줌)
          })
        )
        await app.listen(3000);
      }
      ```

      ```typescript
      //create-movie.dto.ts
      import {IsNumber, IsString} from 'class-validator';
      
      export class CreateMovieDto {
        @IsString() // title 은 string이어야 한다.
        readonly title : string;
        @IsNumber() // year는 number여야 한다.
        readonly year : number;
        @IsString({each : true}) // genres의 모든 값은 string이어야 한다
        readonly genres : string[];
      }
      ```

      8. NestJS 에서의 의존성 주입(Dependency Injection) 

         ```typescript
         // movies.controller.ts
         export class MoviesController {
           constructor(readonly moviesService : MoviesService) {} 
            // constructor에서 moviesService를 직접적으로 import하지 않았다.
             // 그저 type만 import했을 뿐이다.
             // 근데 type만 import 했는데
           @Get()
           getAll() : Movie[] {
             return this.moviesService.getAll(); 
               // moviesService 의 getAll을 어떻게 사용할 수 있을까?
           }
         }
         ```

         

         ```typescript
         // movies.module.ts
         @Module({
           controllers : [MoviesController],
           providers : [MoviesService]
             //바로 module 에서!
             // MoviesService를 import 하고
             // MoviesController 에 inject 한다.
         })
         export class MoviesModule {}
         ```

      9. NestJS의 프로젝트 구조 정리

         1. 각각의 기능은 각각의 Module을 가진다.
         2. 이 Module 들이 모두 import 되어서 하나로 합쳐져 나가는 곳이 app.module.ts 이다.
         3. 각각의 Module 들은 각각의 Service 와 Controller를 import 하고 의존성 주입
            1. Controller : 라우팅과 Service 에 정의된 기능들을 리턴
            2. Service : 실제 기능들을 정의 

      10. Jest Hooks

          1. beforeEach, afterEach: 각 기능의 테스트 전/후에 할 일을 정의
          2. beforeAll, afterAll : 기능 전반의 테스트 전/후에 할 일을 정의

      11. e2e(end to end) 테스트

          1. 특정 URL에 테스트를 보낸다(Controller, service, pipe 등 모든 것에 대한 테스트를 한꺼번에 함)

          2. 기능 단위별 테스트가 어려울 때 주로 쓰인다

             ```typescript
              beforeAll(async () => {
                 const moduleFixture: TestingModule = await Test.createTestingModule({
                   imports: [AppModule],
                 }).compile();
             
                 app = moduleFixture.createNestApplication();
                  //주의할 점
                  //테스트를 위해 만들어진 서버인 app은 
                  //main.ts 에서 정의되어 실제 서비스되는 서버와 같은 환경이어야 한다.
                 app.useGlobalPipes(
                   new ValidationPipe({
                     whitelist : true,
                     forbidNonWhitelisted : true,
                     transform : true
                   })
                 )
                  //위 주석에서 여기까지의 코드가 없을 경우(파이프를 사용하지 않을 경우)
                  //테스팅용 서버는 main.ts에서 가진 파이프가 없는 상태가 되는 것이고
                  //이는 실제 서버와의 테스트 결과가 다르게 될 수 있느 결과를 낳는다.
                 await app.init();
               });
             ```

             

   