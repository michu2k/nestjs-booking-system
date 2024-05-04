import {NestFactory} from "@nestjs/core";
import {ValidationPipe} from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import {AppModule} from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true}));
  app.setGlobalPrefix("api");

  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
