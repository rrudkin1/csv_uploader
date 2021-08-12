var csv = document.getElementById('CSV');
var readFileEx = document.getElementById('processFilesButton');
var processButton = document.querySelector('.process-btn');
var downloadBtn = document.querySelector('.download-report-btn');

function readFile() {
  Papa.parse(csv.files[0], {
    complete: function (results) {

      
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

      let dltActNum = '';

      function formatResults(resData) {
        let arrOfObjs = [];
        for (i = 0; i < 10; i++) {
          if (resData.data[i] === dltActNum) continue;
          arrOfObjs.push(resData.data[i]);
        }

        let totalValArray = [];
        for (i = 0; i < arrOfObjs.length; i++) {
          totalValArray.push(Number(arrOfObjs[i].TotalAccountValue));
        }

        let totalVal = totalValArray.reduce((a, b) => a + b, 0);

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

          for (i = 0; i < data.length; i++) {
            $('#myTableBody').append(`<tr>
                                  <td>${data[i].Account}</td>
                                  <td>${data[i].AccountName}</td>
                                  <td>${new Intl.NumberFormat('us-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                  }).format(data[i].TotalAccountValue)}</td>
                                  <td><button class="delete-button" id="deleteRowBtn" value=${
                                    data[i].Account
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
        }

        createTable(arrOfObjs);

        downloadBtn.addEventListener('click', () => {
          let csvContent = 'data:text/csv;charset=utf-8,';
          rows.forEach(function (rowArray) {
            let row = rowArray.join(',');
            csvContent += row + '\r\n';
          });
        });
      }

      $('#myTable').on('click', '.delete-button', function () {
        dltActNum = $(this).attr('value');
        console.log(dltActNum);
        formatResults(results);
      });

      if (csv.value.split('.').pop() != 'csv') {
        failFileType();
      } else if (results.data[0].hasOwnProperty('Fee')) {
        failUploadLoc();
      } else {
        successProcess();
        formatResults(results);
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
