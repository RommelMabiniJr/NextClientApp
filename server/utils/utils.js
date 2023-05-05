
// create a function to make paymentMethods json into a string with commas that separate each "name" key and its corresponding value
function stringifyPaymentMethods(paymentMethods) {
    let paymentMethodsString = '';
    for (let i = 0; i < paymentMethods.length; i++) {
        paymentMethodsString += paymentMethods[i].name;
        if (i < paymentMethods.length - 1) {
            paymentMethodsString += ', ';
        }
    }
    return paymentMethodsString;
}

function jsonifyPaymentMethods(paymentMethodsString) {
    let paymentMethods = [];
    let paymentMethodsArray = paymentMethodsString.split(', ');
    for (let i = 0; i < paymentMethodsArray.length; i++) {
        paymentMethods.push({ name: paymentMethodsArray[i] });
    }
    return paymentMethods;
}

module.exports = {
    stringifyPaymentMethods,
    jsonifyPaymentMethods
}
