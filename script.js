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
                    
                    const newObjArr = new Map();
                    for(i = 0; i < 10; i++) {
                        newObjArr.set(i, returnedData.data[i]);
                    }

                    console.log(newObjArr);
                    console.log(newObjArr.size);
                    console.log(newObjArr.get(1));
                    console.log(newObjArr.get(1).Account);

                    createTable(newObjArr);

                    function createTable(data) {
                        let table = document.getElementById('myTable');
                        
                        table.innerHTML = `
                            <table class="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">Account No.</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Value</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                <thead>
                                <tbody id="myTableBody">

                                </tbody>
                            </table>
                        `;

                        for(i = 0; i < data.size; i++) {
                            $('#myTableBody').append(`<tr>
                                            <td>${data.get(i).Account}</td>
                                            <td>${data.get(i).AccountName}</td>
                                            <td>${data.get(i).TotalAccountValue}</td>
                                            <td><button class="delete-button" id='deleteRowBtn'><i class="fas fa-times"></i></button></td>
                                       </tr>`
                            )};
                        }
                        
                        // const deleteBtn = document.getElementById('deleteRowBtn');

                        document.querySelectorAll('delete-button').addEventListener('click', () => {
                            console.log(newObjArr)
                        });
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