function getNotation(moveObj){
	var notationObj = {
		piece: moveObj.piece,
		from: moveObj.fileFrom + moveObj.rankFrom,
		to: moveObj.fileTo + moveObj.rankTo  
	}
	return notationObj;
}

function getFileLetter(str, index){

	var colNum = 1;
	if(index === 0){
		return "a";
	}

	for(var i = 0; i < index; i++){

		if(str[i].match(/[a-zA-Z]/)){
			colNum++;
		} else {
			colNum += Number(str[i]);
		}
	}
	return [0,"a","b","c","d","e","f","g","h"][colNum];
}

//p stands for piece abreviation
function getCount(str, p){
	var count = 0;
	for(var i = 0; i < str.length; i++){
		if(str[i] === p){
			count++;
		}
	}
	return count;
}


//fen1StrA, fen1StrB, fen2StrA, fen2StrB
//this is called on fen1StrA & fen2StrA to find fenFrom
//and on fen1StrB andfen2StrB to find fenTo
//strings from Fen 1 must go first
function findFenFromAndFenTo(moveObj, str1, str2){
	
	if(getCount(str1, moveObj.piece) > getCount(str2, moveObj.piece)){

		moveObj.fenFrom = str1;
		moveObj.fenFromAfter = str2;
		

	} else {

		moveObj.fenTo = str2;
		moveObj.fenToBefore = str1;
		
	}

}
//when only 1 row is changed
function findPieceMovedSideways(obj, str1, str2){
	console.log(str1)
	
	if(str1.length > str2.length){
		var shorterLen = str2.length;
	} else {
		var shorterLen = str1.length;
	}
	
	for(var i = 0; i < shorterLen; i++){
		
		if(str1[i] !== str2[i]){
			//A
			if(str1[i].match(/[0-9]/) && str2[i].match(/[0-9]/)){
				//illegal move if piece jumped over another piece
				if(obj.piece !== str1[i + 1]){
					console.log("can't jump over piece")
					return false;
				}
				return str1[i + 1];
			}
			//B
			if(str1[i].match(/[0-9]/) && str2[i].match(/[a-zA-Z]/)){
				
				return str1[i + 1];
			}
			//C
			if(str1[i].match(/[a-zA-Z]/) && str2[i].match(/[0-9]/)){
				
				return str1[i];
			}
			//D
			if(str1[i].match(/[a-zA-Z]/) && str2[i].match(/[a-zA-Z]/)){

				return str1[i];
			}
		}
	}
}
//compares fen strings to find index of piece that moved
//this is called on fenFrom(str1) and fenFromAfter(str2) to get fileFrom
//again called on fenTo(str1) and fenToBefore(str2) to get fileTo

function getIndexToGetFile(str1, str2){

	var shorterLen;

	if(str1.length > str2.length){
		shorterLen = str1.length;
	} else {
		shorterLen = str2.length;
	}	

	for(var i = 0; i < shorterLen; i++){
		
		if(str1[i] !== str2[i]){
			//A
			if(str1[i].match(/[0-9]/) && str2[i].match(/[0-9]/)){
				console.log(str1[i+1])
				return getFileLetter(str1, i + 1);
				
			}
			//B
			if(str1[i].match(/[0-9]/) && str2[i].match(/[a-zA-Z]/)){

				return getFileLetter(str1, i + 1);
				
			}
			//C
			if(str1[i].match(/[a-zA-Z]/) && str2[i].match(/[0-9]/)){

				return getFileLetter(str1, i);
				
			}
			//D
			if(str1[i].match(/[a-zA-Z]/) && str2[i].match(/[a-zA-Z]/)){

				//removed + 1
				return getFileLetter(str1, i);
				
			}
		}
	}
}


	function findMovedPiece(moveObj){
	
		
		arr1 = moveObj.fen1.split("/");
		arr2 = moveObj.fen2.split("/");
		var tempArr1 = [];
		var tempArr2 = [];
		
		moveObj.rankObj = {
			"fromObj": {},
			"toObj": {}
		}

		
		for(var i = 0; i < 8; i++){
			
			//finds 2 or 4 partial fens
			//assigns rows to each partial fen
			if(arr1[i] !== arr2[i]){
				tempArr1.push(arr1[i]);
				moveObj.rankObj.fromObj[arr1[i]] = 8 - i;
				
				
				tempArr2.push(arr2[i]);
				moveObj.rankObj.toObj[arr2[i]] = 8 - i;
			}
			
		}

		moveObj.tempArr1 = tempArr1;
		moveObj.tempArr2 = tempArr2;

		if (tempArr1.length > 1){

			
			var longer, shorter;
			
			if(tempArr1[0].length > tempArr2[0].length){
				longer = tempArr1[0].split("");
				shorter = tempArr2[0].split("");
			} else {
				longer = tempArr2[0].split("");
				shorter = tempArr1[0].split("");			
			}
			
			for(var j = 0; j < shorter.length; j++){
				
				for(var k = 0; k < longer.length; k++){
					if(longer[k].match(/[0-9]/)){
						longer.splice(k,1);
						j--;
						
					} else if (longer[k] === shorter[j]){
						longer.splice(k,1);
						continue;
					}
				}
				
			}
			moveObj.piece = longer[0];

			//call findFenFromAndFenTo twice to assign all 4 strings
			findFenFromAndFenTo(moveObj, tempArr1[0], tempArr2[0]);
			findFenFromAndFenTo(moveObj, tempArr1[1], tempArr2[1]);

			//get files
			moveObj.fileFrom = getIndexToGetFile(moveObj, moveObj.fenFrom, moveObj.fenFromAfter);
			moveObj.fileTo = getIndexToGetFile(moveObj, moveObj.fenTo, moveObj.fenToBefore);
			
		}
		
		//only 1 row changed
		//i.e. piece moves sideways
		else {
			
			moveObj.piece = findPieceMovedSideways(tempArr1[0], tempArr2[0]);
			moveObj.fenFrom = tempArr1[0];
			moveObj.fenTo = tempArr2[0];
			moveObj.fileFrom = getIndexToGetFile(moveObj, tempArr1[0], tempArr2[0]);
			moveObj.fileTo = getIndexToGetFile(moveObj, tempArr1[0], tempArr2[0]);

		}

		//get ranks 
		moveObj.rankFrom = moveObj.rankObj.fromObj[moveObj.fenFrom];
		moveObj.rankTo = moveObj.rankObj.toObj[moveObj.fenTo];
		console.log(getNotation(moveObj));
		//console.log("jumpedOverPiece:", jumpedOverPiece(moveObj));
		return moveObj;

		
	}


