const FILTER_END_POINT ='api/filter';
const baseURL = 'https://nbaserver-q21u.onrender.com/';
const playersArr: displayPlayer[] = [];


interface displayPlayer{
    position: string;
    twoPercent: Number;
    threePercent: Number;
    points: Number;
    playerName: String;
    _id: String;
}

interface dbPlayer{
    age: Number;
    games: Number;
    seasons: Number[];
    team: String;
    position: string;
    twoPercent: Number;
    threePercent: Number;
    points: Number;
    playerName: String;
    __v: Number;
    _id: String;
}


interface Filter{
    position: string;
    twoPercent: Number;
    threePercent: Number;
    points: Number;
}

// החזרת מערך השחקנים מהלוקל סטורג
const loadPlayers = () : displayPlayer[] | null => {
    const arr : string | null  = localStorage.getItem('playersArr');
    return arr ? JSON.parse(arr) : null;
}

// הוספת אובייקט  למערך הלוקל סטורג
const addPlayer = (player: displayPlayer) :void =>  {
    const arr : displayPlayer[]|null = loadPlayers();
    if(arr){
        arr.push(player);
        localStorage.setItem('playersArr', JSON.stringify(arr));
    } 
    else{
        const newArr : displayPlayer[] = [player];
        localStorage.setItem('playersArr', JSON.stringify(newArr));
    } 
    
}

// מחיקת משימה מהמערך בלוקל סטורג
const removeTask = (id: string) => {
    const arr : displayPlayer[] | null = loadPlayers()
    if(!arr) return;
    const newPlayersArr = arr.filter((player) => player._id !== id);
    localStorage.setItem('playersArr', JSON.stringify(newPlayersArr));
}
   

// פונקציה גנרית שמקבלת נקודת קצה ואובייקט ושולחת לשרת בקשת פוסט
const postDada = async (obj : Filter, endPoint : string = '') : Promise<dbPlayer[] | Error> => {
    try{
        const response : Response = await fetch(`${baseURL}${endPoint}`, {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data : dbPlayer[] = await response.json();
        console.log(data);
        return data;
    }
    catch(err){
        console.error(err);
        return err instanceof Error ? err : new Error('An unknown error occurred');
    }
}

const player1:Filter = {
    position: 'PG',
    twoPercent: 0,
    threePercent: 0,
    points: 0
}

// postDada(player1, FILTER_END_POINT);