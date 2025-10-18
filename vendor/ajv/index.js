class Ajv {
  constructor(options = {}) {
    this.options = options;
  }

  compile(schema) {
    const validateValue = (schemaNode, value, path, errors) => {
      if (!schemaNode) {
        return;
      }

      const addError = (message) => {
        errors.push({ instancePath: path || '/', message });
      };

      const { type } = schemaNode;

      if (type === 'array') {
        if (!Array.isArray(value)) {
          addError('should be array');
          return;
        }

        if (typeof schemaNode.minItems === 'number' && value.length < schemaNode.minItems) {
          addError(`should contain at least ${schemaNode.minItems} items`);
        }

        if (schemaNode.items) {
          value.forEach((item, index) => {
            const itemPath = `${path}/${index}`;
            validateValue(schemaNode.items, item, itemPath, errors);
          });
        }
        return;
      }

      if (type === 'object') {
        if (value === null || typeof value !== 'object' || Array.isArray(value)) {
          addError('should be object');
          return;
        }

        const props = schemaNode.properties || {};

        if (Array.isArray(schemaNode.required)) {
          for (const key of schemaNode.required) {
            if (!(key in value)) {
              const keyPath = `${path}/${key}`;
              errors.push({ instancePath: keyPath, message: 'is required' });
            }
          }
        }

        for (const [key, val] of Object.entries(value)) {
          if (!Object.prototype.hasOwnProperty.call(props, key)) {
            if (schemaNode.additionalProperties === false) {
              const keyPath = `${path}/${key}`;
              errors.push({ instancePath: keyPath, message: 'additional property is not allowed' });
            }
            continue;
          }

          const nextPath = `${path}/${key}`;
          validateValue(props[key], val, nextPath, errors);
        }
        return;
      }

      if (type === 'string') {
        if (typeof value !== 'string') {
          addError('should be string');
          return;
        }

        if (typeof schemaNode.minLength === 'number' && value.length < schemaNode.minLength) {
          addError(`should NOT be shorter than ${schemaNode.minLength} characters`);
        }
      }

      if (schemaNode.enum && !schemaNode.enum.includes(value)) {
        addError(`should be equal to one of the allowed values`);
      }

      if (schemaNode.type === undefined && schemaNode.properties) {
        // fallback for schemas that omit type but define properties
        validateValue({ ...schemaNode, type: 'object' }, value, path, errors);
      }
    };

    const validator = (data) => {
      const errors = [];
      validateValue(schema, data, '', errors);
      validator.errors = errors.length > 0 ? errors : null;
      return errors.length === 0;
    };

    validator.errors = null;
    return validator;
  }
}

export default Ajv;
