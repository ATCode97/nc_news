const { DATABASE_URL } = process.env;
const ENV = process.env.NODE_ENV || "development";

console.log(`Currently running in ${ENV} environment`);

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  development: {
    connection: {
      database: "nc_news"
      // user,
      // password
    }
  },
  test: {
    connection: {
      database: "nc_news_test"
      // user,
      // password
    }
  },
  production: {
    connection: `${DATABASE_URL}?ssl=true`
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
