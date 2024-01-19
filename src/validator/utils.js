export const handleValidation = async (schema, value) => {
    const options = {
        errors: {
            wrap: {
                label: ''
            }
        }
    };

    await schema.validateAsync(value, options);
}