import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ResponseValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      switchMap(async (data) => {
        if (!data) {
          return data;
        }

        // Получаем тип возвращаемого значения из метаданных
        const handler = context.getHandler();
        const returnType = Reflect.getMetadata('design:returntype', handler);

        // Если возвращаемый тип - это класс, валидируем его
        if (returnType && typeof returnType === 'function') {
          return this.validateResponse(data, returnType);
        }

        // Если это массив, проверяем первый элемент для определения типа
        if (Array.isArray(data) && data.length > 0) {
          // Пытаемся определить тип из метаданных или из самого объекта
          const firstItem = data[0];
          if (firstItem && typeof firstItem === 'object') {
            // Если все элементы массива одного типа, валидируем каждый
            const validatedArray = await Promise.all(
              data.map((item) => this.validateResponse(item, returnType)),
            );
            return validatedArray;
          }
        }

        return data;
      }),
    );
  }

  private async validateResponse(data: any, DtoClass: any): Promise<any> {
    // Если data уже является экземпляром нужного класса, валидируем его
    if (data instanceof DtoClass) {
      const errors = await validate(data);
      if (errors.length > 0) {
        this.throwValidationError(errors);
      }
      return data;
    }

    // Преобразуем plain object в экземпляр класса
    const instance = plainToInstance(DtoClass, data);
    const errors = await validate(instance);

    if (errors.length > 0) {
      this.throwValidationError(errors);
    }

    return instance;
  }

  private throwValidationError(errors: any[]): void {
    const errorMessages = errors.map((e) => Object.values(e.constraints || {})).flat();
    throw new HttpException(
      `Response validation failed: ${errorMessages.join(', ')}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
