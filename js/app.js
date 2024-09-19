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
// מחיקת משימה מהמערך בלוקל סטורג
const removeTask = (id) => {
    const arr = loadPlayers();
    if (!arr)
        return;
    const newPlayersArr = arr.filter((player) => player._id !== id);
    localStorage.setItem('playersArr', JSON.stringify(newPlayersArr));
};
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
const player1 = {
    position: 'PG',
    twoPercent: 0,
    threePercent: 0,
    points: 0
};
// postDada(player1, FILTER_END_POINT);
