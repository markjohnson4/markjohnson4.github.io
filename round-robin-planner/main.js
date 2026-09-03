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
        const locations = formData.locations.split('\n');

        
        
        // make an array of indices to compare with one of people meeting (to find the solitary person)
        let allPeopleIndices = [];
        for (let index = 0; index < peopleData.length; index++) {
          allPeopleIndices.push(index);
        }
        
        
        const robinData = robin(peopleData.length);
        const rounds = robinData.length;

        const locationsPromptElem = document.getElementById('locationsPrompt');
        const noPeopleLocationsPromptText = 'Submit your list of names to see how many locations you need to provide.';
        const neededLocations = Math.floor(peopleData.length/2);
        if(peopleData.length == 0) {
          locationsPromptElem.innerHTML = noPeopleLocationsPromptText;
        }
        else if(peopleData.length > 0 && locations[0] == '') {
          locationsPromptElem.innerHTML = `You need to provide <strong>${neededLocations}</strong> locations`;
        }
        else if(neededLocations > locations.length) {
          const additionalLocationsNeeded = neededLocations - locations.length;
          locationsPromptElem.innerHTML = `You need to provide <strong>${additionalLocationsNeeded}</strong> additional location${additionalLocationsNeeded > 1? 's': ''}`;
        }


        function locationTextFromIndex(locationIndex) {
          if(locationIndex == null) {
            if(formData.solitaryLocation != '') {
              return formData.solitaryLocation; 
            }
            else {
              return 'Solitary Location';
            }
            
          }
          if(locations[locationIndex] == '' || !locations[locationIndex]) {
            return 'location ' + (locationIndex + 1);
          }
          else {
            return locations[locationIndex];
          }
        }

        var html = ''
        if(peopleData.length > 1) {
          html += '<a href="#nav" id="links">Links</a>';
        }

        html += '<nav id="nav">';
        html += '<ul>';
        html += '<li><a href="#form">Form</a></li>';
        html += '<li><a href="#admin">Admin</a></li>';
        for (let index = 0; index < peopleData.length; index++) {
          html += `<li><a href="#p${index}">${peopleData[index]}</a></li>`;
        }
        html += '</ul>';
        html += '</nav>';

        let individualizedInfo = [];
        html += '<section id="admin">';
        for (let round = 0; round < rounds; round++) {
            const roundArray = robinData[round];
            let peopleMeetingIndexes = [];
            let individualizedInfoRound = [];
            html += `<h2>Round ${round + 1}</h2>`;
            for (let locationIndex = 0; locationIndex < roundArray.length; locationIndex++) {
                var person1Obj = {};
                var person2Obj = {};
                const meetingArray = roundArray[locationIndex];
                html += `<h3>${locationTextFromIndex(locationIndex)}</h3>`;
                const firstPersonIndex = meetingArray[0] - 1;
                const secondPersonIndex = meetingArray[1] - 1;

                person1Obj.locationIndex = locationIndex;
                person2Obj.locationIndex = locationIndex;
                
                person1Obj.partner = secondPersonIndex;
                person2Obj.partner = firstPersonIndex;

                individualizedInfoRound[firstPersonIndex] = person1Obj;
                individualizedInfoRound[secondPersonIndex] = person2Obj;

                peopleMeetingIndexes.push(firstPersonIndex);
                peopleMeetingIndexes.push(secondPersonIndex);
                html += `${peopleData[firstPersonIndex]} and ${peopleData[secondPersonIndex]}`;
            }


            let solitaryPersonIndex = allPeopleIndices.filter(x => !peopleMeetingIndexes.includes(x));
            
            if(solitaryPersonIndex.length > 0) {
              html += `<h3>${locationTextFromIndex(null)}</h3>`;
              html += peopleData[solitaryPersonIndex];
              let solitaryObj = {};
              solitaryObj.location = null;
              solitaryObj.partner = null;
              individualizedInfoRound[solitaryPersonIndex] = solitaryObj;
            }

            individualizedInfo.push(individualizedInfoRound);
            
        }
        html += '</section>';
        html += '<div class="allPeopleWrap">'
        
        for (let index = 0; index < peopleData.length; index++) {
          const personName = peopleData[index];
          html += `<section id="p${index}">`;
          html += `<h1>${personName}</h1>`;
          for (let i = 0; i < individualizedInfo.length; i++) {
            html += `<h2>Round ${i + 1}</h2>`;
            const roundArray = individualizedInfo[i];            
            const you = roundArray[index];
            if(you.partner == null) {
              html += `Yourself @ ${locationTextFromIndex(null)}`;
            }
            else {
              html += `${peopleData[you.partner]} @ ${locationTextFromIndex(you.locationIndex)}`;
              
            }
            
          }
          html += '</section>';
        }
        html += '</div>';
     
      
        document.getElementById('htmlWrap').innerHTML = html;

        

// Mark markandersjohnson@gmail.com 217-693-2434
// John john@gmail.com 111-111-1111
// Arie arie@gmail.com 222-222-2222