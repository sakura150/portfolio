const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  database: 'auth',
  username: 'postgres',
  password: 'pol987vc',  
  host: 'localhost',
  port: 5432,
  dialect: 'postgres'
});




module.exports = sequelize;
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL подключена успешно');
    return sequelize.sync({ force: true }); 
  })
  .then(() => console.log('All models were synchronized successfully'))
  .catch(err => console.error('Ошибка подключения к PostgreSQL:', err));