const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // o tu servicio de correo
  auth: {
    user: 'petitoyaservice@gmail.com', // tu correo electrónico
    pass: 'wksn pnad uquy gggu', // tu contraseña de correo electrónico o contraseña de aplicación
  },
});

const sendPasswordChangeEmail = (to, nombre, codigo) => {
  const mailOptions = {
    from: 'petitoyaservice@gmail.com',
    to: to,
    subject: 'Código de Verificación para Restablecer Contraseña',
    text: `Hola ${nombre},\n\nTu código de verificación es: ${codigo}\n\nSi no solicitaste este cambio, por favor contacta a soporte de inmediato.\n\nGracias,\nTu equipo de soporte.`,
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
