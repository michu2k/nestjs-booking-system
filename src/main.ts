import {NestFactory} from "@nestjs/core";
import {ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import * as cookieParser from "cookie-parser";
import {AppModule} from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true}));
  app.setGlobalPrefix("api");

  app.enableCors({
    origin: configService.get("CORS_ORIGINS").split(","),
    credentials: true
  });

  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
