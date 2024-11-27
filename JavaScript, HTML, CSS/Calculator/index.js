const screenDisplay = document.getElementsByClassName('display')[0];
const buttons = document.getElementsByClassName('numbers');

let prevNumber = '';
let calculationOperator ='';
screenDisplay.value = '0';

Array.from(buttons).forEach(btn => {
    btn.addEventListener('click', (event) => {
        inputNumber(event.target.id)
    });
});
const inputNumber = (number) => {
    const screenNumber = screenDisplay.value;
    if (screenNumber.length < 16) {
        if (number === '0') {
            screenDisplay.value = screenNumber + number;
        } else if (screenDisplay.value.includes(".")) {
            screenDisplay.value = parseFloat(screenNumber + number).toString();
        } else {
            screenDisplay.value = parseInt(screenNumber + number).toString();
        }
    }
}

const updateScreen = (number) => {
    screenDisplay.value = number;
}

const decimal = document.querySelector(".point");

const inputDecimal = (dot) => {
    if (screenDisplay.value.includes(".")) {
        return
    }
    screenDisplay.value = screenDisplay.value + dot;
};

decimal.addEventListener("click", (event) => {
    inputDecimal(event.target.textContent)
    updateScreen(screenDisplay.value)
   });

const operators = document.querySelectorAll(".operation");

operators.forEach((operation) => {
    operation.addEventListener("click", (event) => {
        const operator = event.target.textContent;
        prevNumber = screenDisplay.value;
        calculationOperator = operator;
        screenDisplay.value = '';
    })
});


const equalSing = document.querySelector(".result");

equalSing.addEventListener("click", () => {
    screenDisplay.value = calculate();
    updateScreen(screenDisplay.value);
});
 
const calculate = () => {
    switch(calculationOperator) {
        case '+': return Number(prevNumber) + Number(screenDisplay.value);
            break;
        case '-': return Number(prevNumber) - Number(screenDisplay.value);
            break;
        case '*': return Number(prevNumber) * Number(screenDisplay.value);
            break;
        case '/':
            if (Number(screenDisplay.value) === 0 ) {
                alert("Cant divide by Zero");
                return
            }
            return Number(prevNumber) / Number(screenDisplay.value);
            break;
        default:
            return
    }
    calculationOperator = '';
    return result;
};

const clearAll = () => {
    prevNumber = '';
    calculationOperator = '';
    screenDisplay.value = '0';
}

const clear = document.querySelector(".clear");

clear.addEventListener('click', () => {
    clearAll();
});


