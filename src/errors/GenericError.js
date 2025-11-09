/**
 * Classe base para erros customizados
 * @extends Error
 */
class GenericError extends Error {
  /**
   * @param {string} message - Mensagem de erro
   */
  constructor(message) {
    super(message);

    /** @type {string} */
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default GenericError;
