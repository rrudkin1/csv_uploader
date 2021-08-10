let totalValArray = [];
                        let totalVal = 0
                            $("#myTable").on('click', '.delete-button', function() {
                                let getID = $(this).closest('tr').find('td:first');
                                let acctNum = getID[0].outerText;
                                for(i = 0; i < arrOfObjs.length; i++) {
                                    if(arrOfObjs[i].Account == acctNum) {
                                        arrayOfObjs = arrOfObjs.splice(i, 1);
                                    };
                                };
                                
                                for(i = 0; i < arrOfObjs.length; i++ ) {
                                    totalValArray.push(Number(arrOfObjs[i].TotalAccountValue));
                                }
                                
                                for(i = 0; i < totalValArray.length; i++) {
                                    totalVal += totalValArray[i];
                                }
                                
                                createTable(arrOfObjs);