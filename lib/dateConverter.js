
const DateConverter = () => {

    const convertDateToReadable = (date) => {
        let newDate = new Date(date);
        return newDate.toLocaleDateString();
    }
    
    const convertDateToMySQL = (date) => {
        return new Date(date).toISOString().slice(0, 10);
    }

    return {
        convertDateToReadable
    }
}

export default DateConverter;