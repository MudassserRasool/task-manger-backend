import validator from 'validator';

function isValidSeqId(id) {
  if (!validator.isInt(id.toString(), { min: 1 })) {
    return false;
  }
  return true;
}

export { isValidSeqId };
