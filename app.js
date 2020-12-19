let word2Vec;

function modelLoaded() {
  const status = document.querySelector('#status')
  status.innerHTML = 'Model Loaded';
  status.classList.remove('alert-danger');
  status.classList.add('alert-primary');
}

function setup() {

  // Create the Word2Vec model with pre-trained file of 10,000 words
  word2Vec = ml5.word2vec('wordvecs10000.json', modelLoaded);

  // Select all the DOM elements
  const nearWordInput = document.querySelector('#nearword');
  const nearForm = document.querySelector('#form');
  const nearResults = document.querySelector('#results');

  const betweenWordInput1 = document.querySelector("#between1");
  const betweenWordInput2 = document.querySelector("#between2");
  const betweenForm = document.querySelector("#form2");
  const betweenResults = document.querySelector("#results2");

  const addInput1 = document.querySelector("#isto1");
  const addInput2 = document.querySelector("#isto2");
  const addInput3 = document.querySelector("#isto3");
  const addForm = document.querySelector("#form3");
  const addResults = document.querySelector("#results3");

  // Finding the nearest words
  nearForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const word = nearWordInput.value;
    word2Vec.nearest(word, (err, result) => {
      let output = '';
      if (result) {
        output += '<ul>'
        for (let i = 0; i < result.length; i += 1) {
          output += `<li> ${result[i].word}</li>`;
        }
        output += '</ul>';
      } else {
        output = 'No word vector found';
      }
      nearResults.innerHTML = output;
    });
  });

  // Finding the average of two words
  betweenForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const word1 = betweenWordInput1.value;
    const word2 = betweenWordInput2.value;
    word2Vec.average([word1, word2], 4, (err, average) => {
      betweenResults.innerHTML = `<ul><li>${average[0].word}</li></ul>`;
    })
  });

  // Adding two words together to "solve" an analogy
  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const is1 = addInput1.value;
    const to1 = addInput2.value;
    const is2 = addInput3.value;
    word2Vec.subtract([to1, is1])
      .then(difference => word2Vec.add([is2, difference[0].word]))
      .then(result => { addResults.innerHTML = `<ul><li>${result[0].word}</li></ul>` })
  });
}

setup();