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

                    const newArrObjs = [];
                    for(i = 0; i < 10; i++) {
                        newArrObjs.push(returnedData.data[i]);
                    };
                    
                    // console.log(newArrObjs);
                    // console.log(newArrObjs.length);
                    // console.log(newArrObjs[1]);
                    // console.log(newArrObjs[1].Account);

                    createTable(newArrObjs);

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

                        for(i = 0; i < data.length; i++) {
                            $('#myTableBody').append(`<tr>
                                    <td>${data[i].Account}</td>
                                    <td>${data[i].AccountName}</td>
                                    <td>${data[i].TotalAccountValue}</td>
                                    <td><button class="delete-button" id='deleteRowBtn'><i class="fas fa-times"></i></button></td>
                                </tr>
                                `);
                            }
                            
                            function sumOfColumns(myTable, columnIndex) {
                                var tot = 0;
                                $(myTable).find("tr").children("td:nth-child(" + columnIndex + ")")
                                .each(function() {
                                    $this = $(this);
                                    if (!$this.hasClass("sum") && $this.html() != "") {
                                        tot += parseFloat($this.html());
                                    }
                                });

                                $("#myTable").on('click', '.delete-button', function() {
                                    $(this).closest('tr').remove();
                                    console.log(sumOfColumns('#myTable', 3));
                                });

                                return tot;
                            }
                                                        
                            $('#myTableBody').append(`
                            <tr>
                                <td colspan="2"><strong>Total missed account value:</strong></td>
                                <td colspan="2"><strong>${sumOfColumns('#myTable', 3)}</strong></td>
                            </tr>
                        `);

                    }      
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

