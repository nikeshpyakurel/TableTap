import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    BadRequestException,
    ForbiddenException,
    RequestTimeoutException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import { ConnectionNotFoundError, EntityNotFoundError, EntityPropertyNotFoundError, MongoServerError, QueryFailedError } from 'typeorm';
import { TokenExpiredError } from 'jsonwebtoken';
import { LoggerService } from 'src/logger/logger.service';

@Catch(
    QueryFailedError,
    EntityNotFoundError,
    ConnectionNotFoundError,
    BadRequestException,
    EntityPropertyNotFoundError,
    TypeError,
)
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        private readonly logger: LoggerService, // Inject LoggerService
    ) { }

    catch(exception: any, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        // Log the exception with Winston
        this.logger.error(exception.message, exception.stack);

        if (exception instanceof TokenExpiredError) {
            status = HttpStatus.REQUEST_TIMEOUT;
            message = 'Request timeout';
        }

        if (exception instanceof QueryFailedError && exception['code']) {
            const errorCode = exception['code'];
            switch (errorCode) {
                case '23502':
                    status = HttpStatus.BAD_REQUEST;
                    message = 'Not null constraint violation';
                    break;
                case '23503':
                    status = HttpStatus.BAD_REQUEST;
                    message = 'Foreign key constraint violation';
                    break;
                case '23505':
                    status = HttpStatus.CONFLICT;
                    message = 'Unique constraint violation';
                    break;
                case '22001':
                    status = HttpStatus.BAD_REQUEST;
                    message = 'String length exceeds limit';
                    break;
                case '22P02':
                    status = HttpStatus.BAD_REQUEST;
                    message = 'Invalid input syntax for integer';
                    break;
                default:
                    status = HttpStatus.INTERNAL_SERVER_ERROR;
                    message = 'Database error';
                    break;
            }
        } else if (exception instanceof EntityNotFoundError) {
            status = HttpStatus.NOT_FOUND;
            message = "Couldn't find any data.";
        } else if (exception instanceof ConnectionNotFoundError) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Database connection not found';
        } else if (exception instanceof BadRequestException) {
            status = HttpStatus.BAD_REQUEST;
            message = exception.getResponse()['message'];
        } else if (exception instanceof EntityPropertyNotFoundError) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = exception.message;
        } else if (exception instanceof TypeError) {
            status = HttpStatus.BAD_REQUEST;
            message = exception.message;
        } else if (exception.response && exception.response.statusCode) {
            status = exception.response.statusCode;
            message = exception.response.message || 'Unhandled exception';
        }

        // Send the error response
        response.status(status).json({
            statusCode: status,
            message: message,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
        });
    }
}
