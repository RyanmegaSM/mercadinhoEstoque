/**
 * @typedef {Object.<string, { message: string }>} FormError
 */

/**
 * Transforma um Set de erros em um objeto de erros
 *
 * @param {Set<FormError>} errors - Conjunto de erros de formulário
 * @returns {FormError} Objeto com os erros agregados
 */
export const transformSetToObject = (errors) => {
  return Array.from(errors).reduce((acc, error) => {
    const key = Object.keys(error)[0];
    acc[key] = error[key];
    return acc;
  }, /** @type {FormError} */ ({}));
};
