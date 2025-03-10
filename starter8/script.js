'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date) {
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class='movements__date'>${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = () => {
  function tick() {
    const min = `${Math.trunc(time / 60)}`.padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);

      labelWelcome.textContent = `Log in to get started `;
      containerApp.style.opacity = 0;

      currentAccount = '';
    }

    time--;
  }
  let time = 120;
  tick();
  const timer2 = setInterval(() => tick(), 1000);
  return timer2;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer2;

//FAKE ALWAYS LOGIN

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    if (timer2) clearInterval(timer2);

    timer2 = startLogOutTimer();
    //Current date
    containerApp.style.opacity = 100;
    const dateNow = new Date();
    const day = `${dateNow.getDate()}`.padStart(2, '0');
    const month = `${dateNow.getMonth() + 1}`.padStart(2, '0');
    const year = dateNow.getFullYear();
    const hour = `${dateNow.getHours()}`.padStart(2, '0');
    const min = `${dateNow.getMinutes()}`.padStart(2, '0');
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset Timer

    clearInterval(timer2);
    timer2 = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(function () {
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUI(currentAccount);
    }, 3000);
  }
  inputLoanAmount.value = '';

  // Reset Timer
  clearInterval(timer2);
  timer2 = startLogOutTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//170. =================CONVERTING AND CHECKING NUMBERS===================

//Parsing

console.log(Number.parseInt('30px')); //JS removes the symbol "px"
console.log(Number.parseFloat('2.5rem'));

console.log(Number.isNaN(+'20x')); //Checks if its a Nan

//171 =================MATH AND ROUDING===============================
console.log(Math.sqrt(25)); //This method gives us the Square root(raíz quadrada)
console.log(25 ** (1 / 2)); //Another way
console.log(8 ** (1 / 3)); //Cubic root

console.log(Math.PI * Number.parseFloat('10px') ** 2); //Area of the circle

console.log(Math.trunc(Math.random() * 6) + 1); //Generating a random number between 1 and 6

const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min; //Gives us a number between the min and max especified.

console.log(randomInt(10, 50));

//Rouding

console.log(Math.round(23.3)); //Arredonda pro mais próximo
console.log(Math.round(23.9));

console.log(Math.ceil(44.4)); //Arrendo sempre pra cima
console.log(Math.ceil(44.7));

console.log(Math.floor(55.1)); //Arredonda sempre para baixo
console.log(Math.floor(55.8));
console.log(Math.floor(-55.6)); //Se o valor for negativo a ordem se alterar

//Remainder operator

labelBalance.addEventListener('click', () => {
  [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
    if (i % 2 === 0) row.style.backgroundColor = 'tomato';
  });
});

//BigInt

//Before ES20 we could storage numbers only in this size

console.log(2 ** 53 - 1); //Bigger than thar was not safe.
console.log(Number.MAX_SAFE_INTEGER); //is the same result

//So in ES20 came to us the BigInt

console.log(10004284824824828431284284824824828428428428428428n);
console.log(BigInt(319391391));
console.log(3193913913919319318417521859n * 4284284824824824828428428428428n);

//Dates and Times

const now = new Date();
console.log(now);
console.log(new Date('Feb 24 2022 00:57:26'));
console.log(new Date('December 24,2016'));

console.log(new Date(2037, 10, 19, 15, 23, 5));
console.log(new Date(0)); //Start of the unix time
console.log(new Date(3 * 24 * 60 * 60 * 1000)); //3 Days after Unix time

//Working with dates

const future = new Date(2037, 10, 19, 15, 23, 5);
console.log(future.getFullYear());

//Operations with Date

console.log(Number(future)); //Converting a date we receive a timestamp in miliseconds

const daysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
const days1 = daysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
console.log(days1);

// SetTimeout and setInterval

setTimeout(() => console.log('Here is your pizza!'), 3000); //The code is gonna be execute in 3s later. its a async method,that is, the below code is executed instantly
console.log('waiting...');

setTimeout(
  (first, second) =>
    console.log(
      `Testing the first parameter: ${first} and the second: ${second}`
    ),
  4000,
  'First Parameter',
  'Second Parameter'
);

const ingredients = ['olives', 'spinach'];

const timer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
  1000,
  ...ingredients
);

if (ingredients.includes('spinach')) {
  console.log('Timer was stopped');
  clearTimeout(timer);
} // We can stop the timer

//SetInterval

// setInterval(() => {
//   const now = new Date();
//   console.log(now);
// }, 1000);
