const moment = require("moment");

//Revisa que los valores de los campos de fechas sean validos
const isDate = (value) => {

    if(!value){
        return false;
    }

    const fecha = moment(value);

    if(fecha.isValid()){
        return true;
    } else {
        return false;
    }

}

module.exports = { isDate };