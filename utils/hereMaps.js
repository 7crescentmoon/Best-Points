const ErrorHandler = require("../utils/ErrorHandler");
const baseURL = "https://geocode.search.hereapi.com/v1"
const apiKey = 'xgnMhTN3RQBGKBzG3YMDYVK67RidvFgyNskoVvGQMvk'
const geocode = async (address) => {
    const url = `${baseURL}/geocode?q=${address}&limit=1&apiKey=${apiKey}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data.items[0] ;
    } catch (error) {
        throw new ErrorHandler(error.message, 500);
    }
}

const geometry = async (address) => {
    try {
        const {position} = await geocode(address);
        return {
            type: "Point",
            coordinates: [position.lng, position.lat] 
        }
    } catch (error) {
        throw new ErrorHandler(error.message, 500);
    }
}

module.exports = {
    geocode,
    geometry
}
