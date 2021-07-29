    var csv = document.getElementById('CSV');
    var readFileEx = document.getElementById('processFilesButton');
    var statusBar = document.querySelector('.status-bar');


    function readFile() {
        Papa.parse(csv.files[0], {
            complete: function(results) {


                if(results.data[0].hasOwnProperty('Fee')) {
                // if(Object.entries(results.data[0]).length === 18) {
                    statusBar.classList.remove('fail');
                    statusBar.classList.add('success');
                    statusBar.innerHTML = 'Success!'
                    console.log('Results:');
                    console.log(results);
                    console.log(Object.entries(results.data[0]).length);
                } else {
                    statusBar.classList.remove('success');
                    statusBar.classList.add('fail');
                    statusBar.innerHTML = 'Failed...'
                
                setTimeout(function() { alert("It looks like you uploaded the wrong CSV file..."); }, 500);
                }
            },
            header: true, 
            skipEmptyLines: 'greedy'
        });
    }

    readFileEx.addEventListener('click', readFile);
