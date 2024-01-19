export const home = (req, res) => {
    const response = {
        status: true,
        message: 'Welcome to Kebunbibit REST API'
    }

    res.json(response);
}