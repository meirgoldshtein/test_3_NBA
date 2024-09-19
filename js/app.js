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
let playersArr = [];
const positionsInput = document.querySelector('#positionSelect');
const pointsInput = document.querySelector('.points');
const threeInput = document.querySelector('.threeRange');
const twoInput = document.querySelector('.twoRange');
const searchButton = document.querySelector('.searchButton');
const tableBody = document.querySelector('.tableBody');
const filterInput = document.querySelector('.filterInput');
const filterButton = document.querySelector('.filterButton');
const saveTeamButton = document.querySelector('.saveTeam');
let teamArr = [];
let teamsFromDB;
let index = 0;
// פונקצייה להצגת מספרים מעל לאינפוט בחירת הנקודות והאחוזים
const updateLabels = () => {
    const pointsLabel = document.querySelector('.pointsLabel');
    const threeLabel = document.querySelector('.threeLabel');
    const twoLabel = document.querySelector('.twoLabel');
    pointsLabel.innerHTML = pointsInput.value;
    threeLabel.innerHTML = threeInput.value;
    twoLabel.innerHTML = twoInput.value;
};
updateLabels();
// האזנה לשינוי באינפוט המספרים והפעלת הפונקצייה לעדכון בתצוגה
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
//פןנקצייה שמופעלת בלחיצה על כפתור הוספת שחקן מהרשימה לנבחרת
const addPlayerToCard = (target) => {
    var _a, _b, _c, _d;
    const parent = target.parentElement.parentElement;
    // מציאת תפקיד השחקן לפי אטריביוט שנתתי לכפתור
    const position = target.getAttribute('data-position');
    // מציאת כרטיס השחקן בעל אותו מזהה תפקיד
    const card = document.querySelector(`#${position}`);
    //הזרקת השחקן לכרטיס
    card.querySelector('.playerName').innerHTML = (_a = parent.querySelector('.nameDiv')) === null || _a === void 0 ? void 0 : _a.textContent;
    card.querySelector('.threePrecents').innerHTML = (_b = parent.querySelector('.THREE_DIV')) === null || _b === void 0 ? void 0 : _b.textContent;
    card.querySelector('.twoPrecents').innerHTML = (_c = parent.querySelector('.FG_DIV')) === null || _c === void 0 ? void 0 : _c.textContent;
    card.querySelector('.playerPoints').innerHTML = (_d = parent.querySelector('.pointsDiv')) === null || _d === void 0 ? void 0 : _d.textContent;
    const PLAYER = playersArr.filter(player => player._id === target.id)[0];
    teamArr.push(PLAYER);
    // טיפול בשינוי צבע הכפתורים לאחר הלחיצה
    card.style.backgroundColor = 'pink';
    target.style.backgroundColor = 'red';
    searchButton.style.backgroundColor = 'green';
    const buttons = document.querySelectorAll('.addBtn');
    buttons.forEach(button => {
        if (button.id !== target.id) {
            button.style.backgroundColor = 'blue';
        }
    });
};
// פונקצייה להצגת קבוצות שקיימות בדי בי
const renderTeams = () => {
    let players = teamsFromDB[index].players;
    console.log(players);
    for (let j = 0; j < players.length; j++) {
        const card = document.querySelector(`#${players[j].position}`);
        card.querySelector('.playerName').innerHTML = players[j].playerName;
        card.querySelector('.threePrecents').innerHTML = players[j].threePercent.toString();
        card.querySelector('.twoPrecents').innerHTML = players[j].twoPercent.toString();
        card.querySelector('.playerPoints').innerHTML = players[j].points.toString();
    }
};
// מאזין לכפתור דפדוף ימינה
document.querySelector('.btnRight').addEventListener('click', () => {
    if (index >= teamsFromDB.length - 1) {
        index = 0;
    }
    else {
        index++;
    }
    renderTeams();
});
// מאזין לכפתור דפדוף שמאלה
document.querySelector('.btnLeft').addEventListener('click', () => {
    if (index <= 0) {
        index = teamsFromDB.length - 1;
    }
    else {
        index--;
    }
    renderTeams();
});
// יצירת מבנה אובייקט סינון עם פרמטרים שהזין המשתמש שישלחו לשרת
const createBodyToPost = () => {
    return {
        position: positionsInput.value,
        twoPercent: Number(twoInput.value),
        threePercent: Number(threeInput.value),
        points: Number(pointsInput.value)
    };
};
// פונקצייה שמקבלת אובייקט של שחקן ויוצרת עבורו אלמנט שורה בטבלה
const createTableRow = (player) => {
    const row = document.createElement('div');
    row.classList.add('playerRow');
    row.classList.add(`${player.position}color`);
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
    FG_DIV.textContent = player.twoPercent.toString() + '%';
    row.appendChild(FG_DIV);
    const THREE_DIV = document.createElement('div');
    THREE_DIV.classList.add('THREE_DIV');
    THREE_DIV.textContent = player.threePercent.toString() + '%';
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
// פונקצייה שמקבלת מערך שחקנים ומטפלת בהצגתו בטבלה
const renderTable = (arr) => {
    tableBody.innerHTML = '';
    arr.forEach((player) => {
        const row = createTableRow(player);
        row.id = player._id;
        tableBody.appendChild(row);
    });
};
// מאזין ראשי לכפתור החיפוש ומטפל וקורא לפונקציות המתאימות
searchButton.addEventListener('click', (e) => __awaiter(void 0, void 0, void 0, function* () {
    const body = createBodyToPost();
    console.log(body);
    try {
        const data = yield postDada(body, FILTER_END_POINT);
        if (data instanceof Error) {
            throw data;
        }
        renderTable(data);
        playersArr = data;
        searchButton.style.backgroundColor = 'red';
    }
    catch (err) {
        console.error(err);
    }
}));
const feachTeams = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Response = yield fetch(`https://nbaserver-q21u.onrender.com/api/GetAllTeams`);
        const data = yield Response.json();
        console.log(data);
        teamsFromDB = data;
    }
    catch (err) {
        console.error(err);
    }
});
feachTeams();
// saveTeamButton.addEventListener('click', () => {
//     if(teamArr.length !== 5)
//     {
//         alert('לא נבחרו 5 שחקנים');
//     }
//     else
//     {
//         postDada(teamArr)
//     }
// })
// // החזרת מערך השחקנים מהלוקל סטורג
// const loadPlayers = () : displayPlayer[] | null => {
//     const arr : string | null  = localStorage.getItem('playersArr');
//     return arr ? JSON.parse(arr) : null;
// }
// // הוספת אובייקט  למערך הלוקל סטורג
// const addPlayer = (player: displayPlayer) :void =>  {
//     const arr : displayPlayer[]|null = loadPlayers();
//     if(arr){
//         arr.push(player);
//         localStorage.setItem('playersArr', JSON.stringify(arr));
//     } 
//     else{
//         const newArr : displayPlayer[] = [player];
//         localStorage.setItem('playersArr', JSON.stringify(newArr));
//     } 
// }
// // מחיקת שחקן מהמערך בלוקל סטורג
// const removeTask = (id: string) => {
//     const arr : displayPlayer[] | null = loadPlayers()
//     if(!arr) return;
//     const newPlayersArr = arr.filter((player) => player._id !== id);
//     localStorage.setItem('playersArr', JSON.stringify(newPlayersArr));
// }
// const player1:Filter = {
//     position: 'PG',
//     twoPercent: 0,
//     threePercent: 0,
//     points: 0
// }
// postDada(player1, FILTER_END_POINT);
