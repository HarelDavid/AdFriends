import dataUrlToBlob from 'dataurl-to-blob'

export function	uuid() {
	/*jshint bitwise:false */
	var i, random;
	var uuid = '';

	for (i = 0; i < 32; i++) {
		random = Math.random() * 16 | 0;
		if (i === 8 || i === 12 || i === 16 || i === 20) {
			uuid += '-';
		}
		uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
			.toString(16);
	}

	return uuid;
}

export function pluralize(count, word) {
	return count === 1 ? word : word + 's';
}


export function convertToImage(file) {
	return new Promise((resolve, reject) => {
		var reader = new FileReader();
		reader.readAsDataURL(file);

		reader.addEventListener("load", (ev) => {
			var img = new Image();
			img.src = ev.target.result;

			img.addEventListener("load", () => {
				resolve(img);
			});

		});

		reader.addEventListener("error", () => {
			reject(reader.error);
		});
	})
}

export function dataURItoFile(data, filename) {
	let file = null;
	try {
		file = new File([dataUrlToBlob(data)], `${filename}`, {type: 'image/jpeg'});
	}
	catch (ex) {
		// on iphone 5, safari, file object constructor doesn't work
		// we use blob instead, but it doesn't have name propery so we create it
		file = new Blob([dataUrlToBlob(data)], {type: 'image/jpeg'});
		file.name = `${filename}`;
	}
	return file;
}


export function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");

    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();


    return new Promise((resolve, reject)=> {
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            document.body.removeChild(textArea);
            // window.open('http://web.whatsapp.com', '_blank');
            console.log('Copying text command was ' + msg);
            resolve(msg);

        } catch (err) {
            console.log('Oops, unable to copy');
            reject('ארעה שגיאה, אנא נסה מאוחר יותר');

        }
    });

}

function getFileCheckSum(file) {
    return new Promise((resolve, reject)=> {
        try {
            var reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onloadend = function () {
                var hash = CryptoJS.MD5(reader.result).toString();
                resolve(hash);
            };
        } catch (e) {
            reject(e);
        }
    });
}


export function isMobile() {
    let mql = window.matchMedia('(max-width: 920px)');
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && mql.matches) {
        return true;
    }
    return false;
}