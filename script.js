var figure = "";
var selected;
var oldSelected = "";
var player = 0;
var playFigs;
var pawnMove;
var figurTable = [['8', '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜', '8'],
                    ['7', '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟', '7'],
                    ['6', '', '', '', '', '', '', '', '', '6'],
                    ['5', '', '', '', '', '', '', '', '', '5'],
                    ['4', '', '', '', '', '', '', '', '', '4'],
                    ['3', '', '', '', '', '', '', '', '', '3'],
                    ['2', '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙', '2'],
                    ['1', '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖', '1']];

function chessdesk(figurTable, figure) {
    var newTable = document.createElement('table'),
        name = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', ''],
        blackFigs = ['♜', '♞', '♝', '♛', '♚', '♟'],
        whiteFigs = ['♖', '♘', '♗', '♕', '♔', '♙'];
    if (player == 0) {
        playFigs = whiteFigs;
    } else {
        playFigs = blackFigs;
    }
    for (var i = 0, a = 9; i < 10, a >= 0; i++, a--) {
        var newTr = newTable.insertRow(i);
        for (var j = 0; j < 10; j++) {
            var newTd = newTr.insertCell(j);
            newTd.className = "x_" + j;
            switch (i) {
                case 0:
                    newTd.innerText = name[j];
                    break;
                case 9:
                    newTd.innerText = name[j];
                    break;
                default:
                    if (j == 0 || j == 9) {
                        newTd.innerHTML = a;
                    }
                    break;
            }
            if (i > 0 && i < 9) {
                newTd.innerHTML = figurTable[i - 1][j];
                newTd.id = "id_" + i + "_" + j;
                if (j > 0 && j < 9) {
                    var index = 0;
                    for (var z = 0; z < 7; z++) {
                        if (index == 1) {
                            break
                        } else if (newTd.innerText == playFigs[z]) {
                            index = 1;
                            newTd.onclick = function () { //поднимание
                                if (oldSelected != "") {
                                    oldSelected.style.textShadow = "";
                                    oldSelected.style.textAlign = "";
                                    oldSelected.style.verticalAlign = "";
                                }
                                figure = this.innerHTML;
                                this.style.textShadow = "10px 10px 10px black";
                                this.style.textAlign = "left";
                                this.style.verticalAlign = "top";
                                oldSelected = this;
                                selected = this.id;
                            }
                        } else if (z == 6) {
                            newTd.onclick = function () { //опускание
                                try {
                                    var beg = selected.split("_");
                                } catch (err) {
                                    alert("Вначале выберите фигуру");
                                }
                                var end = this.id.split("_");
                                if (winner(newTable, this.innerHTML, blackFigs[4], whiteFigs[4], figure)) {
                                    if (blackFigs[0] == figure || whiteFigs[0] == figure) { // Ладья
                                        if ((end[2] == beg[2] || end[1] == beg[1])) {
                                            if (pathCheck(beg, end)) {
                                                pawnMove = 0;
                                                castling(beg, end);
                                                playerSelect(newTable, figure, figurTable, end, beg, document, this);
                                            } else {
                                                alert("Ход недопустим!");
                                            }
                                        } else {
                                            alert("Ход недопустим!");
                                        }
                                    }
                                    if (blackFigs[1] == figure || whiteFigs[1] == figure) { // Конь
                                        var horse1 = (beg[1] - end[1] == 2 && ((beg[2] - end[2] == 1) || (beg[2] - end[2] == -1)));
                                        var horse2 = (beg[1] - end[1] == 1 && ((beg[2] - end[2] == 2) || (beg[2] - end[2] == -2)));
                                        var horse3 = (beg[1] - end[1] == -1 && ((beg[2] - end[2] == 2) || (beg[2] - end[2] == -2)));
                                        var horse4 = (beg[1] - end[1] == -2 && ((beg[2] - end[2] == 1) || (beg[2] - end[2] == -1)));
                                        if (horse1 || horse2 || horse3 || horse4) {
                                            pawnMove = 0;
                                            playerSelect(newTable, figure, figurTable, end, beg, document, this);
                                        } else {
                                            alert("Ход недопустим!");
                                        }
                                    }
                                    if (blackFigs[2] == figure || whiteFigs[2] == figure) { // Слон
                                        if ((beg[1] - end[1] == beg[2] - end[2]) || (end[1] - beg[1] == beg[2] - end[2])) {
                                            if (pathCheck(beg, end)) {
                                                pawnMove = 0;
                                                playerSelect(newTable, figure, figurTable, end, beg, document, this);
                                            } else {
                                                alert("Ход недопустим!");
                                            }
                                        } else {
                                            alert("Ход недопустим!");
                                        }
                                    }
                                    if (blackFigs[3] == figure || whiteFigs[3] == figure) { // Ферзь
                                        var queen1 = ((end[2] == beg[2]) || end[1] == beg[1]);
                                        var queen2 = ((beg[1] - end[1] == beg[2] - end[2]) ||
                                            (end[1] - beg[1] == beg[2] - end[2]));
                                        if (queen1 || queen2) {
                                            if (pathCheck(beg, end)) {
                                                pawnMove = 0;
                                                playerSelect(newTable, figure, figurTable, end, beg, document, this);
                                            } else {
                                                alert("Ход недопустим!");
                                            }
                                        } else {
                                            alert("Ход недопустим!");
                                        }
                                    }
                                    if (blackFigs[4] == figure || whiteFigs[4] == figure) { // Король
                                        var king1 = ((end[2] == beg[2] && (beg[1] - end[1] == 1 || beg[1] - end[1] == -1)) ||
                                            (end[1] == beg[1] && (beg[2] - end[2] == 1 || beg[2] - end[2] == -1)));
                                        var king2 = (((beg[1] - end[1] == beg[2] - end[2]) &&
                                                ((beg[1] - end[1] == 1) || ((beg[1] - end[1] == -1)))) ||
                                            ((end[1] - beg[1] == beg[2] - end[2]) &&
                                                ((beg[1] - end[1] == 1 && beg[2] - end[2] == -1) ||
                                                    ((beg[1] - end[1] == -1 && beg[2] - end[2] == 1)))));
                                        if (king1 || king2) {
                                            pawnMove = 0;
                                            playerSelect(newTable, figure, figurTable, end, beg, document, this);
                                        } else {
                                            alert("Ход недопустим!");
                                        }
                                    }
                                    if (blackFigs[5] == figure) { // Черная пешка
                                        if (beg[1] == 2) {
                                            var strLeng = 2;
                                        } else {
                                            var strLeng = 1;
                                        }
                                        if (((end[2] - beg[2] == 1 || end[2] - beg[2] == -1) && end[1] - beg[1] == 1 && figurTable[end[1] - 1][end[2]] != "")) { // пешка ест
                                            if (pathCheck(beg, end)) {
                                                pawnMove = 1;
                                                if (end[1] == 8) {
                                                    figure = uglyDuck();
                                                }
                                                playerSelect(newTable, figure, figurTable, end, beg, document, this);
                                            } else {
                                                alert("Ход недопустим!");
                                            }
                                        } else if (((end[2] - beg[2] == 1 || end[2] - beg[2] == -1) && end[1] - beg[1] == 1 && figurTable[end[1] - 1][end[2]] == "" && figurTable[end[1] - 2][end[2]] != "" && pawnMove == 1)) { // взятие на проходе
                                            if (pathCheck(beg, end)) {
                                                figurTable[end[1] - 2][end[2]] = "";
                                                pawnMove = 1;
                                                playerSelect(newTable, figure, figurTable, end, beg, document, this);
                                            } else {
                                                alert("Ход недопустим!");
                                            }
                                        } else if (end[2] != beg[2] || end[1] - beg[1] > strLeng || end[1] - beg[1] < 0) {
                                            alert("Ход недопустим!");
                                        } else if (figurTable[end[1] - 1][end[2]] != "") {
                                            alert("Ход недопустим!");
                                        } else {
                                            if (pathCheck(beg, end)) { // пешка ходит
                                                pawnMove = 1;
                                                if (end[1] == 8) {
                                                    figure = uglyDuck();
                                                }
                                                playerSelect(newTable, figure, figurTable, end, beg, document, this);
                                            } else {
                                                alert("Ход недопустим!");
                                            }
                                        }
                                    }
                                    if (whiteFigs[5] == figure) { // Белая пешка
                                        if (beg[1] == 7) {
                                            var strLeng = 2;
                                        } else {
                                            var strLeng = 1;
                                        }
                                        if (((end[2] - beg[2] == 1 || end[2] - beg[2] == -1) && beg[1] - end[1] == 1 && figurTable[end[1] - 1][end[2]] != "")) { // пешка ест
                                            if (pathCheck(beg, end)) {
                                                pawnMove = 1;
                                                if (end[1] == 1) {
                                                    figure = uglyDuck();
                                                }
                                                playerSelect(newTable, figure, figurTable, end, beg, document, this);
                                            } else {
                                                alert("Ход недопустим!");
                                            }
                                        } else if (((end[2] - beg[2] == 1 || end[2] - beg[2] == -1) && beg[1] - end[1] == 1 && figurTable[end[1] - 1][end[2]] == "" && figurTable[end[1]][end[2]] != "" && pawnMove == 1)) { // взятие на проходе
                                            if (pathCheck(beg, end)) {
                                                figurTable[end[1]][end[2]] = "";
                                                pawnMove = 1;
                                                playerSelect(newTable, figure, figurTable, end, beg, document, this);
                                            } else {
                                                alert("Ход недопустим!");
                                            }
                                        } else if (end[2] != beg[2] || beg[1] - end[1] > strLeng || beg[1] - end[1] < 0) {
                                            alert("Ход недопустим!");
                                        } else if (figurTable[end[1] - 1][end[2]] != "") {
                                            alert("Ход недопустим!");
                                        } else {
                                            if (pathCheck(beg, end)) { // пешка ходит
                                                pawnMove = 1;
                                                if (end[1] == 1) {
                                                    figure = uglyDuck();
                                                }
                                                playerSelect(newTable, figure, figurTable, end, beg, document, this);
                                            } else {
                                                alert("Ход недопустим!");
                                            }
                                        }
                                    }
                                } else {
                                    figurTable = [['8', '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜', '8'],
                                                ['7', '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟', '7'],
                                                ['6', '', '', '', '', '', '', '', '', '6'],
                                                ['5', '', '', '', '', '', '', '', '', '5'],
                                                ['4', '', '', '', '', '', '', '', '', '4'],
                                                ['3', '', '', '', '', '', '', '', '', '3'],
                                                ['2', '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙', '2'],
                                                ['1', '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖', '1']];
                                    figure = "";
                                    chessdesk(figurTable, figure);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    document.body.appendChild(newTable);
}

function playerSelect(newTable, figure, figurTable, end, beg, document, this1) {
    document.getElementById(selected).style = "";
    document.getElementById(selected).innerHTML = "";
    this1.innerHTML = figure;
    if (player == 0) {
        player = 1;
        alert("Теперь ходят черные");
        document.body.removeChild(newTable);
        figurTable[end[1] - 1][end[2]] = figure;
        figurTable[beg[1] - 1][beg[2]] = "";
        figure = "";
        chessdesk(figurTable, figure);
    } else {
        player = 0;
        alert("Теперь ходят белые");
        document.body.removeChild(newTable);
        figurTable[end[1] - 1][end[2]] = figure;
        figurTable[beg[1] - 1][beg[2]] = "";
        figure = "";
        chessdesk(figurTable, figure);
    }
}

function winner(newTable, figure, blackFigs, whiteFigs, free) {
    if (free != "") { // исправление бага с первым "ходом" по черному королю
        if (figure == blackFigs) {
            alert("Белые победили!!! Теперь они ходят!!!")
            document.body.removeChild(newTable);
            return false;
        } else if (figure == whiteFigs) {
            alert("Черные победили!!! Теперь они ходят!!!")
            document.body.removeChild(newTable);
            return false;
        }
    }
    return true;
}

function pathCheck(beg, end) { // Проверка пути
    if (beg[2] == end[2]) { // 1 горизонталь
        if (beg[1] > end[1]) {
            var coord1 = beg[1];
            var coord2 = end[1];
        } else {
            var coord1 = end[1];
            var coord2 = beg[1];
        }
        for (i = coord1 - 1; i > coord2; i--) {
            if (figurTable[i - 1][end[2]] != '') {
                return false;
            }
        }
        return true;
    } else if (beg[1] == end[1]) { // 2 горизонталь
        if (beg[2] > end[2]) {
            var coord1 = beg[2];
            var coord2 = end[2];
        } else {
            var coord1 = end[2];
            var coord2 = beg[2];
        }
        for (j = coord1 - 1; j > coord2; j--) {
            if (figurTable[(end[1] - 1)][j] != "") {
                return false;
            }
        }
        return true;
    } else if (beg[1] - end[1] == beg[2] - end[2]) { // 1 диагональ
        if (beg[1] > end[1]) {
            var coord1 = beg[1];
            var coord2 = beg[2];
            var coord3 = end[1];
            var coord4 = end[2];
        } else {
            var coord3 = beg[1];
            var coord4 = beg[2];
            var coord1 = end[1];
            var coord2 = end[2];
        }
        for (i = coord1 - 2, j = parseInt(coord2) - 1; i > parseInt(coord3) - 1; i--, j--) {
            if (figurTable[i][j] != '') {
                return false;
            }
        }
        return true;
    } else if (end[1] - beg[1] == beg[2] - end[2]) { // 2 диагональ
        if (beg[2] < end[2]) {
            var coord1 = beg[1];
            var coord2 = beg[2];
            var coord3 = end[1];
            var coord4 = end[2];
        } else {
            var coord3 = beg[1];
            var coord4 = beg[2];
            var coord1 = end[1];
            var coord2 = end[2];
        }
        for (i = coord1 - 2, j = parseInt(coord2) + 1; i > parseInt(coord3) - 1; i--, j++) {
            if (figurTable[i][j] != '') {
                return false;
            }
        }
        return true;
    }
}

function uglyDuck() {
    while (true){
        var figSelect = prompt("Выберете фигуру: 1 - ладья, 2 - конь, 3 - слон, 4 - ферзь", "4");
        if (figSelect == 1) {
            return playFigs[0];
        } else if (figSelect == 2) {
            return playFigs[1];
        } else if (figSelect == 3){
            return playFigs[2];
        } else if (figSelect == 4) {
            return playFigs[3];
        } else {
            alert("Выбор неверен!!!");
        }
    }
}

function castling(beg, end){
    if (beg[1] == 1 && beg[2] == 1 && end[1] == 1 && end[2] == 4){
        if (figurTable[0][2] == '' && figurTable[0][3] == '' && figurTable[0][4] == '' && figurTable[0][5] == '♚'){
            if (confirm("Сделать рокировку?")){
                figurTable[0][5] = '';
                figurTable[0][3] = '♚';
            }
        }
    } else if (beg[1] == 1 && beg[2] == 8 && end[1] == 1 && end[2] == 6) {
        if (figurTable[0][6] == '' && figurTable[0][7] == '' && figurTable[0][5] == '♚'){
            if (confirm("Сделать рокировку?")){
                figurTable[0][5] = '';
                figurTable[0][7] = '♚';
            }
        }
    } else if (beg[1] == 8 && beg[2] == 1 && end[1] == 8 && end[2] == 4) {
        if (figurTable[7][2] == '' && figurTable[7][3] == '' && figurTable[7][4] == '' && figurTable[7][5] == '♔'){
            if (confirm("Сделать рокировку?")){
                figurTable[7][5] = '';
                figurTable[7][3] = '♔';
            }
        }
    } else if (beg[1] == 8 && beg[2] == 8 && end[1] == 8 && end[2] == 6) {
        if (figurTable[7][6] == '' && figurTable[7][7] == '' && figurTable[7][5] == '♔'){
            if (confirm("Сделать рокировку?")){
                figurTable[7][5] = '';
                figurTable[7][7] = '♔';
            }
        }
    }
}

chessdesk(figurTable, figure);
