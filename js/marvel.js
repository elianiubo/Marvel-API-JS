let urlComicHeroi;

$(document).ready(function(){
	//Assignem l'esdeveniment quan es fa clic a
	//la caixa de text de cerca
	$('#text_cerca').on('keypress', function(e){
		//Si la tecla polsada és la tecla Enter...
		if (e.key == 'Enter') {
			//Agafem el valor de la caixa de text
			let textCerca = $(this).val();
			//Si no està buida...
			if (textCerca.trim() != ""){
				//Buidem els jocs de la cerca anterior
				$('#llista-jocs').empty();
				//Fem la petició AJAX per a obtenir la clau
				$.ajax({method:"GET",
					url:"https://marvel.descodifi.cat?clau=true",
					//Si hi ha una resposta correcta per la petició...
					success: function(dades){
						let clau = dades.resposta.clau;

						//Fem petició amb les lletres a buscar i amb la clau obtinguda
						$.ajax({method:"GET",
							url:`https://gateway.marvel.com/v1/public/characters?${clau}&nameStartsWith=${textCerca}`,
							//Si hi ha una resposta correcta per la petició...
							success: function(dades){
								let infoHerois = dades.data.results;
								console.log(infoHerois);
								for(let i=0; i<infoHerois.length; i++){
									$('#llista-herois').append(crearHeroi(infoHerois[i]));
								}
								//Afegim l'esdeveniment de clic l'heroi corresponent
								$('.heroi').on('click',ferCrida);
							}
						});
					}
				});
			}
		};
	});
});

//Funció que crea un joc segons les dades del fitxer JSON
function crearHeroi(dades){

	let urlPrimerComic = (dades.comics.items.length>0)?dades.comics.items[0].resourceURI:"";

	let $contingut = `<div class="heroi" urlComic="${urlPrimerComic}">
			<div class="imatge">
				<img src="${dades.thumbnail.path}.${dades.thumbnail.extension}">
			</div>
			<div class="informacio">
				<div class="nom">${dades.name}</div>
				<a  class="url" href="${dades.urls[0].url}">Visita</a>
			</div>
		</div>`;

	return $($contingut);
}

function ferCrida(){
	//Agafem l'atribut 'slug' del joc clicat
	urlComicHeroi = $(this).attr('urlComic');
	//Fem petició a la nova URL
	$.ajax({method:"GET",
			url:"https://marvel.descodifi.cat?clau=true",
			//Si hi ha una resposta correcta per la petició...
			success: function(dades){
				let clau = dades.resposta.clau;

				//Fem petició amb les lletres a buscar i amb la clau obtinguda
				$.ajax({method:"GET",
					url:`${urlComicHeroi}?${clau}`,
					//Si hi ha una resposta correcta per la petició...
					success: function(dades){
						let infoComic = dades.data.results[0];
						console.log(infoComic);
						//Mostrem finestra emergent
						Swal.fire({
						  title: infoComic.title,
						  html: '<strong>Pàgines: </strong>' + infoComic.pageCount + "<br/>" + infoComic.description +
						  '<br/><a href="'+infoComic.urls[0].url+'">Pàgina web</a>',
						  imageUrl: infoComic.images[0].path + "." + infoComic.images[0].extension,
						  imageAlt: infoComic.title,
						  width: '800px'
						});
					}
				});
			}
		});
}