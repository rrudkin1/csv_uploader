    var csv = document.getElementById('CSV');
    var readFileEx = document.getElementById('processFilesButton');


    function readFile() {
        Papa.parse(csv.files[0], {
            complete: function(results) {


                if(results.data[0].hasOwnProperty('Fee')) {
                // if(Object.entries(results.data[0]).length === 18) {
                    console.log('Results:');
                    console.log(results);
                    console.log(Object.entries(results.data[0]).length);
            } else {
                alert("It looks like you may have uploaded the wrong CSV file...")
                }
            },
            header: true, 
            skipEmptyLines: 'greedy'
        });
    }

    readFileEx.addEventListener('click', readFile);
