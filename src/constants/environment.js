const PORT = process.env.PORT || 4000;
const environment = process.env.ENVIRONMENT;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export { environment, JWT_SECRET_KEY, PORT };
