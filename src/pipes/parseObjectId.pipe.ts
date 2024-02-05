import { Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import { ValidationException } from '../exceptions';

export type ParseObjectIdPipeOptions = {
  isOptional?: boolean
}

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
  isOptional: boolean;

  constructor(options?: ParseObjectIdPipeOptions) {
    if (options) {
      this.isOptional = options.isOptional;
    }
  }

  transform(value: any): Types.ObjectId {
    if (this.isOptional && !value) {
      return value;
    }

    const validObjectId = Types.ObjectId.isValid(value);

    if (!validObjectId) {
      throw new ValidationException('Cannot transform string to ObjectID');
    }

    return Types.ObjectId.createFromHexString(value);
  }
}