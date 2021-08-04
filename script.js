    var csv = document.getElementById('CSV');
    var readFileEx = document.getElementById('processFilesButton');
    var processButton = document.querySelector('.process-btn');


    function readFile() {
        Papa.parse(csv.files[0], {
            complete: function(results) {
                if(csv.value.split('.').pop() != 'csv') {
                    processButton.classList.remove('success');
                    processButton.classList.add('fail');
                    processButton.innerHTML = 'Failed';
                    setTimeout(function() { alert("It looks like you may have uploaded the wrong file type. Make sure to upload .csv files only."); }, 500);
                    setTimeout(function() { window.location = '/'; }, 4000);
                } else if(results.data[0].hasOwnProperty('Fee')) {
                // if(Object.entries(results.data[0]).length === 18) {
                    processButton.classList.remove('success');
                    processButton.classList.add('fail');
                    processButton.innerHTML = 'Failed';
                    setTimeout(function() { alert("It looks like you may have uploaded your file(s) in the wrong location. Make sure to upload the base list and billed list in the correct locations."); }, 500);
                    setTimeout(function() { window.location = '/'; }, 4000);
                } else {
                    // RR: if passes both tests = success
                    processButton.classList.remove('fail');
                    processButton.classList.add('success');
                    processButton.innerHTML = 'Success';
                    returnedData = results; 
                    // console.log(returnedData.data[0].Account);
                    
                    const newArr = new Map();
                    newArr.set(returnedData.data[0].Account, returnedData.data[0]);
                    newArr.set(returnedData.data[1].Account, returnedData.data[1]);
                    newArr.set(returnedData.data[2].Account, returnedData.data[2]);
                    newArr.set(returnedData.data[3].Account, returnedData.data[3]);
                    newArr.set(returnedData.data[4].Account, returnedData.data[4]);

                    console.log(newArr);

                    let arrLength = newArr.length;

                    let arrTable = '<table>' +
                                '<tr>' +
                                 '<th>Account</th>' +
                                 '<th>AccountName</th>' +
                                 '<th>TotalAccountValue</th>' +
                                '</tr>';
                    
                    for(i = 0; i < arrLength; i++) {
                        arrTable += '<tr>' +
                                     '<td>' + newArr[i].Account + '</td>' +
                                     '<td>' + newArr[i].AccountName + '</td>' +
                                     '<td>' + newArr[i].TotalAccountValue + '</td>' + 
                                    '<tr>'
                    }

                    console.log(arrTable);

                    document.getElementById('myTable').innerHTML = arrTable;
                    
                }
            },
                header: true, 
                skipEmptyLines: 'greedy',
                transform: dataRegex,
                transformHeader: (h) => {return h.replaceAll(/\s/g, '');}
        });
    }

    function dataRegex(v) {
        let transformedString = v;
        let dollarSignRegex = /\$(\d)/g;
        let commaRegex = /(\d)\,(\d)/g;
        let trailingSpaceRegex = /$\s/g;

        transformedString = transformedString.replaceAll(dollarSignRegex, '$1');
        transformedString = transformedString.replaceAll(commaRegex, '$1$2');
        transformedString = transformedString.replaceAll(trailingSpaceRegex, '');

        return transformedString;
    }

    readFileEx.addEventListener('click', readFile);