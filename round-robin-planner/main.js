// hardcoding this cause I don't under module.exports.  I want to ask someone!


// https://github.com/tournament-js/roundrobin
const DUMMY = -1;
// returns an array of round representations (array of player pairs).
// http://en.wikipedia.org/wiki/Round-robin_tournament#Scheduling_algorithm
robin = function (n, ps) {  // n = num players
  const rs = [];                  // rs = round array
  if (!ps) {
    ps = [];
    for (let k = 1; k <= n; k += 1) {
      ps.push(k);
    }
  } else {
    ps = ps.slice();
  }

  if (n % 2 === 1) {
    ps.push(DUMMY); // so we can match algorithm for even numbers
    n += 1;
  }
  for (let j = 0; j < n - 1; j += 1) {
    rs[j] = []; // create inner match array for round j
    for (let i = 0; i < n / 2; i += 1) {
      const o = n - 1 - i;
      if (ps[i] !== DUMMY && ps[o] !== DUMMY) {
        // flip orders to ensure everyone gets roughly n/2 home matches
        const isHome = i === 0 && j % 2 === 1;
        // insert pair as a match - [ away, home ]
        rs[j].push([isHome ? ps[o] : ps[i], isHome ? ps[i] : ps[o]]);
      }
    }
    ps.splice(1, 0, ps.pop()); // permutate for next round
  }
  return rs;
};

// / https://github.com/tournament-js/roundrobin

var formData = {};
        var urlObject = new URL(window.location.href);
        urlObject.searchParams.forEach((value, name) => {
            // save the info to the formData object
            formData[name] = value;

            // put data back into form
            var input = document.querySelector(`[name="${name}"]`);
            if (input) {
                var inputType = input.type;
                if (inputType == 'checkbox') {
                    if (value == 'on') {

                        input.checked = true;
                    }
                }
                else if (inputType == 'radio') {
                    document.querySelector('[name="' + name + '"][value="' + value + '"]').checked = true;
                }
                else {
                    document.querySelector('[name="' + name + '"]').value = value;
                }
            }
        });

        // after everything from the URL is loaded into the form, trigger the "input" event for all textareas so that they autogrow (using the existing autogrow css/html)
        document.querySelectorAll('textarea').forEach(elem => {
            elem.dispatchEvent(new Event('input', { bubbles: true }));
        });

        // app...
        // var robin = require('roundrobin');
        const peopleData = formData.peopleData.split('\n');
        console.log('peopleData: '); console.log(peopleData);
        
        const robinData = robin(peopleData.length);
        console.log('robinData: '); console.log(robinData);
        const rounds = robinData.length;

        var html = ''

        for (let round = 0; round < rounds; round++) {
            const roundArray = robinData[round];
            let peopleMeetingIndexes = [];
            let solitaryPerson = peopleData.slice();// I'll prune this later
            html += `<h2>Round ${round + 1}</h2>`;
            for (let locationIndex = 0; locationIndex < roundArray.length; locationIndex++) {
                const meetingArray = roundArray[locationIndex];
                html += `<h3>Location ${locationIndex + 1}</h3>`;
                const firstPersonIndex = meetingArray[0] - 1;
                const secondPersonIndex = meetingArray[1] - 1;
                peopleMeetingIndexes.push(firstPersonIndex);
                peopleMeetingIndexes.push(secondPersonIndex);
                html += `${peopleData[firstPersonIndex]} and ${peopleData[secondPersonIndex]}`;

               
            }
            for (let index = 0; index < peopleMeetingIndexes.length; index++) {
                const personIndex = peopleMeetingIndexes[index];
                console.log('peopleMeetingIndexes: '); console.log(peopleMeetingIndexes);

                // use this:
                // https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
            }
            
            html += `<h3>Solitary Location</h3>`;
        }

        document.getElementById('htmlWrap').innerHTML = html;

        // maybe use this! 
        // although it doesn't currently work with an odd number of people...
        // https://codepen.io/Piconey/pen/mwPamw
        // https://github.com/tournament-js/roundrobin is probs better...

// Mark markandersjohnson@gmail.com 217-693-2434
// John john@gmail.com 111-111-1111
// Arie arie@gmail.com 222-222-2222