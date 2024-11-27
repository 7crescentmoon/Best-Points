const schemaPlace = require("../schemas/place");
const ErrorHandler = require("../utils/ErrorHandler");
const validatePlace = (req, res, next) => {
  const { error } = schemaPlace.validate(req.body, { abortEarly: false });

  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    return next(new ErrorHandler(msg, 400));
  }else {
    next();
  }
};

module.exports = validatePlace;

  // return next(new ErrorHandler(msg, 400));
  // if (error) {
  //   // console.log(error.details);
  //   const msg = error.details.reduce((acc, curr) => {
  //     const fieldName = curr.path.slice(-1)[0];

  //     // Buat pesan error baru hanya dengan nama field terakhir
  //     const messageParts = curr.message.split(" ");
  //     messageParts[0] = `"${fieldName}"`; // Ganti nama field lengkap dengan fieldName
  //     const updatedMessage = messageParts.join(" "); // Susun ulang pesan error

  //     // Masukkan pesan yang sudah dimodifikasi ke objek errorMessages
  //     acc[fieldName] = updatedMessage;
  //     return acc;
  //   }, {});

  //   // console.log(msg);
  //   req.errorMessages = msg;
  //   next();
  // } else {
  //   next();
  // }