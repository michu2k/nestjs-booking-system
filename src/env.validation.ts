import { plainToInstance } from "class-transformer";
import { IsEnum, IsString, IsUrl, validateSync } from "class-validator";

enum Environment {
  Development = "development",
  Production = "production",
  Test = "test"
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  GOOGLE_CLIENT_SECRET: string;

  @IsUrl({ require_tld: false })
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

  @IsUrl({ require_tld: false })
  AUTH_REDIRECT_URL: string;

  @IsString()
  CORS_ORIGINS: string;
}

export function validateEnvs(config: Record<string, unknown>) {
  // Skip validation for e2e tests in CI
  if (process.env.NODE_ENV === Environment.Test) {
    return config;
  }

  const validatedConfig = plainToInstance(EnvironmentVariables, config);

  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
