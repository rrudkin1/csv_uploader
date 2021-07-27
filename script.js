    var csv = document.getElementById('CSV');
    var readFileEx = document.getElementById('processFilesButton');

    let resultsArr = [];
    function readFile() {
        Papa.parse(csv.files[0], {
            complete: function(results) {
            resultsArr.push(results);
            },
            header: true, 
            skipEmptyLines: 'greedy'
        });
        console.log('Results:');
        console.log(resultsArr[0]);
    }

    readFileEx.addEventListener('click', readFile);


    
