
const DateConverter = () => {

    const convertDateToReadable = (date) => {
        let newDate = new Date(date);
        return newDate.toLocaleDateString();
    }

    const convertDateToReadableDetailed = (date) => {
        let newDate = new Date(date);
        return newDate.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    const convertDateToMySQL = (date) => {
        return new Date(date).toISOString().slice(0, 10);
    }

    const convertTimeToReadable = (time) => {
        return new Date(`1970-01-01T${time}Z`).toLocaleTimeString([], { timeStyle: 'short' });
    }

    return {
        convertDateToReadable,
        convertTimeToReadable,
        convertDateToReadableDetailed,
        convertDateToMySQL
    }
}

export default DateConverter;