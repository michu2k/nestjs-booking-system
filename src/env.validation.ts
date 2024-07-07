import {plainToInstance} from "class-transformer";
import {IsOptional, IsString, IsUrl, validateSync} from "class-validator";

class EnvironmentVariables {
  @IsString()
  DATABASE_URL: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_DB: string;

  @IsString()
  @IsOptional()
  POSTGRES_PORT: string;

  @IsString()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  GOOGLE_CLIENT_SECRET: string;

  @IsUrl({require_tld: false})
  GOOGLE_CALLBACK_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  ACCESS_TOKEN: string;

  @IsString()
  ACCESS_TOKEN_VALIDITY: string;

  @IsString()
  REFRESH_TOKEN: string;

  @IsString()
  REFRESH_TOKEN_VALIDITY: string;

  @IsUrl({require_tld: false})
  AUTH_REDIRECT_URL: string;

  @IsString()
  CORS_ORIGINS: string;
}

export function validateEnvs(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config);

  const errors = validateSync(validatedConfig, {skipMissingProperties: false});

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
