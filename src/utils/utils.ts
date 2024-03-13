import { Injectable, NotFoundException } from '@nestjs/common';
import { ValidateMissingRecordsById } from './interfaces/utils.interface';

@Injectable()
export class Utils {
  validateMissingRecordsById(params: ValidateMissingRecordsById) {
    const {
      records,
      ids,
      notFoundException,
      customErrorMessage,
      idListVariableName = ':id_list',
    } = params;
    let recordsNotfound: number[] = [];

    if (records.length != ids.length) {
      recordsNotfound = ids.filter((id) => !records.some((rf) => id == rf.id));
    }

    if (recordsNotfound.length) {
      let error =
        recordsNotfound.length > 1
          ? `Records with ids (${recordsNotfound.join(', ')}) not found`
          : `Record with id (${recordsNotfound}) not found`;

      if (customErrorMessage) {
        error =
          recordsNotfound.length > 1
            ? customErrorMessage.plural
            : customErrorMessage.singular;

        if (
          !customErrorMessage.plural.includes(idListVariableName) ||
          !customErrorMessage.singular.includes(idListVariableName)
        ) {
          throw new Error(
            `Variable ${idListVariableName} not found in custom error messages`,
          );
        }
        error = error.replaceAll(
          idListVariableName,
          recordsNotfound.join(', '),
        );
      }

      if (notFoundException) {
        throw new NotFoundException(error);
      }
    }

    return recordsNotfound;
  }
}
