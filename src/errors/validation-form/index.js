import GenericError from "../GenericError.js";

/**
 * @typedef {Object.<string, { message: string }>} ValidationErrors
 */

/**
 * Classe de erro para validações de formulário
 * @extends GenericError
 */
class ValidationFormError extends GenericError {
  /**
   * @param {string} [message="Usuário não encontrado."] - Mensagem principal do erro
   * @param {ValidationErrors} errors - Objeto contendo os erros de validação
   */
  constructor(message = "Usuário não encontrado.", errors) {
    super(message);
    /** @type {ValidationErrors} */
    this.errors = errors;
  }
}

export default ValidationFormError;
