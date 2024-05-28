const { createLogger, format, transports } = require('winston');

const customLevels = {
  levels: {
    error: 0,
    warning: 1,
    info: 2,
    debug: 3,
    silly: 4,
    critical: 0
  },
  colors: {
    error: 'red',
    warning: 'yellow',
    info: 'green',
    debug: 'blue',
    silly: 'magenta',
    critical: 'red'
  }
};

const logger = createLogger({
  levels: customLevels.levels,
  format: format.combine(
    format.colorize({ all: true }), // Habilitar colorize para todos los niveles
    format.timestamp(),
    format.printf(info => `${info.timestamp} - ${info.level.toUpperCase()}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      level: 'silly'
    }),
    new transports.File({ 
      filename: 'log/server.log', 
      level: 'info' 
    }),
    new transports.File({ 
      filename: 'log/error.log', 
      level: 'error' 
    }),
    new transports.File({ 
      filename: 'log/critical.log', 
      level: 'critical'
    })
  ]
});

module.exports = logger;
