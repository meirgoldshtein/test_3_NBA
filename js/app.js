"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const FILTER_END_POINT = 'api/filter';
const baseURL = 'https://nbaserver-q21u.onrender.com/';
const playersArr = [];
const positionsInput = document.querySelector('#positionSelect');
const pointsInput = document.querySelector('.points');
const threeInput = document.querySelector('.threeRange');
const twoInput = document.querySelector('.twoRange');
const searchButton = document.querySelector('.searchButton');
const tableBody = document.querySelector('.tableBody');
const updateLabels = () => {
    const pointsLabel = document.querySelector('.pointsLabel');
    const threeLabel = document.querySelector('.threeLabel');
    const twoLabel = document.querySelector('.twoLabel');
    pointsLabel.innerHTML = pointsInput.value;
    threeLabel.innerHTML = threeInput.value;
    twoLabel.innerHTML = twoInput.value;
};
pointsInput.addEventListener('input', updateLabels);
threeInput.addEventListener('input', updateLabels);
twoInput.addEventListener('input', updateLabels);
// פונקציה גנרית שמקבלת נקודת קצה ואובייקט ושולחת לשרת בקשת פוסט
const postDada = (obj_1, ...args_1) => __awaiter(void 0, [obj_1, ...args_1], void 0, function* (obj, endPoint = '') {
    try {
        const response = yield fetch(`${baseURL}${endPoint}`, {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = yield response.json();
        console.log(data);
        return data;
    }
    catch (err) {
        console.error(err);
        return err instanceof Error ? err : new Error('An unknown error occurred');
    }
});
const addPlayerToCard = (target) => {
    var _a, _b, _c, _d;
    // const target :HTMLButtonElement = e.target!;
    const parent = target.parentElement.parentElement;
    console.log(target);
    console.log(parent);
    // const player = playersArr.find((player) => player._id === target.id);
    // if (!player) return;
    const position = target.getAttribute('data-position');
    const card = document.querySelector(`#${position}`);
    card.style.backgroundColor = 'pink';
    card.querySelector('.playerName').innerHTML = (_a = parent.querySelector('.nameDiv')) === null || _a === void 0 ? void 0 : _a.textContent;
    card.querySelector('.threePrecents').innerHTML = (_b = parent.querySelector('.THREE_DIV')) === null || _b === void 0 ? void 0 : _b.textContent;
    card.querySelector('.twoPrecents').innerHTML = (_c = parent.querySelector('.FG_DIV')) === null || _c === void 0 ? void 0 : _c.textContent;
    card.querySelector('.playerPoints').innerHTML = (_d = parent.querySelector('.pointsDiv')) === null || _d === void 0 ? void 0 : _d.textContent;
};
const createBodyToPost = () => {
    return {
        position: positionsInput.value,
        twoPercent: Number(twoInput.value),
        threePercent: Number(threeInput.value),
        points: Number(pointsInput.value)
    };
};
const createTableRow = (player) => {
    const row = document.createElement('div');
    row.classList.add('playerRow');
    const nameDiv = document.createElement('div');
    nameDiv.classList.add('nameDiv');
    nameDiv.textContent = player.playerName;
    row.appendChild(nameDiv);
    const positionDiv = document.createElement('div');
    positionDiv.textContent = player.position;
    positionDiv.classList.add('positionDiv');
    row.appendChild(positionDiv);
    const pointsDiv = document.createElement('div');
    pointsDiv.textContent = player.points.toString();
    pointsDiv.classList.add('pointsDiv');
    row.appendChild(pointsDiv);
    const FG_DIV = document.createElement('div');
    FG_DIV.classList.add('FG_DIV');
    FG_DIV.textContent = player.twoPercent.toString();
    row.appendChild(FG_DIV);
    const THREE_DIV = document.createElement('div');
    THREE_DIV.classList.add('THREE_DIV');
    THREE_DIV.textContent = player.threePercent.toString();
    row.appendChild(THREE_DIV);
    const actionDiv = document.createElement('div');
    actionDiv.classList.add('actionDiv');
    const addBtn = document.createElement('button');
    addBtn.classList.add('addBtn');
    addBtn.id = player._id;
    addBtn.setAttribute('data-position', player.position);
    addBtn.addEventListener('click', () => addPlayerToCard(addBtn));
    addBtn.textContent = 'Add Damian to Current Team';
    actionDiv.appendChild(addBtn);
    row.appendChild(actionDiv);
    return row;
};
const renderTable = (arr) => {
    tableBody.innerHTML = '';
    arr.forEach((player) => {
        const row = createTableRow(player);
        row.id = player._id;
        tableBody.appendChild(row);
    });
};
searchButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    const body = createBodyToPost();
    console.log(body);
    try {
        const data = yield postDada(body, FILTER_END_POINT);
        console.log(data);
        if (data instanceof Error) {
            throw data;
        }
        renderTable(data);
    }
    catch (err) {
        console.error(err);
    }
}));
// החזרת מערך השחקנים מהלוקל סטורג
const loadPlayers = () => {
    const arr = localStorage.getItem('playersArr');
    return arr ? JSON.parse(arr) : null;
};
// הוספת אובייקט  למערך הלוקל סטורג
const addPlayer = (player) => {
    const arr = loadPlayers();
    if (arr) {
        arr.push(player);
        localStorage.setItem('playersArr', JSON.stringify(arr));
    }
    else {
        const newArr = [player];
        localStorage.setItem('playersArr', JSON.stringify(newArr));
    }
};
// מחיקת שחקן מהמערך בלוקל סטורג
const removeTask = (id) => {
    const arr = loadPlayers();
    if (!arr)
        return;
    const newPlayersArr = arr.filter((player) => player._id !== id);
    localStorage.setItem('playersArr', JSON.stringify(newPlayersArr));
};
const player1 = {
    position: 'PG',
    twoPercent: 0,
    threePercent: 0,
    points: 0
};
// postDada(player1, FILTER_END_POINT);
