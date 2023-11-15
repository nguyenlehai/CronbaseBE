import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

export const transformError = (message: string, statusCode?: any) => {
  if (message == 'Internal server error') {
    throw new InternalServerErrorException(message);
  }
  throw new HttpException(
    {
      errors: message,
      statusCode: statusCode ? statusCode : HttpStatus.BAD_REQUEST,
    },
    statusCode ? statusCode : HttpStatus.BAD_REQUEST,
  );
};
type TransformResponseInterface = {
  data?: Array<any> | object;
  message?: string;
};

export const transformResponse = ({
  data,
  message,
  ...rest
}: TransformResponseInterface) => ({
  data,
  message,
  success: true,
  ...rest,
});
