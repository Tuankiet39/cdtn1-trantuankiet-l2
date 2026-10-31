function validateCreateOrderInput(reqBody) {
  const errors = {};
  if (!reqBody.user_id || typeof reqBody.user_id !== 'number') {
    errors.user_id = 'user_id là bắt buộc và phải là kiểu số Integer';
  }
  if (!reqBody.items || !Array.isArray(reqBody.items) || reqBody.items.length === 0) {
    errors.items = 'Mảng items bắt buộc phải chứa ít nhất 1 sản phẩm';
  }
  return errors;
}

module.exports = { validateCreateOrderInput };