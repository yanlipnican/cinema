import glob from 'glob';
import path from 'path';

module.exports = (app) => {


	app.get('/admin/test', (req, res) => {
		data.title = "Password change";
		res.render('test-upload.twig');
	});

	app.post('/admin/test', (req, res) => {
		
		console.log(req.body);
		console.log(req.files);

		var source = fs.createReadStream(req.files.fileToUpload.file);
		var dest = fs.createWriteStream(appRoot + '/public/upload/images/' + req.files.fileToUpload.filename);

		source.pipe(dest);
		source.on('end', function() { 

			fs.unlink(req.files.fileToUpload.file, () => {
				let fileDir = req.files.fileToUpload.file.split('/');
				fileDir.pop();
				fileDir = fileDir.join('/');
				fs.rmdir(fileDir, function(){
					fileDir = fileDir.split('/');
					fileDir.pop();
					fileDir = fileDir.join('/');
					fs.rmdir(fileDir)
				});
			});
			res.redirect('/admin/test');

		});
		source.on('error', err => { res.status(500).send('Damn no ! ' + err) });

	});

	// get all files from upload/images 
	app.get('/admin/get-image-gallery', (req, res) => {

		glob("public/upload/images/*", (er, files) => {
			const data = {
				images : []
			};

			for (var i = 0; i < files.length; i++) {
				
				files[i] = files[i].split('/');
				files[i].shift();
				files[i] = files[i].join('/');

				data.images.push(files[i]);
			}

			res.render('admin-gallery.twig', data);

		});

	});

}
