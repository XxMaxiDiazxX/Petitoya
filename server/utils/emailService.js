const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // o tu servicio de correo
  auth: {
    user: 'your-email@gmail.com', // tu correo electrónico
    pass: 'your-email-password', // tu contraseña de correo electrónico o contraseña de aplicación
  },
});

const sendPasswordChangeEmail = (to, nombre) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: to,
    subject: 'Cambio de Contraseña',
    text: `Hola ${nombre},\n\nTu contraseña ha sido cambiada exitosamente.\n\nSi no realizaste este cambio, por favor contacta a soporte de inmediato.\n\nGracias,\nTu equipo de soporte.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error);
    } else {
      console.log('Correo enviado:', info.response);
    }
  });
};

module.exports = { sendPasswordChangeEmail };
