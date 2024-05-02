import {plainToInstance} from "class-transformer";
import {IsString, IsUrl, validateSync} from "class-validator";

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
  GOOGLE_CLIENT_ID: string;

  @IsString()
  GOOGLE_CLIENT_SECRET: string;

  @IsUrl({require_tld: false})
  GOOGLE_CALLBACK_URL: string;

  @IsString()
  JWT_SECRET: string;
}

export function validateEnvs(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config);

  const errors = validateSync(validatedConfig, {skipMissingProperties: false});

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
