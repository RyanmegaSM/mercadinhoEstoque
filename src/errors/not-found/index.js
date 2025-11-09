import GenericError from "../GenericError.js";

/**
 * Classe de erro para validações de formulário
 * @extends GenericError
 */
class NotFoundException extends GenericError {
  /**
   *
   * @param {string} message
   */
  constructor(message = "Recurso não encontrado") {
    super(message);
  }
}

export default NotFoundException;
