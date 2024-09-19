const FILTER_END_POINT ='api/filter';
const baseURL = 'https://nbaserver-q21u.onrender.com/';
const playersArr: displayPlayer[] = [];
const positionsInput :HTMLSelectElement = document.querySelector('#positionSelect')!;
const pointsInput:HTMLInputElement = document.querySelector('.points')!;
const threeInput:HTMLInputElement = document.querySelector('.threeRange') !;
const twoInput:HTMLInputElement = document.querySelector('.twoRange')!;
const searchButton:HTMLButtonElement = document.querySelector('.searchButton')!;
const tableBody = document.querySelector('.tableBody')!;

const updateLabels = () => {
    const pointsLabel = document.querySelector('.pointsLabel') as HTMLLabelElement;
    const threeLabel = document.querySelector('.threeLabel') as HTMLLabelElement;
    const twoLabel = document.querySelector('.twoLabel') as HTMLLabelElement;
    pointsLabel.innerHTML =  pointsInput.value;
    threeLabel.innerHTML =   threeInput.value;
    twoLabel.innerHTML =  twoInput.value;
}

pointsInput.addEventListener('input', updateLabels);
threeInput.addEventListener('input', updateLabels);
twoInput.addEventListener('input', updateLabels);


interface displayPlayer{
    position: string;
    twoPercent: number;
    threePercent: number;
    points: number;
    playerName: string;
    _id: string;
}


interface dbPlayer{
    age: number;
    games: number;
    seasons: number[];
    team: string;
    position: string;
    twoPercent: number;
    threePercent: number;
    points: number;
    playerName: string;
    __v: number;
    _id: string;
}


interface Filter{
    position: string;
    twoPercent: number;
    threePercent: number;
    points: number;
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


const createBodyToPost = () : Filter => {
    
    return {
        position: positionsInput.value,
        twoPercent: Number(twoInput.value),
        threePercent: Number(threeInput.value),
        points: Number(pointsInput.value)
    }
}


const createTableRow = (player: dbPlayer) : HTMLDivElement => {

    
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
    addBtn.textContent = 'Add Damian to Current Team';
    actionDiv.appendChild(addBtn);
    row.appendChild(actionDiv);

    return row;

}


const renderTable = (arr: dbPlayer[]) : void => {
    tableBody.innerHTML = '';
    arr.forEach((player) => {
        const row = createTableRow(player);
        tableBody.appendChild(row);
    });
}


searchButton.addEventListener('click',async () => {
    const body : Filter = createBodyToPost();
    console.log(body)
    try
    {
        const data : dbPlayer[]|Error = await postDada(body, FILTER_END_POINT);
        console.log(data);
        if(data instanceof Error)
        {
            throw data;
        }
        renderTable(data);
    }
    catch(err)
    {
        console.error(err);
    }
});




















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

// מחיקת שחקן מהמערך בלוקל סטורג
const removeTask = (id: string) => {
    const arr : displayPlayer[] | null = loadPlayers()
    if(!arr) return;
    const newPlayersArr = arr.filter((player) => player._id !== id);
    localStorage.setItem('playersArr', JSON.stringify(newPlayersArr));
}
  
const player1:Filter = {
    position: 'PG',
    twoPercent: 0,
    threePercent: 0,
    points: 0
}

// postDada(player1, FILTER_END_POINT);