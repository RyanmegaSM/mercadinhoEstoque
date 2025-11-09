/**
 * Valida um objeto com base nas regras de validação fornecidas.
 * @param {object} data - O objeto a ser validado.
 * @param {object} rules - Um objeto onde as chaves são os campos a serem validados
 *                         e os valores são arrays de funções de validação.
 * @returns {Set} Um conjunto de erros encontrados. Se não houver erros, retorna um conjunto vazio.
 */
export function validate(data, rules) {
  const errors = new Set();

  for (const field in rules) {
    if (rules.hasOwnProperty(field)) {
      const value = data[field];
      const fieldRules = rules[field];

      for (const rule of fieldRules) {
        const errorMessage = rule(value);
        if (errorMessage) {
          errors.add({ [field]: { message: errorMessage } });
        }
      }
    }
  }

  return errors;
}
