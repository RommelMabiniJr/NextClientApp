const FormatHelper = () => {

    const convertArrayToString = (array, itemName = "name") => {
        const stringArray = array.map((item) => item[itemName]);
        return stringArray.join(", ");
    }

    return {
        convertArrayToString
    }
}

export default FormatHelper;