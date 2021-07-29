    var csv = document.getElementById('CSV');
    var readFileEx = document.getElementById('processFilesButton');
    var statusBar = document.querySelector('.status-bar');
    var processButton = document.querySelector('.process-btn');


    function readFile() {
        Papa.parse(csv.files[0], {
            complete: function(results) {


                if(results.data[0].hasOwnProperty('Fee')) {
                // if(Object.entries(results.data[0]).length === 18) {
                    processButton.classList.remove('fail');
                    processButton.classList.add('success');
                    processButton.innerHTML = '<i class="fas fa-check"></i> Success';
                    // processButton.innerHTML = 
                    console.log('Results:');
                    console.log(results);
                    console.log(Object.entries(results.data[0]).length);
                } else {
                    processButton.classList.remove('success');
                    processButton.classList.add('fail');
                    processButton.innerHTML = '<i class="fas fa-times"></i> Failed';
                
                setTimeout(function() { alert("It looks like you uploaded the wrong file... Make sure you are loading a .csv file, and make sure to upload the base list and billed list in the correct locations."); }, 500);

                setTimeout(function() { processButton.classList.remove('fail'), processButton.innerHTML = 'Process Files'; }, 4000);
                }
            },
            header: true, 
            skipEmptyLines: 'greedy'
        });
    }

    readFileEx.addEventListener('click', readFile);
