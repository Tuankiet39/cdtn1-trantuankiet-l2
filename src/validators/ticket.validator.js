function validateCreateTicketInput(body) {
  const errors = {};

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { body: 'A JSON object is required.' };
  }

  if (!Number.isInteger(body.customer_id) || body.customer_id <= 0) {
    errors.customer_id = 'customer_id must be a positive integer.';
  }
  if (!Number.isInteger(body.device_id) || body.device_id <= 0) {
    errors.device_id = 'device_id must be a positive integer.';
  }
  if (typeof body.issue_description !== 'string'
      || body.issue_description.trim().length === 0
      || body.issue_description.length > 1000) {
    errors.issue_description = 'issue_description must contain 1 to 1000 characters.';
  }

  return errors;
}

module.exports = { validateCreateTicketInput };
