export default () => ({
  database: {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "12345",
    name: "task-management",
    ssl: false,
  },
});