// identify errors thrown by us
export class MotifsError extends Error {
  name = 'MotifsError';
}

export class MotifsErrorNotFound extends MotifsError {
  name = 'MotifsErrorNotFound';
  constructor(public message = 'Not found') {
    super(message);
  }
}


export class MotifsErrorDuplicate extends MotifsError {
  name = 'MotifsErrorDuplicate';
  constructor(public message = 'Duplicate') {
    super(message);
  }
}
