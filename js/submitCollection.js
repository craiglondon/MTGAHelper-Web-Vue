﻿function submitCollection() {
    var fileInput = document.getElementById('fileCollection');

    if (!fileInput.files[0]) {
        alert('Please select a file to upload.');
        return;
    }

    var file = fileInput.files[0];

    if (file.size > 10485760) {
        alert('Your file is too big. Try deleting the output_log.txt file, reopen the MTG Arena game, go browse your collection and close the game. This will generate a very small valid output_log.txt that you can ZIP and send here.');
        return;
    }
    else if (file.name.endsWith(".zip") === false) {
        alert('The file to upload must be a ZIP file (not the output_log.txt file directly) and be less than 10 MB.');
        return;
    }

    var fdata = new FormData();
    fdata.append("fileCollection", file);

    vueApp.loadData('collectionPost', true);
    sendAjaxPost('/api/User/Collection', fdata, false, function (statuscode, body) {
        vueApp.loadData('collectionPost', false);
        try {
            // Can throw exception if file sent was too large, as we receive HTML page saying 404 blah blah
            var response = JSON.parse(body);

            if (statuscode === 201) {
                vueApp.modalData = {
                    type: 'userId'
                };

                vueApp.showUploadCollectionModal = false;
                vueApp.modelUser.collection = response;
                vueApp.refreshUserHistory();
                vueApp.refreshAll(false, false);
                vueApp.calculateWeightsProposed();
            }
            else {
                alert(response.error);
            }
        } catch (e) {
            alert('There was a problem with your file. Check that it\'s the text log file ZIPPED and that the file size is less than 10 MB.');
        }
    });
}