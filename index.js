const mainContent = document.getElementById('main');
const gpaTermPage = document.getElementById('gpa__term');
const gpaTotalPage = document.getElementById('gpa__total');

const renderTermPage = () => {
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
	mainContent.innerHTML = '';
	mainContent.insertAdjacentHTML('beforeend', markup);
};

const renderTotalPage = () => {
	const markup = `
		<div class="calc__gpa--total">
			<div class="gpa__data">
				<label class="label" for="gpa__total--input">Your last total GPA</label>
				<input
					id="gpa__total--input"
					type="text"
					class="input"
					placeholder="Your last total GPA"
				/>
				<label class="label" for="hours__total--input">Your last total credit</label>
				<input
					id="hours__total--input"
					type="text"
					class="input"
					placeholder="Your last total credit"
				/>
				<label class="label" for="gpa__term--input">Your GPA in this term</label>
				<input
					id="gpa__term--input"
					type="text"
					class="input"
					placeholder="Your GPA in this Term"
				/>
				<label class="label" for="hours__term--input">Your total credit in this term</label>
				<input
					id="hours__term--input"
					type="text"
					class="input"
					placeholder="Your total credit in this term"
				/>
				<button class="button calc__total">Calculate Total GPA</button>
				<p class="gpa__text">Your GPA is: <span class="gpa__text--value"></span></p>
			</div>
		</div>
	`;
	mainContent.innerHTML = '';
	mainContent.insertAdjacentHTML('beforeend', markup);
};

const isEmpty = (inp) => {
	return inp.some((el) => el.value === '');
};

const isInRange = (inp) => {
	return (
		parseFloat(inp[0].value) >= 0 &&
		parseFloat(inp[0].value) <= 100 &&
		parseFloat(inp[1].value) >= 1 &&
		parseFloat(inp[1].value) <= 4
	);
};

const makeLinkActive = (link) => {
	gpaTermPage.classList.remove('active');
	gpaTotalPage.classList.remove('active');
	link.classList.add('active');
};

const resetInputs = (inputs) => {
	inputs.forEach((input) => (input.value = ''));
};

const renderWarrningEmpty = (container, paragraph) => {
	const markup = `
        <p class="warrning_para" style="font-size:2rem;color:red">Please fill the inputs</p>
	`;
	if (paragraph) {
		container.removeChild(paragraph);
	}
	container.insertAdjacentHTML('beforeend', markup);
};

const renderWarrningNotInRange = (container, paragraph) => {
	const markup = `
		<p class="warrning_para" style="font-size:2rem;color:red">Please enter correct numbers</p>
	`;
	if (paragraph) {
		container.removeChild(paragraph);
	}
	container.insertAdjacentHTML('beforeend', markup);
};

const renderTable = (table, inputs) => {
	const markup = `
		<div class="table__row table__item">
			<div class="table__data">${parseFloat(inputs[0].value)}</div>
			<div class="remove__item">&#10060;</div>
			<div class="table__data">${parseFloat(inputs[1].value)}</div>
		</div>
	`;
	table.insertAdjacentHTML('beforeend', markup);
};

const renderGpa = (subjects, element) => {
	let total = subjects.reduce(
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

	if (total.hours === 0) {
		element.textContent = 0;
	} else {
		element.textContent = (total.degrees / total.hours).toFixed(3);
	}
};

const renderTotalGpa = (lastGpa, lastHours, termGpa, termHours, element) => {
	let gpa = (lastGpa * lastHours + termGpa * termHours) / (lastHours + termHours);
	element.textContent = gpa ? gpa.toFixed(3) : 0;
};

///////////////////////////////////////////////////////////////////////////////////

// ------------------controlers-------------------
gpaTermPage.addEventListener('click', () => {
	renderTermPage();
	makeLinkActive(gpaTermPage);
});

gpaTotalPage.addEventListener('click', () => {
	renderTotalPage();
	makeLinkActive(gpaTotalPage);
});

mainContent.addEventListener('click', (e) => {
	if (e.target.matches('.add__subject')) {
		let inputs = [...document.querySelectorAll('.input')];
		const warrningPara = document.querySelector('.warrning_para');
		const inputContainer = document.querySelector('.gpa__data');
		const table = document.querySelector('.gpa__table');

		//check if inputs empty
		if (isEmpty(inputs)) {
			renderWarrningEmpty(inputContainer, warrningPara);
			// check if it's not in the correct range
		} else if (!isInRange(inputs)) {
			renderWarrningNotInRange(inputContainer, warrningPara);
		} else {
			if (warrningPara) {
				inputContainer.removeChild(warrningPara);
			}
			renderTable(table, inputs);
			resetInputs(inputs);
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
		renderGpa(subjects, gpaValue);
	}

	if (e.target.matches('.calc__total')) {
		let gpaValue = document.querySelector('.gpa__text--value');
		let lastGpa = parseFloat(document.getElementById('gpa__total--input').value);
		let lastHours = parseFloat(document.getElementById('hours__total--input').value);
		let termGpa = parseFloat(document.getElementById('gpa__term--input').value);
		let termHours = parseFloat(document.getElementById('hours__term--input').value);
		renderTotalGpa(lastGpa, lastHours, termGpa, termHours, gpaValue);
	}
});
