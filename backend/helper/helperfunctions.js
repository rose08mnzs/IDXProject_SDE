function validatePageLimit(limit) {
  const num = Number(limit);

  if (!Number.isInteger(num) || num < 1 || num > 100) {
    const err = new Error("limit must be between 1 and 100");
    err.status = 400;
    throw err;
  }

  return num;
}

function validatePageOffset(offset) {
  const num = Number(offset);

  if (!Number.isInteger(num) || num < 0) {
    const err = new Error("offset must be 0 or greater");
    err.status = 400;
    throw err;
  }

  return num;
}

function validateNumber(number) {
  const num = Number(number);
  if (number == undefined || number == null || number == "" || Number.isNaN(num)) {
    return false;
  }
  return true;
}

function validateListingId(id) {
  if (!id || id.length > 11 || !/^[A-Za-z0-9_-]+$/.test(id)) {
    const err = new Error("Invalid listing ID");
    err.status = 400;
    throw err;
  }
  return { id };
}


module.exports = {
  validatePageLimit,
  validatePageOffset,
  validateNumber,
  validateListingId
};