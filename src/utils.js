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


export function dataURItoFile(data) {
	let file = null;
	let {fileName} = this.props;
	try {
		file = new File([dataURLtoBlob(data)], `${fileName}.jpg`, {type: 'image/jpeg'});
	}
	catch (ex) {
		// on iphone 5, safari, file object constructor doesn't work
		// we use blob instead, but it doesn't have name propery so we create it
		file = new Blob([dataURLtoBlob(data)], {type: 'image/jpeg'});
		file.name = `${fileName}.jpg`;
	}
	return file;
}

