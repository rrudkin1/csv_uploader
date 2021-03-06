var csv = document.getElementById('CSV');
var readFileEx = document.getElementById('processFilesButton');
var processButton = document.querySelector('.process-btn');
var downloadBtn = document.querySelector('.download-report-btn');
let formattedCsvArr = [];
let newArray = [];
let newObjsList = [];
let downloadedReport;

function readFile() {
  Papa.parse(csv.files[0], {
    complete: function (results) {
      if (csv.value.split('.').pop() != 'csv') {
        failFileType();
      } else {
        formatCSV(results);
        Papa.parse(formattedCsvArr, {
          complete: function (results) {
            if (!results.data[0].hasOwnProperty('Account')) {
              failUploadLoc();
            } else if (results.data[0].hasOwnProperty('Fee')) {
              failUploadLoc;
            } else {
              successProcess();
              createArray(results);
              formatResults(newArray);
            }
          },
          header: true,
          skipEmptyLines: 'greedy',
          transform: dataRegex,
          transformHeader: (h) => {
            return h.replaceAll(/\s/g, '');
          },
        });
      }
    },
    header: false,
    skipEmptyLines: 'greedy',
  });
}

function failFileType() {
  processButton.classList.remove('success');
  processButton.classList.add('fail');
  processButton.innerHTML = 'Failed';
  setTimeout(function () {
    alert(
      'It looks like you may have uploaded the wrong file type. Make sure to upload .csv files only.'
    );
  }, 500);
  setTimeout(function () {
    window.location = '/';
  }, 4000);
}

function formatCSV(r) {
  r.data.shift();
  r.data.splice(r.data.length - 2, 2);
  formattedCsvArr = Papa.unparse(r, { header: false });
}

function failUploadLoc() {
  processButton.classList.remove('success');
  processButton.classList.add('fail');
  processButton.innerHTML = 'Failed';
  setTimeout(function () {
    alert(
      'It looks like you may have uploaded your file(s) in the wrong location. Make sure to upload the base list and billed list in the correct locations.'
    );
  }, 500);
  setTimeout(function () {
    window.location = '/';
  }, 4000);
}

function successProcess() {
  processButton.classList.remove('fail');
  processButton.classList.add('success');
  processButton.innerHTML = 'Success';
}

function createArray(r) {
  for (i = 0; i < 10; i++) {
    newArray.push(r.data[i]);
  }
}

function formatResults(arr) {
  newObjsList = newArray;
  let totalValArray = [];
  for (i = 0; i < arr.length; i++) {
    totalValArray.push(Number(arr[i].TotalAccountValue));
  }

  let totalVal = totalValArray.reduce((a, b) => a + b, 0);

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

  for (i = 0; i < arr.length; i++) {
    $('#myTableBody').append(`<tr>
                            <td>${arr[i].Account}</td>
                            <td>${arr[i].AccountName}</td>
                            <td>${new Intl.NumberFormat('us-US', {
                              style: 'currency',
                              currency: 'USD',
                            }).format(arr[i].TotalAccountValue)}</td>
                            <td><button class="delete-button" id="deleteRowBtn" value=${
                              arr[i].Account
                            }><i class="fas fa-times"></i></i>
                            </i>
                            </i></button></td> 
                        </tr>
                        `);
  }

  $('#myTableBody').append(`
                    <tr>
                        <td colspan="2" style="text-align:left"><strong>Total missed account value:</strong></td>
                        <td colspan="2" style="text-align:left"><strong>${new Intl.NumberFormat(
                          'us-US',
                          { style: 'currency', currency: 'USD' }
                        ).format(totalVal)}</strong></td>
                    </tr>
                    `);

  let deleteButtons = document.getElementsByClassName('delete-button');
  for (i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener('click', function () {
      removeDeletedAcct(this.value);
      formatResults(newObjsList);
    });
  }
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

function removeDeletedAcct(acct) {
  for (i = 0; i < newObjsList.length; i++) {
    if (newObjsList[i]['Account'] === acct) {
      newObjsList.splice(i, 1);
      console.log(`Row for account #${acct} deleted. Updated list:`);
      console.log(newObjsList);
    }
  }
}

downloadBtn.addEventListener('click', () => {
  console.log('Here is the corrected list of missed accounts:');
  console.log(newObjsList);
  downloadedReport = Papa.unparse(newObjsList, { header: true });
  console.log(downloadedReport);

  var downloadLink = document.createElement('a');
  var blob = new Blob(['\ufeff', downloadedReport]);
  var url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = 'missedAccounts.csv';

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
});

readFileEx.addEventListener('click', readFile);
