import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ForbiddenException,
  HttpException,
  NotFoundException
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import { ServiceError, ServiceErrorCode } from "../utils/service-error";

const EXCEPTION_BY_CODE: Record<ServiceErrorCode, new (message: string) => HttpException> = {
  [ServiceErrorCode.BAD_REQUEST]: BadRequestException,
  [ServiceErrorCode.NOT_FOUND]: NotFoundException,
  [ServiceErrorCode.FORBIDDEN]: ForbiddenException,
  [ServiceErrorCode.CONFLICT]: ConflictException
};

@Catch(ServiceError)
export class ServiceErrorFilter extends BaseExceptionFilter {
  catch(error: ServiceError, host: ArgumentsHost) {
    const Exception = EXCEPTION_BY_CODE[error.code];

    super.catch(new Exception(error.message), host);
  }
}
