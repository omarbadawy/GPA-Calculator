const mainContent = document.getElementById('main');
const gpaTermPage = document.getElementById('gpa__term');
const gpaTotalPage = document.getElementById('gpa__total');

// rendering GPA term page
gpaTermPage.addEventListener('click', () => {
	const markup = `
    <div class="calc__gpa--term">
        <div class="gpa__data">
            <label class="label" for="degree">Enter a subject degree</label>
            <input id="degree" type="text" name="degree" class="input" placeholder="Degree" />
            <label class="label" for="hours">Enter a subject credit</label>
            <input id="hours" type="text" name="hours" class="input" placeholder="Hours" />
            <button class="button add__subject">Add subject</button>
        </div>
        <div class="gpa__table">
            <div class="table__row">
                <div class="table__header">Degree</div>
                <div class="table__header">Hours</div>
            </div>
        </div>
        <div class="button__calc">
            <button class="button calc__gpa">Calculate GPA</button>
            <p class="gpa__text">Your GPA is: <span class="gpa__text--value"></span></p>
        </div>
    </div>
    `;

	// remove all element from Main
	mainContent.innerHTML = '';

	// add the markup
	mainContent.insertAdjacentHTML('beforeend', markup);
});

mainContent.addEventListener('click', (e) => {
	if (e.target.matches('.add__subject')) {
		let inputs = [...document.querySelectorAll('.input')];
		let isEmpty = inputs.some((el) => el.value === '');
		let isFirstInRange = parseFloat(inputs[0].value) >= 0 && parseFloat(inputs[0].value) <= 100;
		let isSecondInRange = parseFloat(inputs[1].value) >= 1 && parseFloat(inputs[1].value) <= 4;
		const warrningPara = document.querySelector('.warrning_para');
		const inputContainer = document.querySelector('.gpa__data');
		const table = document.querySelector('.gpa__table');

		//check if inputs empty
		if (isEmpty) {
			const markup = `
                <p class="warrning_para" style="font-size:2rem;color:red">Please fill the inputs</p>
            `;
			if (warrningPara) {
				inputContainer.removeChild(warrningPara);
			}
			inputContainer.insertAdjacentHTML('beforeend', markup);

			// check if it's not in the correct range
		} else if (!(isFirstInRange && isSecondInRange)) {
			const markup = `
                <p class="warrning_para" style="font-size:2rem;color:red">Please enter correct numbers</p>
            `;
			if (warrningPara) {
				inputContainer.removeChild(warrningPara);
			}
			inputContainer.insertAdjacentHTML('beforeend', markup);
		} else {
			if (warrningPara) {
				inputContainer.removeChild(warrningPara);
			}
			const markup = `
                <div class="table__row table__item">
                    <div class="table__data">${parseFloat(inputs[0].value)}</div>
                    <div class="remove__item">&#10060;</div>
                    <div class="table__data">${parseFloat(inputs[1].value)}</div>
                </div>
            `;
			table.insertAdjacentHTML('beforeend', markup);
			inputs[0].value = '';
			inputs[1].value = '';
		}
	}

	// if the user clicked on delete item
	if (e.target.matches('.remove__item')) {
		const deletedElement = e.target.parentNode;
		e.target.parentNode.parentNode.removeChild(deletedElement);
	}

	// calculate GPA
	if (e.target.matches('.calc__gpa')) {
		let gpaValue = document.querySelector('.gpa__text--value');
		let subjects = [...document.querySelectorAll('.table__item')];
		let sum = subjects.reduce(
			(acc, el) => {
				let deg = parseFloat(el.children[0].textContent);
				let grade = 0;

				if (deg < 60) grade = 0;
				else if (deg < 65) grade = 2;
				else if (deg < 70) grade = 2.3;
				else if (deg < 75) grade = 2.7;
				else if (deg < 80) grade = 3;
				else if (deg < 85) grade = 3.3;
				else if (deg < 90) grade = 3.7;
				else grade = 4;

				acc.degrees += grade * parseFloat(el.children[2].textContent);
				acc.hours += parseFloat(el.children[2].textContent);
				return acc;
			},
			{ degrees: 0, hours: 0 }
		);

		if (sum.hours === 0) {
			gpaValue.textContent = 0;
		} else {
			gpaValue.textContent = (sum.degrees / sum.hours).toFixed(3);
		}
	}
});
